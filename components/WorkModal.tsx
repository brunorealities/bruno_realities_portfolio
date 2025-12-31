
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Work } from './HorizontalCarousel';
import GlassCard from './GlassCard';

interface WorkModalProps {
    work: Work;
    index: number;
    total: number;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

const WorkModal: React.FC<WorkModalProps> = ({ work, index, total, onClose, onNext, onPrev }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const blocksRef = useRef<HTMLDivElement>(null);
    const prevWorkRef = useRef<string>(work.title);

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

    // Effect to handle content change animation when navigating
    useEffect(() => {
        if (prevWorkRef.current !== work.title) {
            const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.8 } });

            tl.to([titleRef.current, blocksRef.current], { opacity: 0, y: -10, duration: 0.3 });
            tl.set([titleRef.current, blocksRef.current], { y: 20 });
            tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 });
            tl.to(blocksRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");

            prevWorkRef.current = work.title;
        }
    }, [work.title]);

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
        <div ref={modalRef} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black overflow-hidden font-system text-[10px] tracking-widest text-[#F2F0ED]">
            {/* Background Image with Overlay */}
            <div ref={backgroundRef} key={work.image} className="absolute inset-0">
                <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>

            {/* UI Content Layer */}
            <div ref={contentRef} className="relative w-full h-full p-6 md:p-10 flex flex-col justify-between pointer-events-none">

                {/* Top Bar: Close Button & Metadata */}
                <div className="flex justify-between items-start z-50">
                    <div className="flex flex-col space-y-2 pointer-events-auto bg-black/40 backdrop-blur-sm p-4 border border-white/5 rounded-sm">
                        <span className="text-white opacity-40">{work.year}</span>
                        <div className="flex gap-4">
                            {work.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 border border-white/10 rounded-sm">
                                    [{tag}]
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="pointer-events-auto group p-2 transition-transform active:scale-90"
                    >
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-2xl">
                            <span className="text-2xl md:text-3xl font-light">×</span>
                        </div>
                    </button>
                </div>

                {/* Side Navigation (Desktop/Tablet) */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-10 z-40">
                    <button
                        onClick={onPrev}
                        className="pointer-events-auto group hidden md:flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all active:scale-95"
                    >
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-lg">←</span>
                        </div>
                        <span className="text-[8px] tracking-[0.3em]">PREV</span>
                    </button>

                    <button
                        onClick={onNext}
                        className="pointer-events-auto group hidden md:flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all active:scale-95"
                    >
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-lg">→</span>
                        </div>
                        <span className="text-[8px] tracking-[0.3em]">NEXT</span>
                    </button>
                </div>

                {/* Middle Section: Massive Title */}
                <div className="relative flex-1 flex flex-col justify-center items-center px-4">
                    <div className="overflow-hidden">
                        <h2
                            ref={titleRef}
                            className="font-system text-[18vw] md:text-[14vw] leading-[0.8] tracking-tighter-massive text-center text-white opacity-90 transition-all"
                            style={{ fontStretch: 'extra-condensed' }}
                        >
                            {work.title}
                        </h2>
                    </div>
                </div>

                {/* Bottom Sections: Responsive Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 md:gap-0">

                    {/* Description (Left) */}
                    <div className="w-full md:max-w-sm pointer-events-auto order-2 md:order-1">
                        <GlassCard variant="compact" dark className="!bg-black/40 !border-white/5 !backdrop-blur-xl !p-6 md:!p-8 shadow-2xl">
                            <h4 className="font-system opacity-30 mb-4 text-[8px] tracking-[0.3em]">CONCEPT_NOTE</h4>
                            <p className="font-body text-base md:text-lg text-white/80 leading-relaxed normal-case tracking-normal">
                                {work.longDesc.split('\n')[0].substring(0, 180)}...
                            </p>
                        </GlassCard>
                    </div>

                    {/* Navigation Bar (Bottom Center - Simplified for Mobile) */}
                    <div className="flex flex-col items-center gap-4 pointer-events-auto order-1 md:order-2 bg-black/60 backdrop-blur-md p-4 rounded-full border border-white/5 min-w-[200px] shadow-2xl">
                        <div className="text-[10px] font-bold opacity-40 tracking-[0.4em] uppercase mb-1">
                            {formatIndex(index)} <span className="opacity-20 mx-2">/</span> {formatIndex(total)}
                        </div>
                        <div className="flex items-center gap-8">
                            <button
                                onClick={onPrev}
                                className="md:hidden text-white/40 hover:text-white p-4 transition-colors"
                            >
                                <span className="text-xl">←</span>
                            </button>
                            <div className="w-8 h-[1px] bg-white/10 hidden md:block"></div>
                            <button
                                onClick={onNext}
                                className="md:hidden text-white/40 hover:text-white p-4 transition-colors"
                            >
                                <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Metadata (Right - Hidden or re-positioned on mobile) */}
                    <div className="hidden lg:block w-64 text-right pointer-events-auto order-3">
                        <GlassCard variant="compact" dark className="!bg-black/40 !border-white/5 !backdrop-blur-xl !p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-system opacity-30 mb-2 text-[8px] tracking-[0.3em]">FORMAT</h4>
                                    <p className="font-system text-white tracking-widest uppercase text-[10px]">{work.medium}</p>
                                </div>
                                <div>
                                    <h4 className="font-system opacity-30 mb-2 text-[8px] tracking-[0.3em]">CONTEXT</h4>
                                    <p className="font-system text-white tracking-widest uppercase text-[10px]">{work.context}</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkModal;
