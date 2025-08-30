import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Disable shadows and other performance-intensive features in development
const isDevelopment = process.env.NODE_ENV === 'development';

// Optimized model component
const Model = React.memo(({ url }) => {
  const group = useRef();
  const { scene } = useGLTF(url, true, undefined, (loader) => {
    // Optimize loading with draco compression if available
    if (window.DRACOLoader) {
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
        // Only enable shadows in production for better performance
        if (!isDevelopment) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
        
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
}

function ModelViewer() {
  const [isClient, setIsClient] = useState(false);
  
  // Only render on client-side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-white">Loading 3D viewer...</div>
      </div>
    );
  }

  // Performance optimization for the canvas
  const canvasStyle = useMemo(() => ({
    width: '100%',
    height: '500px',
    position: 'relative',
    border: '1px solid #333',
    borderRadius: '8px',
    overflow: 'hidden',
    // Force GPU acceleration
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: 1000
  }), []);

  // Only load the environment in production for better performance
  const environment = useMemo(() => {
    return isDevelopment ? null : <Environment preset="city" background={false} />;
  }, []);

  return (
    <div style={canvasStyle}>
      <Canvas
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit pixel ratio for better performance
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
        onCreated={({ gl, scene }) => {
          // Performance optimizations
          gl.shadowMap.enabled = !isDevelopment;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
          gl.autoClear = false;
          
          // Set up renderer properties for better performance
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.setSize(window.innerWidth, window.innerHeight);
          
          // Optimize scene
          scene.background = null;
        }}
        frameloop="demand" // Only render on demand when interacting
      >
        {/* Optimized lights */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 7]} 
          intensity={0.8}
          castShadow={!isDevelopment}
          shadow-mapSize-width={isDevelopment ? 0 : 1024}
          shadow-mapSize-height={isDevelopment ? 0 : 1024}
          shadow-bias={-0.0001}
        />
        
        {/* Model with Suspense boundary */}
        <Suspense fallback={null}>
          <Model url="/free_1972_datsun_240k_gt.glb" />
          {environment}
        </Suspense>
        
        {/* Optimized controls */}
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
      
      {/* Performance optimized controls help */}
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
        {isDevelopment ? 'DEV MODE: ' : ''}Left-click: Rotate | Right-click: Pan | Scroll: Zoom
      </div>
      
      {/* Performance monitor (only in development) */}
      {isDevelopment && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'lime',
          fontFamily: 'monospace',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          pointerEvents: 'none'
        }}>
          <div>FPS: <span id="fps-counter">--</span></div>
          <div>Triangles: <span id="triangle-count">--</span></div>
        </div>
      )}
    </div>
  );
}

// Add performance monitoring in development
if (isDevelopment && typeof window !== 'undefined') {
  // Simple FPS counter
  let lastTime = performance.now();
  let frameCount = 0;
  let lastFpsUpdate = 0;
  
  const updateFps = () => {
    const now = performance.now();
    frameCount++;
    
    if (now - lastFpsUpdate > 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
      const fpsElement = document.getElementById('fps-counter');
      if (fpsElement) fpsElement.textContent = fps;
      
      // Update triangle count
      const triangles = document.querySelectorAll('canvas')[0]?.querySelectorAll('canvas').length || 0;
      const triangleElement = document.getElementById('triangle-count');
      if (triangleElement) triangleElement.textContent = triangles;
      
      lastFpsUpdate = now;
      frameCount = 0;
    }
    
    requestAnimationFrame(updateFps);
  };
  
  // Start FPS counter
  requestAnimationFrame(updateFps);
}

export default React.memo(ModelViewer);
