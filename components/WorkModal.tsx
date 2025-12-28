
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Work } from './HorizontalCarousel';
import GlassCard from './GlassCard';

interface WorkModalProps {
    work: Work;
    onClose: () => void;
}

const WorkModal: React.FC<WorkModalProps> = ({ work, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Animation
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        tl.fromTo(overlayRef.current,
            { opacity: 0 },
            { opacity: 1 }
        );

        tl.fromTo(contentRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0 },
            "-=0.6"
        );

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleClose = () => {
        const tl = gsap.timeline({
            defaults: { ease: "power3.inOut", duration: 0.6 },
            onComplete: onClose
        });

        tl.to(contentRef.current, { opacity: 0, y: 20 });
        tl.to(overlayRef.current, { opacity: 0 }, "-=0.4");
    };

    return (
        <div ref={modalRef} className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-[#F2F0ED]/80 backdrop-blur-xl cursor-pointer"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                ref={contentRef}
                className="relative w-full h-full md:w-[90vw] md:h-[90vh] bg-[#F2F0ED] md:border border-black/5 overflow-y-auto shadow-2xl"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-8 right-8 z-50 group p-4"
                >
                    <div className="relative w-8 h-8">
                        <span className="absolute top-1/2 left-0 w-full h-[1px] bg-black rotate-45 group-hover:scale-x-110 transition-transform"></span>
                        <span className="absolute top-1/2 left-0 w-full h-[1px] bg-black -rotate-45 group-hover:scale-x-110 transition-transform"></span>
                    </div>
                </button>

                <div className="max-w-screen-lg mx-auto py-20 px-10">

                    {/* 1. Visual Preview */}
                    <div className="aspect-[16/9] w-full overflow-hidden bg-black/5 mb-16">
                        <img
                            src={work.image}
                            alt={work.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]"
                        />
                    </div>

                    <GlassCard variant="hero" dark>
                        {/* 2. Work Header */}
                        <div className="mb-16">
                            <div className="flex justify-between items-baseline mb-6">
                                <h2 className="font-display-bold text-[8vw] md:text-[6vw] uppercase tracking-tighter-massive leading-none">
                                    {work.title}
                                </h2>
                                <span className="font-display-serif italic text-2xl md:text-3xl opacity-40">{work.year}</span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {work.tags.map((tag, i) => (
                                    <span key={i} className="px-4 py-1 border border-black/10 rounded-full font-mono text-[10px] uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 3. Description */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                            <div className="md:col-span-12">
                                <div className="font-display-serif italic text-2xl md:text-3xl text-black/80 leading-relaxed space-y-8">
                                    {work.longDesc.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4. Metadata Block */}
                        <div className="border-t border-black/10 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div>
                                <h4 className="font-display-bold text-xs uppercase tracking-[0.2em] mb-4 opacity-30">Categories</h4>
                                <p className="font-display-bold text-lg uppercase tracking-tighter">{work.tags.join(' / ')}</p>
                            </div>
                            <div>
                                <h4 className="font-display-bold text-xs uppercase tracking-[0.2em] mb-4 opacity-30">Medium</h4>
                                <p className="font-display-bold text-lg uppercase tracking-tighter">{work.medium}</p>
                            </div>
                            <div>
                                <h4 className="font-display-bold text-xs uppercase tracking-[0.2em] mb-4 opacity-30">Context</h4>
                                <p className="font-display-bold text-lg uppercase tracking-tighter">{work.context}</p>
                            </div>
                        </div>
                    </GlassCard>

                    <div className="mt-40 text-center">
                        <button
                            onClick={handleClose}
                            className="font-display-bold text-xs uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity"
                        >
                            Close_Project
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkModal;
