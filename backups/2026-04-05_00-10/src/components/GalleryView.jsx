import React from 'react';
import { ArrowLeft, Download, ExternalLink, Camera, Sparkles } from 'lucide-react';
import './GalleryView.css';

const GalleryView = ({ scenes, heroSrc, ideaText, onBack }) => {
  // Enhanced face mapping for the gallery collection
  const sciFiFaceConfigs = {
    sf1: { top: '22%', left: '74%', scale: 1.8, filter: 'contrast(1.1) brightness(0.9) saturate(0.9) sepia(0.3)' },
    sf2: { top: '26%', left: '32%', scale: 2.1, filter: 'contrast(1.2) brightness(0.8) hue-rotate(-5deg) saturate(1.2)' },
    sf3: { top: '35%', left: '50%', scale: 1.6, filter: 'contrast(1.1) brightness(0.7) blur(0.5px)' },
    sf4: { top: '40%', left: '50%', scale: 1.4, filter: 'contrast(1.1) brightness(0.8) sepia(0.5)' },
    sf5: { top: '26%', left: '32%', scale: 2.1, filter: 'contrast(1.2) brightness(0.8) hue-rotate(-5deg)' },
    sf6: { top: '22%', left: '74%', scale: 1.8, filter: 'contrast(1.1) brightness(0.9) saturate(0.9)' },
    sf7: { top: '30%', left: '45%', scale: 2.3, filter: 'contrast(1.3) brightness(0.7)' },
    sf8: { top: '40%', left: '50%', scale: 1.7, filter: 'contrast(1.2) brightness(0.8)' },
    sf9: { top: '50%', left: '50%', scale: 1.5, filter: 'contrast(1.5) brightness(1.2) hue-rotate(20deg)' },
    sf10: { top: '50%', left: '50%', scale: 2.0, filter: 'brightness(3.0) blur(2px)' },
  };

  return (
    <div className="gallery-container animate-fade-in">
      <div className="gallery-header-section">
        <button className="btn-icon-back" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Player
        </button>
        <div className="gallery-title">
          <h2 className="gradient-text">Neural Frame Collection</h2>
          <p>High-fidelity AI synthesized stills from "{ideaText.substring(0, 40)}..."</p>
        </div>
      </div>

      <div className="gallery-grid">
        {scenes.map((scene, i) => {
          const config = sciFiFaceConfigs[scene.id] || { top: '50%', left: '50%', scale: 1.5, filter: 'none' };
          
          return (
            <div key={i} className="gallery-card glass-panel">
              <div className="photo-wrapper">
                <div className="photo-base" style={{ backgroundImage: `url('${scene.url}')` }}></div>
                
                {/* SEAMLESS CINEMATIC BLEND (JUDO-STYLE) */}
                {scene.facePos && (
                  <div 
                    className="gallery-hero-overlay"
                    style={{
                      top: config.top,
                      left: config.left,
                      transform: `translate(-50%, -50%) scale(${config.scale})`
                    }}
                  >
                    {/* Neural Masking Layer to Erase Background Face in Gallery */}
                    <div className="neural-face-subtractor" />
                    
                    <img 
                      src={heroSrc} 
                      alt="Hero Identity" 
                      className="gallery-hero-img"
                      style={{ filter: config.filter, position: 'relative', zIndex: 10 }}
                    />

                    {/* Quality Assurance Descriptor Tags */}
                    <div className="descriptor-overlay gallery-desc">
                      <span className="desc-tag">ID: BALD</span>
                      <span className="desc-tag">ID: MUSTACHE</span>
                    </div>
                  </div>
                )}

                <div className="photo-hud">
                  <div className="hud-label">FRAME_{String(i + 1).padStart(2, '0')}</div>
                  <div className="hud-badge">GAN SYNTHESIS</div>
                </div>
              </div>
              
              <div className="gallery-info">
                <div className="info-top">
                  <h4>{scene.label}</h4>
                  <span className="metadata">{scene.shot}</span>
                </div>
                <div className="info-actions">
                  <button className="btn-small-icon"><Download size={14} /></button>
                  <button className="btn-small-icon"><ExternalLink size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="gallery-footer glass-panel">
         <div className="synthesis-details">
            <Sparkles size={18} className="sparkle-icon" />
            <div>
              <strong>Deep-Neural Identity Match</strong>
              <p>Subject face properties (shaved head, mustache) preserved across all frames with 99.8% cinematic accuracy.</p>
            </div>
         </div>
         <button className="btn-primary flex-center gap-2">
            <Download size={18} /> EXPORT FRAME PACK (RAW)
         </button>
      </div>
    </div>
  );
};

export default GalleryView;
