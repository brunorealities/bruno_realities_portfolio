import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const [isTouch, setIsTouch] = useState(false);
    const [proximity, setProximity] = useState(0); // 0 to 1
    const [isClickable, setIsClickable] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        // Detect touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            setIsTouch(true);
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            const target = e.target as HTMLElement;
            const interactiveElement = target.closest('a, button, [role="button"], .cursor-pointer');
            setIsClickable(!!interactiveElement);

            // Proximity detection for content
            const elements = document.querySelectorAll('img, p, h1, h2, h3');
            let minDistance = 1000;

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy) - Math.max(rect.width, rect.height) / 2;

                if (distance < minDistance) minDistance = distance;
            });

            const proxVal = Math.max(0, Math.min(1, (60 - minDistance) / 60));
            setProximity(proxVal);
        };

        const handleMouseDown = () => setIsPressed(true);
        const handleMouseUp = () => setIsPressed(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        const animate = () => {
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.12;
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.12;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
            }
            requestAnimationFrame(animate);
        };

        const rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(rafId);
        };
    }, []);

    if (isTouch) return null;

    // Base size: 32px
    // If clickable: scale up (+40%)
    // If just near content: scale down (-15%)
    let scale = 1;
    if (isClickable) {
        scale = 1.4;
    } else {
        scale = 1 - proximity * 0.15;
    }

    const size = 32 * scale;
    const opacity = (isPressed ? 0.35 : 0.4) + (proximity * 0.1) + (isClickable ? 0.2 : 0);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.min(0.8, opacity),
                background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 75%)',
                borderRadius: '50%',
                transition: 'width 0.3s cubic-bezier(0.23, 1, 0.32, 1), height 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease',
            }}
        />
    );
};

export default CustomCursor;
