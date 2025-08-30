import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

const CanvasWrapper = ({ children }) => (
  <Canvas
    camera={{ position: [5, 2, 5], fov: 50 }}
    gl={{ antialias: true, alpha: true }}
    onCreated={({ gl }) => {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = window.THREE.PCFSoftShadowMap;
    }}
  >
    {children}
  </Canvas>
);

export default CanvasWrapper;
