// components/DesignerComponent.tsx
"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';

export default function DesignerComponent() {
  return (
    <div className="h-screen w-full">
      <Canvas>
        <ambientLight />
        <mesh>
          <sphereGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  );
}