import React, { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas, useLoader, useThree } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, useGLTF, useFBX, useTexture } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import Effects from './Effects';
import BackgroundWaves from './BackgroundWaves';

// Fix for React Three Fiber JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      group: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      fog: any;
    }
  }
}

/**
 * CONFIGURAÇÃO DE MODELO:
 */
const MODEL_CONFIG = {
  path: 'models/serhibrido_decimate.obj',
  scale: .8,
  position: [0, -3, 0] as [number, number, number],
};

interface FlexibleModelProps {
  path: string;
  scale: number;
  position: [number, number, number];
}

/**
 * FlexibleModel: Carrega modelos e aplica MeshPhysicalMaterial com distorção injetada.
 */
const FlexibleModel = React.forwardRef<THREE.Object3D, FlexibleModelProps>(({ path, scale, position }, ref) => {
  const extension = path.split('.').pop()?.toLowerCase();

  // Carregamento das texturas
  const textures = useTexture({
    map: 'texturas/basecolor.png',
    normalMap: 'texturas/normal.png',
    roughnessMap: 'texturas/roughness.png',
  });

  // Configuração das texturas
  useMemo(() => {
    Object.values(textures).forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.flipY = false; // Importante para modelos OBJ/FBX às vezes
    });
  }, [textures]);

  let model: THREE.Object3D;

  if (extension === 'glb' || extension === 'gltf') {
    const { scene } = useGLTF(path) as any;
    model = scene;
  } else if (extension === 'fbx') {
    model = useFBX(path);
  } else if (extension === 'obj') {
    model = useLoader(OBJLoader, path);
  } else {
    return null;
  }

  // Uniforms para a distorção orgânica
  const distortionUniforms = useRef({
    uTime: { value: 0 },
    uDistortion: { value: 0.01 }
  });

  // Aplicamos o MeshPhysicalMaterial com onBeforeCompile
  useMemo(() => {
    model.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = new THREE.MeshPhysicalMaterial({
          map: textures.map,
          normalMap: textures.normalMap,
          roughnessMap: textures.roughnessMap,
          metalness: 0.98,
          roughness: 0.0,
          envMapIntensity: 10.0,
          side: THREE.DoubleSide,
        });

        material.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = distortionUniforms.current.uTime;
          shader.uniforms.uDistortion = distortionUniforms.current.uDistortion;

          shader.vertexShader = `
            uniform float uTime;
            uniform float uDistortion;
            ${shader.vertexShader}
          `.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            float noise = sin(transformed.x * 2.5 + uTime) * cos(transformed.y * 2.5 + uTime * 0.7) * 0.4;
            noise += sin(transformed.z * 1.5 + uTime * 1.1) * 0.2;
            transformed += normal * noise * uDistortion;
            `
          );
        };

        mesh.material = material;
      }
    });
  }, [model, textures]);

  // Atualiza o tempo para a distorção
  useFrame((state) => {
    distortionUniforms.current.uTime.value = state.clock.getElapsedTime();
  });

  return <primitive object={model} ref={ref} scale={scale} position={position} />;
});

interface SceneState {
  position: [number, number, number];
  scale: number;
  distortion: number;
  opacity: number;
  rotationSpeed: number;
}

const interpolate = (s1: SceneState, s2: SceneState, t: number): SceneState => {
  const easedT = t * t * (3 - 2 * t);
  return {
    position: s1.position.map((v, i) => v + (s2.position[i] - v) * easedT) as [number, number, number],
    scale: s1.scale + (s2.scale - s1.scale) * easedT,
    distortion: s1.distortion + (s2.distortion - s1.distortion) * easedT,
    opacity: s1.opacity + (s2.opacity - s1.opacity) * easedT,
    rotationSpeed: s1.rotationSpeed + (s2.rotationSpeed - s1.rotationSpeed) * easedT
  };
};

const SceneContent = ({ progress }: { progress: number }) => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;

  const modelRef = useRef<THREE.Object3D>(null);
  const groupRef = useRef<THREE.Group>(null);

  const desktopStates: Record<string, SceneState> = useMemo(() => ({
    about: { position: [0, 2, 0], scale: 2.0, distortion: 0.15, opacity: 1.0, rotationSpeed: 0.9 },
    works: { position: [2.0, 0, -1], scale: 1.5, distortion: 0.1, opacity: 1.0, rotationSpeed: 0.8 },
    research: { position: [-2.2, 0, -2], scale: 0.9, distortion: 0.2, opacity: 1.0, rotationSpeed: 0.2 },
    contact: { position: [0, -.25, 0], scale: 0.4, distortion: 0.05, opacity: 1.0, rotationSpeed: 2.0 }
  }), []);

  const mobileStates: Record<string, SceneState> = useMemo(() => ({
    about: { position: [0, 1.4, 0], scale: 1.5, distortion: 0.15, opacity: 1.0, rotationSpeed: 0.9 },
    works: { position: [0, 0, -1], scale: 1.2, distortion: 0.1, opacity: 1.0, rotationSpeed: 0.8 },
    research: { position: [0, 0, -2], scale: 0.7, distortion: 0.2, opacity: 1.0, rotationSpeed: 0.2 },
    contact: { position: [0.2, 0, 0], scale: 0.8, distortion: 0.05, opacity: 1.0, rotationSpeed: 2.0 }
  }), []);

  const currentStates = isMobile ? mobileStates : desktopStates;

  useFrame((state) => {
    const { clock } = state;
    const time = clock.getElapsedTime();
    if (!groupRef.current) return;

    let target: SceneState;
    if (progress < 0.3) {
      target = interpolate(currentStates.about, currentStates.works, progress / 0.3);
    } else if (progress < 0.7) {
      target = interpolate(currentStates.works, currentStates.research, (progress - 0.3) / 0.4);
    } else {
      target = interpolate(currentStates.research, currentStates.contact, (progress - 0.7) / 0.3);
    }

    const lerpSpeed = 0.04;
    groupRef.current.position.lerp(new THREE.Vector3(...target.position), lerpSpeed);

    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, target.scale, lerpSpeed);
    groupRef.current.scale.set(s, s, s);

    groupRef.current.rotation.y = time * 0.15 + (progress * Math.PI * 2.5);
    groupRef.current.rotation.x = Math.sin(time * 0.08) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Suspense fallback={null}>
          <FlexibleModel
            ref={modelRef}
            path={MODEL_CONFIG.path}
            scale={MODEL_CONFIG.scale}
            position={MODEL_CONFIG.position}
          />
        </Suspense>
      </Float>
    </group>
  );
};

interface FocusState {
  texture: THREE.Texture | null;
  progress: number;
  center?: THREE.Vector2;
}

const Scene: React.FC<{ progress: number; researchFocus?: FocusState }> = ({ progress, researchFocus }) => (
  <div className="w-full h-full fixed inset-0 pointer-events-none">
    <Canvas dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
      <BackgroundWaves progress={progress} focus={researchFocus} />
      <SceneContent progress={progress} />
      <Effects />
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} color="#FFFFFF" />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#FFFFFF" />
      <fog attach="fog" args={['#F2F0ED', 6, 18]} />
    </Canvas>
  </div>
);

export default Scene;
