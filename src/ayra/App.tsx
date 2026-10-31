import { useEffect, useState } from 'react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Dive, Gate } from './components/Gate';
import { LogoCard, Materials, Process, Project49, Statement, Trail, Walk } from './components/Sections';
import { Projects } from './components/Projects';
import { Header, Hero, Marquee } from './components/Top';
import { useReveal } from './hooks';

/**
 * AYRA home page.
 * Order: entry gate → header → hero → word bands → about → walk through the house → projects →
 * materials → belief → process → Project 49 → contact → logo card.
 * Text and images are in data.ts; styles in ayra.css.
 */
export default function App() {
  const [entered, setEntered] = useState(false);
  const [diving, setDiving] = useState(false);
  useReveal();

  // lock scrolling while the entry gate is up
  useEffect(() => {
    document.documentElement.style.overflow = entered ? '' : 'hidden';
  }, [entered]);

  return (
    <>
      <Header />
      {!entered && <Gate onEnterAyra={() => setDiving(true)} />}
      {diving && <Dive onLand={() => setEntered(true)} onDone={() => setDiving(false)} />}
      <main id="top">
        <Hero active={entered} />
        <Marquee />
        <About />
        <Walk />
        <Projects />
        <Materials />
        <Statement />
        <Process />
        <Project49 />
      </main>
      <Contact />
      <LogoCard />
      <Trail />
    </>
  );
}
