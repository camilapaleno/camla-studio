import React, { useState, useEffect } from 'react';

interface DynamicOverlayProps {
  children: React.ReactNode;
  tvStatic?: boolean;
  chromaticAberration?: boolean;
  scanlines?: boolean;
  staticIntensity?: number;
  aberrationIntensity?: number;
  scanlineIntensity?: number;
  className?: string;
}

const DynamicOverlay: React.FC<DynamicOverlayProps> = ({
  children,
  tvStatic = false,
  chromaticAberration = false,
  scanlines = false,
  staticIntensity = 0.1,
  aberrationIntensity = 2,
  scanlineIntensity = 0.3,
  className = ""
}) => {
  const [noisePattern, setNoisePattern] = useState('');
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Generate TV static noise pattern
  useEffect(() => {
    if (tvStatic) {
      const generateNoise = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        if (!ctx) return '';

        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const noise = Math.random() * 255;
          data[i] = noise;     // Red
          data[i + 1] = noise; // Green
          data[i + 2] = noise; // Blue
          data[i + 3] = staticIntensity * 255; // Alpha
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
      };

      const updateNoise = () => {
        setNoisePattern(generateNoise());
      };

      updateNoise();
      const interval = setInterval(updateNoise, 50); // Update every 50ms for animated static

      return () => clearInterval(interval);
    }
  }, [tvStatic, staticIntensity]);

  const overlayStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%'
  };

  const staticOverlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: noisePattern ? `url(${noisePattern})` : 'none',
    backgroundRepeat: 'repeat',
    pointerEvents: 'none',
    zIndex: 10,
    mixBlendMode: 'overlay',
    opacity: 0.8
  };

  const contentWrapperStyles: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%'
  };

  const contentStyles: React.CSSProperties = {
    width: '100%',
    height: '100%'
  };

  // Red channel layer (shifted right)
  const redChannelStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 12,
    transform: `translateX(${aberrationIntensity}px)`,
    mixBlendMode: 'screen',
    opacity: 0.5,
    filter: 'saturate(3) contrast(1.2)'
  };

  // Cyan channel layer (shifted left)
  const cyanChannelStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 12,
    transform: `translateX(-${aberrationIntensity}px)`,
    mixBlendMode: 'screen',
    opacity: 0.5,
    filter: 'saturate(3) contrast(1.2)'
  };

  const scanlineStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 13,
    backgroundImage: `repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, ${scanlineIntensity * 0.15}) 0px,
      rgba(180, 180, 180, ${scanlineIntensity * 0.1}) 1px,
      transparent 2px,
      transparent 4px
    )`,
    animation: 'scanlinePulse 2s ease-in-out infinite',
    filter: 'blur(1px)',
    mixBlendMode: 'overlay'
  };

  const staticSpotStyles: React.CSSProperties = hoverPosition ? {
    position: 'absolute',
    left: hoverPosition.x - 150,
    top: hoverPosition.y - 150,
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 14,
    backgroundImage: `repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, ${scanlineIntensity * 0.4}) 0px,
      rgba(0, 0, 0, ${scanlineIntensity * 0.5}) 1px,
      rgba(255, 255, 255, ${scanlineIntensity * 0.3}) 2px,
      transparent 3px,
      transparent 6px
    )`,
    filter: 'blur(0.5px)',
    mixBlendMode: 'screen',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
    opacity: 0.8
  } : {};

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scanlines) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoverPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  return (
    <>
      <style jsx>{`
        @keyframes scanlinePulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>

      <div
        className={`dynamic-overlay ${className}`}
        style={overlayStyles}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={contentWrapperStyles}>
          {/* Original content */}
          <div style={contentStyles}>
            {children}
          </div>

          {/* Chromatic aberration layers */}
          {chromaticAberration && (
            <>
              <div
                style={redChannelStyles}
                className="chromatic-red"
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  filter: 'brightness(1) sepia(1) saturate(10) hue-rotate(-30deg)'
                }}>
                  {children}
                </div>
              </div>
              <div
                style={cyanChannelStyles}
                className="chromatic-cyan"
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  filter: 'brightness(1) sepia(1) saturate(10) hue-rotate(150deg)'
                }}>
                  {children}
                </div>
              </div>
            </>
          )}
        </div>
        {scanlines && <div style={scanlineStyles} />}
        {scanlines && hoverPosition && <div style={staticSpotStyles} />}
        {tvStatic && <div style={staticOverlayStyles} />}
      </div>
    </>
  );
};

// 3D Cube component using CSS transforms
export const AnimatedCube: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 1,
        y: prev.y + 0.5
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const cubeStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    margin: '50px auto'
  };

  const faceStyles: React.CSSProperties = {
    position: 'absolute',
    width: '120px',
    height: '120px',
    border: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff'
  };

  return (
    <div style={cubeStyle}>
      <div style={{...faceStyles, backgroundColor: '#ff6b6b', transform: 'translateZ(60px)'}}>
        Front
      </div>
      <div style={{...faceStyles, backgroundColor: '#4ecdc4', transform: 'translateZ(-60px) rotateY(180deg)'}}>
        Back
      </div>
      <div style={{...faceStyles, backgroundColor: '#45b7d1', transform: 'rotateY(90deg) translateZ(60px)'}}>
        Right
      </div>
      <div style={{...faceStyles, backgroundColor: '#f9ca24', transform: 'rotateY(-90deg) translateZ(60px)'}}>
        Left
      </div>
      <div style={{...faceStyles, backgroundColor: '#6c5ce7', transform: 'rotateX(90deg) translateZ(60px)'}}>
        Top
      </div>
      <div style={{...faceStyles, backgroundColor: '#fd79a8', transform: 'rotateX(-90deg) translateZ(60px)'}}>
        Bottom
      </div>
    </div>
  );
};

export default DynamicOverlay;
