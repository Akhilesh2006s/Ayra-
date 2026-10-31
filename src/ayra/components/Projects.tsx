import { useCallback, useEffect, useState } from 'react';
import { IMG, PROJECTS } from '../data';
import { useInView } from '../hooks';

type Shot = { img: string; cap: string };

function Project({ p, index, onOpen }: { p: (typeof PROJECTS)[number]; index: number; onOpen: (g: Shot[], i: number, name: string) => void }) {
  const [ref, inView] = useInView<HTMLElement>(0.25);
  return (
    <article className={`proj${inView ? ' in' : ''}`} ref={ref}>
      <button className="pcover" onClick={() => onOpen(p.gallery, 0, p.name)} aria-label={`Open ${p.name} photos`}>
        <img src={IMG(`${p.cover}.jpg`)} alt={`${p.name}, ${p.place}`} />
        <span className="pnum" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className="pview">View {p.gallery.length} photos <i>&rarr;</i></span>
      </button>
      <div className="pmeta">
        <span className="lab">{p.place} &nbsp;/&nbsp; {p.year}</span>
        <h3 className="H">{p.name}</h3>
        <span className="pscope">{p.scope}</span>
        <p>{p.text}</p>
      </div>
      <div className="pstrip" role="list">
        {p.gallery.map((g, i) => (
          <button role="listitem" key={g.img} onClick={() => onOpen(p.gallery, i, p.name)} style={{ transitionDelay: `${0.2 + i * 0.05}s` }}>
            <img src={IMG(`${g.img}.jpg`)} alt={g.cap} loading="lazy" />
            <span>{g.cap}</span>
          </button>
        ))}
      </div>
    </article>
  );
}

function Lightbox({ shots, start, name, onClose }: { shots: Shot[]; start: number; name: string; onClose: () => void }) {
  const [i, setI] = useState(start);
  const go = useCallback((d: number) => setI((x) => (x + d + shots.length) % shots.length), [shots.length]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    addEventListener('keydown', key);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', key); document.documentElement.style.overflow = prev; };
  }, [go, onClose]);
  const s = shots[i];
  return (
    <div className="lbox" role="dialog" aria-label={`${name} photos`} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img key={s.img} src={IMG(`${s.img}.jpg`)} alt={s.cap} />
        <figcaption><span>{name}</span> &nbsp;&mdash;&nbsp; {s.cap} <b>{String(i + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}</b></figcaption>
      </figure>
      <button className="lb-prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); go(-1); }}>&larr;</button>
      <button className="lb-next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); go(1); }}>&rarr;</button>
      <button className="lb-close" aria-label="Close" onClick={onClose}>CLOSE [X]</button>
    </div>
  );
}

/** AYRA's own projects: a big cover that opens up as you reach it, a strip of photos, and a full-screen viewer. */
export function Projects() {
  const [box, setBox] = useState<{ shots: Shot[]; i: number; name: string } | null>(null);
  return (
    <section className="projects" id="projects">
      <div className="wrap">
        <div className="g12 sec-h">
          <p className="lab rv">[ 03 ] &nbsp;Projects</p>
          <h2 className="H rv sech">Our own <span className="b">work.</span></h2>
        </div>
        {PROJECTS.map((p, idx) => (
          <Project key={p.name} p={p} index={idx} onOpen={(shots, i, name) => setBox({ shots, i, name })} />
        ))}
      </div>
      {box && <Lightbox shots={box.shots} start={box.i} name={box.name} onClose={() => setBox(null)} />}
    </section>
  );
}
