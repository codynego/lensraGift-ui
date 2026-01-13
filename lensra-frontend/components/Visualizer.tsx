"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, MeshReflectorMaterial } from '@react-three/drei';

export default function Visualizer() {
  return (
    <div className="w-full h-[500px] bg-zinc-100 rounded-[40px] overflow-hidden">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <Stage environment="city" intensity={0.6}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </Stage>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}