import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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
    
    // Calculate scale to make the model 3x larger
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = (1.5 / maxDim) * 3; // 3x scale
    
    // Apply transformations
    scene.scale.set(scale, scale, scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    
    // Optimize the scene while preserving colors
    scene.traverse((child) => {
      if (child.isMesh) {
        // Keep original materials but optimize them
        if (child.material) {
          // If it's an array of materials, keep them but optimize
          if (Array.isArray(child.material)) {
            child.material = child.material.map(mat => {
              const m = mat.clone();
              // Optimize material properties
              m.roughness = Math.max(0.5, m.roughness || 0.5);
              m.metalness = Math.min(0.5, m.metalness || 0);
              m.dithering = true;
              return m;
            });
          } else {
            // Single material, optimize it
            const m = child.material;
            m.roughness = Math.max(0.5, m.roughness || 0.5);
            m.metalness = Math.min(0.5, m.metalness || 0);
            m.dithering = true;
          }
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

const EnhancedModelViewer = () => {
  const [isClient, setIsClient] = useState(false);
  const [perfLog, setPerfLog] = useState('');
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(0);
  const lastTime = useRef(0);
  const controls = useRef();
  
  useEffect(() => {
    setIsClient(true);
    
    // Simple FPS counter
    const updateFPS = (time) => {
      frameCount.current++;
      
      if (time - lastFpsUpdate.current > 1000) {
        const fps = Math.round((frameCount.current * 1000) / (time - lastFpsUpdate.current));
        setPerfLog(`FPS: ${fps}`);
        lastFpsUpdate.current = time;
        frameCount.current = 0;
      }
      
      requestAnimationFrame(updateFPS);
    };
    
    const id = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(id);
  }, []);

  if (!isClient) {
    return <Fallback />;
  }

  return (
    <div style={{
      width: '100%',
      height: '500px',
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333'
    }}>
      <Canvas
        dpr={1}
        camera={{ 
          position: [0, 0.5, 4],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          gl.shadowMap.enabled = false;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
          gl.autoClear = true;
        }}
        frameloop="demand"
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2}
          castShadow={false}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Model url="/free_1972_datsun_240k_gt.glb" />
        </Suspense>
        
        <OrbitControls 
          ref={controls}
          enableDamping={true}
          dampingFactor={0.15}
          screenSpacePanning={true}
          minDistance={2}
          maxDistance={15}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
          enableZoom={true}
          enablePan={true}
          rotateSpeed={0.7}
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
        color: 'rgba(255,255,255,0.8)',
        fontSize: '12px',
        pointerEvents: 'none',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        padding: '8px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '4px',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}>
        Drag to rotate • Scroll to zoom • Right-click to pan
        {perfLog && (
          <div style={{ marginTop: '4px', fontSize: '10px', opacity: 0.7 }}>
            {perfLog}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(EnhancedModelViewer);
