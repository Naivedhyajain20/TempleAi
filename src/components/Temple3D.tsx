import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/temple.glb";

interface Hotspot {
  position: [number, number, number];
  label: string;
  description: string;
  color: string;
}

const HOTSPOTS: Hotspot[] = [
  { position: [0, 2.5, 0], label: "Main Sanctum", description: "Sacred shrine area", color: "#f59e0b" },
  { position: [-3, 0.5, 3], label: "Entry Gate", description: "Visitor entrance", color: "#10b981" },
  { position: [3, 0.5, 3], label: "Exit Gate", description: "Exit passage", color: "#ef4444" },
  { position: [-3, 0.5, -3], label: "Prasad Area", description: "Offerings distribution zone", color: "#8b5cf6" },
  { position: [3, 0.5, -3], label: "Facilities", description: "Water & washrooms", color: "#06b6d4" },
];

function TempleModel() {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef<THREE.Group>(null);

  // slow rotation
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });

  return (
    <group ref={ref} position={[0, -1, 0]} scale={1.4}>
      <primitive object={scene} />
    </group>
  );
}

// Preload GLB
useGLTF.preload(MODEL_URL);

function HotspotItem(props: Hotspot & { onClick: () => void }) {
  const { position, label, description, color, onClick } = props;
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={hovered ? color : "#000"}
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Hover label */}
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-white/90 border p-2 rounded-md shadow text-xs">
            <strong>{label}</strong>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Temple3D() {
  const [selected, setSelected] = useState<Hotspot | null>(null);

  return (
    <div className="relative w-full h-[700px] rounded-xl overflow-hidden border bg-gradient-to-b from-sky-200 to-blue-100">
      <Canvas camera={{ position: [10, 6, 12], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.4} castShadow />

        <Suspense fallback={null}>
          <TempleModel />
        </Suspense>

        {/* hotspots */}
        {HOTSPOTS.map((hs, i) => (
          <HotspotItem key={i} {...hs} onClick={() => setSelected(hs)} />
        ))}

      <OrbitControls
  enableZoom={true}
  zoomSpeed={1}
  minDistance={0.1}
  maxDistance={200}
/>

      </Canvas>

      {/* Selected hotspot info box */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-4 bg-white/95 p-4 rounded-lg shadow-lg">
          <div className="flex justify-between">
            <div>
              <span
                className="inline-block rounded-full mr-2"
                style={{ width: 12, height: 12, background: selected.color }}
              />
              <strong>{selected.label}</strong>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            </div>
            <button onClick={() => setSelected(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
