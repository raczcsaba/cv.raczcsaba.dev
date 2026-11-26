import {
  AdditiveBlending, BufferAttribute, Euler, BufferGeometry, Color, Group, LineBasicMaterial, LineSegments, PerspectiveCamera,
  Points, Raycaster, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer,
} from 'three';

type Domain = { label: string; color: string };
type Data = { domains: Record<string, Domain>; skills: { name: string; d: string; level: number }[]; projects: { id: string; name: string; stack: string[] }[] };

const VERT = /* glsl */ `
  attribute float size; attribute vec3 color; attribute float alpha;
  varying vec3 vColor; varying float vAlpha;
  uniform float uPixel; uniform float uTime;
  void main() {
    vColor = color; vAlpha = alpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float pulse = 1.0 + 0.08 * sin(uTime * 1.6 + position.x * 0.7 + position.y);
    gl_PointSize = size * pulse * uPixel * (34.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const FRAG = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5; float d = length(c);
    float core = smoothstep(0.22, 0.0, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.55;
    float a = (core + glow) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.65 + core * 0.9), a);
  }`;

export function initGraph(host: HTMLElement, tip: HTMLElement, opts: { onSkill: (name: string) => void }) {
  const data: Data = JSON.parse(document.getElementById('graph-data')!.textContent!);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  host.appendChild(renderer.domElement);
  host.style.opacity = '0';
  host.style.transition = 'opacity 1.4s cubic-bezier(.16,.84,.3,1)';

  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(0, 0, 30);
  const world = new Group();
  const graph = new Group();
  world.add(graph);
  scene.add(world);

  // ---------- layout ----------
  const keys = Object.keys(data.domains);
  const N = data.skills.length;
  const centers = keys.map((_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / keys.length);
    const th = Math.PI * (1 + Math.sqrt(5)) * i;
    return new Vector3(Math.cos(th) * Math.sin(phi), Math.sin(th) * Math.sin(phi), Math.cos(phi)).multiplyScalar(7.5);
  });
  const pos = data.skills.map((s, i) => {
    const c = centers[keys.indexOf(s.d)];
    const r = 1.5 + Math.random() * 3.2;
    const v = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(r);
    return c.clone().add(v).add(new Vector3(0, 0, (i % 3) * 0.1));
  });

  // edges: co-occurrence in project stacks
  const idx = new Map(data.skills.map((s, i) => [s.name, i]));
  const edgeSet = new Map<string, number>();
  const usedIn: string[][] = data.skills.map(() => []);
  for (const p of data.projects) {
    const ids = p.stack.map((s) => idx.get(s)).filter((x): x is number => x !== undefined);
    ids.forEach((a) => usedIn[a].push(p.name));
    for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
      const k = ids[a] < ids[b] ? `${ids[a]}-${ids[b]}` : `${ids[b]}-${ids[a]}`;
      edgeSet.set(k, (edgeSet.get(k) ?? 0) + 1);
    }
  }
  const edges = [...edgeSet.entries()].map(([k, w]) => { const [a, b] = k.split('-').map(Number); return { a, b, w }; });
  const neighbors: Set<number>[] = data.skills.map(() => new Set());
  edges.forEach(({ a, b }) => { neighbors[a].add(b); neighbors[b].add(a); });

  // relax: springs on edges, repulsion between nodes, pull to cluster centre
  for (let it = 0; it < 160; it++) {
    const f = pos.map(() => new Vector3());
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const d = pos[i].clone().sub(pos[j]);
      const l = Math.max(d.length(), 0.3);
      const rep = d.multiplyScalar(1.6 / (l * l * l));
      f[i].add(rep); f[j].sub(rep);
    }
    for (const { a, b, w } of edges) {
      const d = pos[b].clone().sub(pos[a]);
      const k = (d.length() - 3.2) * 0.012 * Math.min(w, 3);
      d.normalize().multiplyScalar(k);
      f[a].add(d); f[b].sub(d);
    }
    data.skills.forEach((s, i) => f[i].add(centers[keys.indexOf(s.d)].clone().sub(pos[i]).multiplyScalar(0.02)));
    pos.forEach((p, i) => p.add(f[i].clampLength(0, 0.5)));
  }
  const home = pos.map((p) => p.clone());

  // ---------- nodes ----------
  const geo = new BufferGeometry();
  const P = new Float32Array(N * 3), C = new Float32Array(N * 3), S = new Float32Array(N), A = new Float32Array(N);
  const baseColor = data.skills.map((s) => new Color(data.domains[s.d].color));
  data.skills.forEach((s, i) => {
    pos[i].toArray(P, i * 3);
    baseColor[i].toArray(C, i * 3);
    S[i] = 2.2 + s.level * 1.15;
    A[i] = 0.95;
  });
  geo.setAttribute('position', new BufferAttribute(P, 3));
  geo.setAttribute('color', new BufferAttribute(C, 3));
  geo.setAttribute('size', new BufferAttribute(S, 1));
  geo.setAttribute('alpha', new BufferAttribute(A, 1));
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uPixel: { value: renderer.getPixelRatio() }, uTime: { value: 0 } },
  });
  const points = new Points(geo, mat);
  graph.add(points);

  // ---------- edges ----------
  const eg = new BufferGeometry();
  const EP = new Float32Array(edges.length * 6), EC = new Float32Array(edges.length * 6);
  eg.setAttribute('position', new BufferAttribute(EP, 3));
  eg.setAttribute('color', new BufferAttribute(EC, 3));
  const lineMat = new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false });
  const lines = new LineSegments(eg, lineMat);
  graph.add(lines);
  const dim = 0.14;
  function paintEdges(focus = -1) {
    edges.forEach(({ a, b }, k) => {
      const on = focus === -1 ? dim : a === focus || b === focus ? 0.9 : 0.03;
      const ca = baseColor[a], cb = baseColor[b];
      EC.set([ca.r * on, ca.g * on, ca.b * on, cb.r * on, cb.g * on, cb.b * on], k * 6);
    });
    eg.attributes.color.needsUpdate = true;
  }
  function syncEdges() {
    edges.forEach(({ a, b }, k) => { EP.set([P[a * 3], P[a * 3 + 1], P[a * 3 + 2], P[b * 3], P[b * 3 + 1], P[b * 3 + 2]], k * 6); });
    eg.attributes.position.needsUpdate = true;
  }
  syncEdges(); paintEdges();

  // ---------- dust ----------
  const dustN = 600;
  const dg = new BufferGeometry();
  const DP = new Float32Array(dustN * 3), DC = new Float32Array(dustN * 3), DS = new Float32Array(dustN), DA = new Float32Array(dustN);
  for (let i = 0; i < dustN; i++) {
    const v = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(70);
    v.toArray(DP, i * 3);
    DC.set([0.6, 0.7, 0.8], i * 3); DS[i] = 0.6 + Math.random() * 1.2; DA[i] = 0.25 + Math.random() * 0.35;
  }
  dg.setAttribute('position', new BufferAttribute(DP, 3));
  dg.setAttribute('color', new BufferAttribute(DC, 3));
  dg.setAttribute('size', new BufferAttribute(DS, 1));
  dg.setAttribute('alpha', new BufferAttribute(DA, 1));
  const dust = new Points(dg, mat);
  scene.add(dust);

  // ---------- labels for top skills ----------
  const labelEls = data.skills.map((s, i) => {
    if (s.level < 5) return null;
    const el = document.createElement('span');
    el.textContent = s.name;
    el.style.cssText = `position:absolute;left:0;top:0;font:500 11px/1 'JetBrains Mono',monospace;color:${data.domains[s.d].color};opacity:.0;pointer-events:none;white-space:nowrap;transition:opacity .4s;will-change:transform`;
    host.appendChild(el);
    return { el, i };
  }).filter(Boolean) as { el: HTMLSpanElement; i: number }[];

  // ---------- sizing ----------
  let W = 0, H = 0;
  const resize = () => {
    W = host.clientWidth; H = host.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    const wide = W > 900;
    world.position.x = wide ? 9 : 0;
    world.position.y = wide ? 0 : -2;
    camera.position.z = wide ? 28 : 36;
    host.style.setProperty('--o', wide ? '1' : '0.55');
  };
  new ResizeObserver(resize).observe(host);
  resize();

  // ---------- interaction ----------
  const ray = new Raycaster();
  ray.params.Points = { threshold: 0.55 };
  const mouse = new Vector2(9, 9);
  let hover = -1, dragging = false, lastX = 0, lastY = 0;
  let velX = 0.0012, velY = 0, rotX = 0.2, rotY = 0;
  let parX = 0, parY = 0;
  const hero = host.parentElement!;

  hero.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    parX = mouse.x; parY = mouse.y;
    if (dragging) {
      velX = (e.clientX - lastX) * 0.0025; velY = (e.clientY - lastY) * 0.0025;
      lastX = e.clientX; lastY = e.clientY;
    }
    tip.style.left = e.clientX + 'px';
    tip.style.top = e.clientY + 'px';
  }, { passive: true });
  hero.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('a,button,input,textarea')) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
  });
  addEventListener('pointerup', () => (dragging = false));
  hero.addEventListener('pointerleave', () => { mouse.set(9, 9); setHover(-1); });
  hero.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a,button,input,textarea')) return;
    if (hover >= 0 && usedIn[hover].length) opts.onSkill(data.skills[hover].name);
  });

  function setHover(i: number) {
    if (i === hover) return;
    hover = i;
    hero.style.cursor = i >= 0 ? 'pointer' : '';
    for (let k = 0; k < N; k++) A[k] = i === -1 ? 0.95 : k === i || neighbors[i].has(k) ? 1 : 0.18;
    geo.attributes.alpha.needsUpdate = true;
    paintEdges(i);
    if (i >= 0) {
      const s = data.skills[i];
      const used = usedIn[i];
      tip.innerHTML = `<b style="color:${data.domains[s.d].color}">${s.name}</b><span>${data.domains[s.d].label}${used.length ? ` · used in ${used.length} project${used.length > 1 ? 's' : ''}<br>${used.slice(0, 3).join(', ')}${used.length > 3 ? '…' : ''}<br><i>click to filter</i>` : ''}</span>`;
      tip.classList.add('on');
      document.dispatchEvent(new CustomEvent('graph:hover', { detail: s.name }));
    } else tip.classList.remove('on');
  }

  // ---------- easter egg: nodes spell a word ----------
  let shape: Vector3[] | null = null;
  function spell(word: string, ms = 6000) {
    const cv = document.createElement('canvas');
    cv.width = 220; cv.height = 80;
    const g = cv.getContext('2d')!;
    g.fillStyle = '#fff'; g.font = '900 64px Inter, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(word, 110, 42);
    const px = g.getImageData(0, 0, 220, 80).data;
    const cand: Vector3[] = [];
    for (let y = 0; y < 80; y += 3) for (let x = 0; x < 220; x += 3) if (px[(y * 220 + x) * 4 + 3] > 128) cand.push(new Vector3((x - 110) * 0.11, (40 - y) * 0.11, 0));
    for (let i = cand.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [cand[i], cand[j]] = [cand[j], cand[i]]; }
    shape = pos.map((_, i) => cand[i % cand.length]);
    setTimeout(() => (shape = null), ms);
  }
  (window as unknown as { __graph: unknown }).__graph = { spell };

  // ---------- loop ----------
  let visible = true, raf = 0, t = 0, scrollFade = 1;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(host);
  addEventListener('scroll', () => { scrollFade = Math.max(0, 1 - scrollY / (innerHeight * 0.9)); }, { passive: true });
  const tmp = new Vector3();
  const inv = new Euler(0, 0, 0, 'ZYX');

  function frame() {
    raf = 0;
    if (!visible || document.hidden) return;
    t += 0.016;
    mat.uniforms.uTime.value = t;
    if (!dragging) { velX += (0.0012 - velX) * 0.02; velY *= 0.94; }
    rotY += reduced ? 0 : velX; rotX += velY;
    rotX = Math.max(-0.9, Math.min(0.9, rotX));
    graph.rotation.set(rotX, rotY, 0);
    world.rotation.x += (parY * 0.12 - world.rotation.x) * 0.05;
    world.rotation.y += (parX * 0.2 - world.rotation.y) * 0.05;
    world.position.z = -(1 - scrollFade) * 12;
    dust.rotation.y = t * 0.01;
    host.style.opacity = String(scrollFade * Number(host.style.getPropertyValue('--o') || 1));

    // morph towards target shape (egg) or home
    let moved = false;
    for (let i = 0; i < N; i++) {
      const target = shape ? tmp.copy(shape[i]).applyEuler(inv.set(-rotX, -rotY, 0, 'ZYX')) : home[i];
      const k = shape ? 0.08 : 0.05;
      const dx = target.x - P[i * 3], dy = target.y - P[i * 3 + 1], dz = target.z - P[i * 3 + 2];
      if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 0.002) {
        P[i * 3] += dx * k; P[i * 3 + 1] += dy * k; P[i * 3 + 2] += dz * k; moved = true;
      }
    }
    if (moved) { geo.attributes.position.needsUpdate = true; syncEdges(); }

    // hover
    if (!dragging && mouse.x < 2) {
      ray.setFromCamera(mouse, camera);
      const hit = ray.intersectObject(points)[0];
      setHover(hit?.index ?? -1);
    }

    // labels
    for (const { el, i } of labelEls) {
      tmp.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]).applyMatrix4(points.matrixWorld);
      const z = tmp.clone().applyMatrix4(camera.matrixWorldInverse).z;
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * W, y = (-tmp.y * 0.5 + 0.5) * H;
      el.style.transform = `translate(${x + 10}px, ${y - 5}px)`;
      el.style.opacity = shape ? '0' : String(Math.max(0, Math.min(0.85, (z + 40) / 14 - 0.6)) * (hover === -1 || hover === i || neighbors[hover]?.has(i) ? 1 : 0.15));
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  requestAnimationFrame(() => (host.style.opacity = '1'));
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !raf) raf = requestAnimationFrame(frame); });
}
