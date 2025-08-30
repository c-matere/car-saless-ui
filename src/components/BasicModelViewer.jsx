import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ url }) => {
  const group = useRef();
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    if (!scene) return;
    
    // Center and scale the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3 / maxDim; // 3x scale
    
    scene.scale.set(scale, scale, scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    
    return () => {
      // Cleanup
      scene.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  return <primitive object={scene} />;
};

const BasicModelViewer = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{
        width: '100%',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: '8px'
      }}>
        Loading 3D viewer...
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '500px',
      position: 'relative',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      border: '1px solid #333'
    }}>
      <Canvas
        camera={{ 
          position: [0, 0.5, 3],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2}
        />
        
        <Suspense fallback={null}>
          <Model url="/free_1972_datsun_240k_gt.glb" />
        </Suspense>
        
        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.1}
          minDistance={1.5}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '12px',
        pointerEvents: 'none',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
      }}>
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
};

export default BasicModelViewer;
