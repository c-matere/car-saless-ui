import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ objUrl, mtlUrl }) => {
  const group = useRef();
  const { scene } = useThree();
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Clear existing scene
        while (scene.children.length > 0) {
          const child = scene.children[0];
          scene.remove(child);
        }

        // Load materials if MTL file exists
        if (mtlUrl) {
          const mtlLoader = new MTLLoader();
          const materials = await new Promise((resolve) => {
            mtlLoader.load(mtlUrl, resolve);
          });
          materials.preload();
          
          // Load OBJ with materials
          const objLoader = new OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.load(objUrl, (object) => {
            scene.add(object);
          });
        } else {
          // Load just the OBJ
          const objLoader = new OBJLoader();
          objLoader.load(objUrl, (object) => {
            scene.add(object);
          });
        }
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();

    return () => {
      // Cleanup
      while (scene.children.length > 0) {
        const child = scene.children[0];
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
        scene.remove(child);
      }
    };
  }, [objUrl, mtlUrl, scene]);

  return null;
};

const RawModelViewer = () => {
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
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Model 
            objUrl="/free_1972_datsun_240k_gt.obj"
            mtlUrl="/free_1972_datsun_240k_gt.mtl"
          />
        </Suspense>
        
        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.1}
          autoRotate={false}
          enableZoom={true}
          enablePan={true}
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

export default RawModelViewer;
