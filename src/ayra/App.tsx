import { useEffect, useState } from 'react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Dive, Gate } from './components/Gate';
import { LogoCard, Materials, Process, Project49, Statement } from './components/Sections';
import { Projects } from './components/Projects';
import { Header } from './components/Top';
import { Architect, Faq, HeroFilm, Reel, Services } from './components/Cinema';
import { useReveal } from './hooks';
import { startSmoothScroll } from '../smooth';

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
    if (entered) startSmoothScroll(); // inertial, buttery scrolling on desktop (Lenis)
  }, [entered]);

  return (
    <>
      <Header />
      {!entered && <Gate onEnterAyra={() => setDiving(true)} />}
      {diving && <Dive onLand={() => setEntered(true)} onDone={() => setDiving(false)} />}
      <main>
        <HeroFilm active={entered} />
        <Reel />
        <About />
        <Services />
        <Projects />
        <Architect />
        <Materials />
        <Statement />
        <Process />
        <Faq />
        <Project49 />
      </main>
      <Contact />
      <LogoCard />
    </>
  );
}
