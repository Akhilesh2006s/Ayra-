import { useRef, useState } from 'react';
import { IMG } from '../data';
import { prefersReducedMotion, useScroll } from '../hooks';
import { House3D, type HouseCtl } from './House3D';

/**
 * The crazy part: one scroll, one house.
 * The model rises from its plan, comes apart floor by floor (exploded view),
 * the sun goes down and the glass starts to glow, then the camera flies through
 * the front glass and you land inside the finished room.
 */
const CHAPTERS = [
  { at: 0.0, k: 'I', t: 'Raised from a plan.', s: 'Columns, slabs and walls — modelled to the millimetre before we break ground.' },
  { at: 0.22, k: 'II', t: 'Taken apart, floor by floor.', s: 'Every level designed on its own: living below, bedrooms above, a garden on the roof.' },
  { at: 0.5, k: 'III', t: 'Lit for the evening.', s: 'We design the light as carefully as the walls — how the house glows at dusk.' },
  { at: 0.74, k: 'IV', t: 'Then you walk in.', s: 'And the model becomes a home.' },
];
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

export function Journey() {
  const secRef = useRef<HTMLElement>(null);
  const ctl = useRef<HouseCtl>({ T: 0.2, explode: 0, night: 0, zoom: 0, yaw: 0 });
  const [p, setP] = useState(0);

  useScroll(() => {
    const el = secRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const v = clamp(-r.top / Math.max(1, el.offsetHeight - innerHeight));
    const reduce = prefersReducedMotion();
    const c = ctl.current;
    c.T = reduce ? 1 : 0.15 + 0.85 * ease(seg(v, 0, 0.18));
    c.explode = ease(seg(v, 0.22, 0.38)) * (1 - ease(seg(v, 0.46, 0.56)));
    c.night = ease(seg(v, 0.5, 0.68));
    c.zoom = reduce ? 0 : ease(seg(v, 0.74, 0.94));
    c.yaw = v * 1.3;
    setP(v);
  });

  const ch = [...CHAPTERS].reverse().find((c) => p >= c.at) ?? CHAPTERS[0];
  const night = ease(seg(p, 0.5, 0.68));
  const inside = seg(p, 0.86, 0.97);
  return (
    <section className="journey" ref={secRef} id="model" style={{ ['--n' as string]: night.toFixed(3) }}>
      <div className="jstick">
        <div className="jsky" aria-hidden="true" />
        <House3D ctl={ctl} className="jcanvas" />
        <img className="jinside" src={IMG('p1-r10.jpg')} alt="Inside the finished home: a sitting room by the shrine" style={{ opacity: inside, transform: `scale(${(1.15 - 0.15 * inside).toFixed(3)})` }} />
        <div className="jcopy" key={ch.k}>
          <span className="jk">{ch.k}</span>
          <h2 className="H">{ch.t}</h2>
          <p>{ch.s}</p>
        </div>
        <div className="jbar" aria-hidden="true"><i style={{ transform: `scaleY(${p.toFixed(3)})` }} /></div>
        <div className="jsteps" aria-hidden="true">{CHAPTERS.map((c) => <span key={c.k} className={c === ch ? 'on' : p > c.at ? 'done' : undefined}>{c.k}</span>)}</div>
      </div>
    </section>
  );
}
