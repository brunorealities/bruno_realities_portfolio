import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MobileMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    onNavClick: (id: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle, onNavClick }) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<HTMLDivElement>(null);
    const line2Ref = useRef<HTMLDivElement>(null);
    const line3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Animate hamburger to X
            gsap.to(line1Ref.current, { rotate: 45, y: 8, duration: 0.4, ease: "power2.inOut" });
            gsap.to(line2Ref.current, { opacity: 0, duration: 0.3 });
            gsap.to(line3Ref.current, { rotate: -45, y: -8, duration: 0.4, ease: "power2.inOut" });

            // Show overlay
            gsap.to(overlayRef.current, {
                autoAlpha: 1,
                duration: 0.8,
                ease: "power3.inOut"
            });

            // Animate items
            if (menuItemsRef.current) {
                gsap.fromTo(menuItemsRef.current.children,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.3 }
                );
            }
        } else {
            document.body.style.overflow = '';
            // Animate X back to hamburger
            gsap.to(line1Ref.current, { rotate: 0, y: 0, duration: 0.4, ease: "power2.inOut" });
            gsap.to(line2Ref.current, { opacity: 1, duration: 0.3 });
            gsap.to(line3Ref.current, { rotate: 0, y: 0, duration: 0.4, ease: "power2.inOut" });

            // Hide overlay
            gsap.to(overlayRef.current, {
                autoAlpha: 0,
                duration: 0.6,
                ease: "power3.inOut"
            });
        }
    }, [isOpen]);

    const navItems = [
        { id: 'about', label: 'About' },
        { id: 'works', label: 'Works' },
        { id: 'research', label: 'Research' },
        { id: 'contact', label: 'Contact' }
    ];

    return (
        <>
            {/* Hamburger Toggle */}
            <button
                onClick={onToggle}
                className="fixed top-10 right-10 z-[100] w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none pointer-events-auto md:hidden"
                aria-label="Toggle Menu"
            >
                <div ref={line1Ref} className="w-6 h-[1.5px] bg-black" />
                <div ref={line2Ref} className="w-6 h-[1.5px] bg-black" />
                <div ref={line3Ref} className="w-6 h-[1.5px] bg-black" />
            </button>

            {/* Fullscreen Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[90] bg-white/10 backdrop-blur-2xl flex items-center justify-center invisible opacity-0 md:hidden"
                onClick={onToggle}
            >
                <div
                    ref={menuItemsRef}
                    className="flex flex-col items-center gap-12 text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onToggle();
                                onNavClick(item.id);
                            }}
                            className="group relative"
                        >
                            <span className="font-system text-4xl tracking-tighter uppercase text-black hover:opacity-50 transition-opacity">
                                {item.label}
                            </span>
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-system text-[8px] tracking-[0.4em] opacity-0 group-hover:opacity-30 transition-opacity uppercase">
                                Selected
                            </span>
                        </button>
                    ))}
                </div>

                {/* Branding in Menu */}
                <div className="absolute bottom-12 left-0 w-full text-center opacity-20">
                    <span className="font-system text-[10px] tracking-[0.5em] uppercase">Digital Corporeality // 2026</span>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
