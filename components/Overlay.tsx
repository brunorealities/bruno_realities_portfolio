import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HorizontalCarousel, { Work } from './HorizontalCarousel';
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
      title: "Escapismo",
      desc: "Synthetic escape through digital membranes.",
      longDesc: "Escapismo explores the desire to dissolve the physical body into digital space. Through a series of generative membranes, the work investigates the tension between the weight of biological existence and the perceived weightlessness of virtual presence.\n\nThe piece functions as a haptic mirror, reflecting the viewer's movements as fluid distortions in a synthetic skin.",
      image: "images/eros.png",
      year: "2025",
      tags: ["Interactive Installation", "Digital Sculpture"],
      medium: "Hybrid",
      context: "Exhibition"
    },
    {
      title: "Absentia",
      desc: "The presence of absence in virtual spaces.",
      longDesc: "Absentia is a study on the emotional residue left behind in digital environments. It focuses on the 'ghost' signals of human interaction—the traces of touch and intent that remain after a connection is severed.\n\nBy mapping these invisible patterns, the work creates a space for reflecting on the fragility of artificial intimacy.",
      image: "images/eros.png",
      year: "2024",
      tags: ["Video Art", "Generative Video"],
      medium: "Digital",
      context: "Online"
    },
    {
      title: "Assimétricos",
      desc: "Asymmetrical beauty in digital corporeality.",
      longDesc: "This project challenges the perfect symmetry often associated with digital avatars. By introducing intentional flaws and biomorphic irregularities, Assimétricos seeks a more 'human' form of digital representation.\n\nIt is an exploration of the uncanny valley, where distortion becomes a signifier of life and vulnerability.",
      image: "images/eros.png",
      year: "2025",
      tags: ["Digital Sculpture", "Fine Art"],
      medium: "Digital",
      context: "Ongoing"
    },
    {
      title: "Cotidiano",
      desc: "Everyday digital intimacy and synthetic touch.",
      longDesc: "Cotidiano captures the mundane moments of interaction with digital interfaces. It highlights the subtle textures of synthetic touch and the quiet intimacy found in our daily digital rituals.",
      image: "images/eros.png",
      year: "2024",
      tags: ["Illustration", "Digital Sculpture"],
      medium: "Digital",
      context: "Ongoing"
    },
    {
      title: "Antropomórficos",
      desc: "Efeitos colaterais de sentir como humano.",
      longDesc: "Antropomórficos is an ongoing investigation into the physicalization of emotional data. The work translates complex human feelings—longing, desire, anxiety—into tactile, biomorphic forms that pulse and breathe.\n\nIt asks: what are the side effects of feeling like a human in a world of machines?",
      image: "images/eros.png",
      year: "2025",
      tags: ["Interactive Installation", "XR / Immersive Experience"],
      medium: "Hybrid",
      context: "Commissioned"
    },
    {
      title: "Gestual Intimacy",
      desc: "Textured gestures in a digital landscape.",
      longDesc: "This work focuses on the translation of physical gestures into digital textures. It explores how the nuance of human movement can be preserved and amplified through generative processes.",
      image: "images/eros.png",
      year: "2025",
      tags: ["Performance", "Generative Video"],
      medium: "Hybrid",
      context: "Performance"
    },
    {
      title: "Não Correspondido",
      desc: "Unrequited signals in a fragmented presence.",
      longDesc: "Não Correspondido deals with the failure of communication in digital spaces. It visualizes the 'lost packets' of emotional intent, creating a landscape of fragmented signals and unfulfilled desires.",
      image: "images/eros.png",
      year: "2024",
      tags: ["Video Art", "Fine Art"],
      medium: "Digital",
      context: "Online"
    },
    {
      title: "No Canto",
      desc: "Isolated moments of digital reflection.",
      longDesc: "A study on solitude within the hyper-connected digital realm. No Canto creates a quiet, peripheral space for contemplation and self-observation.",
      image: "images/eros.png",
      year: "2025",
      tags: ["Digital Sculpture", "Wearable / Object"],
      medium: "Hybrid",
      context: "Exhibition"
    },
    {
      title: "Offering",
      desc: "A digital offering of synthetic emotion.",
      longDesc: "Offering is a symbolic gesture of vulnerability in the digital age. It presents a synthetic heart, pulsing with data-driven emotions, as a gift to the network.",
      image: "images/eros.png",
      year: "2023",
      tags: ["Fine Art", "Digital Sculpture"],
      medium: "Digital",
      context: "Commissioned"
    },
    {
      title: "Orgasm Enhancer",
      desc: "Flesh and skin rendered through digital interfaces.",
      longDesc: "This provocative piece explores the intersection of technology and human sexuality. It investigates how digital tools can amplify and distort our most intimate physical experiences.",
      image: "images/eros.png",
      year: "2025",
      tags: ["Wearable / Object", "Interactive Installation"],
      medium: "Hybrid",
      context: "Exhibition"
    },
    {
      title: "Smiley Render",
      desc: "Fragmented joy in a synthetic world.",
      longDesc: "Smiley Render deconstructs the most basic symbol of happiness. It reveals the complex, often distorted layers of data that lie beneath the surface of digital positivity.",
      image: "images/eros.png",
      year: "2024",
      tags: ["Illustration", "Generative Video"],
      medium: "Digital",
      context: "Ongoing"
    },
    {
      title: "Underwater",
      desc: "Volumetric rendering of digital presence.",
      longDesc: "Underwater immerses the viewer in a dense, fluid digital environment. It explores the sensation of being submerged in data, where presence is felt through pressure and light rather than solid form.",
      image: "images/eros.png",
      year: "2025",
      tags: ["XR / Immersive Experience", "AR / WebAR"],
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
            <h1 className="font-system text-xl md:text-2xl tracking-[0.2em] opacity-90">Bruno Realities</h1>
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

        {/* Morphing Dynamic Statement - Moved outside .reveal to bypass transform-parent constraints */}
        <MorphingText />
      </section>

      {/* ABOUT SECTION (Artist Statement) */}
      {/* ABOUT SECTION (Artist Statement) - Cinematic Full-screen Portrait */}
      <section id="about" className="relative min-h-screen w-full overflow-hidden bg-black group/about">

        {/* Full-screen Background Image with Hover Interaction */}
        <div className="absolute inset-0 z-0 transition-all duration-[2s] ease-in-out grayscale opacity-30 group-hover/about:grayscale-0 group-hover/about:opacity-100 scale-105 group-hover/about:scale-100">
          <img
            src="images/FOTO2.png"
            alt="Artist Portrait"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 xl:from-black/60" />
        </div>

        {/* Overlaid UI Elements and Text */}
        <div className="relative z-10 h-full min-h-screen flex flex-col justify-between p-10 md:p-20 pointer-events-none">

          {/* Top: Systemic Label */}
          <div className="reveal flex justify-start">
            <div className="border-t border-white/20 pt-4">
              <span className="font-system text-[9px] text-white opacity-40 block mb-1">Ref. AI-00 // Archive</span>
              <h3 className="font-system text-[11px] text-white tracking-[0.3em] opacity-80 uppercase leading-none">Artist Statement</h3>
            </div>
          </div>

          {/* Bottom-Right: Elegant Minimalist Statement */}
          <div className="reveal flex justify-end items-end">
            <div className="max-w-xl text-right pointer-events-auto">
              <p className="font-body text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
                I am a new media artist working at the intersection of body, technology, and intimacy. My practice investigates how human presence is transformed when mediated by digital systems, interfaces, and artificial intelligences.
              </p>
              <p className="font-body text-xl md:text-2xl text-white/90 leading-relaxed">
                Through installations and biomorphic distortion, I explore the idea of artificial intimacy and digital corporeality. Distortion operates as a central language — a symptom of the tension between human sensibility and computational logic.
              </p>

              <div className="mt-12 flex justify-end items-center gap-6 opacity-30">
                <span className="font-system text-[9px] text-white tracking-[0.4em]">status.presence // active</span>
                <div className="w-12 h-[1px] bg-white/40"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="min-h-[60vh] flex flex-col items-center justify-center px-10">
        <div className="max-w-5xl reveal text-center">
          <p className="font-body text-3xl md:text-5xl leading-[1.3] text-black/80 max-w-4xl mx-auto">
            We push the limits of <span className="font-system text-[0.6em] align-middle px-4 opacity-50 tracking-widest text-black">innovation</span> to craft immersive experiences that <span className="underline underline-offset-8 decoration-black/10">captivate</span> and engage.
          </p>
        </div>
      </section>

      {/* WORKS SECTION */}
      <section id="works" className="min-h-screen py-40 border-t border-black/5">
        <div className="px-10 mb-20 reveal">
          <div className="flex gap-8 items-baseline">
            <h2 className="font-system text-[6vw] tracking-tighter-massive leading-none opacity-90">Works</h2>
            <span className="font-system text-[9px] opacity-40">Selected Projects</span>
          </div>
        </div>

        <div className="reveal">
          <HorizontalCarousel
            works={works}
            onWorkClick={(work) => setActiveWork(work)}
          />
        </div>
      </section>

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

          {/* 4. Notes / Short Essays */}
          <div className="mb-40 reveal px-4">
            <h3 className="font-system text-[10px] tracking-[0.3em] mb-10 opacity-40">Notes / Short Essays</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="border-t border-black/5 pt-8">
                <h4 className="font-system text-lg tracking-tight mb-6 opacity-90">The Biomorphic Shift</h4>
                <p className="font-body text-xl text-black/60 leading-relaxed uppercase-none">
                  The transition from rigid digital structures to organic, breathing forms marks a shift in how we perceive virtual presence. Distortion becomes a language of life, signaling the presence of an embodied consciousness within the machine.
                </p>
              </div>
              <div className="border-t border-black/5 pt-8">
                <h4 className="font-system text-lg tracking-tight mb-6 opacity-90">Mediated Touch</h4>
                <p className="font-body text-xl text-black/60 leading-relaxed uppercase-none">
                  When touch is translated through a screen, it loses its physical weight but gains a new, synthetic intensity. We are mapping this new landscape of intimacy, where the interface acts as a second skin, sensitive and reactive.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Lexicon */}
          <div className="mb-40 reveal">
            <h3 className="font-display-bold text-xs uppercase tracking-[0.3em] mb-10 opacity-40">Lexicon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
              {[
                { term: "Digital Corporeality", def: "The state of having a body that exists primarily through digital signals and interfaces." },
                { term: "Synthetic Desire", def: "Emotional intent that is shaped and amplified by artificial systems." },
                { term: "Biomorphic Distortion", def: "The intentional deformation of digital forms to mimic biological processes like breathing or pulsing." },
                { term: "Haptic Resonance", def: "The lingering sensation of physical touch within a virtual interaction." }
              ].map((item, i) => (
                <div key={i} className="border-l border-black/10 pl-8">
                  <h5 className="font-display-bold text-lg uppercase tracking-tighter mb-2">{item.term}</h5>
                  <p className="font-display-serif italic text-black/50">{item.def}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Situated References */}
          <div className="reveal">
            <h3 className="font-display-bold text-xs uppercase tracking-[0.3em] mb-10 opacity-40">Situated References</h3>
            <div className="flex flex-wrap gap-x-12 gap-y-4">
              {[
                "Post-Human Aesthetics",
                "Cybernetic Intimacy",
                "Biomorphic Design Systems",
                "Mediated Affect Theory",
                "Digital Phenomenology"
              ].map((ref, i) => (
                <span key={i} className="font-display-bold text-sm uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity cursor-default">
                  {ref}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Background Typography restored */}
        <h3 className="font-display-bold text-[14vw] leading-[0.8] uppercase tracking-tighter-massive opacity-5 absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none select-none">
          Fragmented Presence
        </h3>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-10">
        <div className="reveal w-full max-w-screen-xl text-center">
          <div className="font-system text-[9px] opacity-40 tracking-widest mb-10 text-black">Termination / Link</div>
          <h2 className="font-system text-[10vw] md:text-[14vw] tracking-tighter-massive leading-[0.8] mb-24 opacity-90">
            Connect<br />Future
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            <a href="mailto:studio@brunorealities.art" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all">
              Email <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
            <a href="#" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all">
              Instagram <span className="inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
            <a href="#" className="group font-system text-xl md:text-2xl tracking-tight pb-2 border-b border-black/10 hover:border-black transition-all">
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
