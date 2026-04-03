import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Play, Download, Settings, Volume2, VolumeX, Camera, Share2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
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
    { id: 'sc10', label: 'VICTORY — CHAMPION FOREVER', url: '/judo_victory_final.png', angle: 'zoom-out', shot: 'Cinematic Finale', impact: false },
  ],
  sciFi: [
    { id: 'sf1', label: 'PHASE 1 — Ceiba Tree Hunter', url: '/scifi_action.png', angle: 'pan-right', shot: 'Predator Perspective stalk', action: 'stalk', facePos: { top: '22%', left: '74%' } },
    { id: 'sf2', label: 'PHASE 1 — Thermal Lock-on', url: '/scifi_faceoff.png', angle: 'zoom-in', shot: 'Plasma Caster HUD', action: 'strike', facePos: { top: '26%', left: '32%' } },
    { id: 'sf3', label: 'PHASE 1 — Counter-Blast', url: '/scifi_alien.png', angle: 'low-angle', shot: 'Cloak Flicker VFX', impact: true, action: 'stalk', facePos: { top: '35%', left: '50%' } },
    { id: 'sf4', label: 'PHASE 2 — Mud Stealth', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1280&q=80', angle: 'aerial', shot: 'Guerrilla Tactics hide', action: 'stalk', facePos: { top: '40%', left: '50%' } },
    { id: 'sf5', label: 'PHASE 2 — Green Blood Trail', url: '/scifi_faceoff.png', angle: 'zoom-in', shot: 'Predator Injury Neon Green', impact: true, action: 'grapple', facePos: { top: '26%', left: '32%' } },
    { id: 'sf6', label: 'PHASE 3 — Honorable Kill', url: '/scifi_action.png', angle: 'zoom-out', shot: 'Final Face-Off Challenge', action: 'victory', facePos: { top: '22%', left: '74%' } },
    { id: 'sf7', label: 'PHASE 3 — The Struggle', url: '/scifi_faceoff.png', angle: 'close-up', shot: 'Wrist Blade Force', action: 'grapple', facePos: { top: '30%', left: '45%' } },
    { id: 'sf8', label: 'PHASE 3 — Helmet Crack', url: '/scifi_alien.png', angle: 'low-angle', shot: 'Stone Impact Resolution', impact: true, action: 'strike', facePos: { top: '40%', left: '50%' } },
    { id: 'sf9', label: 'AFTERMATH — Self Destruct', url: 'https://images.unsplash.com/photo-146233194002ea-74075b6cc35a?auto=format&fit=crop&w=1280&q=80', angle: 'zoom-out', shot: 'Glowing Symbols Flicker', action: 'stalk', facePos: { top: '50%', left: '50%' } },
    { id: 'sf10', label: 'AFTERMATH — Blinding Light', url: 'https://images.unsplash.com/photo-1528722828814-77b9b834b22f?auto=format&fit=crop&w=1280&q=80', angle: 'aerial', shot: 'Charred Jungle Crater', action: 'victory', facePos: { top: '50%', left: '50%' } },
  ],
};

