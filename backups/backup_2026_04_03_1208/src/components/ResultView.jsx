import React, { useState } from 'react';
import { Copy, Check, Download, ArrowLeft, Play } from 'lucide-react';
import './ResultView.css';

const ResultView = ({ promptData, onBack, onGenerateVideo }) => {
  const [copied, setCopied] = useState(false);
  const [editableJson, setEditableJson] = useState(JSON.stringify(promptData, null, 2));

  const handleCopy = () => {
    navigator.clipboard.writeText(editableJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(editableJson);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "cinematic_prompt.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <button className="btn-icon-back" onClick={onBack}>
          <ArrowLeft size={20} /> Edit Idea
        </button>
        <h2 className="gradient-text">Review and Confirm Prompt</h2>
        <p className="subtitle">You can edit the structured JSON before generating the final video.</p>
      </div>

      <div className="code-panel glass-panel" style={{ flex: 1, minHeight: '400px' }}>
        <div className="code-header">
          <span>generated_prompt.json</span>
          <div className="code-actions">
            <button onClick={handleCopy} className="action-btn">
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
            <button onClick={handleDownloadJSON} className="action-btn text-accent">
              <Download size={16} /> Export JSON
            </button>
          </div>
        </div>
        <div className="code-content" style={{ padding: 0 }}>
          <textarea 
            value={editableJson}
            onChange={(e) => setEditableJson(e.target.value)}
            style={{
              width: '100%',
              height: '400px',
              backgroundColor: '#0a0a0a',
              color: '#00d2ff',
              fontFamily: 'Courier New, Courier, monospace',
              fontSize: '0.9rem',
              border: 'none',
              padding: '20px',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div className="export-actions">
        <button 
          className="btn-primary flex-center gap-2" 
          onClick={onGenerateVideo}
          style={{ padding: '16px 32px', fontSize: '1.2rem', width: '100%' }}
        >
          <Play size={24} /> Confirm Prompt & Generate Video (Veo 3 / Seedance)
        </button>
      </div>
    </div>
  );
};

export default ResultView;
