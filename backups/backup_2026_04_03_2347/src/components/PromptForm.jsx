import React, { useState } from 'react';
import { Upload, Film, Clock, AlignLeft } from 'lucide-react';
import './PromptForm.css';

const PromptForm = ({ onGenerate }) => {
  const [idea, setIdea] = useState('');
  const [duration, setDuration] = useState(3);
  const [genre, setGenre] = useState('Action');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [heroImageUrl, setHeroImageUrl] = useState('/demo_hero.jpg');
  const [heroName, setHeroName] = useState('RAJAGOPAL KANNAN');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setHeroImageUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    onGenerate({ ideaText: idea, duration, genre, aspectRatio, includeHero: !!heroImageUrl, heroImageUrl, heroName: heroName.trim() || 'Lead Protagonist' });
  };

  return (
    <div className="glass-panel form-container">
      <div className="form-header">
        <h2><Film className="icon" /> Video Architect</h2>
        <p className="subtitle">Design your cinematic sequence</p>
      </div>

      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="form-group">
          <label><AlignLeft size={16} /> Prompt Idea</label>
          <textarea 
            placeholder="E.g., A fight sequence between the hero and 3 smugglers late at night..."
            rows="5"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label><Clock size={16} /> Duration (minutes)</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>

          <div className="form-group half">
            <label>Genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="Action">Action</option>
              <option value="Romance">Romance</option>
              <option value="Horror">Horror</option>
              <option value="Emotional">Emotional</option>
              <option value="Song">Song Sequence</option>
              <option value="Sci-Fi">Sci-Fi</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Aspect Ratio</label>
          <div className="aspect-ratio-group">
            {[
              { value: '16:9',   label: '16:9',   sub: 'Widescreen HD' },
              { value: '2.39:1', label: '2.39:1', sub: 'Cinematic' },
              { value: '4:3',    label: '4:3',    sub: 'Classic' },
              { value: '9:16',   label: '9:16',   sub: 'Vertical Reels' },
            ].map(ar => (
              <button
                type="button"
                key={ar.value}
                className={`ar-btn ${aspectRatio === ar.value ? 'ar-active' : ''}`}
                onClick={() => setAspectRatio(ar.value)}
              >
                <span className="ar-ratio">{ar.label}</span>
                <span className="ar-sub">{ar.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group upload-group">
          <label>Hero/Protagonist Reference Image</label>
          <div className={`upload-zone ${heroImageUrl ? 'uploaded' : ''}`}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-label">
              {heroImageUrl ? (
                <div className="hero-preview">
                  <img src={heroImageUrl} alt="Hero Reference" className="hero-thumb" />
                  <span className="hero-preview-label">✓ Hero Image Ready — Click to Change</span>
                </div>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Click to upload character photo</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>🎥 Hero Name</label>
          <input
            type="text"
            placeholder="e.g. RAJAGOPAL KANNAN"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            className="hero-name-input"
          />
        </div>

        <button type="submit" className="btn-primary submit-btn">
          Generate Master Prompt
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
