import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Play, Download, Settings, Volume2, VolumeX, Camera, Share2, CheckCircle } from 'lucide-react';
import './VideoPlayerView.css';

// ── 10-Scene cinematic technical sequence ───────────────────────────────────
const LOCAL_SCENE_SETS = {
  judo: [
    { id: 'sc1', label: 'ROUND 1 — The Challenge', url: '/judo_scene1.png', angle: 'pan-right', shot: 'Wide Establishing Shot', impact: false },
    { id: 'sc2', label: 'GRIP BATTLE — Tension', url: '/judo_scene4.png', angle: 'zoom-in', shot: 'Macro Close-Up Shot', impact: false },
    { id: 'sc3', label: 'HANI-GOSHI — Master Technique', url: '/judo_harai_goshi.png', angle: 'pull-back', shot: 'Harai Goshi Throw', impact: true },
    { id: 'sc4', label: 'UCHI-MATA — Pure Strength', url: '/judo_uchi_mata.png', angle: 'low-angle', shot: 'Uchi Mata Throw', impact: true },
    { id: 'sc5', label: 'TOMOE NAGE — Circle Throw', url: '/judo_tomoe_nage.png', angle: 'aerial', shot: 'Tomoe Nage Throw', impact: true },
    { id: 'sc6', label: 'CLIMAX — The 10th Throw', url: '/judo_scene2.png', angle: 'pan-left', shot: 'Tracking Shot', impact: false },
    { id: 'sc7', label: 'KATA GURUMA — Final Finish', url: '/judo_kata_guruma.png', angle: 'zoom-in', shot: 'Kata Guruma Slam', impact: true },
    { id: 'sc8', label: 'PRESSURE — Overhead View', url: '/judo_scene6.png', angle: 'aerial', shot: 'High Angle View', impact: false },
    { id: 'sc9', label: 'TRIUMPH — Hero stands Tall', url: '/judo_scene5.png', angle: 'low-angle', shot: 'Low Angle Hero', impact: false },
    { id: 'sc10', label: 'VICTORY — CHAMPION FOREVER', url: '/judo_victory_final.png', angle: 'zoom-out', shot: 'Cinematic Finale', impact: false },
  ],
};

// ── Scene builder ─────────────────────────────────────────────────────────────
const buildScenesFromPrompt = (ideaText = '', genre = 'Action') => {
  const text = ideaText.toLowerCase();
  const judoWords = ['judo', 'throw', 'tatami', 'grappl', 'ippon', 'fight', 'combat', 'martial', 'wrestl', 'competition', 'russian'];
  if (judoWords.some(w => text.includes(w))) return LOCAL_SCENE_SETS.judo;

  // Unsplash fallback
  const keywordMap = [
    { words: ['boxing', 'punch', 'ring'], query: 'professional boxing match ring crowd' },
    { words: ['rain', 'storm'], query: 'cinematic rain storm night street' },
    { words: ['forest', 'jungle'], query: 'cinematic dark forest moody lighting' },
    { words: ['city', 'street', 'urban'], query: 'cinematic city street neon night' },
    { words: ['ocean', 'sea', 'beach'], query: 'cinematic ocean waves dramatic sunset' },
    { words: ['romance', 'love'], query: 'romantic couple golden hour cinematic' },
    { words: ['horror', 'dark', 'ghost'], query: 'dark horror cinematic atmospheric' },
    { words: ['space', 'galaxy'], query: 'space galaxy stars cinematic' },
  ];
  let matchedQuery = null;
  for (const k of keywordMap) {
    if (k.words.some(w => text.includes(w))) { matchedQuery = k.query; break; }
  }
  const genreMap = {
    Action: 'cinematic action hero silhouette dramatic',
    Romance: 'romantic couple cinematic golden hour',
    Horror: 'dark horror cinematic atmospheric',
    Emotional: 'emotional cinematic portrait dramatic lighting',
    Song: 'cinematic music performance stage spotlight',
    'Sci-Fi': 'science fiction futuristic city cinematic',
  };
  matchedQuery = matchedQuery || genreMap[genre] || 'cinematic dramatic action scene';

  const angles = ['zoom-in','pull-back','pan-right','low-angle','aerial','zoom-out'];
  return [42, 77, 15, 88, 31, 55].map((seed, i) => ({
    id: `uns-${seed}`,
    label: ['Opening Sequence','Tension Build','High Angle View','Close Combat','Low Hero Shot','Final Resolution'][i],
    url: `https://source.unsplash.com/1280x720/?${encodeURIComponent(matchedQuery)}&sig=${seed}`,
    angle: angles[i],
    shot: 'Dynamic Angle',
    impact: i % 2 === 0,
  }));
};

