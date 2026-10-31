import { Fragment, useEffect, useRef, useState } from 'react';
import { HERO_SCENES, IMG, MARQUEE, NAV, ROOMS } from '../data';
import { prefersReducedMotion, scrollToRoom, useScroll } from '../hooks';
import { Logo, Pencil } from './Marks';

function navClick(e: React.MouseEvent, room?: number) {
  if (room === undefined) return;
  e.preventDefault();
  scrollToRoom(room, ROOMS.length);
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  useScroll(() => setSolid(window.scrollY > 40));
  return (
    <>
      <header className={`hdr${solid ? ' solid' : ''}`}>
        <Logo href="#top" />
        <nav className="nav">
          {NAV.map((n, i) => (
            <a key={n.href} href={n.href} className={i === 0 ? 'on' : undefined} onClick={(e) => navClick(e, n.room)}>{n.label}</a>
          ))}
        </nav>
        <a className="btn" href="#contact">Start a project <span className="ar">&rarr;</span></a>
        <button className="burger" aria-label="Open menu" onClick={() => setMenu(true)}><i /><i /></button>
      </header>
      <div className={`mnav${menu ? ' open' : ''}`}>
        <button onClick={() => setMenu(false)}>CLOSE [X]</button>
        {[...NAV, { label: 'Contact', href: '#contact', room: undefined }].map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => { setMenu(false); navClick(e, n.room); }}>{n.label}</a>
        ))}
      </div>
    </>
  );
}

/** Hero: the pencil colours each room in, holds, then moves to the next one. */
export function Hero({ active }: { active: boolean }) {
  const artRef = useRef<HTMLDivElement>(null);
  const skRef = useRef<HTMLImageElement>(null);
  const phRef = useRef<HTMLImageElement>(null);
  const penRef = useRef<HTMLSpanElement>(null);
  const gnRef = useRef<HTMLSpanElement>(null);
  const gmRef = useRef<HTMLElement>(null);
  const [scene, setScene] = useState(0);
  const [up, setUp] = useState(false);

  // preload every scene
  useEffect(() => {
    HERO_SCENES.forEach((s) => { new Image().src = IMG(`${s.img}.jpg`); new Image().src = IMG(`${s.img}-sketch.jpg`); });
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setUp(true), 250);
    const art = artRef.current!;
    const setP = (p: number) => {
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      art.style.setProperty('--p', `${(e * 100).toFixed(2)}%`);
      art.style.setProperty('--py', `${(46 + Math.sin(p * Math.PI * 7) * 5).toFixed(2)}%`);
      if (gnRef.current) gnRef.current.textContent = String(Math.round(e * 100)).padStart(2, '0');
      if (gmRef.current) gmRef.current.style.bottom = `${e * 100}%`;
    };
    if (prefersReducedMotion()) { setP(1); return () => window.clearTimeout(t); }
    const DRAW = 2600, HOLD = 2600, FADE = 700;
    let t0 = 0, raf = 0, i = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const el = now - t0;
      const pen = penRef.current!;
      if (el < DRAW) { setP(el / DRAW); pen.style.opacity = '1'; }
      else if (el < DRAW + HOLD) { setP(1); pen.style.opacity = '0'; }
      else if (el < DRAW + HOLD + FADE) { const o = String(1 - (el - DRAW - HOLD) / FADE); skRef.current!.style.opacity = o; phRef.current!.style.opacity = o; }
      else {
        i = (i + 1) % HERO_SCENES.length;
        const s = HERO_SCENES[i];
        skRef.current!.src = IMG(`${s.img}-sketch.jpg`);
        phRef.current!.src = IMG(`${s.img}.jpg`);
        setScene(i);
        setP(0);
        skRef.current!.style.opacity = '1';
        phRef.current!.style.opacity = '1';
        t0 = now;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = window.setTimeout(() => { raf = requestAnimationFrame(tick); }, 500);
    return () => { window.clearTimeout(t); window.clearTimeout(start); cancelAnimationFrame(raf); };
  }, [active]);

  const s = HERO_SCENES[scene];
  const words = ['Every', 'space', 'begins', 'as', 'a'];
  return (
    <section className="hero">
      <div className="art" ref={artRef}>
        <img className="sk" ref={skRef} src={IMG(`${HERO_SCENES[0].img}-sketch.jpg`)} alt="" />
        <img className="ph" ref={phRef} src={IMG(`${HERO_SCENES[0].img}.jpg`)} alt="A room designed by AYRA" />
        <Pencil ref={penRef} />
      </div>
      <div className="grid" />
      <div className="gauge" aria-hidden="true">
        <span className="gl">DRAWN</span><span className="gn" ref={gnRef}>00</span>
        <span className="track"><i ref={gmRef} /></span><span className="gl">BUILT</span>
      </div>
      <span className="scene"><b>{s.code}</b> &nbsp;{s.label}</span>
      <div className="in">
        <p className="lab"><b>AYRA</b> &nbsp;/&nbsp; Interior &amp; exterior design</p>
        <h1 className={`H build${up ? ' up' : ''}`} aria-label="Every space begins as a line.">
          {words.map((w, i) => (
            <span key={w}><span className="w"><span style={{ transitionDelay: `${i * 0.09}s` }}>{w}</span></span> </span>
          ))}
          <span className="w"><span className="b" style={{ transitionDelay: '0.45s' }}>line.</span></span>
        </h1>
        <div className="hfoot">
          <a className="go" href="#about"><i>&darr;</i> Let&rsquo;s draw</a>
          <p className="lab coord">Studio Hyderabad &nbsp;/&nbsp; Homes across India</p>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const row = (items: string[]) => (
    <span>{items.map((w) => <Fragment key={w}>{w} <i>&#9998;</i> </Fragment>)}&nbsp;</span>
  );
  return (
    <div className="mq" aria-hidden="true">
      <div className="mrow">{row(MARQUEE.inside)}{row(MARQUEE.inside)}</div>
      <div className="mrow r">{row(MARQUEE.outside)}{row(MARQUEE.outside)}</div>
    </div>
  );
}
