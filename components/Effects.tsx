
import React from 'react';
import { EffectComposer, Noise, Vignette, Scanline, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * Effects: Componente modular para gerenciar o pós-processamento do site.
 * 
 * O QUE VOCÊ PODE AJUSTAR:
 * - Noise: Adiciona granulado (ruído) para parecer sinal analógico.
 * - Scanline: Cria as linhas horizontais típicas de TVs antigas.
 * - Vignette: Escurece as bordas da tela.
 * - ChromaticAberration: Cria aquele "desvio" de cor nas bordas (RGB split).
 */
const Effects = () => {
    return (
        <EffectComposer>
            {/* 1. Ruído Analógico (Noise) */}
            <Noise
                opacity={0.1}
                blendFunction={BlendFunction.OVERLAY} // Tente SOFT_LIGHT para algo mais sutil
            />

            {/* 2. Linhas de Varredura (Scanlines) */}
            <Scanline
                density={1.} // Quantidade de linhas
                opacity={0.5} // Visibilidade das linhas
                blendFunction={BlendFunction.OVERLAY}
            />

            {/* 3. Vinheta (Vignette) - Dá profundidade e foca no centro */}
            <Vignette
                offset={0.6}
                darkness={.3}
                eskil={false}
                blendFunction={BlendFunction.NORMAL}
            />

            {/* 4. Aberração Cromática - O toque final para o look analógico */}

        </EffectComposer>
    );
};

export default Effects;
