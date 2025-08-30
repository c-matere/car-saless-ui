import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Optimized model component
const Model = React.memo(({ url }) => {
  const group = useRef();
  const { scene } = useGLTF(url, true, undefined, (loader) => {
    // Optimize loading with draco compression if available
    if (typeof window !== 'undefined' && window.DRACOLoader) {
      const dracoLoader = new window.DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
      loader.setDRACOLoader(dracoLoader);
    }
  });
  
  // Memoize the model processing
  const processedScene = useMemo(() => {
    if (!scene) return null;
    
    const sceneClone = scene.clone();
    
    // Create a bounding box to center the model
    const box = new THREE.Box3().setFromObject(sceneClone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Calculate scale to make the model a reasonable size
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    
    sceneClone.scale.set(scale, scale, scale);
    sceneClone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    
    // Optimize the scene
    sceneClone.traverse((child) => {
      if (child.isMesh) {
        // Optimize geometry
        if (child.geometry) {
          child.geometry.computeVertexNormals();
          if (child.geometry.attributes.normal) {
            child.geometry.attributes.normal.needsUpdate = true;
          }
          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();
        }
        
        // Optimize materials
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.roughness = 1;
              mat.metalness = 0;
              mat.dithering = true;
            });
          } else {
            child.material.roughness = 1;
            child.material.metalness = 0;
            child.material.dithering = true;
          }
        }
      }
    });
    
    return sceneClone;
  }, [scene]);
  
  if (!processedScene) return null;
  
  return <primitive ref={group} object={processedScene} dispose={null} />;
});

const ModelViewer = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Performance optimization for the canvas
  const canvasStyle = useMemo(() => ({
    width: '100%',
    height: '500px',
    position: 'relative',
    border: '1px solid #333',
    borderRadius: '8px',
    overflow: 'hidden',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: 1000
  }), []);

  if (!isClient) {
    return (
      <div style={{
        ...canvasStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        backgroundColor: '#1a1a1a'
      }}>
        Loading 3D viewer...
      </div>
    );
  }

  return (
    <div style={canvasStyle}>
      <Canvas
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{ 
          position: [0, 0.5, 3], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = false;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
          gl.autoClear = false;
        }}
        frameloop="demand"
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 7]} 
          intensity={0.8}
        />
        
        <Suspense fallback={null}>
          <Model url="/free_1972_datsun_240k_gt.glb" />
        </Suspense>
        
        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.1}
          screenSpacePanning={true}
          minDistance={1.5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
          enableZoom={true}
          enablePan={true}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
          target={[0, 0.5, 0]}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        pointerEvents: 'none',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)'
      }}>
        Left-click + drag: Rotate | Right-click + drag: Pan | Scroll: Zoom
      </div>
    </div>
  );
};

export default React.memo(ModelViewer);
