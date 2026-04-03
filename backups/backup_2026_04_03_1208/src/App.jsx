import React, { useState } from 'react';
import PromptForm from './components/PromptForm';
import MockAIProcessing from './components/MockAIProcessing';
import ResultView from './components/ResultView';
import VideoPlayerView from './components/VideoPlayerView';
import { parsePromptToMockJSON } from './utils/mockGenerator';
import './App.css';

function App() {
  // 'form', 'processing_json', 'result', 'generating_video', 'video_playback'
  const [view, setView] = useState('form'); 
  const [formData, setFormData] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);

  const handleGenerateStart = (data) => {
    setFormData(data);
    setView('processing_json');
  };

  const handleJsonGenerationComplete = () => {
    const jsonOutput = parsePromptToMockJSON(
      formData.ideaText, 
      formData.duration, 
      formData.genre, 
      formData.includeHero,
      formData.heroName,
      formData.aspectRatio
    );
    setGeneratedPrompt(jsonOutput);
    setView('result');
  };

  const handleGenerateVideoClicked = () => {
    setView('generating_video');
  };

  const handleVideoGenerationComplete = () => {
    setView('video_playback');
  };

  const handleReset = () => {
    setView('form');
    setFormData(null);
    setGeneratedPrompt(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="gradient-text">ANTENNA</h1>
        <p>AI Cinematic Prompt Engineer</p>
      </header>

      <main className="app-main">
        {view === 'form' && <PromptForm onGenerate={handleGenerateStart} />}
        {view === 'processing_json' && <MockAIProcessing title="Generating Prompt Array" onComplete={handleJsonGenerationComplete} />}
        {view === 'result' && <ResultView promptData={generatedPrompt} onBack={() => setView('form')} onGenerateVideo={handleGenerateVideoClicked} />}
        {view === 'generating_video' && <MockAIProcessing title="Generating AI Video using Veo 3 Engine" onComplete={handleVideoGenerationComplete} />}
        {view === 'video_playback' && <VideoPlayerView formData={formData} onBack={handleReset} />}
      </main>

      <footer className="app-footer">
        <p>Powered by Advanced NLP & Cinematic Intelligence</p>
      </footer>
    </div>
  );
}

export default App;
