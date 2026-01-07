import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OrbitalInterface from './OrbitalInterface';
import { Work } from './HorizontalCarousel';
import WorkModal from './WorkModal';
import GlassCard from './GlassCard';
import ResearchField, { ResearchItem } from './ResearchField';
import MorphingText from './MorphingText';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  desc: string;
  longDesc: string;
  image: string;
  tag?: string;
  date?: string;
  location?: string;
}

interface OverlayProps {
  onProjectClick: (project: Project) => void;
  scrollProgress: number;
  distortion: number;
  onResearchFocus?: (focus: { texture: any; progress: number; center?: any } | null) => void;
}

const Overlay: React.FC<OverlayProps> = ({ onProjectClick, scrollProgress, distortion, onResearchFocus }) => {
  const [activeWork, setActiveWork] = useState<Work | null>(null);
  const [isAboutRevealed, setIsAboutRevealed] = useState(false);
  const [activeResearch, setActiveResearch] = useState<ResearchItem | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll('.reveal');
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        onEnter: () => section.classList.add('active'),
        onEnterBack: () => section.classList.add('active'),
      });
      triggers.push(st);
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      triggers.forEach(t => t.kill());
    };
  }, []);

  const works: Work[] = [
    {
      title: "Cheiro No Cangote",
      desc: "Everyday digital intimacy and synthetic touch.",
      longDesc: "Cotidiano captures the mundane moments of interaction with digital interfaces. It highlights the subtle textures of synthetic touch and the quiet intimacy found in our daily digital rituals.",
      image: "images/images/capa_cheiro.jpeg",
      year: "2024",
      tags: ["Spatial"],
      medium: "Digital",
      context: "Ongoing"
    },
    {
      title: "Antropomórficos",
      desc: "Efeitos colaterais de sentir como humano.",
      longDesc: "Antropomórficos is an ongoing investigation into the physicalization of emotional data. The work translates complex human feelings—longing, desire, anxiety—into tactile, biomorphic forms that pulse and breathe.",
      image: "images/images/eros.png",
      year: "2025",
      tags: ["Illustration"],
      medium: "Hybrid",
      context: "Commissioned"
    },
    {
      title: "Melting Intimacy",
      desc: "Videoart about the degrading intimacy stage",
      longDesc: "This work focuses on the translation of physical gestures into digital textures. It explores how the nuance of human movement can be preserved and amplified through generative processes.",
      image: "images/images/meltingintimacy.png",
      year: "2025",
      tags: ["VideoArt"],
      medium: "Hybrid",
      context: "Performance"
    },
    {
      title: "Speculatives Intimacies",
      desc: "Unrequited signals in a fragmented presence.",
      longDesc: "Não Correspondido deals with the failure of communication in digital spaces. It visualizes the 'lost packets' of emotional intent, creating a landscape of fragmented signals and unfulfilled desires.",
      image: "images/images/speculativeintimacy.png",
      year: "2024",
      tags: ["Illustration"],
      medium: "Digital",
      context: "Online"
    },
    {
      title: "Corpo Sem Orgãos",
      desc: "Resin Sculpture of 3D printed human body without organs",
      longDesc: "A study on solitude within the hyper-connected digital realm. No Canto creates a quiet, peripheral space for contemplation and self-observation.",
      image: "images/images/corposemorgãos.jpeg",
      year: "2025",
      tags: ["Sculpture"],
      medium: "Hybrid",
      context: "Exhibition"
    },
    {
      title: "Interdito",
      desc: "Fine art of a forbidden gesture",
      longDesc: "Smiley Render deconstructs the most basic symbol of happiness. It reveals the complex, often distorted layers of data that lie beneath the surface of digital positivity.",
      image: "images/images/interdito.jpeg",
      year: "2024",
      tags: ["Illustration"],
      medium: "Digital",
      context: "Ongoing"
    },
    {
      title: "Assimétricos",
      desc: "Translucent Artificial Intimacy Sculpture",
      longDesc: "Underwater immerses the viewer in a dense, fluid digital environment. It explores the sensation of being submerged in data, where presence is felt through pressure and light rather than solid form.",
      image: "images/images/capa_assimetricos.jpeg",
      year: "2025",
      tags: ["Sculpture"],
      medium: "Digital",
      context: "Exhibition"
    }
  ];

  const handleCloseModal = () => setActiveWork(null);

  const handleNextWork = () => {
    if (!activeWork) return;
    const currentIndex = works.findIndex(w => w.title === activeWork.title);
    const nextIndex = (currentIndex + 1) % works.length;
    setActiveWork(works[nextIndex]);
  };

  const handlePrevWork = () => {
    if (!activeWork) return;
    const currentIndex = works.findIndex(w => w.title === activeWork.title);
    const prevIndex = (currentIndex - 1 + works.length) % works.length;
    setActiveWork(works[prevIndex]);
  };

  return (
    <main className="w-full text-black">
      {/* Work Modal */}
      {activeWork && (
        <WorkModal
          work={activeWork}
          index={works.findIndex(w => w.title === activeWork.title)}
          total={works.length}
          onClose={handleCloseModal}
          onNext={handleNextWork}
          onPrev={handlePrevWork}
        />
      )}

      {/* HERO SECTION */}
      <section id="hero" className="min-h-screen flex flex-col justify-center px-10 relative overflow-hidden">
        <div className="reveal flex flex-col items-center justify-center text-center">
          <div className="absolute top-10 left-10 text-left">
            <h1 className="font-system text-xl md:text-2xl tracking-[0.2em] opacity-90"></h1>
            <span className="font-system text-[9px] opacity-40 block mt-1 leading-none">Digital Corporeality Archive</span>
          </div>

          <div className="absolute bottom-10 right-10 text-right hidden md:block text-black">
            <p className="font-system text-[9px] leading-relaxed opacity-60">
              Phase: Fragmented<br />
              Status:  De-Virtuality
            </p>
          </div>
        </div>

        <div style={{ opacity: Math.max(0, 1 - scrollProgress * 8), transition: 'opacity 0.5s ease-out' }}>
          <MorphingText />
        </div>
      </section>

      <div className="divider-dark" />

      {/* ABOUT SECTION */}
      <section id="about" onClick={() => setIsAboutRevealed(!isAboutRevealed)} className="relative min-h-screen w-full overflow-hidden bg-black group/about">
        <div className={`absolute inset-0 z-0 transition-all duration-[2s] ease-in-out grayscale blur-2xl opacity-100 group-hover/about:grayscale-0 group-hover/about:opacity-100 group-hover/about:blur-none scale-100 ${isAboutRevealed ? 'grayscale-0 blur-none opacity-100' : ''}`}>
          <img src="/images/PERFIL.jpg" alt="Artist Portrait" className="w-full h-full object-cover object-[center_20%] -scale-x-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
        </div>

        <div className="relative z-10 h-full min-h-screen flex flex-col justify-between p-10 md:p-20 pt-32 md:pt-40 pointer-events-none">
          <div className="reveal flex justify-start">
            <div className="border-t border-white/20 pt-4">
              <h3 className="font-system text-[11px] text-white tracking-[0.3em] opacity-80 uppercase leading-none">Artist Statement</h3>
            </div>
          </div>

          <div className="reveal flex justify-end items-end h-full">
            <GlassCard variant="compact" dark className="max-w-2xl text-right pointer-events-auto">
              <p className="font-system text-[3.8vw] md:text-[2.2vw] text-white leading-[0.95] tracking-[-0.07em] mb-4 uppercase">
                New media artist investigating the boundaries between visceral flesh and digital simulacrums. Through 3D modeling, glitch art, and immersive installations, the artist distorts post-anatomical figures to confront sterile virtuality with physical friction, denouncing the artificialization of intimate territories.
              </p>
              <div className="mt-8 flex justify-end items-center gap-6 opacity-30">
                <span className="font-system text-[9px] text-white tracking-[0.4em]">status.presence // active</span>
                <div className="w-12 h-[1px] bg-white/40"></div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <div className="divider-dark" />

      {/* WORKS SECTION */}
      <section id="works" className="min-h-[130vh] lg:min-h-[95vh] border-t border-black/5 pb-4 md:pb-10">
        <div className="relative z-10">
          <OrbitalInterface
            works={works}
            onWorkClick={(work) => setActiveWork(work)}
          />
        </div>
      </section>

      <div className="divider-dark" />

      {/* RESEARCH SECTION - Laboratory Archive Redesign */}
      <section id="research" className="min-h-screen pt-12 pb-32 md:py-32 px-10 bg-white/5 backdrop-blur-[2px] text-black relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="mb-20 reveal border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <h2 className="font-system text-[8vw] md:text-[6vw] tracking-tighter-massive leading-none opacity-90 mb-2 uppercase">Research</h2>
              <span className="font-system text-[10px] tracking-[0.4em] opacity-40 uppercase">Laboratory Archive // Concept Study</span>
            </div>

            <div className="max-w-xs">
              <h3 className="font-system text-[10px] tracking-[0.3em] mb-6 opacity-30 uppercase">Lines of Investigation</h3>
              <ul className="space-y-3 opacity-60">
                {["Artificial Intimacy", "Virtualization of Embodiment", "Post-Anatomical Bodies", "Distortion Surfaces"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1 h-[1px] bg-black/30"></span>
                    <span className="font-system text-xs tracking-widest uppercase">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal relative min-h-[600px] w-full mb-12">
            <ResearchField
              onUpdateMetadata={setActiveResearch}
              onFocusBackground={(texture, progress, center) => {
                if (onResearchFocus) {
                  onResearchFocus(texture ? { texture, progress, center } : null);
                }
              }}
            />

            <div className={`absolute bottom-0 left-0 transition-opacity duration-500 pointer-events-none ${activeResearch ? 'opacity-100' : 'opacity-0'}`}>
              <div className="border-l border-black/20 pl-6 py-2">
                <span className="font-system text-[9px] opacity-30 tracking-[0.3em] uppercase block mb-1">Experiment.Ref // {activeResearch?.year}</span>
                <h4 className="font-system text-xl tracking-tight uppercase">{activeResearch?.title}</h4>
                <div className="mt-4 flex items-center gap-4 opacity-20">
                  <span className="font-system text-[8px] uppercase tracking-widest">status: analyzed</span>
                  <div className="w-8 h-[1px] bg-black"></div>
                </div>
              </div>
            </div>

            {!activeResearch && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-center">
                <span className="font-system text-[10px] tracking-[0.5em] uppercase animate-pulse">explore archive</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="divider-dark" />

      {/* CONTACT SECTION */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-10">
        <div className="reveal w-full max-w-screen-xl text-center">
          <div className="font-system text-[9px] opacity-40 tracking-widest mb-10 text-black">Termination / Link</div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            <a href="mailto:studio@brunorealities.art" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all text-black">
              Email <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
            <a href="https://www.instagram.com/bruno.realities/" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all text-black">
              Instagram <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
            <a href="https://www.linkedin.com/in/bruno-macedo-776a52331/" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all text-black">
              LinkedIn <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
          </div>
        </div>
      </section>

      <div className="h-[20vh]" />
    </main>
  );
};

export default Overlay;
