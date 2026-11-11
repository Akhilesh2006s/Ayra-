import { useEffect, useRef } from 'react';
import { IMG, NUMBERS, COMPANY } from '../data';
import { prefersReducedMotion, useInView, useScroll } from '../hooks';

function Count({ to }: { to: number | string }) {
  const [ref, inView] = useInView<HTMLElement>(0.6);
  useEffect(() => {
    const node = ref.current;
    if (typeof to !== 'number' || !inView || !node || prefersReducedMotion()) return;
    let s = 0, raf = 0;
    const step = (ts: number) => { s = s || ts; const k = Math.min(1, (ts - s) / 1400); node.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, ref]);
  return <b ref={ref}>{to}</b>;
}

/** About: an editorial spread — large photo, a smaller one overlapping, and the studio text. */
export function About() {
  const pins = useRef<HTMLElement[]>([]);
  const addPin = (p: HTMLElement | null) => { if (p && !pins.current.includes(p)) pins.current.push(p); };
  useScroll(() => {
    if (prefersReducedMotion()) return;
    pins.current.forEach((el) => {
      const r = (el.parentNode as HTMLElement).getBoundingClientRect();
      const c = r.top + r.height / 2 - innerHeight / 2;
      el.style.transform = `translate3d(0,${(c * Number(el.dataset.speed)).toFixed(1)}px,0)`;
    });
  });
  return (
    <section className="intro" id="about">
      <div className="wrap">
        <div className="g12">
          <p className="lab rv">I &nbsp;&mdash;&nbsp; The studio</p>
          <h2 className="H rv">Architecture for the inside <span className="b">and the outside</span> of a home.</h2>
        </div>
        <div className="g12 cols">
          <div className="spread rv">
            <figure className="big"><img src={IMG('p1-r12.jpg')} alt="Hall with a carved teak mandapa, by AYRA" /><figcaption>Teak, Brass &amp; Light — Hyderabad</figcaption></figure>
            <figure className="small" data-speed="-.08" ref={addPin}><img src={IMG('p1-r19.jpg')} alt="Brass lamps in the pooja room" /><figcaption>Brass, detail</figcaption></figure>
          </div>
          <div className="ctext">
            <p className="rv tldr"><b>AYRA is an interior and exterior design studio in {COMPANY.city}.</b> We design homes inside and out: living rooms, kitchens, bedrooms and pooja rooms, and the facades, courtyards and gardens around them.</p>
            <p className="rv">Every project begins at your table, becomes a 3D walkthrough you can step through, then working drawings our site team builds to.</p>
            <p className="rv">The same hand designs the room and the front of the house, so the light, the materials and the view all agree. Every project is led by our principal architect, <b>Ar. {COMPANY.architect}</b>.</p>
            <a className="btn rv" href="#projects">See our projects</a>
          </div>
        </div>
        <div className="nums">
          {NUMBERS.map((n) => (
            <div className="rv" key={n.text}><Count to={n.value} /><span className="lab">{n.text}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
