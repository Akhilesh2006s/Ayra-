import { useEffect, useRef, useState } from 'react';
import { DOOR_WORDS, EYE_PATHS, EYE_VIEWBOX, IMG } from '../data';
import { prefersReducedMotion } from '../hooks';
import { CycleWord, Logo, Pencil, PencilShape } from './Marks';

/**
 * The entry: on black, a pencil draws the AYRA eye, it blinks, then two doors open:
 * AYRA (interior & exterior) and Project 49 (its own elephant and Night Garden colours).
 */
export function Gate({ onEnterAyra }: { onEnterAyra: () => void }) {
  const [play, setPlay] = useState(false);
  const [opened, setOpened] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const [blink, setBlink] = useState(false);
  const [peek, setPeek] = useState<number | null>(null);
  const lgRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const penRef = useRef<SVGGElement>(null);

  const open = () => {
    setOpened((was) => {
      if (!was) window.setTimeout(() => setIntroGone(true), 900);
      return true;
    });
  };

  // the opening drawing
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let raf = 0;
    const start = requestAnimationFrame(() => requestAnimationFrame((t0) => {
      setPlay(true);
      const ps = pathRefs.current.filter(Boolean) as SVGPathElement[];
      if (reduce) { ps.forEach((p) => (p.style.strokeDashoffset = '0')); if (penRef.current) penRef.current.style.opacity = '0'; return; }
      const lens = ps.map((p) => p.getTotalLength());
      const total = lens.reduce((a, b) => a + b, 0);
      const begin = t0 + 150;
      const tick = (t: number) => {
        const k = Math.min(1, Math.max(0, (t - begin) / 2300));
        let d = k * total;
        ps.forEach((p, i) => {
          const part = Math.min(1, Math.max(0, d / lens[i]));
          p.style.strokeDashoffset = String(1 - part);
          if (d > 0 && d <= lens[i] && penRef.current) {
            const pt = p.getPointAtLength(d);
            penRef.current.setAttribute('transform', `translate(${pt.x},${pt.y})`);
          }
          d -= lens[i];
        });
        if (k < 1) raf = requestAnimationFrame(tick);
        else {
          if (penRef.current) penRef.current.style.opacity = '0';
          window.setTimeout(() => setBlink(true), 250);
        }
      };
      raf = requestAnimationFrame(tick);
    }));
    const auto = window.setTimeout(open, reduce ? 900 : 4400);
    const key = () => open();
    window.addEventListener('keydown', key, { once: true });
    return () => { cancelAnimationFrame(start); cancelAnimationFrame(raf); window.clearTimeout(auto); window.removeEventListener('keydown', key); };
  }, []);

  // each door briefly shows what is behind it
  useEffect(() => {
    if (!opened || prefersReducedMotion()) return;
    let n = 0;
    let off = 0;
    const first = window.setTimeout(function step() {
      setPeek(n % 2);
      off = window.setTimeout(() => setPeek(null), 2300);
      n++;
      timer = window.setTimeout(step, 3400);
    }, 1200);
    let timer = first;
    return () => { window.clearTimeout(timer); window.clearTimeout(off); };
  }, [opened]);

  const tilt = (e: React.PointerEvent) => {
    if (prefersReducedMotion() || !lgRef.current) return;
    lgRef.current.style.setProperty('--ry', `${(e.clientX / innerWidth - 0.5) * 16}deg`);
    lgRef.current.style.setProperty('--rx', `${-(e.clientY / innerHeight - 0.5) * 12}deg`);
  };

  return (
    <div className={`gate${opened ? ' in' : ''}`} id="gate" role="dialog" aria-label="Choose a way in">
      {!introGone && (
        <div className={`intro${play ? ' play' : ''}${opened ? ' done' : ''}`} aria-hidden="true" onClick={open} onPointerMove={tilt}>
          <div className="lg" ref={lgRef}>
            <svg className={`mk${blink ? ' blink' : ''}`} viewBox={EYE_VIEWBOX}>
              {EYE_PATHS.map((d, i) => <path key={i} ref={(el) => { pathRefs.current[i] = el; }} pathLength={1} d={d} />)}
              <g className="pg" ref={penRef}>
                <g transform="rotate(-38) scale(2.2) translate(0,-10)"><PencilShape /></g>
              </g>
            </svg>
            <i className="cu" style={{ transitionDelay: '2.3s' }} />
            <span className="wm">
              {'AYRA'.split('').map((c, i) => <b key={i} style={{ transitionDelay: `${2.5 + i * 0.1}s` }}>{c}</b>)}
            </span>
            <span className="tag">Associates &middot; Interior &amp; exterior design</span>
          </div>
          <span className="lab skip">Tap anywhere to enter</span>
        </div>
      )}

      <div className="top"><Logo /><span className="lab">Two ways in &middot; Choose yours</span></div>

      <a className={`door d1${peek === 0 ? ' peek' : ''}`} href="#top"
        onClick={(e) => { e.preventDefault(); open(); onEnterAyra(); }}>
        <span className="art">
          <img className="sk" src={IMG('p1-r16-sketch.jpg')} alt="" />
          <img className="ph" src={IMG('p1-r16.jpg')} alt="" />
          <Pencil />
        </span>
        <span className="k">01 / Design studio</span>
        <span className="H dh">AYRA<br /><span className="b">interior &amp; exterior</span></span>
        <span className="dp">Homes designed inside and out, from the first pencil line to the last cushion.
          <span className="tease"> Point here and watch the sketch become the room.</span></span>
        <span className="cyc" aria-hidden="true"><CycleWord words={DOOR_WORDS.ayra} ms={2200} /></span>
        <span className="enter"><i>&rarr;</i>Enter AYRA</span>
      </a>

      <a className={`door d2 p49${peek === 1 ? ' peek' : ''}`} href="/project-49/">
        <span className="art p49art"><i className="ring" /><i className="ring r2" /><img src={IMG('elephant.webp')} alt="" /></span>
        <span className="lock">49 HOMES &middot; ONE OF ONE</span>
        <span className="k">02 / Homes by AYRA</span>
        <span className="H dh">Project<br /><span className="b">49</span></span>
        <span className="dp">Forty-nine homes, built only once.
          <span className="tease"> Seven design ideas, never repeated. See what the first families chose.</span></span>
        <span className="cyc" aria-hidden="true"><CycleWord words={DOOR_WORDS.p49} ms={2600} /></span>
        <span className="enter"><i>&rarr;</i>Enter Project 49</span>
      </a>
    </div>
  );
}

