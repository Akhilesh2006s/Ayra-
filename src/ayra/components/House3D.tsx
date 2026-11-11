import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks';

/**
 * A live 3D architectural model, drawn on canvas with no libraries.
 * It builds itself in four stages, like an architect's model coming alive:
 * 01 Plan (footprint drawn on the site grid) → 02 Structure (columns, slabs)
 * → 03 Envelope (walls, glass) → 04 Material & light (timber fins, pool, trees).
 * Drag to turn it; it also turns slowly on its own.
 */

type Kind = 'col' | 'slab' | 'wall' | 'glass' | 'fin' | 'pool' | 'tree' | 'step';
type Box = { k: Kind; x: number; y: number; z: number; w: number; d: number; h: number; t: number };

export const STAGES = ['Plan', 'Structure', 'Envelope', 'Material & light'] as const;

function model(): Box[] {
  const B: Box[] = [];
  const add = (k: Kind, x: number, y: number, z: number, w: number, d: number, h: number, t: number) => B.push({ k, x, y, z, w, d, h, t });
  // structure: columns on a 4.5 m grid, ground + first floor + roof slabs
  const xs = [-7, -2.5, 2, 6.5], ys = [-4, 0.5, 4.5];
  xs.forEach((x, i) => ys.forEach((y, j) => add('col', x - 0.15, y - 0.15, 0, 0.3, 0.3, 3.4, 0.27 + (i * 3 + j) * 0.006)));
  add('slab', -7.6, -4.6, 0, 14.8, 9.8, 0.25, 0.32);
  xs.forEach((x, i) => ys.forEach((y, j) => add('col', x - 0.15, y - 0.15, 3.65, 0.3, 0.3, 3.1, 0.38 + (i * 3 + j) * 0.005)));
  add('slab', -8.4, -5.2, 3.4, 16.4, 10.4, 0.28, 0.42);      // first floor slab, cantilevered
  add('slab', -8.6, -5.6, 6.75, 16.6, 10.6, 0.3, 0.48);       // roof slab with deep overhang
  // envelope: stone-clad side walls, glass front, solid back
  add('wall', -7.5, -4.5, 0.25, 0.35, 9.0, 3.15, 0.55);
  add('wall', 6.5, -4.5, 0.25, 0.35, 9.0, 3.15, 0.56);
  add('wall', -7.5, 4.3, 0.25, 14.3, 0.35, 3.15, 0.57);
  add('wall', -8.2, -5.0, 3.68, 0.35, 10.0, 3.07, 0.6);
  add('wall', 7.6, -5.0, 3.68, 0.35, 10.0, 3.07, 0.61);
  add('wall', -8.2, 4.7, 3.68, 16.1, 0.35, 3.07, 0.62);
  add('glass', -7.1, -4.45, 0.25, 13.5, 0.08, 3.15, 0.66);
  add('glass', -7.8, -5.0, 3.68, 15.3, 0.08, 3.07, 0.69);
  // material & light: timber fins (jaali screen), pool, steps, trees
  for (let i = 0; i < 26; i++) add('fin', -7.8 + i * 0.6, -5.35, 3.68, 0.09, 0.28, 3.07, 0.74 + i * 0.004);
  add('pool', -6.5, -10.5, -0.05, 9.5, 4.2, 0.12, 0.84);
  add('step', 2.6, -6.2, 0, 3.4, 1.4, 0.15, 0.86);
  add('tree', 8.6, -8.2, 0, 1.6, 1.6, 4.8, 0.9);
  add('tree', -10.4, -2.0, 0, 1.4, 1.4, 4.2, 0.92);
  add('tree', 9.6, 3.6, 0, 1.8, 1.8, 5.4, 0.94);
  return B;
}

const C = {
  ink: '#151413', line: 'rgba(21,20,19,.75)', red: '#A3221C', grid: 'rgba(21,20,19,.08)',
  slabTop: '#FBFAF7', slabSide: '#E6E1D9', col: '#D9D3CA', wallA: '#E9E2D6', wallB: '#D8CFC1',
  glass: 'rgba(120,150,165,', fin: '#8A5A3C', finSide: '#6E4630', pool: '#7FA9B5', tree: '#7E8E6A', step: '#EDE8E0',
};

