import React, { useState } from 'react';
import { Copy, Check, Download, ArrowLeft, Play, Binary } from 'lucide-react';
import './ResultView.css';

import { Cpu, Shield, Zap, Info } from 'lucide-react';

const ResultView = ({ promptData, onBack, onGenerateVideo }) => {
  const [copied, setCopied] = useState(false);
  const [editableJson, setEditableJson] = useState(JSON.stringify(promptData, null, 2));

  const handleCopy = () => {
    navigator.clipboard.writeText(editableJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const engineInfo = promptData.engine_metadata || {};

  return (
    <div className="result-container animate-fade-in">
      <div className="result-header">
        <button className="btn-icon-back" onClick={onBack}>
          <ArrowLeft size={18} /> Edit Idea
        </button>
        <h2 className="gradient-text">Neural Manifest Confirmed</h2>
        <p className="subtitle">Review the structured sequence and neural architecture parameters.</p>
      </div>

      <div className="result-layout">
        <div className="code-panel glass-panel">
          <div className="code-header">
            <div className="flex-center gap-2">
              <Binary size={16} />
              <span>manifest_v3.json</span>
            </div>
            <div className="code-actions">
              <button onClick={handleCopy} className="action-btn">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="code-content">
            <textarea 
              value={editableJson}
              onChange={(e) => setEditableJson(e.target.value)}
              className="json-textarea"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="architecture-sidebar glass-panel">
          <div className="side-header">
            <Cpu size={18} />
            <h4>Neural Architecture</h4>
          </div>
          
          <div className="arch-item">
            <label>ENGINE</label>
            <span>{promptData.ai_engine}</span>
          </div>

          <div className="arch-item">
            <label>ARCHITECTURE</label>
            <span>{engineInfo.architecture || 'Standard Diffusion'}</span>
          </div>

          <div className="arch-item">
            <label>STRENGTHS</label>
            <div className="tag-cloud">
              {(engineInfo.strengths || []).map((s, i) => (
                <span key={i} className="arch-tag">{s}</span>
              ))}
            </div>
          </div>

          <div className="arch-item">
            <label>META-OPTIMIZATION</label>
            <div className="meta-details">
              {engineInfo.adversarial_params ? (
                <>
                  <div className="meta-line">Loss: {engineInfo.adversarial_params.loss_function}</div>
                  <div className="meta-line">Confidence: {engineInfo.adversarial_params.discriminator_confidence_threshold * 100}%</div>
                </>
              ) : (
                <div className="meta-line">Standard Latent Denoising</div>
              )}
            </div>
          </div>

          <div className="arch-note">
             <Info size={14} />
             <p>Optimized for {promptData.aspect_ratio?.selected} cinematic output.</p>
          </div>
        </div>
      </div>

      <div className="export-actions">
        <button 
          className="btn-primary flex-center gap-2 generate-btn" 
          onClick={onGenerateVideo}
        >
          <Play size={20} fill="currentColor" /> 
          EXECUTE NEURAL RENDERING
        </button>
      </div>
    </div>
  );
};

export default ResultView;
