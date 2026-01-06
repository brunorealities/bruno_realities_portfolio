import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const phrases = [
    "Carne",         // O corpo físico, visceral e resistente 
    "Pele",
    "Malha",       // O limite sensível que vira superfície de contato 
    "Pulso",
    "Suor",
    "Latência",
    "Loop",             // A vida orgânica que pulsa em atraso 
    "Eros",          // A chama que move e costura o que foi partido 
    "Toque",
    "Simulacro",
    "Virtual",
    "Presença",        // A busca pela fricção que não acontece 
    "Intimo",       // A performance de uma intimidade que não existe 
    "Protocolo",       // Onde o desejo humano vira padrão estatístico 
    "Interface",      // A expressão da subjetividade que vira signo O atraso entre ação e resposta que deforma o corpo 
    "Pixel",         // A unidade que denuncia a mentira da aparência    // A repetição suave que zumbifica a experiência      // O corpo transformado em infraestrutura de relação 
    "Atomo"          // O estado final da presença sem proximidade e afeto sem fricção 
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
                    fontSize: '22vw',
                    lineHeight: '1.2',
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