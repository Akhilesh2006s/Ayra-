import { forwardRef, useEffect, useState } from 'react';
import { EYE_PATHS, EYE_VIEWBOX } from '../data';
import { useCycle, useInView } from '../hooks';

/** The black drafting pencil. Its tip is at the left edge, so position it by its left/top. */
export const Pencil = forwardRef<HTMLSpanElement, { id?: string; style?: React.CSSProperties }>(
  function Pencil(props, ref) {
    return (
      <span className="pen" ref={ref} {...props}>
        <svg viewBox="0 0 160 20" aria-hidden="true"><PencilShape /></svg>
      </span>
    );
  },
);

export function PencilShape() {
  return (
    <>
      <polygon points="0,10 26,2 26,18" fill="#E9D9BF" />
      <polygon points="0,10 8,7.6 8,12.4" fill="#33312E" />
      <rect x="26" y="2" width="100" height="16" fill="#D8432B" />
      <rect x="26" y="7.4" width="100" height="1.2" fill="#fff" opacity=".35" />
      <rect x="126" y="2" width="10" height="16" fill="#C9C4BC" />
      <rect x="136" y="2" width="20" height="16" rx="4" fill="#EDEAE3" />
    </>
  );
}

/** Small static eye for the header, gate and footer. */
export function EyeIcon() {
  return (
    <svg className="mk" viewBox={EYE_VIEWBOX} aria-hidden="true">
      <path d={EYE_PATHS.join(' ')} />
    </svg>
  );
}

export function Logo({ href }: { href?: string }) {
  const inner = (
    <>
      <span className="mkw"><EyeIcon /><i /></span>
      <span className="wm">AYRA</span>
    </>
  );
  return href ? <a className="logo" href={href} aria-label="AYRA home">{inner}</a> : <span className="logo">{inner}</span>;
}

/** The eye that draws itself, stroke by stroke, when it scrolls into view. */
export function DrawnEye({ className, label }: { className: string; label?: string }) {
  const [ref, inView] = useInView<SVGSVGElement>(0.35);
  return (
    <svg
      ref={ref}
      className={`${className}${inView ? ' in' : ''}`}
      viewBox={EYE_VIEWBOX}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {EYE_PATHS.map((d, i) => (
        <path key={i} pathLength={1} d={d} style={{ transitionDelay: `${i * 0.14}s` }} />
      ))}
    </svg>
  );
}

/** A word that swaps every few seconds with a small fade. */
export function CycleWord({ words, ms }: { words: readonly string[]; ms: number }) {
  const i = useCycle(words.length, ms);
  const [shown, setShown] = useState(i);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (i === shown) return;
    setOut(true);
    const t = window.setTimeout(() => { setShown(i); setOut(false); }, 420);
    return () => window.clearTimeout(t);
  }, [i, shown]);
  return <b className={out ? 'out' : undefined}>{words[shown]}</b>;
}
