import { Fragment, useEffect, useRef, useState } from 'react';
import { HERO_SCENES, IMG, MARQUEE, NAV, ROOMS } from '../data';
import { prefersReducedMotion, scrollToRoom, useScroll } from '../hooks';
import { Logo } from './Marks';
import { House3D, STAGES } from './House3D';

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
            <a key={n.href} href={n.href} className={i === 0 ? 'on' : undefined} onClick={(e) => navClick(e, (n as { room?: number }).room)}>{n.label}</a>
          ))}
        </nav>
        <a className="btn" href="#contact">Start a project</a>
        <button className="burger" aria-label="Open menu" onClick={() => setMenu(true)}><i /><i /></button>
      </header>
      <div className={`mnav${menu ? ' open' : ''}`}>
        <button onClick={() => setMenu(false)}>CLOSE [X]</button>
        {[...NAV, { label: 'Contact', href: '#contact', room: undefined }].map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => { setMenu(false); navClick(e, (n as { room?: number }).room); }}>{n.label}</a>
        ))}
      </div>
    </>
  );
}

/**
 * Hero: an architect's model comes alive. A 3D villa builds itself on the site grid
 * (plan → structure → envelope → material), then dissolves into the finished, photographed rooms.
 */
export function Hero({ active }: { active: boolean }) {
  const [stage, setStage] = useState(0);
  const [live, setLive] = useState(false);
  const [play, setPlay] = useState(0);
  const [i, setI] = useState(0);
  const [up, setUp] = useState(false);
  useEffect(() => { HERO_SCENES.forEach((s) => { new Image().src = IMG(`${s.img}.jpg`); }); }, []);
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setUp(true), 200);
    setPlay((p) => p + 1); setLive(false); setStage(0);
    const toLive = window.setTimeout(() => setLive(true), prefersReducedMotion() ? 2500 : 11500);
    return () => { window.clearTimeout(t); window.clearTimeout(toLive); };
  }, [active]);
  useEffect(() => {
    if (!live || prefersReducedMotion()) return;
    const iv = window.setInterval(() => setI((x) => (x + 1) % HERO_SCENES.length), 5500);
    return () => window.clearInterval(iv);
  }, [live]);
  const replay = () => { setLive(false); setStage(0); setPlay((p) => p + 1); window.setTimeout(() => setLive(true), 11500); };
  const s = HERO_SCENES[i];
  return (
    <section className="hero ahero">
      <div className="in">
        <div className="copy">
          <p className="kicker">AYRA Associates &nbsp;&mdash;&nbsp; Architecture, interiors &amp; exteriors</p>
          <h1 className={`H build${up ? ' up' : ''}`} aria-label="From plan to place.">
            <span className="w"><span>From plan</span></span><br />
            <span className="w"><span className="b" style={{ transitionDelay: '.12s' }}>to place.</span></span>
          </h1>
          <p className="sub">Every AYRA home is modelled in 3D before a single brick is laid. You walk through it, change it, live in it — then we build it, exactly.</p>
          <ol className="stages">
            {STAGES.map((n, k) => (
              <li key={n} className={live ? 'done' : k < stage ? 'done' : k === stage ? 'on' : undefined}><b>{String(k + 1).padStart(2, '0')}</b>{n}</li>
            ))}
            <li className={live ? 'on' : undefined}><b>05</b>Built</li>
          </ol>
          <div className="acts">
            <a className="btn fill" href="#contact">Start a project</a>
            <button className="btn" onClick={live ? replay : () => setLive(true)}>{live ? 'Replay the model' : 'See it built'}</button>
          </div>
        </div>
        <div className={`stage3d${live ? ' live' : ''}`}>
          <House3D playKey={play} onStage={setStage} />
          <div className="renders" aria-hidden={!live}>
            {HERO_SCENES.map((sc, k) => <img key={sc.img} src={IMG(`${sc.img}.jpg`)} alt={k === i ? sc.label : ''} className={k === i ? 'on' : undefined} />)}
            <p className="cap"><b>{String(i + 1).padStart(2, '0')}</b> / {String(HERO_SCENES.length).padStart(2, '0')} &nbsp;&middot;&nbsp; {s.label}</p>
          </div>
          <span className="hint">{live ? 'Built by AYRA' : 'Drag to turn the model'}</span>
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
