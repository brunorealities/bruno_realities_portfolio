import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const phrases = [
    "intimacy as interface",
    "the body becomes image",
    "presence, fragmented",
    "desire mediated by systems",
    "contact without touch",
    "the archive is alive"
];

const MorphingText: React.FC = () => {
    const [index, setIndex] = useState(0);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const context = gsap.context(() => {
            const tl = gsap.timeline({
                repeat: -1,
                defaults: { ease: "power2.inOut" }
            });

            tl.to(textRef.current, {
                opacity: 0.15, // Opacidade baixa para parecer marca d'água
                duration: 2,
                delay: 0.5
            })
                .to(textRef.current, {
                    opacity: 0,
                    duration: 1.5,
                    delay: 4,
                    onComplete: () => {
                        setIndex((prev) => (prev + 1) % phrases.length);
                    }
                });
        }, textRef);

        return () => context.revert();
    }, []);

    return (
        /* inset-0 faz com que ele ocupe a tela toda. 
           pointer-events-none impede que o texto bloqueie cliques nos menus.
           z-0 ou z-[-1] coloca ele para trás dos elementos principais. */
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-0">
            <div
                ref={textRef}
                /* text-6xl a 9xl para ficar realmente grande como no design */
                className="font-mono text-5xl md:text-9xl uppercase tracking-[0.2em] text-black opacity-0 text-center select-none px-4 leading-tight"
            >
                {phrases[index]}
            </div>
        </div>
    );
};

export default MorphingText;