export const buildScenesFromPrompt = (ideaText = '', genre = 'Action') => {
  const text = ideaText.toLowerCase();
  const judoWords = ['judo', 'throw', 'tatami', 'grappl', 'ippon', 'fight', 'combat', 'martial', 'wrestl', 'competition', 'russian'];
  const sciFiWords = ['alien', 'creature', 'monster', 'futuristic', 'cyber', 'space', 'galaxy', 'sci-fi'];

  if (sciFiWords.some(w => text.includes(w)) || genre === 'Sci-Fi') return LOCAL_SCENE_SETS.sciFi;
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
    Action: 'cinematic action hero photography dramatic',
    Romance: 'romantic couple cinematic golden hour photography',
    Horror: 'dark horror movie scene cinematic monster',
    Emotional: 'emotional cinematic portrait dramatic lighting people',
    Song: 'cinematic music performance stage spotlight singer',
    'Sci-Fi': 'cinematic futuristic alien creature extraterrestrial movie scene',
  };
  matchedQuery = matchedQuery || genreMap[genre] || 'cinematic dramatic movie scene';

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
    const isSciFi = totalScenes >= 6; 
    const isStealth = isSciFi && sceneIndex < 3;
    const isEngagement = isSciFi && sceneIndex >= 3 && sceneIndex < 9;
    const isClimax = isSciFi && sceneIndex >= 9;

    // ── Layer 1: Bass Drone / Stealth Tension
    if (isStealth) {
      createOsc(ctx, 'sine', 40, 0.02); // Deep infra-bass
      createOsc(ctx, 'sine', 80, 0.015);
      // Breathing SFX simulation
      for (let i = 0; i < 4; i++) {
        createNoise(ctx, 0.005, 500, i * 2, 1.2); 
      }
      // Predator "Clicking" Motif
      for (let i = 0; i < 12; i++) {
        createOsc(ctx, 'square', 1200 + Math.random() * 500, 0.008, i * 0.6, 0.02); 
      }
    } else {
      const bassFreq = isSciFi ? 45 + progress * 25 : 55 + progress * 30;
      createOsc(ctx, 'sawtooth', bassFreq, 0.018);
    }

    // ── Layer 2: Rhythmic Chaos (Taiko Drums)
    if (isEngagement) {
      const bpm = 150;
      const beatInterval = 60 / bpm;
      for (let beat = 0; beat < 16; beat++) {
        createNoise(ctx, 0.4 + progress * 0.3, 100, beat * beatInterval, 0.15); // Taiko Hit
        if (beat % 4 === 0) createNoise(ctx, 0.6, 200, beat * beatInterval, 0.2); // Accented Downbeat
      }
    }

    // ── Layer 3: Orchestral Scrabble / Predator Motif
    const chordRoot = [220, 247, 262, 294, 330, 349, 392, 440, 493, 523][sceneIndex % 10];
    if (isSciFi) {
      createOsc(ctx, 'sawtooth', chordRoot, 0.015);
      createOsc(ctx, 'square', chordRoot * 1.51, 0.005, 0.25); // Intense synth shimmer
    }

    // ── Layer 4: Impact Sync (Bass Drop on Blows)
    const currentScene = scenes[sceneIndex];
    if (currentScene?.impact) {
      createOsc(ctx, 'sine', 60, 0.2, 0, 0.8); // Sub-bass impact
      createNoise(ctx, 0.8, 150, 0, 0.4); // Kinetic slam
    }

    // ── Layer 5: Aftermath Sterile Hum
    if (isClimax) {
      createOsc(ctx, 'sine', 880, 0.012); // High clinical hum
      createOsc(ctx, 'sine', 1760, 0.008);
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
    selectedEngine = 'GAN (Adversarial)'
  } = formData || {};
  const heroSrc = heroImageUrl || '/demo_hero.jpg';

  const cssAspectRatio = aspectRatio === '2.39:1' ? '2.39 / 1'
    : aspectRatio === '16:9' ? '16 / 9'
    : aspectRatio === '4:3'  ? '4 / 3'
    : aspectRatio === '9:16' ? '9 / 16'
    : '16 / 9';

  const scenes = buildScenesFromPrompt(ideaText, genre);
  const SCENE_DURATION = 8;
  const TOTAL_DURATION = Math.max(scenes.length * SCENE_DURATION, 1);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const canvasRef = useRef(null);
  const activeScene = scenes.length > 0 ? Math.min(Math.floor(elapsed / SCENE_DURATION), scenes.length - 1) : 0;
  const sceneLabel = scenes[activeScene]?.label || '';
  const shotType  = scenes[activeScene]?.shot  || '';
  const angleClass = scenes[activeScene]?.angle || 'zoom-in';
  const isImpact = scenes[activeScene]?.impact || false;
  const currentAction = scenes[activeScene]?.action || 'idle';

  // Cinematic face mapping for Sci-Fi (Removing TECH HUD, providing SEAMLESS BLEND)
  const sciFiFaceConfigs = {
    sf1: { top: '22%', left: '74%', scale: 2.2, filter: 'contrast(1.1) brightness(0.9) saturate(0.9) sepia(0.3)' },
    sf2: { top: '26%', left: '32%', scale: 2.4, filter: 'contrast(1.2) brightness(0.8) hue-rotate(-5deg) saturate(1.2)' },
    sf3: { top: '35%', left: '50%', scale: 2.0, filter: 'contrast(1.1) brightness(0.7) blur(0.5px)' },
    sf4: { top: '40%', left: '50%', scale: 1.8, filter: 'contrast(1.1) brightness(0.8) sepia(0.5)' },
    sf5: { top: '26%', left: '32%', scale: 2.4, filter: 'contrast(1.2) brightness(0.8) hue-rotate(-5deg)' },
    sf6: { top: '22%', left: '74%', scale: 2.2, filter: 'contrast(1.1) brightness(0.9) saturate(0.9)' },
    sf7: { top: '30%', left: '45%', scale: 2.6, filter: 'contrast(1.3) brightness(0.7)' },
    sf8: { top: '40%', left: '50%', scale: 2.1, filter: 'contrast(1.2) brightness(0.8)' },
    sf9: { top: '50%', left: '50%', scale: 1.9, filter: 'contrast(1.5) brightness(1.2) hue-rotate(20deg)' },
    sf10: { top: '50%', left: '50%', scale: 2.3, filter: 'brightness(3.0) blur(2px)' },
  };

  const currentFaceConfig = sciFiFaceConfigs[scenes[activeScene]?.id] || { top: '50%', left: '50%', scale: 1.5, filter: 'none' };


  const isSciFiMode = ideaText.toLowerCase().includes('alien') || 
                      ideaText.toLowerCase().includes('creature') || 
                      ideaText.toLowerCase().includes('monster') ||
                      ideaText.toLowerCase().includes('futuristic') || 
                      ideaText.toLowerCase().includes('cyber') ||
                      genre === 'Sci-Fi';

  const isBroadcastMode = (ideaText.toLowerCase().includes('judo') || 
                           ideaText.toLowerCase().includes('competition') || 
                           ideaText.toLowerCase().includes('match')) && !isSciFiMode;

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
    <div className="video-player-container animate-fade-in">
      <div className="video-main-layout">
        <div className="player-section">
          <div className="result-header">
            <button className="btn-icon-back" onClick={onBack}>
              <ArrowLeft size={18} /> Exit Theater
            </button>
            <div className="engine-status">
              <div className="status-dot"></div>
              <span>NEURAL ENGINE: {selectedEngine}</span>
            </div>
          </div>

          <div className={`cinema-screen glass-panel ${isImpact ? 'impact-shake' : ''}`} style={{ aspectRatio: aspectRatio === '9:16' ? '9/16' : '16/9' }}>
            <div className="screen-wrapper">
              <div className="cinematic-bars bar-top" />

              {scenes.map((scene, i) => (
                <div
                  key={i}
                  className={`scene ${activeScene === i ? 'active' : ''} scene-angle-${scene.angle}`}
                  style={{ backgroundImage: `url('${scene.url}')` }}
                />
              ))}

              {/* CINEMATIC HERO INTEGRATION (REMOVING HUD AS PER USER REQUEST) */}
              {scenes.length > 0 && scenes[activeScene]?.facePos && currentFaceConfig && (
                <div 
                  className="cinematic-hero-integration"
                  style={{
                    top: currentFaceConfig.top,
                    left: currentFaceConfig.left,
                    transform: `translate(-50%, -50%) scale(${currentFaceConfig.scale})`
                  }}
                >
                  {/* Neural Masking Layer to Erase Background Face */}
                  <div className="neural-face-subtractor" />
                  
                  <img 
                    src={heroSrc} 
                    alt="Hero Identity" 
                    className="hero-integrated-cinematic" 
                    style={{ filter: currentFaceConfig.filter }}
                  />
                  
                  {/* Neural Frame for descriptor matching */}
                  <div className="descriptor-overlay">
                    <span className="desc-tag">ID: BALD</span>
                    <span className="desc-tag">ID: MUSTACHE</span>
                  </div>
                </div>
              )}

              {/* GAN ENHANCED BADGE */}
              <div className="gan-refinement-badge">
                <ShieldCheck size={16} />
                <span>GAN ENHANCED • 8192px HYPER-PHOTOREAL</span>
              </div>

              {/* VFX LAYERS (CINEMATIC MASTERPIECE) */}
              <div className="vfx-grain" />
              <div className="vfx-chromatic" />
              <div className="vfx-god-rays" />
              <div className={`vfx-cloak-flicker ${activeScene < 3 ? 'active' : ''}`} />
              
              <canvas ref={canvasRef} className="particle-canvas" width={1280} height={720} />

              {/* ONSCREEN HUD */}
              <div className="onscreen-hud">
                <div className="top-hud">
                  <span className="shot-tag">{shotType}</span>
                  <span className="sc-label">{sceneLabel}</span>
                </div>
                <div className="bottom-hud">
                  <div className="rec-indicator">
                    <div className="rec-dot"></div>
                    <span>VEO_3_RAW</span>
                  </div>
                  <div className="timestamp">{formatTime(elapsed)}</div>
                </div>
              </div>

              <div className="cinematic-bars bar-bottom" />

                <div className="video-controls">
                  <button className="control-main" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <div className="pause-bar"></div> : <Play size={20} fill="currentColor" />}
                  </button>
  
                  <div className="progress-wrap" onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    setElapsed(pct * TOTAL_DURATION);
                  }}>
                    <div className="progress-fill" style={{ width: `${Math.min((elapsed / TOTAL_DURATION) * 100, 100)}%` }} />
                  </div>
  
                  <div className="right-controls">
                    <button onClick={onOpenGallery} className="btn-stills" title="View Stills Gallery">
                      <Camera size={18} />
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)}>
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <Settings size={18} className="settings-icon" />
                  </div>
                </div>
            </div>
          </div>

          <div className="video-footer">
            <div className="production-details">
              <h3>{ideaText.substring(0, 50)}...</h3>
              <p>Generated via {selectedEngine} • AI Cinematic Synthesis v4.2</p>
            </div>
            <div className="action-cluster">
              <button className="btn-primary flex-center gap-2">
                <Download size={18} /> DOWNLOAD MASTER (MP4)
              </button>
              <button className="btn-secondary">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="technical-rail">
           <h3>NEURAL FRAMES</h3>
           <div className="rail-grid">
             {scenes.map((scene, i) => (
               <div 
                 key={i} 
                 className={`rail-card ${activeScene === i ? 'active' : ''}`}
                 onClick={() => setElapsed(i * SCENE_DURATION)}
               >
                 <div className="rail-thumb" style={{ backgroundImage: `url('${scene.url}')` }}>
                   {activeScene === i && <div className="playing-pulse"></div>}
                 </div>
                 <span className="rail-label">{scene.label.split('—')[0]}</span>
               </div>
             ))}
           </div>
           
           <div className="gan-info-box glass-panel">
              <div className="box-header">
                <Sparkles size={14} />
                <span>ADVERSARIAL STATUS</span>
              </div>
              <div className="box-content">
                <div className="status-row"><span>Logic:</span> <span>Minimized</span></div>
                <div className="status-row"><span>Face:</span> <span>Preserved</span></div>
                <div className="status-row"><span>Denoise:</span> <span>Adversarial</span></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerView;
