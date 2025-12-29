
import React from 'react';
import {
    EffectComposer,
    Vignette,
    Scanline,
    Bloom
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useControls, folder } from 'leva';

/**
 * Effects: Componente modular para gerenciar o pós-processamento do site.
 * 
 * Mantido apenas o essencial para uma estética "Elegante e Sutil":
 * - Bloom: Brilho suave nas altas luzes.
 * - Scanline: Linhas de varredura quase imperceptíveis.
 * - Vignette: Enquadramento sutil das bordas.
 */
const Effects = () => {
    const {
        bloomEnabled, bloomIntensity, bloomLuminanceThreshold,
        vignetteEnabled, vignetteOffset, vignetteDarkness,
        scanlineEnabled, scanlineDensity, scanlineOpacity
    } = useControls('Post Processing', {
        'Bloom': folder({
            bloomEnabled: { value: true, label: 'Enabled' },
            bloomIntensity: { value: 0.06, min: 0, max: 5, label: 'Intensity' },
            bloomLuminanceThreshold: { value: 1., min: 0, max: 1, label: 'Threshold' },
        }),
        'Vignette': folder({
            vignetteEnabled: { value: true, label: 'Enabled' },
            vignetteOffset: { value: 0.5, min: 0, max: 1, label: 'Offset' },
            vignetteDarkness: { value: 0.4, min: 0, max: 1, label: 'Darkness' },
        }),
        'Scanline': folder({
            scanlineEnabled: { value: true, label: 'Enabled' },
            scanlineDensity: { value: 1.45, min: 0.1, max: 5, label: 'Density' },
            scanlineOpacity: { value: 0.05, min: 0, max: 0.2, label: 'Opacity' },
        }),
    });

    return (
        <EffectComposer>
            {bloomEnabled && (
                <Bloom
                    intensity={bloomIntensity}
                    luminanceThreshold={bloomLuminanceThreshold}
                    mipmapBlur
                />
            )}

            {scanlineEnabled && (
                <Scanline
                    density={scanlineDensity}
                    opacity={scanlineOpacity}
                    blendFunction={BlendFunction.OVERLAY}
                />
            )}

            {vignetteEnabled && (
                <Vignette
                    offset={vignetteOffset}
                    darkness={vignetteDarkness}
                    eskil={false}
                    blendFunction={BlendFunction.NORMAL}
                />
            )}
        </EffectComposer>
    );
};

export default Effects;
