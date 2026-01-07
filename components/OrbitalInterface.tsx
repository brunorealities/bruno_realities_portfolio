import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
    // React state only for critical path changes (Active Index)
    const [activeIndex, setActiveIndex] = useState(0);

    // Refs for performance-critical data
    const dialRef = useRef<HTMLDivElement>(null);
    const trailRef = useRef<HTMLDivElement>(null);
    const filmStripRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const rotation = useRef(0);
    const lastAngle = useRef(0);
    const lastPos = useRef({ x: 0, y: 0 });
    const isInteracting = useRef(false);
    const snapTimeout = useRef<NodeJS.Timeout | null>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const touchDirection = useRef<'none' | 'horizontal' | 'vertical'>('none');

    const ITEM_ANGLE = 360 / works.length;

    // --- DIRECT DOM UPDATER (Bypass React for 60fps) ---
    const updateVisuals = useCallback(() => {
        if (!dialRef.current || !trailRef.current || !filmStripRef.current) return;

        // 1. Update Dial Rotation
        gsap.set(dialRef.current, { rotation: rotation.current });

        // 2. Update Inner Dial Counter-Rotation (for text readability)
        const inner = dialRef.current.querySelector('.inner-core') as HTMLElement;
        const pointer = dialRef.current.querySelector('.selection-pointer') as HTMLElement;
        if (inner) gsap.set(inner, { rotation: -rotation.current });
        if (pointer) gsap.set(pointer, { rotation: -rotation.current });

        // 3. Update active index and strip position
        const normalizedRotation = ((rotation.current % 360) + 360) % 360;
        const currentActive = Math.round(normalizedRotation / ITEM_ANGLE) % works.length;

        // Notify React only when index changes to avoid heavy re-renders
        setActiveIndex(prev => prev !== currentActive ? currentActive : prev);

        // Update Film Strip (Vertical Reel)
        // We move the strip vertically: -currentActive * itemHeight
        const itemHeight = 101; // 85px h + 16px mb
        gsap.set(filmStripRef.current, {
            y: -currentActive * itemHeight,
            autoAlpha: 1
        });

        // Update Trail (Main Cards)
        const blocks = trailRef.current.children;
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i] as HTMLElement;
            const idx = parseInt(block.dataset.index || "0");

            const diff = (idx - currentActive + works.length) % works.length;
            const isPast = diff > works.length / 2;
            const offset = isPast ? diff - works.length : diff;

            const isActive = idx === currentActive;
            const isVisible = Math.abs(offset) <= 2;

            gsap.set(block, {
                xPercent: offset * 115,
                z: -Math.abs(offset) * 150,
                scale: isActive ? 1.05 : 0.6,
                rotateY: offset * -8,
                opacity: isVisible ? (isActive ? 1 : 0.2) : 0,
                zIndex: 10 - Math.abs(offset),
                filter: isActive ? 'blur(0px)' : `blur(12px)`,
                pointerEvents: isActive ? 'auto' : 'none'
            });

            // Handle interior overlay class
            const overlay = block.querySelector('.text-overlay');
            if (overlay) {
                if (isActive) overlay.classList.add('active');
                else overlay.classList.remove('active');
            }
        }

        // Update individual film frames
        const frames = filmStripRef.current.children;
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i] as HTMLElement;
            const idx = i;
            const isActive = idx === currentActive;
            gsap.set(frame, {
                scale: isActive ? 1.1 : 0.8,
                opacity: isActive ? 1 : 0.5,
                x: isActive ? 10 : 0,
                borderColor: isActive ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)'
            });
        }
    }, [ITEM_ANGLE, works.length]);

    // --- ANGLE CALCULATION ---
    const getAngle = (clientX: number, clientY: number) => {
        if (!dialRef.current) return 0;
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rad = Math.atan2(clientY - centerY, clientX - centerX);
        return (rad * 180) / Math.PI;
    };

    // --- INTERACTION LOGIC ---
    const handleStart = (clientX: number, clientY: number) => {
        isInteracting.current = true;
        gsap.killTweensOf(rotation);
        if (snapTimeout.current) clearTimeout(snapTimeout.current);

        lastAngle.current = getAngle(clientX, clientY);
        lastPos.current = { x: clientX, y: clientY };
        startPos.current = { x: clientX, y: clientY };
        touchDirection.current = 'none';
    };

    const handleMove = (clientX: number, clientY: number, isSwipe = false) => {
        if (!isInteracting.current && !isSwipe) return;

        let delta = 0;
        if (isSwipe) {
            if (touchDirection.current === 'vertical') return;

            const dx = Math.abs(clientX - startPos.current.x);
            const dy = Math.abs(clientY - startPos.current.y);

            if (touchDirection.current === 'none') {
                if (dx > 5 || dy > 5) {
                    if (dy > dx) {
                        touchDirection.current = 'vertical';
                        return;
                    } else {
                        touchDirection.current = 'horizontal';
                    }
                } else {
                    return;
                }
            }

            delta = (clientX - lastPos.current.x) * 0.8;
            lastPos.current = { x: clientX, y: clientY };
        } else {
            const currentAngle = getAngle(clientX, clientY);
            delta = currentAngle - lastAngle.current;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            lastAngle.current = currentAngle;
        }

        rotation.current += delta;
        updateVisuals();
    };

    const handleEnd = () => {
        isInteracting.current = false;
        scheduleSnap();
    };

    const scheduleSnap = useCallback(() => {
        if (snapTimeout.current) clearTimeout(snapTimeout.current);

        snapTimeout.current = setTimeout(() => {
            const targetRotation = Math.round(rotation.current / ITEM_ANGLE) * ITEM_ANGLE;

            gsap.to(rotation, {
                current: targetRotation,
                duration: 1.5,
                ease: "expo.out",
                onUpdate: updateVisuals
            });
        }, 50);
    }, [ITEM_ANGLE, updateVisuals]);

    const navigate = useCallback((dir: number) => {
        gsap.killTweensOf(rotation);
        if (snapTimeout.current) clearTimeout(snapTimeout.current);

        const targetRotation = Math.round(rotation.current / ITEM_ANGLE) * ITEM_ANGLE + (dir * ITEM_ANGLE);

        gsap.to(rotation, {
            current: targetRotation,
            duration: 1.5,
            ease: "expo.inOut",
            onUpdate: updateVisuals
        });
    }, [ITEM_ANGLE, updateVisuals]);


    // --- EVENTS ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    useEffect(() => {
        // No wheel listener, let the page scroll naturally
    }, []);

    useEffect(() => {
        const moveHandler = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const upHandler = () => handleEnd();

        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);

        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        };
    }, []);

    // Initial Visual Set
    useEffect(() => {
        updateVisuals();
    }, [updateVisuals]);

    // Static Ticks Memo
    const ticks = useMemo(() => [...Array(36)].map((_, i) => (
        <div key={i} className="absolute h-full w-[1px] left-1/2 -translate-x-1/2 flex flex-col justify-between py-2 opacity-20" style={{ transform: `rotate(${i * 10}deg)` }}>
            <div className="w-[1px] h-4 bg-black" />
            <div className="w-[1px] h-4 bg-black" />
        </div>
    )), []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[145vh] lg:h-[95vh] flex flex-col lg:flex-row items-center justify-center lg:justify-center overflow-hidden bg-transparent select-none touch-pan-y pb-4 lg:pb-0"
        >
            <style jsx global>{`
                .text-overlay {
                    opacity: 0;
                    transform: translateY(3rem);
                    transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .text-overlay.active {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>

            {/* 1. GRAIN DIAL - Balanced margin on mobile */}
            <div className="relative w-full h-[45vh] lg:h-full lg:w-[35%] flex items-center justify-center z-50 p-4 lg:p-0 order-first lg:order-none pointer-events-none lg:pointer-events-auto mb-30 lg:mb-0">
                {/* FILM STRIP (VERTICAL REEL) */}
                <div className="absolute right-[-10%] lg:right-[-5%] h-[350px] w-[100px] overflow-hidden pointer-events-none z-0 hidden lg:flex items-center">
                    {/* Connector Line to Dial */}
                    <div className="absolute left-0 w-8 h-[1px] bg-black/10 z-20" />

                    <div className="relative h-full w-full overflow-hidden">
                        <div className="absolute inset-0 border-x border-black/5 z-10" />
                        <div ref={filmStripRef} className="flex flex-col gap-0 items-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] py-[125px]">
                            {works.map((work, idx) => (
                                <div
                                    key={idx}
                                    className="w-16 h-[85px] mb-4 border border-black/10 bg-white shadow-sm overflow-hidden flex-shrink-0 relative group"
                                    style={{ transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                >
                                    <img src={work.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-opacity" alt="" />
                                    {/* Film Sprockets - Left */}
                                    <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around py-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 bg-black/20" />
                                        ))}
                                    </div>
                                    {/* Film Sprockets - Right */}
                                    <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around py-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 bg-black/20" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    ref={dialRef}
                    onMouseDown={(e) => { e.stopPropagation(); handleStart(e.clientX, e.clientY); }}
                    onTouchStart={(e) => {
                        e.stopPropagation();
                        handleStart(e.touches[0].clientX, e.touches[0].clientY);
                    }}
                    onTouchMove={(e) => {
                        e.stopPropagation();
                        handleMove(e.touches[0].clientX, e.touches[0].clientY, true);
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        handleEnd();
                    }}
                    className="relative w-[30vh] h-[30vh] lg:w-[55vh] lg:h-[55vh] rounded-full cursor-grab active:cursor-grabbing group touch-pan-y pointer-events-auto"
                >
                    <div className="absolute inset-0 rounded-full border border-black/[0.08] shadow-[0_0_150px_rgba(0,0,0,0.01)]" />
                    <div className="absolute inset-[15%] rounded-full border border-black/[0.04]" />
                    {ticks}

                    {/* Core */}
                    <div className="absolute inset-0 flex items-center justify-center p-12 lg:p-24 pointer-events-none">
                        <div className="inner-core w-full h-full rounded-full bg-white/40 backdrop-blur-3xl border border-white/50 flex flex-col items-center justify-center gap-2 lg:gap-4 shadow-[inset_0_0_50px_rgba(255,255,255,0.3)]">
                            <span className="font-system text-[7px] lg:text-[10px] tracking-[0.5em] font-bold uppercase opacity-80 text-black px-4 text-center">{works[activeIndex]?.title || 'Neural_Reader'}</span>
                            <div className="w-8 lg:w-16 h-[1px] bg-black/10" />
                            <div className="flex flex-col items-center gap-1">
                                <span className="font-system text-[6px] lg:text-[8px] tracking-[0.2em] opacity-40 uppercase">Sync_Buffer</span>
                                <span className="font-system text-[9px] lg:text-[13px] tracking-[0.3em] uppercase font-system-mono text-black/80 font-bold">100.00%</span>
                            </div>
                        </div>
                    </div>

                    {/* Selection Pointer */}
                    <div className="selection-pointer absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 lg:-translate-y-12 flex flex-col items-center gap-3">
                        <div className="w-3 lg:w-4 h-3 lg:h-4 bg-black rotate-45 shadow-sm" />
                        <div className="w-[1px] h-6 lg:h-12 bg-black/30" />
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute bottom-[2%] lg:bottom-16 flex gap-16 z-[60] pointer-events-auto">
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

            {/* 2. MEMORY TRAIL */}
            <div ref={trailRef} className="relative w-full h-[40vh] lg:h-full lg:w-[50%] flex items-center justify-center lg:justify-center overflow-visible pointer-events-none">
                {works.map((work, idx) => (
                    <div
                        key={idx}
                        data-index={idx}
                        className="absolute will-change-transform"
                    >
                        <div
                            className="relative w-[35vh] lg:w-[55vh] aspect-[3/4.2] bg-white border border-black/10 overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.15)] group cursor-pointer pointer-events-auto"
                            onClick={() => onWorkClick(work)}
                            onTouchStart={(e) => {
                                handleStart(e.touches[0].clientX, e.touches[0].clientY);
                            }}
                            onTouchMove={(e) => {
                                handleMove(e.touches[0].clientX, e.touches[0].clientY, true);
                            }}
                            onTouchEnd={handleEnd}
                        >
                            <img src={work.image} className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-[2s]" alt={work.title} />

                            <div className="text-overlay absolute bottom-4 lg:bottom-12 left-0 w-full p-4 lg:px-12">
                                <div className="bg-white/60 backdrop-blur-xl p-4 lg:p-8 border-l-[4px] border-black flex flex-col gap-2 lg:gap-4 shadow-2xl max-w-[95%] lg:max-w-[85%]">
                                    <div className="flex justify-between items-center opacity-50">
                                        <span className="font-system text-[7px] lg:text-[9px] tracking-[0.4em] uppercase font-bold">{work.year} // Fragment</span>
                                        <span className="font-system-mono text-[7px] lg:text-[9px]">ID_{idx.toString().padStart(3, '0')}</span>
                                    </div>
                                    <h3 className="font-system text-lg lg:text-3xl tracking-tighter-massive leading-none text-black uppercase font-bold">{work.title}</h3>
                                    <p className="font-system text-[9px] lg:text-[11px] tracking-widest leading-relaxed text-black/70 uppercase line-clamp-2 max-w-[90%]">{work.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* HUD */}
            <div className="fixed inset-0 pointer-events-none z-[70]">
                <div className="absolute top-12 left-12 lg:top-24 lg:left-24 flex flex-col gap-3 opacity-30">
                    <div className="flex items-center gap-4">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrbitalInterface;
