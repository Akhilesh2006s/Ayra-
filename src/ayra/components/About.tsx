import { useEffect, useRef } from 'react';
import { IMG, NUMBERS, COMPANY } from '../data';
import { prefersReducedMotion, useInView, useScroll } from '../hooks';
import { Pencil } from './Marks';

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

/** About: a living-room section drawing that draws itself as you scroll, with the pencil riding the newest line. */
export function About() {
  const bpRef = useRef<SVGSVGElement>(null);
  const penRef = useRef<HTMLSpanElement>(null);
  const paths = useRef<SVGPathElement[]>([]);
  const pins = useRef<HTMLElement[]>([]);
  const addPath = (p: SVGPathElement | null) => { if (p && !paths.current.includes(p)) paths.current.push(p); };
  const addPin = (p: HTMLElement | null) => { if (p && !pins.current.includes(p)) pins.current.push(p); };

  useScroll(() => {
    const bp = bpRef.current, pen = penRef.current;
    if (!bp || !pen) return;
    const ds = paths.current;
    const r = bp.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height + innerHeight * 0.35)));
    let cur = -1, ck = 0;
    ds.forEach((d, i) => {
      const k = Math.min(1, Math.max(0, p * ds.length * 0.9 - i * 0.75));
      d.style.strokeDashoffset = String(1 - k);
      if (k > 0 && k < 1) { cur = i; ck = k; }
    });
    if (cur > -1 && !prefersReducedMotion()) {
      const pt = ds[cur].getPointAtLength(ds[cur].getTotalLength() * ck);
      const m = bp.getScreenCTM()!;
      const wr = (pen.parentNode as HTMLElement).getBoundingClientRect();
      pen.style.left = `${pt.x * m.a + m.e - wr.left}px`;
      pen.style.top = `${pt.y * m.d + m.f - wr.top}px`;
      pen.classList.add('on');
    } else pen.classList.remove('on');
    if (!prefersReducedMotion()) pins.current.forEach((el) => {
      const pr = (el.parentNode as HTMLElement).getBoundingClientRect();
      const c = pr.top + pr.height / 2 - innerHeight / 2;
      el.style.transform = `translate3d(0,${(c * Number(el.dataset.speed)).toFixed(1)}px,0)`;
    });
  });

  return (
    <section className="intro" id="about">
      <div className="wrap">
        <div className="g12">
          <p className="lab rv">[ 01 ] &nbsp;About AYRA</p>
          <h2 className="H rv">We draw the room, then we <span className="b">build it.</span></h2>
        </div>
        <div className="g12 cols">
          <div className="bpw rv">
        <svg className="bp" ref={bpRef} viewBox="0 0 600 540" role="img" aria-label="Section drawing of a living room: arched niche with a plant, sofa, pendant lamp and a tall window">
          <g className="grid-l"><line x1="60" y1="20" x2="60" y2="500"/><line x1="120" y1="20" x2="120" y2="500"/><line x1="180" y1="20" x2="180" y2="500"/><line x1="240" y1="20" x2="240" y2="500"/><line x1="300" y1="20" x2="300" y2="500"/><line x1="360" y1="20" x2="360" y2="500"/><line x1="420" y1="20" x2="420" y2="500"/><line x1="480" y1="20" x2="480" y2="500"/><line x1="540" y1="20" x2="540" y2="500"/></g>
          <path ref={addPath} className="d g" pathLength={1} d="M20 480 H580"/>
          <path ref={addPath} className="d" pathLength={1} d="M60 480 V60 H540 V480"/>
          <path ref={addPath} className="d" pathLength={1} d="M100 480 V260 A60 60 0 0 1 220 260 V480"/>
          <path ref={addPath} className="d" pathLength={1} d="M330 110 H510 V380 H330 Z"/>
          <path ref={addPath} className="d t" pathLength={1} d="M420 110 V380 M330 245 H510 M342 122 H498 M342 368 H498"/>
          <path ref={addPath} className="d" pathLength={1} d="M240 470 V412 Q240 400 252 400 H448 Q460 400 460 412 V470 Z M240 440 H460"/>
          <path ref={addPath} className="d t" pathLength={1} d="M258 400 V384 Q258 376 266 376 H320 Q328 376 328 384 V400 M372 400 V384 Q372 376 380 376 H434 Q442 376 442 384 V400 M256 470 V480 M444 470 V480"/>
          <path ref={addPath} className="d t" pathLength={1} d="M220 480 L238 474 H462 L480 480"/>
          <path ref={addPath} className="d c" pathLength={1} d="M300 60 V150 M278 150 H322 L312 172 H288 Z"/>
          <path ref={addPath} className="d c" pathLength={1} d="M140 480 V436 H180 V480 M160 436 C146 392 128 372 118 344 M160 436 C168 392 190 366 204 340 M160 436 C158 396 162 364 160 320 M160 380 C150 372 140 370 132 366 M164 372 C176 364 186 362 196 360"/>
          <path ref={addPath} className="d dim" pathLength={1} d="M36 60 V480 M28 60 H44 M28 480 H44"/>
          <text x="26" y="290" className="tx" transform="rotate(-90 26 290)">3 600</text>
          <text x="60" y="44" className="tx">A-01 / LIVING ROOM SECTION</text>
          <text x="338" y="100" className="tx">JAALI WINDOW</text>
          <text x="104" y="246" className="tx">LIME NICHE</text>
          <text x="20" y="510" className="tx">FFL +0.000</text>
          <g className="axis"><circle cx="60" cy="522" r="10"/><text x="60" y="526" textAnchor="middle">A</text><circle cx="300" cy="522" r="10"/><text x="300" y="526" textAnchor="middle">B</text><circle cx="540" cy="522" r="10"/><text x="540" y="526" textAnchor="middle">C</text></g>
        </svg>
            <Pencil ref={penRef} />
            <figure className="pin p1" data-speed="-.12" ref={addPin}><img src={IMG('stone.jpg')} alt="Stone courtyard" /><figcaption>stone, sun</figcaption></figure>
            <figure className="pin p2" data-speed=".1" ref={addPin}><img src={IMG('plaster.jpg')} alt="Lime plaster wall" /><figcaption>lime, shadow</figcaption></figure>
          </div>
          <div className="ctext">
            <p className="rv tldr"><b>AYRA is an interior and exterior design studio in {COMPANY.city}.</b> We design homes inside and out: living rooms, kitchens, bedrooms and pooja rooms, and the facades, courtyards and gardens around them.</p>
            <p className="rv">Every project starts as a pencil drawing at your table. It becomes a 3D walkthrough you can step through, then working drawings our site team builds to, line for line.</p>
            <p className="rv">The same hand designs the room and the front of the house, so the light, the materials and the view all agree. Every drawing is led by our principal architect, <b>Ar. {COMPANY.architect}</b>.</p>
            <a className="btn rv" href="#walk">What we design <span className="ar">&rarr;</span></a>
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