// ── Particle canvas ───────────────────────────────────────────────────────────
const useParticleCanvas = (canvasRef, isPlaying) => {
  const rafRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.4 + 0.05,
      color: Math.random() > 0.6 ? '255, 140, 0' : Math.random() > 0.5 ? '0, 210, 255' : '255, 255, 255',
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!isPlaying) return;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasRef, isPlaying]);
};

// ── EPIC Multi-layer Web Audio soundtrack ─────────────────────────────────────
const useEpicAudio = (isPlaying, isMuted, sceneIndex, totalScenes) => {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);

  const stopAll = useCallback(() => {
    nodesRef.current.forEach(n => { try { n.stop(0); } catch (_) {} });
    nodesRef.current = [];
  }, []);

  const createOsc = (ctx, type, freq, gainVal, startDelay = 0, duration = null) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + startDelay + 0.5);
    if (duration) gain.gain.linearRampToValueAtTime(0, ctx.currentTime + startDelay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startDelay);
    if (duration) osc.stop(ctx.currentTime + startDelay + duration + 0.1);
    nodesRef.current.push(osc);
    return { osc, gain };
  };

  const createNoise = (ctx, gainVal, filterFreq = 200, startDelay = 0, duration = 0.08) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainVal, ctx.currentTime + startDelay);
    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    source.start(ctx.currentTime + startDelay);
    nodesRef.current.push(source);
  };

  useEffect(() => {
    if (!isPlaying || isMuted) { stopAll(); return; }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!ctxRef.current || ctxRef.current.state === 'closed') ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    stopAll();

    const progress = sceneIndex / Math.max(totalScenes - 1, 1); // 0 to 1

    // ── Layer 1: Bass drone (deepening as fight progresses)
    const bassFreq = 55 + progress * 30;
    createOsc(ctx, 'sawtooth', bassFreq, 0.018);
    createOsc(ctx, 'sawtooth', bassFreq * 2, 0.010);

    // ── Layer 2: String pads (tension chords)
    const chordRoot = [220, 247, 262, 294, 330, 349][sceneIndex % 6];
    createOsc(ctx, 'triangle', chordRoot, 0.020);
    createOsc(ctx, 'triangle', chordRoot * 1.25, 0.012);
    createOsc(ctx, 'triangle', chordRoot * 1.5, 0.008);

    // ── Layer 3: Brass pulse stabs (rhythmic, strong on action scenes)
    if (sceneIndex >= 1) {
      const brassFreq = [196, 220, 246, 261, 293, 329][sceneIndex % 6];
      const brassGain = 0.015 + progress * 0.02;
      for (let beat = 0; beat < 8; beat++) {
        const beatTime = beat * 0.75;
        createOsc(ctx, 'sawtooth', brassFreq, brassGain, beatTime, 0.25);
        createOsc(ctx, 'sawtooth', brassFreq * 2, brassGain * 0.5, beatTime, 0.25);
      }
    }

    // ── Layer 4: Taiko drum hits (percussive impact on action scenes)
    if (sceneIndex >= 2) {
      const drumPattern = [0, 0.5, 1.0, 1.0, 1.5, 2.0, 2.25, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.25, 5.5];
      drumPattern.forEach((t, i) => {
        const intensity = 0.3 + progress * 0.4;
        createNoise(ctx, intensity * (i % 4 === 0 ? 1 : 0.5), 80 + (i % 3) * 40, t, 0.12);
      });
    }

    // ── Layer 5: Victory swell on final scene
    if (sceneIndex === totalScenes - 1) {
      const fanfareFreqs = [523, 659, 784, 1047];
      fanfareFreqs.forEach((f, i) => {
        createOsc(ctx, 'triangle', f, 0.015, i * 0.15, 2.0);
      });
      createOsc(ctx, 'sine', 130, 0.025, 0, 3);
    }

    return stopAll;
  }, [isPlaying, isMuted, sceneIndex, totalScenes, stopAll]);
};

