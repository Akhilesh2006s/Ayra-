import { useEffect, useRef, useState } from 'react';
import { COMPANY, CONTACT, FAQ, FILMS, SERVICES } from '../data';

/** Plays a muted looping video only while it is on screen (saves data and battery). */
function useAutoplay<T extends HTMLVideoElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold });
    io.observe(v); return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/** Full-screen opening film: a pencil sketch turns into the finished room. */
export function HeroFilm({ active }: { active: boolean }) {
  const v = useAutoplay<HTMLVideoElement>(0.2);
  const [on, setOn] = useState(false);
  useEffect(() => { if (active) { const t = setTimeout(() => setOn(true), 150); return () => clearTimeout(t); } }, [active]);
  const f = FILMS[0];
  return (
    <section className={`chero${on ? ' on' : ''}`} id="top">
      <video ref={v} className="chero-v" src={f.src} poster={f.poster} muted loop playsInline preload="auto" />
      <div className="chero-shade" />
      <div className="chero-copy wrap">
        <p className="lab">[ AYRA &middot; Architecture, interiors &amp; exteriors &middot; Hyderabad ]</p>
        <h1 className="H">From a line<br /><span className="b">to a home.</span></h1>
        <p className="chero-sub">Every AYRA room begins as a hand drawing. Watch it become the place you live in.</p>
        <div className="chero-cta">
          <a className="btn fill" href="#contact">Start a project <span className="ar">&rarr;</span></a>
          <a className="btn ghost" href="#reel">Watch the work</a>
        </div>
      </div>
      <div className="chero-tag"><span>{f.code}</span>{f.label}</div>
      <a className="chero-down" href="#reel" aria-label="Scroll down"><i /></a>
    </section>
  );
}

function ReelItem({ f, i }: { f: (typeof FILMS)[number]; i: number }) {
  const v = useAutoplay<HTMLVideoElement>();
  return (
    <article className={`reel-it r${i % 2} rv`}>
      <div className="reel-media">
        <video ref={v} src={f.src} poster={f.poster} muted loop playsInline preload="metadata" />
        <span className="reel-badge">Sketch &rarr; built</span>
      </div>
      <div className="reel-txt">
        <span className="reel-k">{f.code}</span>
        <h3>{f.label}</h3>
        <p>{f.text}</p>
      </div>
    </article>
  );
}

/** The work, as films: each one starts from the architect's drawing. */
export function Reel() {
  return (
    <section className="reel" id="reel">
      <div className="wrap">
        <p className="lab rv">[ I &mdash; The work, in motion ]</p>
        <h2 className="H rv">Drawn first. <span className="b">Then built.</span></h2>
        <div className="reel-list">
          {FILMS.slice(1).map((f, i) => <ReelItem key={f.src} f={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section className="svc" id="services">
      <div className="wrap">
        <p className="lab rv">[ II &mdash; What we design ]</p>
        <h2 className="H rv">One studio, <span className="b">inside and out.</span></h2>
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <div className="svc-it rv" key={s.title}>
              <span className="svc-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>{s.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Architect() {
  return (
    <section className="arch" id="studio">
      <div className="wrap arch-in">
        <div className="arch-mark rv" aria-hidden="true"><span>AYRA</span></div>
        <div className="arch-txt rv">
          <p className="lab">[ The studio ]</p>
          <h2 className="H">Led by an architect, <span className="b">not a catalogue.</span></h2>
          <p>AYRA is led by <b>{COMPANY.architect}</b>, {COMPANY.role}. Every home is drawn by hand first, modelled in 3D so you can walk through it, and then detailed down to the last cabinet and light before anything is ordered.</p>
          <p>The same hand designs the rooms and the front of the house, so the inside and the outside belong to each other.</p>
          <dl className="arch-facts">
            <div><dt>Studio</dt><dd>{COMPANY.city}</dd></div>
            <div><dt>Practice</dt><dd>{COMPANY.legal}</dd></div>
            <div><dt>Talk to us</dt><dd>{CONTACT.phoneLabel}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq">
      <div className="wrap faq-in">
        <div>
          <p className="lab rv">[ Questions ]</p>
          <h2 className="H rv">Before you <span className="b">call us.</span></h2>
        </div>
        <div className="faq-list">
          {FAQ.map((q, i) => (
            <div className={`faq-it${open === i ? ' on' : ''}`} key={q.q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{q.q}</span><i aria-hidden="true">+</i>
              </button>
              <div className="faq-a"><p>{q.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
