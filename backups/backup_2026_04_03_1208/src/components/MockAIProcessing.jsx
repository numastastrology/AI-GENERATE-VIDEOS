import React, { useEffect, useState } from 'react';
import { Loader2, Zap, Cpu, Sparkles } from 'lucide-react';
import './MockAIProcessing.css';

const MockAIProcessing = ({ title = "Generating AI Sequence", onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Analyzing semantic context...", icon: <Cpu className="spin-slow" /> },
    { text: "Structuring sequence timeline...", icon: <Loader2 className="spin-fast" /> },
    { text: "Injecting cinematic styling...", icon: <Zap className="pulse-fast" /> },
    { text: "Finalizing prompt generation...", icon: <Sparkles className="pulse-slow" /> }
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 1500); // 1.5s per imaginary step
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => onComplete(), 500);
    }
  }, [step, onComplete, steps.length]);

  return (
    <div className="processing-container glass-panel">
      <div className="processing-rings">
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
        <div className="ring ring-3"></div>
        <div className="center-icon">
          {step < steps.length ? steps[step].icon : <Sparkles />}
        </div>
      </div>
      
      <div className="processing-text">
        <h3 className="gradient-text">{title}</h3>
        <p>{step < steps.length ? steps[step].text : "Generation Complete!"}</p>
      </div>

      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${(step / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MockAIProcessing;
