'use client';

import React, { useState } from 'react';
import DynamicOverlay, { AnimatedCube } from '@/components/DynamicOverlay';
import Image from 'next/image';
import exampleImage from '@/image/preview-sara-5.png';

const OverlayTestPage = () => {
  const [staticEnabled, setStaticEnabled] = useState(false);
  const [aberrationEnabled, setAberrationEnabled] = useState(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(false);
  const [staticIntensity, setStaticIntensity] = useState(0.1);
  const [aberrationIntensity, setAberrationIntensity] = useState(2);
  const [scanlineIntensity, setScanlineIntensity] = useState(0.3);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    fontFamily: 'Arial, sans-serif'
  };

  const leftPanelStyle: React.CSSProperties = {
    width: '320px',
    backgroundColor: '#2d2d2d',
    padding: '24px',
    color: 'white',
    overflowY: 'auto'
  };

  const rightPanelStyle: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, #667eea, #764ba2, #ff6b6b, #4ecdc4)',
    backgroundSize: '400% 400%',
    animation: 'backgroundMove 10s ease-in-out infinite'
  };

  const controlGroupStyle: React.CSSProperties = {
    marginBottom: '24px'
  };

  const checkboxStyle: React.CSSProperties = {
    marginRight: '12px',
    width: '18px',
    height: '18px'
  };

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: '#555',
    borderRadius: '4px',
    appearance: 'none',
    cursor: 'pointer'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#4a5568',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <>
      <style jsx global>{`
        @keyframes backgroundMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div style={containerStyle}>
        {/* Left Panel - Controls */}
        <div style={leftPanelStyle}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
            Effect Controls
          </h1>

          {/* Effect Toggles */}
          <div style={controlGroupStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#ccc' }}>
              Effects
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#3a3a3a', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={staticEnabled}
                  onChange={(e) => setStaticEnabled(e.target.checked)}
                  style={checkboxStyle}
                />
                <div>
                  <div style={{ fontWeight: '500' }}>TV Static</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Retro noise overlay</div>
                </div>
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#3a3a3a', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={aberrationEnabled}
                  onChange={(e) => setAberrationEnabled(e.target.checked)}
                  style={checkboxStyle}
                />
                <div>
                  <div style={{ fontWeight: '500' }}>Chromatic Aberration</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>RGB channel separation</div>
                </div>
              </label>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#3a3a3a', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={scanlinesEnabled}
                  onChange={(e) => setScanlinesEnabled(e.target.checked)}
                  style={checkboxStyle}
                />
                <div>
                  <div style={{ fontWeight: '500' }}>Scanlines</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>CRT TV lines (hover for static)</div>
                </div>
              </label>
            </div>
          </div>

          {/* Intensity Controls */}
          <div style={controlGroupStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#ccc' }}>
              Intensity
            </h2>

            <div style={{ backgroundColor: '#3a3a3a', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: '500' }}>Static Intensity</label>
                <span style={{ fontSize: '12px', backgroundColor: '#555', padding: '4px 8px', borderRadius: '4px' }}>
                  {staticIntensity}
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={staticIntensity}
                onChange={(e) => setStaticIntensity(parseFloat(e.target.value))}
                style={sliderStyle}
                disabled={!staticEnabled}
              />
            </div>

            <div style={{ backgroundColor: '#3a3a3a', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: '500' }}>Aberration Intensity</label>
                <span style={{ fontSize: '12px', backgroundColor: '#555', padding: '4px 8px', borderRadius: '4px' }}>
                  {aberrationIntensity}px
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={aberrationIntensity}
                onChange={(e) => setAberrationIntensity(parseInt(e.target.value))}
                style={sliderStyle}
                disabled={!aberrationEnabled}
              />
            </div>

            <div style={{ backgroundColor: '#3a3a3a', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: '500' }}>Scanline Intensity</label>
                <span style={{ fontSize: '12px', backgroundColor: '#555', padding: '4px 8px', borderRadius: '4px' }}>
                  {scanlineIntensity.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={scanlineIntensity}
                onChange={(e) => setScanlineIntensity(parseFloat(e.target.value))}
                style={sliderStyle}
                disabled={!scanlinesEnabled}
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#ccc' }}>
              Quick Presets
            </h2>

            <button
              onClick={() => {
                setStaticEnabled(false);
                setAberrationEnabled(false);
                setScanlinesEnabled(false);
              }}
              style={buttonStyle}
            >
              No Effects
            </button>

            <button
              onClick={() => {
                setStaticEnabled(true);
                setAberrationEnabled(false);
                setScanlinesEnabled(true);
                setStaticIntensity(0.15);
                setScanlineIntensity(0.4);
              }}
              style={{...buttonStyle, backgroundColor: '#3182ce'}}
            >
              Retro TV
            </button>

            <button
              onClick={() => {
                setStaticEnabled(false);
                setAberrationEnabled(true);
                setScanlinesEnabled(false);
                setAberrationIntensity(3);
              }}
              style={{...buttonStyle, backgroundColor: '#805ad5'}}
            >
              Glitch Mode
            </button>

            <button
              onClick={() => {
                setStaticEnabled(true);
                setAberrationEnabled(true);
                setScanlinesEnabled(true);
                setStaticIntensity(0.2);
                setAberrationIntensity(4);
                setScanlineIntensity(0.6);
              }}
              style={{...buttonStyle, backgroundColor: '#e53e3e'}}
            >
              Maximum Chaos
            </button>
          </div>
        </div>

        {/* Right Panel - Demo Scene */}
        <div style={rightPanelStyle}>
          <DynamicOverlay
            tvStatic={staticEnabled}
            chromaticAberration={aberrationEnabled}
            scanlines={scanlinesEnabled}
            staticIntensity={staticIntensity}
            aberrationIntensity={aberrationIntensity}
            scanlineIntensity={scanlineIntensity}
          >
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px'
            }}>
              {/* Large centered image */}
              <div style={{
                position: 'relative',
                width: '80%',
                maxWidth: '900px',
                aspectRatio: '16/9'
              }}>
                <Image
                  src={exampleImage}
                  alt="Demo image for testing effects"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              {/* Title overlay */}
              <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                right: '40px',
                textAlign: 'center'
              }}>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  marginBottom: '16px'
                }}>
                  Dynamic Overlay Demo
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'white',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}>
                  Toggle effects to see chromatic aberration and TV static in action
                </p>
              </div>
            </div>
          </DynamicOverlay>
        </div>
      </div>
    </>
  );
};

export default OverlayTestPage;