/** "Drawing you into the world of AYRA": the eye draws, a counter runs, then the eye flies at you. */
export function Dive({ onLand, onDone }: { onLand: () => void; onDone: () => void }) {
  const [stage, setStage] = useState<'' | 'a' | 'b'>('');
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) { onLand(); onDone(); return; }
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setStage('a')));
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / 1900); setCount(Math.round(k * 100)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const t1 = window.setTimeout(onLand, 800);
    const t2 = window.setTimeout(() => setStage('b'), 2100);
    const t3 = window.setTimeout(onDone, 3900);
    return () => { cancelAnimationFrame(r); cancelAnimationFrame(raf); [t1, t2, t3].forEach(window.clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const msg = 'Drawing you into the world of AYRA';
  return (
    <div className={`dive${stage === 'a' ? ' a' : stage === 'b' ? ' a b' : ''}`} aria-hidden="true">
      <div className="dc">
        <svg className="mk" viewBox={EYE_VIEWBOX}>{EYE_PATHS.map((d, i) => <path key={i} pathLength={1} d={d} />)}</svg>
        <i className="cu" />
        <p className="msg">{msg.split('').map((c, i) => (
          <span key={i} style={{ transitionDelay: `${(0.75 + i * 0.03).toFixed(2)}s` }}>{c === ' ' ? ' ' : c}</span>
        ))}</p>
        <p className="cnt">{String(count).padStart(2, '0')}</p>
      </div>
    </div>
  );
}
