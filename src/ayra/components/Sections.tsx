import { useEffect, useRef, useState } from 'react';
import { BELIEF, COMPANY, IMG, MATERIALS, PROCESS, ROOMS, WORK } from '../data';
import { prefersReducedMotion, useScroll } from '../hooks';
import { DrawnEye } from './Marks';

/** A walk through the house: scrolling down slides the rooms sideways, each coloured in as it reaches the centre. */
export function Walk() {
  const walkRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const views = useRef<HTMLDivElement[]>([]);
  const [current, setCurrent] = useState(0);

  useScroll(() => {
    const walk = walkRef.current, track = trackRef.current;
    if (!walk || !track) return;
    const r = walk.getBoundingClientRect();
    const travel = walk.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, travel)));
    const range = Math.max(0, track.scrollWidth - innerWidth);
    track.style.transform = `translate3d(${(-p * range).toFixed(1)}px,0,0)`;
    if (barRef.current) barRef.current.style.width = `${p * 100}%`;
    let best = 0, bd = Infinity;
    views.current.forEach((v, i) => {
      const b = v.getBoundingClientRect();
      const d = Math.abs(b.left + b.width / 2 - innerWidth / 2);
      if (d < bd) { bd = d; best = i; }
      const k = prefersReducedMotion() ? 1 : Math.min(1, Math.max(0, 1 - (b.left + b.width * 0.15 - innerWidth * 0.12) / (innerWidth * 0.55)));
      v.style.setProperty('--k', `${(k * 100).toFixed(1)}%`);
      v.style.setProperty('--po', k > 0.02 && k < 0.98 ? '1' : '0');
    });
    setCurrent(best);
  });

  return (
    <section className="walk" id="walk" ref={walkRef}>
      <div className="wstick">
        <div className="whead wrap">
          <p className="lab">II &nbsp;&mdash;&nbsp; A walk through the house</p>
          <h2 className="H">Inside <span className="b">and</span> outside, <span className="b">one hand.</span></h2>
          <span className="lab wprog"><b>{String(current + 1).padStart(2, '0')}</b> / {String(ROOMS.length).padStart(2, '0')}</span>
        </div>
        <div className="wtrack" ref={trackRef}>
          {ROOMS.map((room, i) => (
            <article className="pnl" id={'id' in room ? room.id : undefined} key={room.title}>
              <span className="pn" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="pv" ref={(el) => { if (el) views.current[i] = el; }}>
                <img className="ph" src={IMG(`${room.img}.jpg`)} alt={`${room.title} designed by AYRA`} />
                <span className="note">{room.note}</span>
              </div>
              <div className="pt">
                <span className="lab">{room.side === 'Inside' ? 'A' : 'E'}-{String(i + 1).padStart(2, '0')} &nbsp;/&nbsp; {room.side}</span>
                <h3 className="H">{room.title}</h3>
                <p>{room.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="wbar"><i ref={barRef} /></div>
      </div>
    </section>
  );
}

export function Materials() {
  return (
    <section className="mats" id="materials">
      <div className="wrap">
        <div className="g12 sec-h">
          <p className="lab rv">IV &nbsp;&mdash;&nbsp; Materials</p>
          <h2 className="H rv sech">Stone, lime <span className="b">and timber.</span></h2>
        </div>
        <div className="mgrid">
          {MATERIALS.map((m, i) => (
            <div className="mat rv" key={m.name}>
              <span className="lab">M-{String(i + 1).padStart(2, '0')}</span>
              <div className="sw"><img src={IMG(`${m.img}.jpg`)} alt={m.name} /></div>
              <b>{m.name}</b><span>{m.use}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "What we believe": on black, the words light up as you read down. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = BELIEF.split(/\s+/);
  const [lit, setLit] = useState(0);
  useScroll(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    setLit(Math.round(p * words.length));
  });
  return (
    <section className="statement">
      <DrawnEye className="seye" />
      <div className="wrap">
        <p className="lab">V &nbsp;&mdash;&nbsp; What we believe</p>
        <p className="big H" ref={ref} aria-label={BELIEF}>
          {words.map((w, i) => <span key={i} className={i < lit ? 'lit' : undefined}>{w} </span>)}
        </p>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="process">
      <div className="wrap">
        <div className="g12 sec-h">
          <p className="lab rv">VI &nbsp;&mdash;&nbsp; How we work</p>
          <h2 className="H rv">Design. Detail. <span className="b">Build.</span></h2>
        </div>
        <div className="pgrid">
          {PROCESS.map((p, i) => (
            <div className="pcol rv" key={p.title}>
              <span className="k">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="H">{p.title}</h3>
              <p>{p.text}</p>
              <ul>{p.steps.map((s, j) => <li key={s}><span>{s}</span><span>{i + 1}.{j + 1}</span></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Project 49 keeps its own elephant and Night Garden colours. */
export function Project49() {
  return (
    <section className="p49band night" id="project-49">
      <div className="wrap g12 p49in">
        <p className="lab rv">VII &nbsp;&mdash;&nbsp; AYRA &times; Project 49</p>
        <a className="mk rv" href="/project-49/" aria-label="Enter Project 49"><i className="ring" /><img src={IMG('elephant.webp')} alt="Project 49 elephant mark" /></a>
        <div className="tx rv">
          <p className="lab" style={{ marginBottom: 18 }}>Forty-nine homes</p>
          <h2 className="H">Project <span className="b">49</span></h2>
          <p>Forty-nine one-of-a-kind homes in Hyderabad, seven design ideas, never repeated. AYRA draws the rooms inside them.</p>
          <a className="btn fill" href="/project-49/">Enter Project 49 <span className="ar">&rarr;</span></a>
        </div>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section className="work">
      <div className="wrap">
        <div className="g12 sec-h">
          <p className="lab rv">[ 07 ] &nbsp;Concepts</p>
          <h2 className="H rv">Drawn by <span className="b">AYRA.</span></h2>
        </div>
        <div className="wgrid">
          {WORK.map((w) => (
            <a className="wcard rv" href="#contact" key={w.title}><img src={IMG(`${w.img}.jpg`)} alt="" /><span className="lab">{w.tag}</span><h3 className="H">{w.title}</h3></a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The black logo card at the end, like the AYRA letterhead. */
export function LogoCard() {
  return (
    <section className="card" id="studio">
      <div className="wrap">
        <DrawnEye className="ceye" label="AYRA logo: an eye drawn from the letters A, Y, R, A" />
        <p className="cname">{COMPANY.legal}</p>
        <p className="cby">{COMPANY.architect}</p>
        <p className="crole">{COMPANY.role}</p>
        <p className="cline">Every space begins with how you see it.</p>
      </div>
    </section>
  );
}

/** A faint pencil line that follows the mouse and fades (desktop only). */
export function Trail() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || !matchMedia('(pointer:fine)').matches || prefersReducedMotion()) return;
    const cx = cv.getContext('2d')!;
    const pts: { x: number; y: number; t: number }[] = [];
    const dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const move = (e: MouseEvent) => pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    addEventListener('resize', size);
    addEventListener('mousemove', move, { passive: true });
    let raf = 0;
    const loop = (now: number) => {
      cx.clearRect(0, 0, innerWidth, innerHeight);
      while (pts.length && now - pts[0].t > 1100) pts.shift();
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], age = (now - b.t) / 1100;
        cx.strokeStyle = `rgba(20,20,20,${(0.5 * (1 - age)).toFixed(3)})`;
        cx.lineWidth = 1.3 * (1 - age) + 0.3;
        cx.lineCap = 'round';
        cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
        if (i % 3 === 0) {
          cx.strokeStyle = `rgba(20,20,20,${(0.18 * (1 - age)).toFixed(3)})`;
          cx.lineWidth = 0.6;
          cx.beginPath(); cx.moveTo(a.x + 1.5, a.y + 1); cx.lineTo(b.x + 1.5, b.y + 1); cx.stroke();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('mousemove', move); };
  }, []);
  return <canvas className="trail" ref={ref} aria-hidden="true" />;
}
