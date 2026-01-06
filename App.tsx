
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import ProjectDetail from './components/ProjectDetail';
import CustomCursor from './components/CustomCursor';
import { Leva } from 'leva';
gsap.registerPlugin(ScrollTrigger);

// Global Debug Toggle - Set to false to hide all controls by default
const DEBUG = false;

interface Project {
  title: string;
  desc: string;
  longDesc: string;
  image: string;
  tag?: string;
  date?: string;
  location?: string;
}

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [researchFocus, setResearchFocus] = useState<{ texture: any; progress: number; center?: any } | null>(null);

  useEffect(() => {
    if (selectedProject) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    // ScrollTrigger reveal logic moved to Overlay.tsx

    return () => {
      trigger.kill();
    };
  }, [selectedProject]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setSelectedProject(null);
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const scrollToTop = () => {
    setSelectedProject(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calcula a distorção baseada na proximidade do corpo 3D (no início do scroll)
  const distortion = scrollProgress < 0.2
    ? Math.pow(1 - (scrollProgress / 0.2), 2) // Queda suave da distorção
    : 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <CustomCursor />
      <Leva hidden={!DEBUG} collapsed />
      <div className={`canvas-container transition-opacity duration-[2.5s] ${selectedProject ? 'opacity-0' : 'opacity-100'}`}>
        <Scene
          progress={selectedProject ? 0.45 : scrollProgress}
          researchFocus={researchFocus}
        />
      </div>

      <nav className={`fixed top-0 left-0 w-full px-10 py-10 z-50 flex justify-between items-start pointer-events-none transition-transform duration-[1.2s] ease-in-out ${selectedProject ? '-translate-y-full' : 'translate-y-0'}`}>
        <div
          onClick={scrollToTop}
          className="font-display-bold text-3xl tracking-tighter pointer-events-auto cursor-pointer text-black hover:opacity-50 transition-opacity uppercase"
        >
          Bruno Realities
        </div>

        <div className="flex space-x-12 pointer-events-auto">
          {[
            { id: 'about', label: 'About' },
            { id: 'works', label: 'Works' },
            { id: 'research', label: 'Research' },
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className="text-[10px] font-display-bold uppercase tracking-[0.2em] text-black hover:opacity-50 transition-opacity"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {selectedProject ? (
        <ProjectDetail
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <Overlay
          onProjectClick={setSelectedProject}
          scrollProgress={scrollProgress}
          distortion={distortion}
          onResearchFocus={setResearchFocus}
        />
      )}
    </div>
  );
};

export default App;
