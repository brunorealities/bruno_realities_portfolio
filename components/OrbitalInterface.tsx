
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export interface Work {
    title: string;
    desc: string;
    longDesc: string;
    image: string;
    year: string;
    tags: string[];
    medium: string;
    context: string;
}

interface OrbitalInterfaceProps {
    works: Work[];
    onWorkClick: (work: Work) => void;
}

const OrbitalInterface: React.FC<OrbitalInterfaceProps> = ({ works, onWorkClick }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [revealRadius, setRevealRadius] = useState(0);
    const [displayIndex, setDisplayIndex] = useState<number | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const revealTween = useRef<gsap.core.Tween | null>(null);

    const handleHover = (idx: number) => {
        if (activeIndex === idx) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setActiveIndex(idx);

        timeoutRef.current = setTimeout(() => {
            setDisplayIndex(idx);
            if (revealTween.current) revealTween.current.kill();

            // Expand from current radius to 150
            revealTween.current = gsap.to({ val: revealRadius }, {
                val: 150,
                duration: 0.8,
                ease: "power2.out",
                onUpdate: function () {
                    setRevealRadius(this.targets()[0].val);
                }
            });
        }, 120);
    };

    const handleMouseLeaveGlobal = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setActiveIndex(null);

        if (revealTween.current) revealTween.current.kill();

        // Retract from current radius to 0
        revealTween.current = gsap.to({ val: revealRadius }, {
            val: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onUpdate: function () {
                setRevealRadius(this.targets()[0].val);
            },
            onComplete: () => {
                setDisplayIndex(null);
            }
        });
    };

    const activeWork = activeIndex !== null ? works[activeIndex] : null;
    const bgWork = displayIndex !== null ? works[displayIndex] : null;

    // --- Systemic Clustering Logic ---
    const { dotPositions, tagLabels } = React.useMemo(() => {
        const uniqueTags = Array.from(new Set(works.flatMap(w => w.tags)));
        const tagCenters: Record<string, { x: number, y: number }> = {};

        // Arrange tags in a wide circle
        uniqueTags.forEach((tag, i) => {
            const angle = (i / uniqueTags.length) * Math.PI * 2 - Math.PI / 4;
            const radius = 35; // % from center
            tagCenters[tag] = {
                x: 50 + Math.cos(angle) * (radius * 1.2),
                y: 50 + Math.sin(angle) * radius
            };
        });

        const positions = works.map((work, idx) => {
            let avgX = 0;
            let avgY = 0;
            work.tags.forEach(tag => {
                avgX += tagCenters[tag].x;
                avgY += tagCenters[tag].y;
            });
            avgX /= work.tags.length;
            avgY /= work.tags.length;

            // Add jitter based on index to prevent overlap
            const jitterRadius = 5;
            const jitterAngle = (idx / works.length) * Math.PI * 2 + (idx * 0.5);

            return {
                x: avgX + Math.cos(jitterAngle) * jitterRadius,
                y: avgY + Math.sin(jitterAngle) * jitterRadius,
            };
        });

        const labels = uniqueTags.map(tag => ({
            name: tag,
            x: tagCenters[tag].x,
            y: tagCenters[tag].y
        }));

        return { dotPositions: positions, tagLabels: labels };
    }, [works]);

    return (
        <div
            className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-transparent"
            onMouseLeave={handleMouseLeaveGlobal}
        >

            {/* 0. Background Watermark */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none select-none">
                <h1 className="font-system text-[25vw] leading-none text-white/[0.04] tracking-tighter-massive uppercase">
                    System
                </h1>
            </div>

            {/* 1. Background Layers */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/[0.03] w-full" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/[0.03] h-full" />

                <div className="absolute inset-0 transition-opacity duration-1000 overflow-hidden">
                    <div
                        className="absolute inset-0 contrast-[1.1] brightness-[0.5] transition-opacity duration-700"
                        style={{
                            backgroundImage: bgWork ? `url(${bgWork.image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            clipPath: `circle(${revealRadius}% at 50% 50%)`,
                            opacity: revealRadius > 0 ? 1 : 0
                        }}
                    />
                </div>
                <div className="absolute inset-0 bg-radial-gradient-vignette opacity-60" />
            </div>

            {/* 2. Cluster Labels Background */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-30">
                {tagLabels.map((tag, i) => (
                    <div
                        key={i}
                        className="absolute flex items-center gap-2"
                        style={{ left: `${tag.x}%`, top: `${tag.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="w-1 h-1 rotate-45 border border-white/40" />
                        <span className="font-system text-[10px] tracking-[0.6em] text-white/50 uppercase whitespace-nowrap">
                            {tag.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* 3. Central Lens */}
            <div
                className="relative z-20 w-72 h-72 md:w-96 md:h-96 rounded-full border border-white/5 overflow-hidden bg-black/60 backdrop-blur-md shadow-[0_0_120px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out"
            >
                <div className="absolute inset-0 transition-opacity duration-500 overflow-hidden">
                    <img
                        src={activeWork?.image}
                        className={`w-full h-full object-cover transition-opacity duration-700 ${activeWork ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            filter: 'contrast(1.2) brightness(1.1) grayscale(0.1)'
                        }}
                    />
                </div>

                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <div className="absolute inset-4 rounded-full border border-white/[0.03] pointer-events-none" />
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] pointer-events-none" />

                <div className={`w-full h-full flex flex-col items-center justify-center gap-2 transition-opacity duration-500 ${activeWork ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="w-12 h-[1px] bg-white/10 animate-pulse" />
                    <span className="font-system text-[8px] tracking-[0.5em] text-white/20 uppercase">Network Active</span>
                </div>
            </div>

            {/* 4. Clustered Mapping Dots */}
            <div className="absolute inset-0 z-30 pointer-events-none">
                {works.map((work, idx) => {
                    const pos = dotPositions[idx];
                    const isActive = activeIndex === idx;

                    return (
                        <div
                            key={idx}
                            className="absolute pointer-events-auto cursor-pointer flex flex-col items-center group"
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: 'translate(-50%, -50%)',
                                transition: 'left 1s cubic-bezier(0.2, 0, 0.2, 1), top 1s cubic-bezier(0.2, 0, 0.2, 1)'
                            }}
                            onMouseEnter={() => handleHover(idx)}
                            onClick={() => onWorkClick(work)}
                        >
                            <div className="relative flex items-center justify-center">
                                <div className={`absolute w-5 h-5 rounded-full border border-white/40 transition-all duration-[0.6s] ease-in-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.5]'
                                    }`} />
                                <div className={`w-1 h-1 rounded-full transition-all duration-500 ${isActive ? 'bg-white scale-125' : 'bg-white/30 group-hover:bg-white/60'
                                    }`} />
                            </div>

                            <div className={`mt-5 transition-all duration-700 pointer-events-none flex flex-col items-center ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
                                }`}>
                                <span className="font-system text-[8px] tracking-[0.4em] text-white uppercase leading-none mb-1 opacity-70">{work.title}</span>
                                <div className="w-6 h-[0.5px] bg-white/30" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 5. Active Metadata Terminal */}
            <div className="absolute bottom-16 left-16 z-40 text-left transition-all duration-700"
                style={{ opacity: activeWork ? 0.9 : 0, transform: activeWork ? 'translateY(0)' : 'translateY(10px)' }}>
                <div className="border-l border-white/10 pl-8">
                    <span className="font-system text-[9px] text-white/30 uppercase tracking-[0.5em] block mb-3">Ref: {activeWork?.year} // ARCHIVE</span>
                    <h4 className="font-system text-[4vw] md:text-[2.6vw] tracking-tighter-massive leading-[0.85] text-white uppercase">
                        {activeWork?.title}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default OrbitalInterface;