// ── Main Component ────────────────────────────────────────────────────────────
const VideoPlayerView = ({ formData, onBack }) => {
  const {
    ideaText = '',
    genre = 'Action',
    heroImageUrl = null,
    heroName = 'Lead Protagonist',
    aspectRatio = '16:9',
  } = formData || {};
  const heroSrc = heroImageUrl || '/demo_hero.jpg';

  const cssAspectRatio = aspectRatio === '2.39:1' ? '2.39 / 1'
    : aspectRatio === '16:9' ? '16 / 9'
    : aspectRatio === '4:3'  ? '4 / 3'
    : aspectRatio === '9:16' ? '9 / 16'
    : '16 / 9';

  const scenes = buildScenesFromPrompt(ideaText, genre);
  const SCENE_DURATION = 8;
  const TOTAL_DURATION = scenes.length * SCENE_DURATION;

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const canvasRef = useRef(null);

  const activeScene = Math.min(Math.floor(elapsed / SCENE_DURATION), scenes.length - 1);
  const sceneLabel = scenes[activeScene]?.label || '';
  const shotType  = scenes[activeScene]?.shot  || '';
  const angleClass = scenes[activeScene]?.angle || 'zoom-in';
  const isImpact = scenes[activeScene]?.impact || false;

  useParticleCanvas(canvasRef, isPlaying);
  useEpicAudio(isPlaying, isMuted, activeScene, scenes.length);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setElapsed(prev => prev >= TOTAL_DURATION ? 0 : prev + 0.25);
    }, 250);
    return () => clearInterval(timer);
  }, [isPlaying, TOTAL_DURATION]);

  const formatTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const downloadFrame = (url, label) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `rk_judo_${label.replace(/\s+/g, '_').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="video-player-container">
      {/* Header */}
      <div className="result-header">
        <button className="btn-icon-back" onClick={onBack}>
          <ArrowLeft size={20} /> Back to Editor
        </button>
        <h2 className="gradient-text">Live Competition Broadcast</h2>
      </div>

      {/* Cinema Screen with Broadcast Effects */}
      <div className={`cinema-screen glass-panel ${isImpact ? 'impact-shake' : ''}`} style={{ aspectRatio: cssAspectRatio }}>
        <div className="screen-wrapper">
          <div className="cinematic-bars bar-top" />

          {/* Dynamic scenes with per-angle Ken Burns */}
          {scenes.map((scene, i) => (
            <div
              key={i}
              className={`scene ${activeScene === i ? 'active' : ''} scene-angle-${scene.angle}`}
              style={{ backgroundImage: `url('${scene.url}')` }}
            />
          ))}

          {/* Broadcast Live Overlays */}
          <div className="broadcast-overlay">
            <div className="live-tag">
              <div className="rec-dot" />
              <span>LIVE</span>
            </div>
            <div className="broadcast-info">
              <div className="broadcast-clock">{formatTime(elapsed)}</div>
              <div className="camera-id">CAM-0{activeScene + 1}</div>
            </div>
            {/* Scanlines / Grain */}
            <div className="scanlines" />
            <div className="film-grain" />
          </div>

          {/* Particle canvas overlay */}
          <canvas ref={canvasRef} className="particle-canvas" width={1280} height={720} />

          {/* Vignette */}
          <div className="video-overlay-gradient" />

          {/* Shot type badge top-left */}
          <div className="shot-type-badge">🎥 {shotType}</div>

          {/* Scene label top-center */}
          <div className="scene-label-badge">{sceneLabel}</div>

          <div className="cinematic-bars bar-bottom" />

          {/* Controls */}
          <div className="video-controls">
            <button className="control-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <span className="pause-icon">||</span> : <Play size={22} />}
            </button>

            <div className="progress-bar-container" onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              setElapsed(pct * TOTAL_DURATION);
            }}>
              <div className="progress-bar-fill" style={{ width: `${(elapsed / TOTAL_DURATION) * 100}%` }} />
            </div>

            <span className="time-display">{formatTime(elapsed)} / {formatTime(TOTAL_DURATION)}</span>

            <button className="control-btn" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button className="control-btn"><Settings size={18} /></button>
          </div>
        </div>
      </div>

      {/* Frame Selection Gallery */}
      <div className="technical-gallery-container glass-panel">
        <div className="gallery-header">
          <h3><Camera size={18} /> Technical Frame Selection</h3>
          <span className="gallery-count">{scenes.length} THROW ANALYSES</span>
        </div>
        <div className="gallery-grid">
          {scenes.map((scene, i) => (
            <div 
              key={i} 
              className={`gallery-card ${activeScene === i ? 'highlight' : ''}`}
              onClick={() => setElapsed(i * SCENE_DURATION)}
            >
              <div 
                className="gallery-thumb" 
                style={{ backgroundImage: `url('${scene.url}')` }}
              >
                <button 
                  className="frame-download-btn" 
                  onClick={(e) => { e.stopPropagation(); downloadFrame(scene.url, scene.label); }}
                  title="Download Photo"
                >
                  <Download size={14} />
                </button>
                {activeScene === i && <div className="now-playing-tag">PLAYING</div>}
              </div>
              <div className="gallery-label">{scene.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info row */}
      <div className="video-info-row">
        <div className="genre-tag"><span>🎬</span> {genre}</div>
        <p className="prompt-recap">{ideaText}</p>
      </div>

      {/* Actions */}
      <div className="video-actions">
        <button className="btn-primary download-btn">
          <Download size={18} /> Download Broadcast (MP4 HD)
        </button>
        <button className="btn-secondary">
          <Share2 size={16} /> Export Sequence Pack
        </button>
      </div>
    </div>
  );
};

export default VideoPlayerView;
