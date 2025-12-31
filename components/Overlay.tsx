import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OrbitalInterface from './OrbitalInterface';
import { Work } from './HorizontalCarousel';
import WorkModal from './WorkModal';
import GlassCard from './GlassCard';

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
}

const Overlay: React.FC<OverlayProps> = ({ onProjectClick, scrollProgress, distortion }) => {
  const [activeWork, setActiveWork] = useState<Work | null>(null);
  const [isAboutRevealed, setIsAboutRevealed] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll('.reveal');
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        onEnter: () => section.classList.add('active'),
        // Re-add active if scrolling back up and down
        onEnterBack: () => section.classList.add('active'),
      });
      triggers.push(st);
    });

    // Refresh ScrollTrigger after a short delay to ensure layout is stable
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
      image: "dist/images/capa_cheiro.jpeg",
      year: "2024",
      tags: ["Spatial"],
      medium: "Digital",
      context: "Ongoing"
    },

    {
      title: "Antropomórficos",
      desc: "Efeitos colaterais de sentir como humano.",
      longDesc: "Antropomórficos is an ongoing investigation into the physicalization of emotional data. The work translates complex human feelings—longing, desire, anxiety—into tactile, biomorphic forms that pulse and breathe.\n\nIt asks: what are the side effects of feeling like a human in a world of machines?",
      image: "images/eros.png",
      year: "2025",
      tags: ["Illustration"],
      medium: "Hybrid",
      context: "Commissioned"
    },
    {
      title: "Melting Intimacy",
      desc: "Videoart about the degrading intimacy stage",
      longDesc: "This work focuses on the translation of physical gestures into digital textures. It explores how the nuance of human movement can be preserved and amplified through generative processes.",
      image: "dist/images/meltingintimacy.png",
      year: "2025",
      tags: ["VideoArt"],
      medium: "Hybrid",
      context: "Performance"
    },
    {
      title: "Speculatives Intimacies",
      desc: "Unrequited signals in a fragmented presence.",
      longDesc: "Não Correspondido deals with the failure of communication in digital spaces. It visualizes the 'lost packets' of emotional intent, creating a landscape of fragmented signals and unfulfilled desires.",
      image: "dist/images/speculativeintimacy.png",
      year: "2024",
      tags: ["Illustration"],
      medium: "Digital",
      context: "Online"
    },
    {
      title: "Corpo Sem Orgãos",
      desc: "Resin Sculpture of 3D printed human body without organs",
      longDesc: "A study on solitude within the hyper-connected digital realm. No Canto creates a quiet, peripheral space for contemplation and self-observation.",
      image: "dist/images/corposemorgãos.jpeg",
      year: "2025",
      tags: ["Sculpture"],
      medium: "Hybrid",
      context: "Exhibition"
    },

    {
      title: "Interdito",
      desc: "Fine art of a forbidden gesture",
      longDesc: "Smiley Render deconstructs the most basic symbol of happiness. It reveals the complex, often distorted layers of data that lie beneath the surface of digital positivity.",
      image: "dist/images/interdito.jpeg",
      year: "2024",
      tags: ["Illustration"],
      medium: "Digital",
      context: "Ongoing"
    },
    {
      title: "Assimétricos",
      desc: "Translucent Artificial Intimacy Sculpture",
      longDesc: "Underwater immerses the viewer in a dense, fluid digital environment. It explores the sensation of being submerged in data, where presence is felt through pressure and light rather than solid form.",
      image: "dist/images/capa_assimetricos.jpeg",
      year: "2025",
      tags: ["Sculpture"],
      medium: "Digital",
      context: "Exhibition"
    }
  ];

  const researchImages = [
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=500&auto=format&fit=crop"
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
            <GlassCard variant="compact" dark>
              <p className="font-system text-[9px] leading-relaxed opacity-60">
                Phase: Fragmented<br />
                Status: Actuated
              </p>
            </GlassCard>
          </div>

        </div>

        {/* Morphing Dynamic Statement - Fades out as we leave Home */}
        <div style={{ opacity: Math.max(0, 1 - scrollProgress * 8), transition: 'opacity 0.5s ease-out' }}>
          <MorphingText />
        </div>
      </section>

      {/* Structural Divider */}
      <div className="divider-dark" />

      {/* ABOUT SECTION (Artist Statement) */}
      {/* ABOUT SECTION (Artist Statement) - Focus & Reference Typography */}
      <section id="about" onClick={() => setIsAboutRevealed(!isAboutRevealed)} className="relative min-h-screen w-full overflow-hidden bg-black group/about">

        {/* Full-screen Background Image with Focus Interaction */}
        <div className={`absolute inset-0 z-0 transition-all duration-[2s] ease-in-out grayscale blur-2xl opacity-100 group-hover/about:grayscale-0 group-hover/about:opacity-100 group-hover/about:blur-none scale-110 group-hover/about:scale-100 ${isAboutRevealed ? 'grayscale-0 blur-none scale-100 opacity-100' : ''}`}>
          <img
            src="images/FOTO2.png"
            alt="Artist Portrait"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
        </div>

        {/* Overlaid UI Elements and Text */}
        <div className="relative z-10 h-full min-h-screen flex flex-col justify-between p-10 md:p-20 pt-32 md:pt-40 pointer-events-none">

          {/* Top: Systemic Label */}
          <div className="reveal flex justify-start">
            <div className="border-t border-white/20 pt-4">
              <span className="font-system text-[9px] text-white opacity-40 block mb-1">Ref. AI-00 // Archive</span>
              <h3 className="font-system text-[11px] text-white tracking-[0.3em] opacity-80 uppercase leading-none">Artist Statement</h3>
            </div>
          </div>

          {/* Bottom-Right: Statement following reference typography */}
          <div className="reveal flex justify-end items-end">
            <div className="max-w-4xl text-right pointer-events-auto">
              <p className="font-system text-[3.8vw] md:text-[2.8vw] text-white leading-[0.95] tracking-[-0.07em] mb-4">
                I am a new media artist working at the intersection of body, technology, and intimacy. My practice investigates how human presence is transformed when mediated by digital systems, interfaces, and artificial intelligences.
              </p>

              <div className="mt-12 flex justify-end items-center gap-6 opacity-30">
                <span className="font-system text-[9px] text-white tracking-[0.4em]">status.presence // active</span>
                <div className="w-12 h-[1px] bg-white/40"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Structural Divider */}
      <div className="divider-dark" />

      {/* WORKS SECTION */}
      <section id="works" className="min-h-screen py-40 border-t border-black/5">
        <div className="px-10 mb-20 reveal">
          <div className="flex gap-8 items-baseline">
            <h2 className="font-system text-[6vw] tracking-tighter-massive leading-none opacity-90">Selected Works</h2>
            <span className="font-system text-[9px] opacity-40">new media works</span>
          </div>
        </div>

        <div className="reveal relative z-10">
          <OrbitalInterface
            works={works}
            onWorkClick={(work) => setActiveWork(work)}
          />
        </div>
      </section>

      {/* Structural Divider */}
      <div className="divider-dark" />

      {/* RESEARCH SECTION */}
      <section id="research" className="min-h-screen py-40 px-10 bg-black/2 relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto relative z-10">

          {/* 1. Intro Text */}
          <div className="mb-32 reveal">
            <div className="flex gap-8 items-baseline mb-12 border-t border-black/10 pt-4">
              <h2 className="font-system text-[6vw] tracking-tighter-massive leading-none opacity-90">Research</h2>
              <span className="font-system text-[9px] opacity-40">Concept Study / 001</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-l border-black/5 pl-10 ml-4">
              <p className="font-body text-2xl text-black/70 leading-relaxed uppercase-none">
                Our research explores the boundaries of artificial intimacy, investigating how digital interfaces can mediate and amplify human emotion. We look at the body not as a fixed biological entity, but as a fluid signal in a network of synthetic desires.
              </p>
              <p className="font-body text-2xl text-black/70 leading-relaxed uppercase-none">
                Through embodied experimentation and biomorphic distortion, we seek to understand the symptoms of digital corporeality. Our focus is on the tactile translation of presence and the visceral impact of mediated touch.
              </p>
            </div>
          </div>

          {/* 2. Lines of Investigation */}
          <div className="mb-40 reveal px-4">
            <h3 className="font-system text-[10px] tracking-[0.3em] mb-10 opacity-40">Lines of Investigation</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 opacity-80">
              {[
                "Artificial Intimacy",
                "Body as Interface",
                "Distortion as Symptom",
                "Mediated Desire",
                "Fragmented Presence"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <span className="w-1 h-1 rounded-full bg-black/20"></span>
                  <span className="font-system text-lg tracking-[-0.02em]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Processes & Experiments */}
          <div className="mb-40 reveal">
            <h3 className="font-display-bold text-xs uppercase tracking-[0.3em] mb-10 opacity-40">Processes & Experiments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { img: "images/process/processo_human.jpeg", cap: "Experiment 001: Synthetic Skin Tension" },
                { img: "images/process/processo_human.jpeg", cap: "Experiment 002: Haptic Memory Mapping" },
                { img: "images/process/processo_human.jpeg", cap: "Experiment 003: Volumetric Presence" },
                { img: "images/process/processo_human.jpeg", cap: "Experiment 004: Tactile Signal Research" }
              ].map((exp, i) => (
                <div key={i} className="group">
                  <div className="aspect-[16/9] overflow-hidden bg-black/5 mb-6">
                    <img src={exp.img} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">{exp.cap}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Structural Divider */}
      <div className="divider-dark" />

      {/* CONTACT SECTION */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-10">
        <div className="reveal w-full max-w-screen-xl text-center">
          <div className="font-system text-[9px] opacity-40 tracking-widest mb-10 text-black">Termination / Link</div>
          {/* <h2 className="font-system text-[10vw] md:text-[14vw] tracking-tighter-massive leading-[0.8] mb-24 opacity-90">
            Connect<br />Future
          </h2> */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            <a href="mailto:studio@brunorealities.art" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all">
              Email <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
            <a href="https://www.instagram.com/bruno.realities/" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all">
              Instagram <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
            <a href="https://www.linkedin.com/in/bruno-macedo-776a52331/" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all">
              LinkedIn <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
          </div>
        </div>
      </section>

      <div className="h-[20vh]" />
    </main >
  );
};

export default Overlay;
