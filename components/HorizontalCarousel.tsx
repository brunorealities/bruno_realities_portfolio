
import React, { useRef, useEffect, useState } from 'react';
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

interface HorizontalCarouselProps {
    works: Work[];
    onWorkClick: (work: Work) => void;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({ works, onWorkClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const pos = useRef({ x: 0, targetX: 0 });

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!containerRef.current || !sliderRef.current) return;

        const slider = sliderRef.current;
        let isDragging = false;
        let startX = 0;
        let isVisible = false;
        let rafId: number;

        const update = () => {
            if (!isVisible) return;

            // Interpolação suave (inertia)
            pos.current.x = gsap.utils.interpolate(pos.current.x, pos.current.targetX, 0.1);

            // Limites
            const maxScroll = -(slider.scrollWidth - window.innerWidth + 80);
            pos.current.targetX = Math.max(Math.min(pos.current.targetX, 0), maxScroll);

            gsap.set(slider, { x: pos.current.x });

            // Detect active card (proximity to center)
            const centerX = window.innerWidth / 2;
            let closestIndex = 0;
            let minDistance = Infinity;

            cardRefs.current.forEach((card, idx) => {
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const distance = Math.abs(cardCenter - centerX);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = idx;
                }
            });

            // Threshold for focus: if close enough to center, set as active
            if (minDistance < window.innerWidth * 0.2) {
                setActiveIndex(closestIndex);
            } else {
                setActiveIndex(null);
            }

            rafId = requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible) {
                rafId = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(rafId);
                // Reset states when out of view
                setActiveIndex(null);
                setHoveredIndex(null);
            }
        }, { threshold: 0.1 });

        observer.observe(containerRef.current);

        const onWheel = (e: WheelEvent) => {
            if (!isVisible) return;
            pos.current.targetX -= e.deltaY + e.deltaX;
        };

        const onPointerDown = (e: PointerEvent) => {
            isDragging = true;
            startX = e.clientX - pos.current.targetX;
            slider.style.cursor = 'grabbing';
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging) return;
            pos.current.targetX = e.clientX - startX;
        };

        const onPointerUp = () => {
            isDragging = false;
            slider.style.cursor = 'grab';
        };

        window.addEventListener('wheel', onWheel, { passive: true });
        slider.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);

        return () => {
            window.removeEventListener('wheel', onWheel);
            slider.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            cancelAnimationFrame(rafId);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full overflow-hidden py-20 cursor-grab">
            <div ref={sliderRef} className="flex gap-12 px-20 will-change-transform">
                {works.map((work, idx) => {
                    const isFocussed = activeIndex === idx || hoveredIndex === idx;

                    return (
                        <div key={idx} className="flex flex-shrink-0 items-stretch gap-12">
                            {idx > 0 && <div className="w-[1px] bg-black/5" />}
                            <div
                                ref={el => { cardRefs.current[idx] = el; }}
                                className="w-[80vw] md:w-[40vw] cursor-pointer transition-all duration-700"
                                onClick={() => onWorkClick(work)}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className="aspect-[16/10] w-full overflow-hidden bg-black/5 mb-6 relative">
                                    <img
                                        src={work.image}
                                        alt={work.title}
                                        className="w-full h-full object-cover transition-all duration-1000"
                                        style={{
                                            filter: isFocussed
                                                ? 'grayscale(0) brightness(1.1) contrast(1.1)'
                                                : 'grayscale(0.8) brightness(0.6) contrast(0.9)',
                                            transform: isFocussed ? 'scale(1.05)' : 'scale(1.0)'
                                        }}
                                    />
                                    {/* Reveal Mask / Ambient Light effect */}
                                    <div
                                        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                                        style={{
                                            opacity: isFocussed ? 0.3 : 0,
                                            background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)'
                                        }}
                                    />
                                    <div className={`absolute top-6 left-6 mix-blend-difference text-white transition-opacity duration-500 ${isFocussed ? 'opacity-100' : 'opacity-0'}`}>
                                        <span className="font-system text-[10px] tracking-widest leading-none">{work.year}</span>
                                    </div>
                                </div>
                                <h4 className={`font-system text-[3vw] md:text-[1.8vw] tracking-tighter leading-none mb-4 transition-opacity duration-500 ${isFocussed ? 'opacity-90' : 'opacity-40'}`}>
                                    {work.title}
                                </h4>
                                <p className={`font-body text-lg md:text-xl transition-opacity duration-500 ${isFocussed ? 'opacity-60' : 'opacity-20'} max-w-sm uppercase-none`}>
                                    {work.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HorizontalCarousel;
