import React from 'react';
import { Shield, Zap, Cloud, Cpu, Globe, Lock, Info } from 'lucide-react';
import './EngineHub.css';

const ENGINES = [
  {
    id: 'GAN (Adversarial)',
    name: 'GAN Adversarial',
    description: 'Breakthrough Generator-Discriminator architecture for hyper-realistic face synthesis.',
    icon: <Shield className="engine-icon gan" />,
    features: ['Offline (Z Image)', 'Unlimited locally', 'No Watermark'],
    bestFor: 'Private, High-Fidelity Portraits',
    adversarial: true
  },
  {
    id: 'Stable Diffusion (Latent)',
    name: 'Stable Diffusion',
    description: 'Open-source Latent Diffusion Model (LDM) for maximum stylistic control.',
    icon: <Cpu className="engine-icon sd" />,
    features: ['GPU Accelerated', 'Local Setup', 'Customizable'],
    bestFor: 'Stylized & Artistic Concepts'
  },
  {
    id: 'Runway (Cinematic)',
    name: 'Runway Gen-3',
    description: 'Cloud-based cinematic neural video engine for professional storytelling.',
    icon: <Cloud className="engine-icon runway" />,
    features: ['Fast Rendering', 'Storytelling focus', 'Editing Suite'],
    bestFor: 'Marketing & Cinematic Trailers'
  }
];

const EngineHub = ({ onSelect }) => {
  return (
    <div className="engine-hub-container animate-fade-in">
      <div className="hub-header">
        <h2 className="gradient-text">Select Neural Engine</h2>
        <p className="subtitle">Choose the AI architecture to power your cinematic generation.</p>
      </div>

      <div className="engine-grid">
        {ENGINES.map((engine) => (
          <div 
            key={engine.id} 
            className={`engine-card glass-panel ${engine.adversarial ? 'adversarial-glow' : ''}`}
            onClick={() => onSelect(engine.id)}
          >
            <div className="card-header">
              {engine.icon}
              <h3>{engine.name}</h3>
            </div>
            
            <p className="engine-desc">{engine.description}</p>
            
            <ul className="feature-list">
              {engine.features.map((f, i) => (
                <li key={i}><Zap size={14} /> {f}</li>
              ))}
            </ul>

            <div className="engine-footer">
              <span className="best-for-label">Best Use:</span>
              <span className="best-for-value">{engine.bestFor}</span>
            </div>

            <div className="selection-overlay">
              <button className="btn-primary">Initialize Engine</button>
            </div>
          </div>
        ))}
      </div>

      <div className="knowledge-base glass-panel">
        <div className="kb-header">
          <Info size={18} />
          <h4>AI Architecture Comparison</h4>
        </div>
        <table className="kb-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Offline?</th>
              <th>Limits</th>
              <th>Best Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Z Image (GAN)</strong></td>
              <td>Yes</td>
              <td>Unlimited</td>
              <td>Private/Offline</td>
            </tr>
            <tr>
              <td><strong>Stable Diffusion</strong></td>
              <td>Yes</td>
              <td>Unlimited</td>
              <td>Developers</td>
            </tr>
            <tr>
              <td><strong>Runway Gen-3</strong></td>
              <td>No</td>
              <td>Limited Credits</td>
              <td>Storytelling</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EngineHub;
