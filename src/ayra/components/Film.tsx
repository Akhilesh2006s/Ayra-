import { useEffect, useRef, useState } from 'react';
import { FILM } from '../data';

/**
 * The process film: 2D plan → 3D model → a finished home, as one continuous video.
 * Two clips play back to back with a crossfade; the step labels follow the time.
 * Plays only while on screen, muted, and loops.
 */
const STEPS = [
  { k: '01', t: 'Plan', at: 0 },
  { k: '02', t: '3D model', at: 0.2 },
  { k: '03', t: 'Brought to life', at: 0.53 },
];

export function Film() {
  const secRef = useRef<HTMLElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const barRef = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);
  const [step, setStep] = useState(0);
  const onScreen = useRef(false);

  // play / pause with visibility
  useEffect(() => {
    const el = secRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      onScreen.current = e.isIntersecting;
      const v = vids.current[cur];
      if (!v) return;
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [cur]);

  // progress bar + step labels across both clips
  useEffect(() => {
    let raf = 0, last = -1;
    const n = FILM.clips.length;
    const loop = () => {
      const v = vids.current[cur];
      if (v && v.duration) {
        const p = (cur + v.currentTime / v.duration) / n;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
        let s = 0; STEPS.forEach((st, i) => { if (p >= st.at) s = i; });
        if (s !== last) { last = s; setStep(s); }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [cur]);

  const next = () => {
    const n = (cur + 1) % FILM.clips.length;
    const v = vids.current[n];
    if (v) { v.currentTime = 0; if (onScreen.current) v.play().catch(() => {}); }
    setCur(n);
  };

  return (
    <section className="film" ref={secRef} id="film" aria-label="From plan to place: the process film">
      <div className="wrap">
        <div className="fhead">
          <p className="lab">[ The process ]</p>
          <h2 className="H">Drawn in 2D. Built in 3D. <span className="b">Brought to life.</span></h2>
        </div>
        <div className="fstage">
          {FILM.clips.map((src, i) => (
            <video
              key={src}
              ref={(el) => { vids.current[i] = el; }}
              className={i === cur ? 'on' : undefined}
              src={src}
              poster={i === 0 ? FILM.poster : undefined}
              muted
              playsInline
              preload={i === 0 ? 'auto' : 'metadata'}
              loop={FILM.clips.length === 1}
              onEnded={next}
            />
          ))}
          <ol className="fsteps">
            {STEPS.map((s, i) => (
              <li key={s.k} className={i === step ? 'on' : i < step ? 'done' : undefined}><b>{s.k}</b>{s.t}</li>
            ))}
          </ol>
          <div className="fbar" aria-hidden="true"><i ref={barRef} /></div>
        </div>
        <p className="fnote">Every AYRA home goes through these three stages before anything is built: a measured plan, a 3D model you can walk through, then real materials and light.</p>
      </div>
    </section>
  );
}