export type HouseCtl = { T: number; explode: number; night: number; zoom: number; yaw: number };

export function House3D({ onStage, playKey, ctl, className = 'house3d' }: { onStage?: (i: number) => void; playKey?: number; ctl?: React.MutableRefObject<HouseCtl>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [, force] = useState(0);
  const state = useRef({ yaw: 0.55, drag: false, lx: 0, vel: 0, t0: 0, stage: -1 });

  useEffect(() => { state.current.t0 = 0; state.current.stage = -1; force((x) => x + 1); }, [playKey]);

  useEffect(() => {
    const cv = ref.current!;
    const cx = cv.getContext('2d')!;
    const boxes = model();
    const reduce = prefersReducedMotion();
    const DUR = 9000;
    let raf = 0;
    let W = 0, H = 0;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const ro = new ResizeObserver(size); ro.observe(cv);

    const down = (e: PointerEvent) => { state.current.drag = true; state.current.lx = e.clientX; cv.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { const s = state.current; if (!s.drag) return; const dx = e.clientX - s.lx; s.lx = e.clientX; s.yaw += dx * 0.008; s.vel = dx * 0.008; };
    const up = () => { state.current.drag = false; };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); addEventListener('pointerup', up);

    const P = 0.5; // camera pitch
    const sp = Math.sin(P), cp = Math.cos(P);

    const frame = (now: number) => {
      const s = state.current;
      if (!s.t0) s.t0 = now;
      const c0 = ctl?.current;
      const T = c0 ? c0.T : reduce ? 1 : Math.min(1, (now - s.t0) / DUR);
      const E = c0 ? c0.explode : 0, N = c0 ? c0.night : 0, Z = c0 ? c0.zoom : 0;
      if (!s.drag) { s.yaw += reduce ? 0 : (c0 ? 0.0006 : 0.0016) + s.vel; s.vel *= 0.92; }
      const stage = T < 0.25 ? 0 : T < 0.52 ? 1 : T < 0.72 ? 2 : 3;
      if (stage !== s.stage) { s.stage = stage; onStage?.(stage); }

      const scale = Math.min(W / (W < 600 ? 25 : 30), H / 21);
      const ox = W * 0.5, oy = H * 0.6;
      const yaw = s.yaw + (c0 ? c0.yaw : 0);
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const rot = (x: number, y: number) => [x * cy - y * sy, x * sy + y * cy];
      const pr = (x: number, y: number, z: number): [number, number, number] => {
        const [X, Y] = rot(x, y);
        return [ox + X * scale, oy - (z * cp - Y * sp) * scale, Y * cp + z * sp];
      };

      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, W, H);
      if (Z > 0) { // fly in toward the glass front
        const f = pr(-0.3, -4.45, 1.7); const zf = 1 + 7 * Z * Z;
        const tx = W / 2 + (f[0] - W / 2) * (1 - Z), ty = H / 2 + (f[1] - H / 2) * (1 - Z);
        cx.translate(tx, ty); cx.scale(zf, zf); cx.translate(-f[0], -f[1]);
      }
      const lift = (b: Box) => (b.k === 'tree' || b.k === 'pool' || b.k === 'step' ? 0 : b.z >= 6.5 ? 2 : b.z >= 3.3 ? 1 : 0) * E * 3.4;
      // site grid
      cx.lineWidth = 1; cx.strokeStyle = N > 0.3 ? 'rgba(255,255,255,.07)' : C.grid;
      for (let g = -14; g <= 14; g += 2) {
        let a = pr(g, -14, 0), b = pr(g, 14, 0); cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.stroke();
        a = pr(-14, g, 0); b = pr(14, g, 0); cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.stroke();
      }
      // 01 plan: footprint and grid lines drawn in red
      const planK = Math.min(1, T / 0.22);
      const plan: [number, number][][] = [
        [[-7.6, -4.6], [7.2, -4.6], [7.2, 5.2], [-7.6, 5.2], [-7.6, -4.6]],
        [[-6.5, -10.5], [3, -10.5], [3, -6.3], [-6.5, -6.3], [-6.5, -10.5]],
      ];
      cx.strokeStyle = C.red; cx.lineWidth = 1.4; cx.setLineDash([]);
      plan.forEach((poly) => {
        const segs = poly.length - 1; const n = planK * segs;
        cx.beginPath();
        for (let i = 0; i < segs && i < n; i++) {
          const f = Math.min(1, n - i);
          const [x1, y1] = poly[i], [x2, y2] = poly[i + 1];
          const a = pr(x1, y1, 0), b = pr(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 0);
          if (i === 0) cx.moveTo(a[0], a[1]);
          cx.lineTo(b[0], b[1]);
        }
        cx.stroke();
      });
      if (planK > 0.4) {
        cx.setLineDash([6, 4]); cx.strokeStyle = 'rgba(163,34,28,.45)'; cx.lineWidth = 1;
        [-7, -2.5, 2, 6.5].forEach((x) => { const a = pr(x, -6, 0), b = pr(x, 6.5, 0); cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.stroke(); });
        [-4, 0.5, 4.5].forEach((y) => { const a = pr(-9, y, 0), b = pr(8.6, y, 0); cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.stroke(); });
        cx.setLineDash([]);
      }

      // solids, painter's order (far first)
      const vis = boxes.map((b) => ({ b, k: Math.max(0, Math.min(1, (T - b.t) / 0.07)) })).filter((o) => o.k > 0);
      const tier = (b: Box) => (b.k === 'tree' ? 0.5 : Math.floor((b.z + 0.1) / 3.3));
      const depth = (b: Box) => rot(b.x + b.w / 2, b.y + b.d / 2)[1];
      vis.sort((A, Bx) => {
        const ta = tier(A.b), tb = tier(Bx.b);
        if (ta !== tb) return ta - tb;
        const sa = A.b.k === 'slab' ? 0 : 1, sb = Bx.b.k === 'slab' ? 0 : 1;
        if (sa !== sb) return sa - sb;
        return depth(A.b) - depth(Bx.b);
      });
      for (const { b, k } of vis) drawBox(b, k);

      function drawBox(b: Box, k: number) {
        if (b.k === 'tree') { drawTree(b, k); return; }
        const grow = b.k === 'slab' ? 1 : k;
        const drop = b.k === 'slab' ? (1 - easeOut(k)) * 3 : 0;
        const z0 = b.z + drop + lift(b), h = b.h * grow;
        const alpha = b.k === 'slab' ? k : 1;
        const pts = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.d], [b.x, b.y + b.d]];
        const bot = pts.map(([x, y]) => pr(x, y, z0)), top = pts.map(([x, y]) => pr(x, y, z0 + h));
        cx.globalAlpha = alpha;
        const glow = b.k === 'glass' && N > 0;
        cx.filter = N > 0 && !glow ? `brightness(${(1 - 0.55 * N).toFixed(2)})` : 'none';
        if (glow) { cx.shadowColor = 'rgba(255,170,80,.9)'; cx.shadowBlur = 28 * N; }
        // side faces facing the camera
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4;
          const [x1, y1] = pts[i], [x2, y2] = pts[j];
          const nx = y2 - y1, ny = -(x2 - x1);
          const ry = rot(nx, ny)[1];
          if (ry <= 0) continue;
          const light = 0.5 + 0.5 * Math.max(0, rot(nx, ny)[0] / Math.hypot(nx, ny));
          face([bot[i], bot[j], top[j], top[i]], sideFill(b.k, light, k));
        }
        face(top, topFill(b.k, k));
        cx.globalAlpha = 1; cx.filter = 'none'; cx.shadowBlur = 0;
      }
      function drawTree(b: Box, k: number) {
        const cxx = b.x + b.w / 2, cyy = b.y + b.d / 2;
        const base = pr(cxx, cyy, 0), topP = pr(cxx, cyy, b.h * 0.55 * k);
        cx.strokeStyle = C.finSide; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(base[0], base[1]); cx.lineTo(topP[0], topP[1]); cx.stroke();
        const c = pr(cxx, cyy, b.h * 0.75 * k);
        cx.globalAlpha = 0.85 * k; cx.fillStyle = C.tree; cx.beginPath(); cx.arc(c[0], c[1], b.w * scale * 0.9 * k, 0, Math.PI * 2); cx.fill();
        cx.globalAlpha = 1; cx.strokeStyle = C.line; cx.lineWidth = 0.6; cx.stroke();
      }
      function face(pts: [number, number, number][], fill: string) {
        cx.beginPath(); cx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i][0], pts[i][1]); cx.closePath();
        cx.fillStyle = fill; cx.fill(); cx.strokeStyle = C.line; cx.lineWidth = 0.7; cx.stroke();
      }
      function sideFill(kind: Kind, light: number, k: number) {
        switch (kind) {
          case 'glass': return N > 0 ? `rgba(${Math.round(120 + 135 * N)},${Math.round(150 + 40 * N)},${Math.round(165 - 75 * N)},${(0.35 + 0.5 * N).toFixed(2)})` : C.glass + (0.18 + 0.25 * k * light).toFixed(2) + ')';
          case 'fin': return light > 0.7 ? C.fin : C.finSide;
          case 'wall': return light > 0.7 ? C.wallA : C.wallB;
          case 'pool': return C.pool;
          case 'col': return C.col;
          default: return light > 0.7 ? C.slabTop : C.slabSide;
        }
      }
      function topFill(kind: Kind, k: number) {
        switch (kind) {
          case 'glass': return C.glass + (0.3 * k).toFixed(2) + ')';
          case 'fin': return C.fin;
          case 'pool': return C.pool;
          case 'wall': return C.wallA;
          default: return C.slabTop;
        }
      }
      // level marks
      if (E > 0.25) { // exploded-view labels, one per floor
        cx.globalAlpha = Math.min(1, (E - 0.25) / 0.3);
        cx.font = '600 10.5px Manrope, Arial, sans-serif';
        [['00  GROUND — LIVING, KITCHEN, COURTYARD', 1.6, 0], ['01  FIRST — BEDROOMS & TERRACE', 5.2, 1], ['02  ROOF — GARDEN & SOLAR', 7.1, 2]].forEach(([l, z, t]) => {
          const p = pr(8.2, 5.4, (z as number) + (t as number) * E * 3.4);
          const tw = cx.measureText(l as string).width;
          cx.strokeStyle = N > 0.3 ? 'rgba(255,255,255,.5)' : C.red; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(p[0], p[1]); cx.lineTo(p[0] + 36, p[1]); cx.stroke();
          cx.fillStyle = N > 0.3 ? 'rgba(20,20,30,.75)' : 'rgba(250,248,245,.94)'; cx.fillRect(p[0] + 40, p[1] - 11, tw + 14, 17);
          cx.fillStyle = N > 0.3 ? '#fff' : C.ink; cx.fillText(l as string, p[0] + 47, p[1] + 1);
        });
        cx.globalAlpha = 1;
      }
      if (T > 0.45 && E < 0.05 && Z < 0.05 && N < 0.3) {
        cx.globalAlpha = Math.min(1, (T - 0.45) / 0.1);
        cx.font = '600 10px Manrope, Arial, sans-serif'; cx.fillStyle = C.red;
        [['GF +0.00', 0.25], ['FF +3.65', 3.68], ['TOR +7.05', 7.05]].forEach(([l, z]) => {
          const p = pr(-8.6, -5.6, z as number);
          const tw = cx.measureText(l as string).width; cx.fillStyle = 'rgba(250,248,245,.92)'; cx.fillRect(p[0] + 10, p[1] - 11, tw + 10, 15); cx.fillStyle = C.red; cx.fillText(l as string, p[0] + 15, p[1]);
          cx.beginPath(); cx.moveTo(p[0] - 6, p[1] - 3); cx.lineTo(p[0] + 6, p[1] - 3); cx.strokeStyle = C.red; cx.lineWidth = 1; cx.stroke();
        });
        cx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className={className} aria-label="A 3D model of an AYRA villa building itself: plan, structure, walls and glass, then timber, pool and trees" role="img" />;
}

function easeOut(x: number) { return 1 - Math.pow(1 - x, 3); }
