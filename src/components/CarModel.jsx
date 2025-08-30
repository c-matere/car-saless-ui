import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

// Simple Model component
const Model = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={0.5} />;
};

// Error boundary for the 3D model
const ModelWithErrorBoundary = ({ modelPath }) => {
  try {
    return <Model modelPath={modelPath} />;
  } catch (error) {
    console.error('Error rendering 3D model:', error);
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-6">
          <div className="text-xl font-medium mb-2">Error Loading Model</div>
          <p className="text-gray-400">We couldn't load the 3D model. Please try again later.</p>
        </div>
      </div>
    );
  }
};

// Preload models
useGLTF.preload('/free_1972_datsun_240k_gt.glb');
useGLTF.preload('/urus.glb');

function CarModel({ modelPath = '/free_1972_datsun_240k_gt.glb' }) {
  const [webGLError, setWebGLError] = useState(false);
  const [modelError, setModelError] = useState(false);
  const canvasRef = useRef(null);

  // Set default model path if not provided
  const currentModelPath = modelPath || '/free_1972_datsun_240k_gt.glb';

  // Check WebGL support
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl || !(gl instanceof WebGLRenderingContext)) {
          throw new Error('WebGL not supported');
        }
        return true;
      } catch (e) {
        console.error('WebGL check failed:', e);
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebGLError(true);
    }
  }, []);

  // Handle WebGL context loss
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event) => {
      event.preventDefault();
      console.error('WebGL context lost');
      setWebGLError(true);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
    };
  }, []);

  // Show fallback if there's an error or WebGL isn't supported
  if (webGLError || modelError) {
    return (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center bg-gray-900 rounded-3xl">
        <div className="text-center p-4">
          <div className="text-white text-lg mb-2">Car Preview</div>
          <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
            <p className="text-center whitespace-pre-line">
              {webGLError 
                ? "3D preview not available in this browser.\nTry using Chrome, Firefox, or Edge."
                : "Unable to load 3D model.\nPlease try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden">
      <Canvas
        ref={canvasRef}
        className="w-full h-full"
        dpr={[1, 2]}
        camera={{ fov: 45 }}
        onError={(error) => {
          console.error('Canvas error:', error);
          setModelError(true);
        }}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <ModelWithErrorBoundary modelPath={currentModelPath} />
          </Stage>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default React.memo(CarModel);
