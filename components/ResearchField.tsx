import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, Canvas, useThree } from '@react-three/fiber';
import { Image, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ResearchItem {
    id: string;
    title: string;
    image: string;
    year: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            group: any;
            ambientLight: any;
            pointLight: any;
        }
    }
}

const ITEMS: ResearchItem[] = [
    { id: '1', title: 'Process Node 02', image: 'images/process/processo_2.jpeg', year: '2025' },
    { id: '2', title: 'Process Node 03', image: 'images/process/processo_3.jpeg', year: '2025' },
    { id: '3', title: 'Process Node 04', image: 'images/process/processo_4.jpeg', year: '2025' },
    { id: '4', title: 'Process Node 05', image: 'images/process/processo_5.jpeg', year: '2025' },
    { id: '5', title: 'Process Node 06', image: 'images/process/processo_6.jpeg', year: '2025' },
    { id: '6', title: 'Process Node 07', image: 'images/process/processo_7.jpeg', year: '2025' },
    { id: '7', title: 'Process Node 08', image: 'images/process/processo_8.jpeg', year: '2025' },
    { id: '8', title: 'Process Node 09', image: 'images/process/processo_9.jpeg', year: '2025' },
    { id: '9', title: 'Process Node 10', image: 'images/process/processo_10.jpeg', year: '2025' },
    { id: '10', title: 'Process Node 11', image: 'images/process/processo_11.jpeg', year: '2025' },
    { id: '11', title: 'Process Node 12', image: 'images/process/processo_12.jpeg', year: '2025' },
    { id: '12', title: 'Process Node 13', image: 'images/process/processo_13.jpeg', year: '2025' },
    { id: '13', title: 'Process Node 14', image: 'images/process/processo_14.jpeg', year: '2025' },
    { id: '14', title: 'Process Node 15', image: 'images/process/processo_15.jpeg', year: '2025' },
    { id: '15', title: 'Process Node 16', image: 'images/process/processo_16.jpeg', year: '2025' },
    { id: '16', title: 'Process Node 17', image: 'images/process/processo_17.jpeg', year: '2025' },
    { id: '17', title: 'Process Node 18', image: 'images/process/processo_18.jpeg', year: '2025' },
    { id: '18', title: 'Process Node 19', image: 'images/process/processo_19.jpeg', year: '2025' },
    { id: '19', title: 'Process Node 20', image: 'images/process/processo_20.jpeg', year: '2025' },
    { id: '20', title: 'Process Node 21', image: 'images/process/processo_21.jpeg', year: '2025' },
    { id: '21', title: 'Process Node 22', image: 'images/process/processo_22.jpeg', year: '2025' },
    { id: '22', title: 'Process Node 23', image: 'images/process/processo_23.jpeg', year: '2025' },
    { id: '23', title: 'Process Node 24', image: 'images/process/processo_24.jpeg', year: '2025' },
    { id: '24', title: 'Process Node 25', image: 'images/process/processo_25.jpeg', year: '2025' },
    { id: '25', title: 'Process Node 26', image: 'images/process/processo_26.jpeg', year: '2025' },
    { id: '26', title: 'Process Node 27', image: 'images/process/processo_27.jpeg', year: '2025' },
    { id: '27', title: 'Process Node 28', image: 'images/process/processo_28.jpeg', year: '2025' },
    { id: '28', title: 'Process Node 29', image: 'images/process/processo_29.jpeg', year: '2025' },
    { id: '29', title: 'Process Node 30', image: 'images/process/processo_30.jpeg', year: '2025' },
    { id: '30', title: 'Process Node 31', image: 'images/process/processo_31.jpeg', year: '2025' },
    { id: '31', title: 'Process Node 32', image: 'images/process/processo_32.jpeg', year: '2025' },
    { id: '32', title: 'Process Node 33', image: 'images/process/processo_33.jpeg', year: '2025' },
    { id: '33', title: 'Process Node 34', image: 'images/process/processo_34.jpeg', year: '2025' },
    { id: '34', title: 'Process Node 35', image: 'images/process/processo_35.jpeg', year: '2025' },
    { id: '35', title: 'Process Node 36', image: 'images/process/processo_36.jpeg', year: '2025' },
    { id: '36', title: 'Process Node 37', image: 'images/process/processo_37.jpeg', year: '2025' },
    { id: '37', title: 'Process Node 38', image: 'images/process/processo_38.jpeg', year: '2025' },
    { id: '38', title: 'Process Node 39', image: 'images/process/processo_39.jpeg', year: '2025' },
    { id: '39', title: 'Process Node Base', image: 'images/process/processo_human.jpeg', year: '2025' },
];

