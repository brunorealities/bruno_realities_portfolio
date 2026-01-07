import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    const [activeIndex, setActiveIndex] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [isInteracting, setIsInteracting] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dialRef = useRef<HTMLDivElement>(null);
    const lastPos = useRef({ x: 0, y: 0 });
    const lastAngle = useRef(0);
    const rotationObj = useRef({ val: 0 }); // Use ref to track rotation for GSAP and eliminate friction
    const snapTimeout = useRef<NodeJS.Timeout | null>(null);

    const ITEM_ANGLE = 360 / works.length;

    // --- ANGLE CALCULATION FOR ROTATION ---
    const getAngle = (clientX: number, clientY: number) => {
        if (!dialRef.current) return 0;
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rad = Math.atan2(clientY - centerY, clientX - centerX);
        return (rad * 180) / Math.PI;
    };

    // --- INTERACTION HANDLERS ---
    const handleStart = (clientX: number, clientY: number) => {
        setIsInteracting(true);
        // Kill any existing snap animations immediately on user contact
        gsap.killTweensOf(rotationObj.current);
        if (snapTimeout.current) clearTimeout(snapTimeout.current);

        lastAngle.current = getAngle(clientX, clientY);
        lastPos.current = { x: clientX, y: clientY };
    };

    const handleMove = (clientX: number, clientY: number, isSwipe = false) => {
        if (!isInteracting && !isSwipe) return;

        let delta = 0;
        if (isSwipe) {
            const deltaX = clientX - lastPos.current.x;
            delta = deltaX * 0.5;
            lastPos.current = { x: clientX, y: clientY };
        } else {
            const currentAngle = getAngle(clientX, clientY);
            delta = currentAngle - lastAngle.current;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            lastAngle.current = currentAngle;
        }

        rotationObj.current.val += delta;
        setRotation(rotationObj.current.val);
    };

    const handleEnd = () => {
        setIsInteracting(false);
        scheduleSnap();
    };

    // --- SMOOTH SNAP LOGIC ---
    const scheduleSnap = useCallback(() => {
        if (snapTimeout.current) clearTimeout(snapTimeout.current);

        snapTimeout.current = setTimeout(() => {
            const current = rotationObj.current.val;
            const targetRotation = Math.round(current / ITEM_ANGLE) * ITEM_ANGLE;

            gsap.to(rotationObj.current, {
                val: targetRotation,
                duration: 1.0, // Reduced duration for snappier feel
                ease: "power3.out", // High initial velocity for responsiveness
                onUpdate: () => {
                    setRotation(rotationObj.current.val);
                }
            });
        }, 50); // Small delay to check if interaction continues
    }, [ITEM_ANGLE]);

    // --- GLOBAL SCROLL / WHEEL HANDLER (ZERO FRICTION) ---
    const handleWheel = useCallback((e: WheelEvent) => {
        // Kill existing animations on new wheel input
        gsap.killTweensOf(rotationObj.current);
        if (snapTimeout.current) clearTimeout(snapTimeout.current);

        const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.25;

        rotationObj.current.val += delta;
        setRotation(rotationObj.current.val);

        scheduleSnap();
    }, [scheduleSnap]);

    // --- KEYBOARD HANDLER ---
    const navigate = useCallback((dir: number) => {
        gsap.killTweensOf(rotationObj.current);
        if (snapTimeout.current) clearTimeout(snapTimeout.current);

        const targetRotation = Math.round(rotationObj.current.val / ITEM_ANGLE) * ITEM_ANGLE + (dir * ITEM_ANGLE);

        gsap.to(rotationObj.current, {
            val: targetRotation,
            duration: 1.2,
            ease: "power3.inOut",
            onUpdate: () => {
                setRotation(rotationObj.current.val);
            }
        });
    }, [ITEM_ANGLE]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: true });
        }
        return () => {
            if (container) container.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    // --- GLOBAL MOUSE MOVE FOR DRAG ---
    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const upHandler = () => handleEnd();

        if (isInteracting) {
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        }

        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, [isInteracting]);

    // --- UPDATE ACTIVE INDEX ---
    useEffect(() => {
        const normalizedRotation = ((rotation % 360) + 360) % 360;
        const newIndex = Math.round(normalizedRotation / ITEM_ANGLE) % works.length;
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    }, [rotation, works.length, activeIndex, ITEM_ANGLE]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[180vh] lg:h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-start overflow-hidden bg-transparent select-none pt-0 lg:pt-0"
            onTouchStart={(e) => {
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
                handleMove(e.touches[0].clientX, e.touches[0].clientY, true);
            }}
            onTouchEnd={handleEnd}
        >
            {/* 1. GRAIN DIAL (COMPACT ON MOBILE, SCALED ON DESKTOP) */}
            <div className="relative w-full h-[40vh] lg:h-full lg:w-[45%] flex items-center justify-center z-50 p-4 lg:p-20 order-first lg:order-none">
                <div
                    ref={dialRef}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        handleStart(e.clientX, e.clientY);
                    }}
                    className="relative w-[30vh] h-[30vh] lg:w-[65vh] lg:h-[65vh] rounded-full cursor-grab active:cursor-grabbing group touch-none"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {/* Visual Rings */}
                    <div className="absolute inset-0 rounded-full border border-black/[0.08] shadow-[0_0_150px_rgba(0,0,0,0.01)]" />
                    <div className="absolute inset-[15%] rounded-full border border-black/[0.04]" />
                    <div className="absolute inset-0 rounded-full border-t border-black/15 animate-[spin_20s_linear_infinite] opacity-10" />

                    {/* Ticks */}
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className="absolute h-full w-[1px] left-1/2 -translate-x-1/2 flex flex-col justify-between py-2 opacity-20" style={{ transform: `rotate(${i * 10}deg)` }}>
                            <div className="w-[1px] h-4 bg-black" />
                            <div className="w-[1px] h-4 bg-black" />
                        </div>
                    ))}

                    {/* Core */}
                    <div className="absolute inset-0 flex items-center justify-center p-12 lg:p-24">
                        <div
                            className="w-full h-full rounded-full bg-white/40 backdrop-blur-3xl border border-white/50 flex flex-col items-center justify-center gap-2 lg:gap-4 shadow-[inset_0_0_50px_rgba(255,255,255,0.3)]"
                            style={{ transform: `rotate(${-rotation}deg)` }}
                        >
                            <span className="font-system text-[7px] lg:text-[10px] tracking-[0.5em] font-bold uppercase opacity-60">Neural_Reader_V4</span>
                            <div className="w-8 lg:w-16 h-[1px] bg-black/10" />
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-system text-[6px] lg:text-[8px] tracking-[0.2em] opacity-40 uppercase">Sync_Buffer</span>
                                <span className="font-system text-[9px] lg:text-[13px] tracking-[0.3em] uppercase font-system-mono text-black/80 font-bold">100.00%</span>
                            </div>
                        </div>
                    </div>

                    {/* Selection Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 lg:-translate-y-12 flex flex-col items-center gap-3" style={{ transform: `rotate(${-rotation}deg)` }}>
                        <div className="w-3 lg:w-4 h-3 lg:h-4 bg-black rotate-45 shadow-sm" />
                        <div className="w-[1px] h-6 lg:h-12 bg-black/30" />
                    </div>
                </div>

                {/* Navigation Fallback (Refined Buttons) */}
                <div className="absolute bottom-[2%] lg:bottom-16 flex gap-16 z-[60]">
                    <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="group flex items-center gap-4 opacity-50 hover:opacity-100 transition-all">
                        <div className="w-8 h-[1px] bg-black group-hover:w-14 transition-all" />
                        <span className="font-system text-[8px] lg:text-[10px] tracking-[0.5em] uppercase font-bold">Prev</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(1); }} className="group flex items-center gap-4 opacity-50 hover:opacity-100 transition-all">
                        <span className="font-system text-[8px] lg:text-[10px] tracking-[0.5em] uppercase font-bold">Next</span>
                        <div className="w-8 h-[1px] bg-black group-hover:w-14 transition-all" />
                    </button>
                </div>
            </div>

            {/* 2. MEMORY TRAIL (STRICTLY HORIZONTAL) */}
            <div className="relative w-full h-[80vh] lg:h-full lg:w-[55%] flex items-center justify-center lg:justify-start overflow-visible mt-0 lg:mt-0">
                <div className="relative w-full h-full flex items-center justify-center lg:justify-start">
                    {works.map((work, idx) => {
                        const diff = (idx - activeIndex + works.length) % works.length;
                        const isPast = diff > works.length / 2;
                        const offset = isPast ? diff - works.length : diff;

                        const isActive = idx === activeIndex;
                        const isVisible = Math.abs(offset) <= 3;

                        return (
                            <div
                                key={idx}
                                className="absolute transition-all duration-[1500ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)]"
                                style={{
                                    transform: `
                                        translateX(${offset * 115}%) 
                                        translateZ(${-Math.abs(offset) * 150}px)
                                        scale(${isActive ? 1.05 : 0.75})
                                        rotateY(${offset * -12}deg)
                                    `,
                                    opacity: isVisible ? (isActive ? 1 : 0.4 / (Math.abs(offset) + 0.5)) : 0,
                                    zIndex: 10 - Math.abs(offset),
                                    filter: isActive ? 'blur(0px)' : `blur(${Math.min(Math.abs(offset) * 8, 25)}px)`,
                                    pointerEvents: isActive ? 'auto' : 'none'
                                }}
                            >
                                <div
                                    className="relative w-[35vh] lg:w-[75vh] aspect-[3/4.2] bg-white border border-black/10 overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.15)] group cursor-pointer"
                                    onClick={() => onWorkClick(work)}
                                >
                                    <img
                                        src={work.image}
                                        className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-[2s]"
                                        alt={work.title}
                                    />

                                    {/* COMPACT TEXT OVERLAY (IMAGE FOCUSED) */}
                                    <div className={`absolute bottom-0 left-0 w-full p-4 lg:p-12 transition-all duration-1200 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                                        <div className="bg-white/60 backdrop-blur-xl p-4 lg:p-8 border-l-[4px] border-black flex flex-col gap-2 lg:gap-4 shadow-2xl max-w-[95%] lg:max-w-[85%]">
                                            <div className="flex justify-between items-center opacity-50">
                                                <span className="font-system text-[7px] lg:text-[9px] tracking-[0.4em] uppercase font-bold">{work.year} // Fragment</span>
                                                <span className="font-system-mono text-[7px] lg:text-[9px]">ID_{idx.toString().padStart(3, '0')}</span>
                                            </div>
                                            <h3 className="font-system text-lg lg:text-3xl tracking-tighter-massive leading-none text-black uppercase font-bold">
                                                {work.title}
                                            </h3>
                                            <p className="font-system text-[9px] lg:text-[11px] tracking-widest leading-relaxed text-black/70 uppercase line-clamp-2 max-w-[90%]">
                                                {work.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* DECORATIVE HUD LAYER */}
            <div className="fixed inset-0 pointer-events-none z-[70]">
                {/* Meta Markers */}
                <div className="absolute top-12 left-12 lg:top-24 lg:left-24 flex flex-col gap-3 opacity-30">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-black rotate-45" />
                        <span className="font-system text-[8px] lg:text-[10px] tracking-[0.8em] uppercase font-bold">Temporal_Eixo_X</span>
                    </div>
                </div>

                <div className="absolute bottom-12 left-12 lg:bottom-24 lg:left-24 flex items-center gap-8 opacity-20">
                    <span className="font-system text-[7px] lg:text-[9px] tracking-[1.2em] uppercase font-system-mono tracking-[1.5em]">DECRYPTING_NEURAL_SEQUENCE...</span>
                </div>
            </div>
        </div>
    );
};

export default OrbitalInterface;
