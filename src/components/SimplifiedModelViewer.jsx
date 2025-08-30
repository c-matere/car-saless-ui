import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Simple fallback component
const Fallback = () => (
  <div style={{
    width: '100%',
    height: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px'
  }}>
    Loading 3D model...
  </div>
);

// Simplified model component with aggressive optimizations
const Model = React.memo(({ url }) => {
  const group = useRef();
  const { scene } = useGLTF(url, true, undefined, (loader) => {
    if (typeof window !== 'undefined' && window.DRACOLoader) {
      const dracoLoader = new window.DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
      loader.setDRACOLoader(dracoLoader);
    }
  });

  useEffect(() => {
    if (!scene) return;
    
    // Create a bounding box to center the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Calculate scale to make the model a reasonable size
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.5 / maxDim;
    
    // Apply transformations
    scene.scale.set(scale, scale, scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    
    // Optimize all meshes
    scene.traverse((child) => {
      if (child.isMesh) {
        // Optimize geometry
        if (child.geometry) {
          child.geometry.computeVertexNormals();
          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();
        }
        
        // Simplify materials
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material = child.material[0]; // Just use first material if multiple
          }
          child.material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.8,
            metalness: 0.2
          });
        }
      }
    });
    
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

  return <primitive ref={group} object={scene} dispose={null} />;
});

const SimplifiedModelViewer = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Fallback />;
  }

  return (
    <div style={{
      width: '100%',
      height: '500px',
      position: 'relative',
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a'
    }}>
      <Canvas
        dpr={1} // Lower DPR for better performance
        camera={{ 
          position: [0, 0.5, 2.5],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: false, // Disable antialiasing for better performance
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(1); // Force lower pixel ratio
          gl.shadowMap.enabled = false;
          gl.toneMapping = THREE.NoToneMapping;
          gl.autoClear = true;
        }}
        frameloop="demand"
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.8}
          castShadow={false}
        />
        
        <Suspense fallback={null}>
          <Model url="/free_1972_datsun_240k_gt.glb" />
        </Suspense>
        
        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.1}
          screenSpacePanning={true}
          minDistance={1}
          maxDistance={10}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
          enableZoom={true}
          enablePan={true}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.8}
          target={[0, 0.3, 0]}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
        pointerEvents: 'none',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      }}>
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
};

export default React.memo(SimplifiedModelViewer);