const ResearchPlane = ({ item, index, count, onSelect, focusedId, onHoverChange }: {
    item: ResearchItem,
    index: number,
    count: number,
    onSelect: (item: ResearchItem | null, texture: THREE.Texture | null) => void,
    focusedId: string | null,
    onHoverChange: (id: string | null) => void
}) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);

    const { position, quaternion } = useMemo(() => {
        // Fibonacci Sphere algorithm for even distribution
        const phi = Math.acos(-1 + (2 * index) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const radius = 4; // Sphere radius

        const pos = new THREE.Vector3(
            Math.cos(theta) * Math.sin(phi) * radius,
            Math.sin(theta) * Math.sin(phi) * radius,
            Math.cos(phi) * radius
        );

        // Orientation: face outwards from the sphere center
        const lookAtTarget = pos.clone().multiplyScalar(2);
        const dummy = new THREE.Object3D();
        dummy.position.copy(pos);
        dummy.lookAt(lookAtTarget);

        return { position: pos, quaternion: dummy.quaternion.clone() };
    }, [index, count]);

    const isFocused = focusedId === item.id;
    const isAnyFocused = focusedId !== null;

    useFrame(() => {
        if (isFocused) {
            meshRef.current.position.lerp(new THREE.Vector3(0, 0, 4), 0.08);
            meshRef.current.scale.lerp(new THREE.Vector3(4.5, 3.2, 1), 0.08);
            meshRef.current.quaternion.slerp(new THREE.Quaternion(), 0.08);
        } else {
            const targetPos = position.clone();
            const targetScale = hovered && !isAnyFocused ? 1.4 : 1.2;
            const targetOpacity = isAnyFocused ? 0.05 : (hovered ? 1 : 0.4);

            meshRef.current.position.lerp(targetPos, 0.08);
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale * 0.7, 1), 0.08);
            meshRef.current.quaternion.slerp(quaternion, 0.08);

            if (meshRef.current.material) {
                (meshRef.current.material as any).opacity = THREE.MathUtils.lerp(
                    (meshRef.current.material as any).opacity,
                    targetOpacity,
                    0.08
                );
            }
        }
    });

    return (
        <Image
            ref={meshRef}
            url={item.image}
            transparent
            onPointerOver={(e) => {
                e.stopPropagation();
                if (!isAnyFocused) {
                    setHovered(true);
                    onHoverChange(item.id);
                }
            }}
            onPointerOut={() => {
                setHovered(false);
                onHoverChange(null);
            }}
            onClick={(e) => {
                e.stopPropagation();
                const tex = (meshRef.current.material as any).map;
                onSelect(isFocused ? null : item, tex);
            }}
        />
    );
};

const ResearchGallery = ({ items, focusedItem, onSelect, onHoverChange }: {
    items: ResearchItem[],
    focusedItem: ResearchItem | null,
    onSelect: (item: ResearchItem | null, texture: THREE.Texture | null) => void,
    onHoverChange: (id: string | null) => void
}) => {
    const groupRef = useRef<THREE.Group>(null!);
    const scrollRef = useRef(0);
    const targetScrollRef = useRef(0);
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const isDragging = useRef(false);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (focusedItem) return;
            // Use both deltaX and deltaY for rotation
            targetScrollRef.current += (e.deltaY + e.deltaX) * 0.001;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

            if (isDragging.current && !focusedItem) {
                targetScrollRef.current += e.movementX * 0.005;
            }
        };

        const handleMouseDown = () => { isDragging.current = true; };
        const handleMouseUp = () => { isDragging.current = false; };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            // Reset cursor just in case
            document.body.style.cursor = 'auto';
        };
    }, [focusedItem]);

    useFrame((state) => {
        if (!groupRef.current) return;
        if (!focusedItem) {
            scrollRef.current = THREE.MathUtils.lerp(scrollRef.current, targetScrollRef.current, 0.06);
            groupRef.current.rotation.y = scrollRef.current + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseRef.current.y * 0.1, 0.05);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouseRef.current.x * 0.05, 0.05);
        } else {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            {items.map((item, idx) => (
                <ResearchPlane
                    key={item.id}
                    item={item}
                    index={idx}
                    count={items.length}
                    onSelect={onSelect}
                    focusedId={focusedItem?.id || null}
                    onHoverChange={onHoverChange}
                />
            ))}
        </group>
    );
};

const ResearchField: React.FC<{
    onUpdateMetadata: (item: ResearchItem | null) => void;
    onFocusBackground: (texture: THREE.Texture | null, progress: number, center?: THREE.Vector2) => void;
}> = ({ onUpdateMetadata, onFocusBackground }) => {
    const [focusedItem, setFocusedItem] = useState<ResearchItem | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const handleSelect = (item: ResearchItem | null, texture: THREE.Texture | null) => {
        setFocusedItem(item);
        onUpdateMetadata(item);
        if (item) {
            onFocusBackground(texture, 1, new THREE.Vector2(0.5, 0.5));
        } else {
            onFocusBackground(null, 0);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleSelect(null, null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={`w-full h-screen ${(hoveredId || focusedItem) ? 'cursor-pointer' : 'cursor-crosshair'}`}>
            <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ResearchGallery
                    items={ITEMS}
                    focusedItem={focusedItem}
                    onSelect={handleSelect}
                    onHoverChange={setHoveredId}
                />
            </Canvas>

            {hoveredId && !focusedItem && (
                <div className="absolute bottom-10 left-10 pointer-events-none reveal transition-all duration-500 text-black">
                    <span className="font-system text-[9px] opacity-30 tracking-[0.3em] uppercase block mb-1">
                        Experiment.Ref // {ITEMS.find(i => i.id === hoveredId)?.year}
                    </span>
                    <h4 className="font-system text-xl tracking-tight uppercase">
                        {ITEMS.find(i => i.id === hoveredId)?.title}
                    </h4>
                </div>
            )}

            {focusedItem && (
                <button
                    onClick={() => handleSelect(null, null)}
                    className="absolute top-10 right-10 z-50 p-4 font-system text-[10px] tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-3 text-black"
                >
                    <span className="w-8 h-[1px] bg-black"></span> Close [ESC]
                </button>
            )}
        </div>
    );
};

export default ResearchField;
export type { ResearchItem };
