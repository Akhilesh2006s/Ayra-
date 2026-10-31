import { useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Run a callback on every scroll and resize (and once immediately). */
export function useScroll(cb: () => void, deps: unknown[] = []) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    const run = () => ref.current();
    run();
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('resize', run);
    return () => {
      window.removeEventListener('scroll', run);
      window.removeEventListener('resize', run);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** True once the element has come into view. */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Adds the "in" class to every .rv element as it scrolls into view (fade-up reveal). */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    );
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Every few ms, step through a list (used for the cycling words). */
export function useCycle(length: number, ms: number, enabled = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % length), ms);
    return () => window.clearInterval(t);
  }, [length, ms, enabled]);
  return i;
}

/** Scroll to one of the rooms in the horizontal walk. */
export function scrollToRoom(index: number, total: number) {
  const walk = document.getElementById('walk');
  if (!walk) return;
  const travel = walk.offsetHeight - window.innerHeight;
  const y = walk.getBoundingClientRect().top + window.scrollY + travel * (index / (total - 1)) * 0.98 + 2;
  window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
