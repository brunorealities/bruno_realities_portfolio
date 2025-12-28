
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Work } from './HorizontalCarousel';
import GlassCard from './GlassCard';

interface WorkModalProps {
    work: Work;
    index: number;
    total: number;
    onClose: () => void;
}

const WorkModal: React.FC<WorkModalProps> = ({ work, index, total, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const blocksRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });

        // Phase 1: Background and Title
        tl.fromTo(backgroundRef.current,
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 1.5 }
        );

        tl.fromTo(titleRef.current,
            { y: "110%", rotate: 3 },
            { y: "0%", rotate: 0, duration: 1.5 },
            "-=1.2"
        );

        // Phase 2: Content Blocks Reveal
        tl.fromTo(blocksRef.current?.children || [],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 1 },
            "-=0.5"
        );

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleClose = () => {
        const tl = gsap.timeline({
            defaults: { ease: "expo.inOut", duration: 0.8 },
            onComplete: onClose
        });

        tl.to(blocksRef.current, { opacity: 0, y: -10, duration: 0.4 });
        tl.to(titleRef.current, { y: "-110%", duration: 0.6 }, "-=0.2");
        tl.to(backgroundRef.current, { opacity: 0, scale: 1.05 }, "-=0.4");
    };

    const formatIndex = (i: number) => {
        return (i + 1).toString().padStart(2, '0');
    };

    return (
        <div ref={modalRef} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black overflow-hidden font-mono uppercase text-[10px] tracking-widest text-[#F2F0ED]">
            {/* Background Image with Overlay */}
            <div ref={backgroundRef} className="absolute inset-0">
                <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover grayscale opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>

            {/* UI Content Layer */}
            <div ref={contentRef} className="relative w-full h-full p-10 flex flex-col justify-between pointer-events-none">

                {/* 1. Header Info (Top-Left) */}
                <div ref={blocksRef} className="w-full h-full flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col space-y-2 pointer-events-auto">
                            <span className="text-white opacity-40">{work.year}</span>
                            <div className="flex gap-4">
                                {work.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="px-2 py-0.5 border border-white/10 rounded-sm">
                                        [{tag}]
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Latin markers - subtle style */}
                        <div className="opacity-20 text-[8px] pointer-events-none text-right">
                            CURATORIAL PREVIEW<br />
                            INDEXED_DATA_{formatIndex(index)}
                        </div>
                    </div>

                    {/* 2. Middle Section: Massive Title */}
                    <div className="relative flex-1 flex flex-col justify-center items-center">
                        <div className="overflow-hidden">
                            <h2
                                ref={titleRef}
                                className="font-display-bold text-[18vw] leading-[0.8] tracking-tighter-massive text-center text-white"
                                style={{
                                    fontStretch: 'extra-condensed',
                                }}
                            >
                                {work.title}
                            </h2>
                        </div>
                    </div>

                    {/* 3. Bottom Sections: Description, Nav, Metadata */}
                    <div className="flex justify-between items-end gap-10">

                        {/* Description (Bottom-Left) */}
                        <div className="max-w-sm pointer-events-auto">
                            <GlassCard variant="compact" dark className="!bg-black/20 !border-white/5 !backdrop-blur-md !p-6">
                                <h4 className="opacity-30 mb-4 text-[8px] tracking-[0.3em]">CONCEPT_NOTE</h4>
                                <p className="font-display-serif italic text-base md:text-lg text-white/80 leading-relaxed normal-case tracking-normal">
                                    {work.longDesc.split('\n')[0].substring(0, 180)}...
                                </p>
                            </GlassCard>
                        </div>

                        {/* Navigation (Bottom-Center) */}
                        <div className="flex flex-col items-center gap-6 pointer-events-auto">
                            <div className="text-lg font-bold opacity-60 tracking-tighter">
                                {formatIndex(index)} <span className="opacity-20 mx-2">/</span> {formatIndex(total)}
                            </div>

                            <div className="flex items-center gap-12">
                                <button className="opacity-30 hover:opacity-100 transition-opacity cursor-pointer">[PREV]</button>

                                <button
                                    onClick={handleClose}
                                    className="group flex flex-col items-center"
                                >
                                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                                        <span className="text-xl">×</span>
                                    </div>
                                </button>

                                <button className="opacity-30 hover:opacity-100 transition-opacity cursor-pointer">[NEXT]</button>
                            </div>
                        </div>

                        {/* Metadata (Bottom-Right) */}
                        <div className="w-56 text-right pointer-events-auto">
                            <GlassCard variant="compact" dark className="!bg-black/20 !border-white/5 !backdrop-blur-md !p-6">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="opacity-30 mb-2 text-[8px] tracking-[0.3em]">FORMAT</h4>
                                        <p className="text-white font-bold tracking-widest">{work.medium}</p>
                                    </div>
                                    <div>
                                        <h4 className="opacity-30 mb-2 text-[8px] tracking-[0.3em]">CONTEXT</h4>
                                        <p className="text-white font-bold tracking-widest">{work.context}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkModal;
