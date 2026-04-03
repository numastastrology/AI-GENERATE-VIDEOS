import React, { useEffect, useState } from 'react';
import { Loader2, Zap, Cpu, Sparkles, Binary, Activity, Target, Database } from 'lucide-react';
import './MockAIProcessing.css';

const MockAIProcessing = ({ title = "Processing", engine = "GAN (Adversarial)", onComplete }) => {
  const [step, setStep] = useState(0);
  const [stats, setStats] = useState({ gen: 0, disc: 0, loss: 1.0 });

  const steps = {
    'GAN (Adversarial)': [
      { text: "Initializing Generator and Discriminator...", icon: <Binary /> },
      { text: "Adversarial Training Iteration #2500...", icon: <Activity /> },
      { text: "Refining Photorealistic Skin Textures...", icon: <Target /> },
      { text: "Final High-Fidelity Synthesis...", icon: <Sparkles /> }
    ],
    'Stable Diffusion (Latent)': [
      { text: "Mapping Latent Space Coordinates...", icon: <Database /> },
      { text: "Forward Diffusion Noise Removal...", icon: <Binary /> },
      { text: "Reverse Diffusion Denoising Step #50...", icon: <Zap /> },
      { text: "VAE Decoding Final Image...", icon: <Sparkles /> }
    ],
    'Runway (Cinematic)': [
      { text: "Syncing with Gen-3 Alpha Cloud...", icon: <Cloud /> },
      { text: "Analyzing Temporal Vector Flow...", icon: <Binary /> },
      { text: "Neural Rendering Frame Sequence...", icon: <Activity /> },
      { text: "Cinematic Post-Process Finalizing...", icon: <Sparkles /> }
    ]
  }[engine] || [
    { text: "Analyzing semantic context...", icon: <Cpu /> },
    { text: "Structuring sequence timeline...", icon: <Loader2 /> },
    { text: "Injecting cinematic styling...", icon: <Zap /> },
    { text: "Finalizing prompt generation...", icon: <Sparkles /> }
  ];

  useEffect(() => {
    // Simulated stat updates
    const statInterval = setInterval(() => {
      setStats(prev => ({
        gen: Math.min(100, prev.gen + Math.random() * 5),
        disc: Math.min(100, prev.disc + Math.random() * 4),
        loss: Math.max(0.001, prev.loss - Math.random() * 0.05)
      }));
    }, 200);

    return () => clearInterval(statInterval);
  }, []);

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 2000); 
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => onComplete(), 1000);
    }
  }, [step, onComplete, steps.length]);

  return (
    <div className="processing-container glass-panel">
      <div className="processing-hud">
        <div className="hud-line top"></div>
        <div className="hud-main">
          {engine === 'GAN (Adversarial)' && (
            <div className="gan-stats">
              <div className="stat-unit">
                <span className="stat-label">GENERATOR</span>
                <div className="stat-bar"><div style={{width: `${stats.gen}%`}}></div></div>
                <span className="stat-value">{stats.gen.toFixed(1)}%</span>
              </div>
              <div className="stat-unit">
                <span className="stat-label">DISCRIMINATOR</span>
                <div className="stat-bar discriminator-bar"><div style={{width: `${stats.disc}%`}}></div></div>
                <span className="stat-value">{stats.disc.toFixed(1)}%</span>
              </div>
              <div className="stat-unit">
                <span className="stat-label">MINIMAX LOSS</span>
                <span className="stat-value loss-val">{stats.loss.toFixed(4)}</span>
              </div>
            </div>
          )}
          
          <div className="processing-central-visual">
            <div className="core-glow"></div>
            <div className={`visual-icon-container ${step >= steps.length ? 'complete' : ''}`}>
               {step < steps.length ? steps[step].icon : <Sparkles />}
            </div>
            <div className="scanning-line"></div>
          </div>

          <div className="processing-info">
            <h3 className="engine-name">{engine}</h3>
            <h2 className="title-text">{title}</h2>
            <div className="current-step">
              <div className="loading-spinner"><Loader2 className="spin-fast" size={14} /></div>
              <p>{step < steps.length ? steps[step].text : "Process Optimized."}</p>
            </div>
          </div>
        </div>
        <div className="hud-line bottom"></div>
      </div>

      <div className="advanced-logs">
        <div className="log-header">NEURAL_DEBUG_LOG_INIT</div>
        <div className="log-entries">
          <div className="log-row">{`[SYS] Engine: ${engine} active`}</div>
          <div className="log-row">{`[NET] Connection stable, bandwidth 1.2 GB/s`}</div>
          <div className="log-row">{`[PRC] Scene index ${Math.floor(step/2)+1} mapping...`}</div>
          {step > 1 && <div className="log-row">{`[TRN] Weight optimization complete`}</div>}
          {step > 2 && <div className="log-row">{`[VFX] High-fidelity layer injection started`}</div>}
        </div>
      </div>
    </div>
  );
};

// Mock Cloud icon since lucide-react might not have it in the expected list if imported directly
const Cloud = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5-1.1-2.9-3.9-5-7.1-5-3.3 0-6.2 2.2-7.1 5.3C1.7 10.9 0 12.8 0 15.1c0 2.4 2 4.4 4.4 4.4" />
  </svg>
);

export default MockAIProcessing;
