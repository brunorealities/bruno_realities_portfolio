
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface LayeredTypographyProps {
    text: string;
    scrollProgress: number;
    distortion?: number; // 0 to 1
}

const LayeredTypography: React.FC<LayeredTypographyProps> = ({ text, scrollProgress, distortion = 0 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const layersRef = useRef<(HTMLDivElement | null)[]>([]);

    // Parallax viscoso baseado no scroll
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            layersRef.current.forEach((layer, i) => {
                if (!layer) return;

                // Foreground (i=0) move mais rápido que background
                const speedMultiplier = 1 - (i * 0.15);
                const targetY = scrollProgress * 150 * speedMultiplier;

                gsap.to(layer, {
                    y: targetY,
                    duration: 1.2 + i * 0.3, // Mais "viscoso" para as camadas de trás
                    ease: "power1.out",
                    overwrite: "auto"
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, [scrollProgress]);

    // Micro-distorção baseada em proximidade
    useEffect(() => {
        let animationFrameId: number;
        const startTime = Date.now();

        const updateDistortion = () => {
            const time = (Date.now() - startTime) * 0.001;

            layersRef.current.forEach((layer, i) => {
                if (!layer) return;

                // Ruído de baixa frequência e intensidade
                const noiseX = Math.sin(time * 1.2 + i) * .5 * distortion;
                const noiseY = Math.cos(time * 0.8 + i) * .5 * distortion;

                // Micro-translações aleatórias sutis
                const jitterX = (Math.sin(time * 1 + i) * 0.5) * distortion;
                const jitterY = (Math.cos(time * 2 + i) * 0.5) * distortion;

                gsap.set(layer, {
                    x: noiseX + jitterX,
                    // Mantemos o Y do parallax mas adicionamos o ruído
                    yPercent: (noiseY + jitterY) * 2,
                    opacity: (1 - (i * 0.2)) * (1 - distortion * 0.1) + (distortion * 0.05),
                });
            });

            animationFrameId = requestAnimationFrame(updateDistortion);
        };

        updateDistortion();
        return () => cancelAnimationFrame(animationFrameId);
    }, [distortion]);

    const layers = [0, 1, 2, 3]; // 4 camadas

    return (
        <div ref={containerRef} className="relative w-full flex flex-col items-center justify-center text-center py-20">
            {layers.map((index) => (
                <div
                    key={index}
                    ref={(el) => { layersRef.current[index] = el; }}
                    className={`absolute inset-0 flex items-center justify-center font-display-bold text-[15vw] md:text-[20vw] tracking-tighter-massive uppercase leading-[0.78] pointer-events-none select-none ${index === 0 ? 'z-10 text-black/40' : 'z-0 text-black/5'
                        }`}
                    style={{
                        // Pequeno offset de Z para profundidade real se o container tiver perspectiva
                        transform: `translateZ(${index * -1}px)`,
                    }}
                >
                    <h1 className="translucent-title">
                        {text.split(' ').map((word, i) => (
                            <React.Fragment key={i}>
                                {word}
                                {i === 0 && <br />}
                            </React.Fragment>
                        ))}
                    </h1>
                </div>
            ))}

            {/* Espaçador invisível para manter o layout do DOM */}
            <div className="opacity-0 pointer-events-none select-none font-display-bold text-[15vw] md:text-[20vw] tracking-tighter-massive uppercase leading-[0.78]">
                {text.split(' ').map((word, i) => (
                    <React.Fragment key={i}>
                        {word}
                        {i === 0 && <br />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default LayeredTypography;
