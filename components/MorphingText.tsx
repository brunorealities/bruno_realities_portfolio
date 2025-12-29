import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const phrases = [
    "intimacy as interface",
    "the body becomes image",
    "fragmented presence",
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
                opacity: 0.08, // Valor bem sutil para não distrair do conteúdo principalrantir impacto visual no fundo
                duration: 2,
                delay: 0.5
            })
                .to(textRef.current, {
                    opacity: 0.0,
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
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-[1] overflow-hidden">
            <div
                ref={textRef}
                style={{
                    fontSize: '16vw',
                    lineHeight: '0.7',
                    fontFamily: "'Inter', sans-serif", // Usando Inter para poder usar Bold alto
                    fontWeight: 900,
                    display: 'block',
                    mixBlendMode: 'multiply' // Faz com que o texto "manche" o fundo branco/brilhante
                }}
                className="uppercase tracking-[-0.05em] text-black opacity-0 text-center select-none whitespace-normal w-full"
            >
                {phrases[index]}
            </div>
        </div>
    );
};

export default MorphingText;