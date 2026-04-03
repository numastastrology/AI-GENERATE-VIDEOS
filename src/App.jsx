import React, { useState } from 'react';
import PromptForm from './components/PromptForm';
import MockAIProcessing from './components/MockAIProcessing';
import ResultView from './components/ResultView';
import VideoPlayerView, { buildScenesFromPrompt } from './components/VideoPlayerView';
import GalleryView from './components/GalleryView';
import { parsePromptToMockJSON } from './utils/mockGenerator';
import './App.css';

import EngineHub from './components/EngineHub';

function App() {
  // 'form', 'engine_selection', 'processing_json', 'result', 'generating_video', 'video_playback', 'gallery'
  const [view, setView] = useState('form'); 
  const [formData, setFormData] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState('GAN (Adversarial)');
  const [generatedPrompt, setGeneratedPrompt] = useState(null);

  const handleGenerateStart = (data) => {
    setFormData(data);
    setView('engine_selection');
  };

  const handleEngineSelect = (engineId) => {
    setSelectedEngine(engineId);
    setView('processing_json');
  };

  const handleJsonGenerationComplete = () => {
    const jsonOutput = parsePromptToMockJSON(
      formData.ideaText, 
      formData.duration, 
      formData.genre, 
      formData.includeHero,
      formData.heroName,
      formData.aspectRatio,
      selectedEngine
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
        <p className="engine-badge">{selectedEngine} Active</p>
      </header>

      <main className="app-main">
        {view === 'form' && <PromptForm onGenerate={handleGenerateStart} />}
        {view === 'engine_selection' && <EngineHub onSelect={handleEngineSelect} />}
        {view === 'processing_json' && (
          <MockAIProcessing 
            title="Initializing Neural Matrix" 
            engine={selectedEngine}
            onComplete={handleJsonGenerationComplete} 
          />
        )}
        {view === 'result' && (
          <ResultView 
            promptData={generatedPrompt} 
            onBack={() => setView('form')} 
            onGenerateVideo={handleGenerateVideoClicked} 
          />
        )}
        {view === 'generating_video' && (
          <MockAIProcessing 
            title="Rendering Hyper-Realistic Frames" 
            engine={selectedEngine}
            onComplete={handleVideoGenerationComplete} 
          />
        )}
        {view === 'video_playback' && (
          <VideoPlayerView 
            formData={formData} 
            onBack={handleReset} 
            onOpenGallery={() => setView('gallery')}
          />
        )}
        {view === 'gallery' && (
          <GalleryView 
            scenes={buildScenesFromPrompt(formData.ideaText, formData.genre)}
            heroSrc={formData.heroImageUrl || '/demo_hero.jpg'}
            ideaText={formData.ideaText}
            onBack={() => setView('video_playback')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Advanced Neural Synthesis & Adversarial Refinement</p>
      </footer>
    </div>
  );
}

export default App;
