
import React, { useRef, useEffect } from 'react';
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
    const pos = useRef({ x: 0, targetX: 0 });

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

            pos.current.x = gsap.utils.interpolate(pos.current.x, pos.current.targetX, 0.1);

            gsap.set(slider, { x: pos.current.x });
            rafId = requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible) {
                rafId = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(rafId);
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
                {works.map((work, idx) => (
                    <div
                        key={idx}
                        className="flex-shrink-0 w-[80vw] md:w-[40vw] cursor-pointer"
                        onClick={() => onWorkClick(work)}
                    >
                        <div className="aspect-[16/10] w-full overflow-hidden bg-black/5 mb-6 group relative">
                            <img
                                src={work.image}
                                alt={work.title}
                                className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                            />
                            <div className="absolute top-6 left-6 mix-blend-difference text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="font-system text-[10px] tracking-widest leading-none">{work.year}</span>
                            </div>
                        </div>
                        <h4 className="font-system text-[3vw] md:text-[1.8vw] tracking-tighter leading-none mb-4 opacity-90">
                            {work.title}
                        </h4>
                        <p className="font-body text-lg md:text-xl text-black/60 max-w-sm uppercase-none">
                            {work.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HorizontalCarousel;
