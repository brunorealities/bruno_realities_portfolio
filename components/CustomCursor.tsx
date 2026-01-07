import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const [isTouch, setIsTouch] = useState(false);
    const [isClickable, setIsClickable] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [heat, setHeat] = useState(0); // 0 to 1

    useEffect(() => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            setIsTouch(true);
            return;
        }

        let heatLevel = 0;
        let lastX = 0;
        let lastY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            mousePos.current = { x: e.clientX, y: e.clientY };
            const target = e.target as HTMLElement;
            const interactiveElement = target.closest('a, button, [role="button"], .cursor-pointer');
            setIsClickable(!!interactiveElement);

            // Accumulate heat based on velocity
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const velocity = Math.sqrt(dx * dx + dy * dy);
            heatLevel += velocity * 0.005;
            heatLevel = Math.min(1.5, heatLevel);

            lastX = e.clientX;
            lastY = e.clientY;
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);
        const handleFocus = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('focus', handleFocus);

        const tl = gsap.timeline({ repeat: -1 });
        const updateHeartbeat = () => {
            tl.clear();
            const intensity = 1 + (heatLevel * 0.3);
            const speed = 1 - (heatLevel * 0.4);

            tl.to(cursorRef.current, {
                scale: 1.25 * intensity,
                duration: 0.12 * speed,
                ease: "power2.out"
            })
                .to(cursorRef.current, {
                    scale: 1,
                    duration: 0.25 * speed,
                    ease: "power2.inOut"
                })
                .to(cursorRef.current, {
                    scale: 1.15 * intensity,
                    duration: 0.12 * speed,
                    ease: "power2.out"
                })
                .to(cursorRef.current, {
                    scale: 1,
                    duration: 0.7 * speed,
                    ease: "power2.inOut"
                });
        };

        const heartInterval = setInterval(updateHeartbeat, 1500);
        updateHeartbeat();

        const animate = () => {
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

            // Decay heat over time
            heatLevel *= 0.985;
            if (heatLevel < 0.01) heatLevel = 0;
            setHeat(Math.min(1, heatLevel));

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
                cursorRef.current.style.opacity = isVisible ? '1' : '0';
            }
            if (glowRef.current) {
                const flicker = 0.1 + Math.random() * 0.1;
                glowRef.current.style.opacity = (isVisible ? (0.2 + (heatLevel * 0.4) + flicker) : 0).toString();
                glowRef.current.style.transform = `scale(${1 + heatLevel * 0.5})`;
            }
            requestAnimationFrame(animate);
        };

        const rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('focus', handleFocus);
            cancelAnimationFrame(rafId);
            clearInterval(heartInterval);
            tl.kill();
        };
    }, [isVisible]);

    if (isTouch) return null;

    const heatColor = isClickable ? '#fff' : `rgb(255, ${249 - (heat * 154)}, ${240 - (heat * 240)})`;
    const auraColor = `radial-gradient(circle, rgba(255, ${180 + (heat * 40)}, ${100 - (heat * 50)}, 0.8) 0%, rgba(255, 100, 50, 0) 70%)`;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform flex items-center justify-center opacity-0 transition-opacity duration-300"
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            <div
                ref={glowRef}
                className="absolute w-12 h-12 rounded-full blur-xl transition-colors duration-500"
                style={{
                    background: auraColor,
                    width: `${40 + heat * 40}px`,
                    height: `${40 + heat * 40}px`,
                }}
            />

            <div
                className="relative w-2 h-2 rounded-full blur-[1px] transition-all duration-300"
                style={{
                    background: heatColor,
                    boxShadow: `0 0 ${10 + heat * 15}px ${2 + heat * 5}px ${isClickable ? 'rgba(255,255,255,0.8)' : 'rgba(255, 150, 50, ' + (0.4 + heat * 0.4) + ')'}`,
                    width: isClickable ? '7px' : (4 + heat * 2) + 'px',
                    height: isClickable ? '7px' : (4 + heat * 2) + 'px',
                }}
            />

            <div
                className="absolute w-4 h-5 opacity-40 blur-md rotate-45 animate-pulse"
                style={{
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    background: `rgba(255, ${150 + heat * 105}, 50, ${0.1 + heat * 0.2})`,
                    transform: `scale(${1 + heat * 0.3}) rotate(${45 + heat * 15}deg)`
                }}
            />
        </div>
    );
};

export default CustomCursor;
