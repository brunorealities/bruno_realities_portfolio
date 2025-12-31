import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { useControls } from 'leva';

const WavesMaterial = shaderMaterial(
  {
    uLargeTime: 0,
    uSmallTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uColor: new THREE.Color('#c4a484'),
    uEmissiveColor: new THREE.Color('#ffffff'),
    uLargeWavesFrequency: new THREE.Vector2(3.2, 6.02),
    uLargeWavesMultiplier: 0.09,
    uSmallWavesIterations: 3,
    uSmallWavesFrequency: 4.1,
    uSmallWavesMultiplier: 0.08,
    uEmissivePower: 5.0,
    uEmissiveLow: -0.353,
    uEmissiveHigh: 0.436,
    uNormalComputeShift: 0.02,
    uMouseFreqInfluence: 0.5,
    uRoughness: 0.282,
    uMouseRadius: 2.5,
    uMouseDepth: 1.0,
  },
  // Vertex Shader
  `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vElevation;
  uniform float uLargeTime;
  uniform float uSmallTime;
  uniform vec2 uMouse;
  
  uniform vec2 uLargeWavesFrequency;
  uniform float uLargeWavesMultiplier;
  uniform float uSmallWavesFrequency;
  uniform float uSmallWavesMultiplier;
  uniform float uNormalComputeShift;
  uniform float uMouseFreqInfluence;
  uniform float uMouseRadius;
  uniform float uMouseDepth;

  // ... (noise functions same as before)
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  float getElevation(vec3 pos) {
    float mouseDist = distance(pos.xy, uMouse);
    float freqMod = 1.0 + smoothstep(8.0, 0.0, mouseDist) * uMouseFreqInfluence;

    float elevation = sin(pos.x * uLargeWavesFrequency.x * freqMod + uLargeTime) *
                      sin(pos.y * uLargeWavesFrequency.y * freqMod + uLargeTime) *
                      uLargeWavesMultiplier;

    float ridged = 0.0;
    float sum = 0.0;

    for(int i = 1; i <= 3; i++) {
      float fi = float(i);
      vec3 noiseInput = vec3(pos.xy * uSmallWavesFrequency * fi * freqMod, uSmallTime);
      float n = snoise(noiseInput) * 0.5 + 0.5;
      float r = 1.0 - abs(2.0 * n - 1.0);
      r = r * r;
      ridged += r / fi;
      sum += 1.0 / fi;
    }

    ridged /= sum;
    elevation += (ridged - 0.5) * (uSmallWavesMultiplier);

    // Mouse Depression Logic
    float mouseDepression = smoothstep(uMouseRadius, 0.0, mouseDist);
    elevation -= pow(mouseDepression, 2.0) * uMouseDepth;

    return elevation;
  }

  void main() {
    vec3 pos = position;
    float elevation = getElevation(pos);
    pos.z += elevation;

    float shift = uNormalComputeShift;
    vec3 posA = position + vec3(shift, 0.0, 0.0);
    vec3 posB = position + vec3(0.0, shift, 0.0);
    posA.z += getElevation(posA);
    posB.z += getElevation(posB);

    vec3 toA = normalize(posA - pos);
    vec3 toB = normalize(posB - pos);
    vNormal = normalize(cross(toA, toB));

    vPosition = pos;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec3 vNormal;
  varying float vElevation;

  uniform vec3 uColor;
  uniform vec3 uEmissiveColor;
  uniform float uEmissivePower;
  uniform float uEmissiveLow;
  uniform float uEmissiveHigh;
  uniform float uRoughness;

  float remap(float value, float low1, float high1, float low2, float high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
  }

  void main() {
    float emissiveFactor = remap(vElevation, uEmissiveLow, uEmissiveHigh, 0.0, 1.0);
    emissiveFactor = clamp(emissiveFactor, 0.0, 1.0);
    emissiveFactor = pow(emissiveFactor, uEmissivePower);

    vec3 finalColor = mix(uColor, uEmissiveColor, emissiveFactor);

    // Iluminação Specular para aspecto "viscoso/molhado"
    vec3 lightDirection = normalize(vec3(0.35, 0.35, 1.0));
    vec3 viewDirection = normalize(vec3(0.0, 0.0, 1.0));
    vec3 halfVector = normalize(lightDirection + viewDirection);
    
    float specPower = mix(100.0, 1.0, uRoughness);
    
    // Normalize vNormal and viewDir for accurate specular highlight
    vec3 normal = normalize(vNormal);
    float specular = pow(max(dot(normal, halfVector), 0.0), specPower);
    
    float lighting = clamp(dot(normal, lightDirection), 0.0, 1.0);
    
    finalColor += lighting * 0.1;
    finalColor += specular * (1.0 - uRoughness) * 0.4;

    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

extend({ WavesMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    wavesMaterial: any;
  }
}

const BackgroundWaves: React.FC<{ progress: number }> = ({ progress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePos = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  // Phase accumulators to prevent glitches when speed changes
  const largeTimeRef = useRef(0);
  const smallTimeRef = useRef(0);

  // GUI Controls for Wave Background
  const controls = useControls('Wave Background', {
    color: '#F0EEE9',
    emissiveColor: '#ffffff',
    largeWaves: {
      value: { x: 0.11, y: 2.60 },
      step: 0.01,
      label: 'Large Freq'
    },
    largeSpeed: { value: 0.92, min: 0, max: 2, step: 0.01 },
    largeMultiplier: { value: 0.28, min: 0, max: 1, step: 0.01 },
    smallFreq: { value: 0.8, min: 0, max: 10, step: 0.1 },
    smallSpeed: { value: 0.27, min: 0, max: 1, step: 0.01 },
    smallMultiplier: { value: 0.22, min: 0, max: 1, step: 0.01 },
    emissivePower: { value: 6.3, min: 1, max: 20, step: 0.1 },
    emissiveLow: { value: -0.40, min: -1, max: 1, step: 0.01 },
    emissiveHigh: { value: 0.41, min: -1, max: 1, step: 0.01 },
    roughness: { value: 0.57, min: 0, max: 1, step: 0.01 },
    normalComputeShift: { value: 0.02, min: 0.001, max: 0.05, step: 0.0001 },
    mouseFreqInfluence: { value: 0.13, min: 0, max: 2, step: 0.01 },
    mouseDepth: { value: 1.0, min: 0.0, max: 2.0, step: 0.1 },
    mouseRadius: { value: 2.5, min: 0.5, max: 5.0, step: 0.1 },
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as any;

    // --- Wave Parameter Logic ---
    // We keep the phase accumulation for stability, but remove the dynamic darkening
    // to keep the background consistent across all sections as requested.

    // Update Material Uniforms directly from controls (or lerp for smoothness)
    material.uEmissivePower = THREE.MathUtils.lerp(material.uEmissivePower, controls.emissivePower, 0.1);
    material.uColor.lerp(new THREE.Color(controls.color), 0.1);

    // ACUMULATE PHASE (Maintenance of the scroll stability fix)
    largeTimeRef.current += delta * controls.largeSpeed;
    smallTimeRef.current += delta * controls.smallSpeed;

    material.uLargeTime = largeTimeRef.current;
    material.uSmallTime = smallTimeRef.current;

    // Scale mouse to viewport geometry size
    const targetX = mousePos.current.x * (viewport.width * 1.5 / 2);
    const targetY = mousePos.current.y * (viewport.height * 1.5 / 2);

    material.uMouse.x = THREE.MathUtils.lerp(material.uMouse.x, targetX, 0.1);
    material.uMouse.y = THREE.MathUtils.lerp(material.uMouse.y, targetY, 0.1);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[viewport.width * 3.5, viewport.height * 3.5, 256, 256]} />
      <wavesMaterial
        transparent
        side={THREE.DoubleSide}
        uColor={new THREE.Color(controls.color)}
        uEmissiveColor={new THREE.Color(controls.emissiveColor)}
        uLargeWavesFrequency={new THREE.Vector2(controls.largeWaves.x, controls.largeWaves.y)}
        uLargeTime={0}
        uLargeWavesMultiplier={controls.largeMultiplier}
        uSmallWavesFrequency={controls.smallFreq}
        uSmallTime={0}
        uSmallWavesMultiplier={controls.smallMultiplier}
        uEmissivePower={controls.emissivePower}
        uEmissiveLow={controls.emissiveLow}
        uEmissiveHigh={controls.emissiveHigh}
        uNormalComputeShift={controls.normalComputeShift}
        uMouseFreqInfluence={controls.mouseFreqInfluence}
        uRoughness={controls.roughness}
        uMouseDepth={controls.mouseDepth}
        uMouseRadius={controls.mouseRadius}
      />
    </mesh>
  );
};

export default BackgroundWaves;
