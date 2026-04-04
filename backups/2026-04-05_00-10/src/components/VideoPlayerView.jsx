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
    { id: 'sf1', label: 'PHASE 1 — Ceiba Tree Hunter', url: '/predator_scene1.png', angle: 'pan-right', shot: 'Predator Perspective Stalk', action: 'stalk', facePos: null },
    { id: 'sf2', label: 'PHASE 1 — Thermal Lock-on', url: '/predator_scene2.png', angle: 'zoom-in', shot: 'Plasma Caster HUD', action: 'strike', facePos: { top: '30%', left: '45%' } },
    { id: 'sf3', label: 'PHASE 1 — Counter-Blast', url: '/predator_scene3.png', angle: 'low-angle', shot: 'Cloak Flicker VFX', impact: true, action: 'stalk', facePos: null },
    { id: 'sf4', label: 'PHASE 2 — Mud Stealth', url: '/predator_scene4.png', angle: 'aerial', shot: 'Guerrilla Tactics Hide', action: 'stalk', facePos: { top: '35%', left: '48%' } },
    { id: 'sf5', label: 'PHASE 2 — Green Blood Trail', url: '/predator_scene5.png', angle: 'zoom-in', shot: 'Predator Injury Neon Green', impact: true, action: 'grapple', facePos: null },
    { id: 'sf6', label: 'PHASE 3 — Honorable Kill', url: '/predator_scene6.png', angle: 'zoom-out', shot: 'Final Face-Off Challenge', action: 'victory', facePos: { top: '28%', left: '65%' } },
    { id: 'sf7', label: 'PHASE 3 — The Struggle', url: '/predator_scene7.png', angle: 'close-up', shot: 'Wrist Blade Force', action: 'grapple', facePos: { top: '32%', left: '40%' } },
    { id: 'sf8', label: 'PHASE 3 — Helmet Crack', url: '/predator_scene8.png', angle: 'low-angle', shot: 'Stone Impact Resolution', impact: true, action: 'strike', facePos: { top: '25%', left: '55%' } },
    { id: 'sf9', label: 'AFTERMATH — Self Destruct', url: '/predator_scene9.png', angle: 'zoom-out', shot: 'Glowing Symbols Flicker', action: 'stalk', facePos: null },
  ],
  cultureHarmony: [
    { id: 'ch1', label: 'Scene 1: Aerial Introduction', url: 'https://images.unsplash.com/photo-1531310197839-ccf54334509e?auto=format&fit=crop&w=1280&q=80&sig=101&q=swiss+alps+aerial+ wildflowers+macro+dew', angle: 'pan-right', shot: 'Wide Establishing Shot', impact: false },
    { id: 'ch2', label: 'Scene 2: Indian Hero’s Introduction', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1280&q=80&sig=102&q=indian+man+martial+arts+meadow+sunlight', angle: 'zoom-in', shot: 'Macro Close-Up Shot', impact: false },
    { id: 'ch3', label: 'Scene 3: Japanese Heroine’s Introduction', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1280&q=80&sig=103&q=japanese+woman+kimono+dance+lake', angle: 'pull-back', shot: 'Cinematic Dance Shot', impact: false },
    { id: 'ch4', label: 'Scene 4: The Meeting', url: 'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=1280&q=80&sig=104&q=romantic+couple+meeting+flower+valley+close+up', angle: 'close-up', shot: 'Emotional Reaction Shot', impact: false },
    { id: 'ch5', label: 'Scene 5: Cultural Exchange', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1280&q=80&sig=105&q=macro+hands+sharing+food+sushi+samosa', angle: 'zoom-in', shot: 'Macro Connection Shot', impact: false },
    { id: 'ch6', label: 'Scene 6: Journey Through the Landscape', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1280&q=80&sig=106&q=couple+exploring+swiss+landscape+alps', angle: 'low-angle', shot: 'Uplifting Travel Shot', impact: false },
    { id: 'ch7', label: 'Scene 7: Climactic Moment', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1280&q=80&sig=107&q=silhouette+people+alps+viewpoint+arms+outstretched', angle: 'aerial', shot: 'Triumphant Finale Shot', impact: true },
    { id: 'ch8', label: 'Scene 8: Reflection by the Lake', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1280&q=80&sig=108&q=people+sitting+by+lake+alps+reflection', angle: 'close-up', shot: 'Serene Reflection Shot', impact: false },
  ],
  wondersOfWorld: [
    { id: 'ww1', label: 'Scene 1: Great Wall of China — Heroine Spins in Moonlight', url: 'https://images.unsplash.com/photo-1547981316-45c1157d079d?auto=format&fit=crop&w=1280&q=80&sig=r1&q=romantic+couple+great+wall+china+night+cinematic', angle: 'pan-right', shot: 'Cinematic Dance Pivot', impact: false },
    { id: 'ww2', label: 'Scene 2: Taj Mahal — India — Romantic Dance at Dawn', url: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1280&q=80&sig=r2&q=romantic+couple+dancing+taj+mahal+dawn', angle: 'zoom-in', shot: 'Macro Embrace Shot', impact: false },
    { id: 'ww3', label: 'Scene 3: Machu Picchu — High Elevation Romance', url: 'https://images.unsplash.com/photo-1526392107052-3341595b9a41?auto=format&fit=crop&w=1280&q=80&sig=r3&q=romantic+couple+machu+picchu+mist+peru', angle: 'pull-back', shot: 'Panoramic Gaze', impact: false },
    { id: 'ww4', label: 'Scene 4: Petra — Torchlit Waltz in Sandstone', url: 'https://images.unsplash.com/photo-1543787754-05fd0c70faac?auto=format&fit=crop&w=1280&q=80&sig=r4&q=romantic+couple+petra+jordan+candles+night', angle: 'close-up', shot: 'Golden Torchlight Focus', impact: false },
    { id: 'ww5', label: 'Scene 5: Colosseum — Roman Night Serenade', url: 'https://images.unsplash.com/photo-1515542641795-85ed3b397567?auto=format&fit=crop&w=1280&q=80&sig=r5&q=romantic+couple+colosseum+rome+evening', angle: 'zoom-in', shot: 'Dynamic Interaction Shot', impact: false },
    { id: 'ww6', label: 'Scene 6: Christ the Redeemer — Sunset Embrace', url: 'https://images.unsplash.com/photo-1593995863951-57c27e518295?auto=format&fit=crop&w=1280&q=80&sig=r6&q=romantic+couple+christ+redeemer+rio+sunset', angle: 'aerial', shot: 'Aerial Romantic Finale', impact: false },
    { id: 'ww7', label: 'Scene 7: Chichen Itza — Moonlight Dance Sequence', url: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=1280&q=80&sig=r7&q=romantic+couple+mexico+pyramid+night', angle: 'pan-left', shot: 'Slow Motion Waltz', impact: false },
    { id: 'ww8', label: 'Scene 8: Great Pyramid — Tender Egyptian Dawn', url: 'https://images.unsplash.com/photo-1539768942893-dad53e8a967d?auto=format&fit=crop&w=1280&q=80&sig=r8&q=romantic+couple+pyramids+giza+egypt+sunrise', angle: 'low-angle', shot: 'Cradle Gaze Shot', impact: false },
    { id: 'ww9', label: 'Scene 9: Angkor Wat — Sacred Dance Finale', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1280&q=80&sig=r9&q=romantic+couple+angkor+wat+dawn+reflection', angle: 'zoom-out', shot: 'Triumphant Romantic Climax', impact: false },
  ],
};

export const buildScenesFromPrompt = (ideaText = '', genre = 'Action') => {
  const text = ideaText.toLowerCase();
  const judoWords = ['judo', 'throw', 'tatami', 'grappl', 'ippon', 'fight', 'combat', 'martial', 'wrestl', 'competition', 'russian'];
  const sciFiWords = ['alien', 'creature', 'monster', 'predator', 'futuristic', 'cyber', 'space', 'galaxy', 'sci-fi'];
  const cultureWords = ['harmony', 'culture', 'swiss', 'india', 'japan', 'sitar', 'shakuhachi', 'romantic', 'song', 'alpine', 'sushi', 'samosa'];
  const wonderWords = ['wonder', 'great wall', 'taj mahal', 'machu picchu', 'petra', 'colosseum', 'christ the redeemer', 'chichen itza', 'pyramid', 'angkor wat'];
 
  if (wonderWords.some(w => text.includes(w))) return LOCAL_SCENE_SETS.wondersOfWorld;
  if (cultureWords.some(w => text.includes(w))) return LOCAL_SCENE_SETS.cultureHarmony;
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
    url: `https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1280&q=80&sig=${seed}&q=${encodeURIComponent(matchedQuery)}`,
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
const useEpicAudio = (isPlaying, isMuted, sceneIndex, totalScenes, scenes) => {
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
    const isSciFi = totalScenes >= 6 && scenes.length > 0 && scenes[0].id && !scenes[0].id.startsWith('ch') && !scenes[0].id.startsWith('ww'); 
    const isCulture = scenes.length > 0 && scenes[0].id && (scenes[0].id.startsWith('ch') || scenes[0].id.startsWith('ww'));
    const isStealth = isSciFi && sceneIndex < 3;
    const isEngagement = isSciFi && sceneIndex >= 3 && sceneIndex < 9;
    const isClimax = isSciFi && sceneIndex >= 9;

    // ── Layer 1: Bass Drone / Stealth Tension / Cultural Strings
    if (isCulture) {
      createOsc(ctx, 'sine', 110, 0.01); // Warm cello-like drone
      createOsc(ctx, 'triangle', 220, 0.008, 0, 4); // Sitar / Koto-like resonant notes
      // Simulating a cultural rhythmic pulse
      for (let i = 0; i < 8; i++) {
        createOsc(ctx, 'sine', 440 + Math.random() * 200, 0.005, i * 0.5, 0.1); 
      }
    } else if (isStealth) {
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
const VideoPlayerView = ({ formData, onBack, onOpenGallery }) => {
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

  // Cinematic face mapping for Sci-Fi — Hero face overlay only on HUMAN scenes
  const sciFiFaceConfigs = {
    sf2: { top: '30%', left: '45%', scale: 2.2, filter: 'contrast(1.15) brightness(0.85) saturate(0.9) sepia(0.15)' },
    sf4: { top: '35%', left: '48%', scale: 2.0, filter: 'contrast(1.1) brightness(0.75) sepia(0.4) saturate(0.8)' },
    sf6: { top: '28%', left: '65%', scale: 2.4, filter: 'contrast(1.2) brightness(0.8) saturate(0.9)' },
    sf7: { top: '32%', left: '40%', scale: 2.6, filter: 'contrast(1.3) brightness(0.7) saturate(1.1)' },
    sf8: { top: '25%', left: '55%', scale: 2.3, filter: 'contrast(1.2) brightness(0.8) saturate(0.9)' },
  };

  const cultureFaceConfigs = {
    ch2: { top: '28%', left: '46%', scale: 2.1, filter: 'contrast(1.1) brightness(0.95) saturate(1.05)' },
    ch4: { top: '32%', left: '40%', scale: 2.3, filter: 'contrast(1.05) brightness(1.0) saturate(1.1)' },
    ch5: { top: '35%', left: '55%', scale: 2.0, filter: 'contrast(1.1) brightness(0.9) saturate(0.95)' },
    ch6: { top: '30%', left: '48%', scale: 2.2, filter: 'contrast(1.1) brightness(0.95) saturate(1.0)' },
    ch8: { top: '34%', left: '42%', scale: 2.4, filter: 'contrast(1.05) brightness(1.05) saturate(1.15)' },
  };

  const wondersFaceConfigs = {
    ww1: { top: '28%', left: '46%', scale: 2.1, filter: 'contrast(1.1) brightness(0.95) saturate(1.05)' },
    ww2: { top: '35%', left: '48%', scale: 2.2, filter: 'contrast(1.1) brightness(0.9) saturate(1.1)' },
    ww3: { top: '30%', left: '52%', scale: 2.0, filter: 'contrast(1.05) brightness(0.9) saturate(1.0)' },
    ww4: { top: '38%', left: '42%', scale: 2.1, filter: 'contrast(1.05) brightness(0.95) saturate(1.0)' },
    ww5: { top: '32%', left: '50%', scale: 2.3, filter: 'contrast(1.1) brightness(0.85) saturate(1.1)' },
    ww6: { top: '26%', left: '44%', scale: 2.4, filter: 'contrast(1.2) brightness(0.8) saturate(0.9)' },
    ww7: { top: '40%', left: '45%', scale: 2.0, filter: 'contrast(1.0) brightness(1.0) saturate(1.2)' },
    ww8: { top: '34%', left: '47%', scale: 2.4, filter: 'contrast(1.15) brightness(0.95) saturate(1.0)' },
    ww9: { top: '32%', left: '55%', scale: 2.2, filter: 'contrast(1.1) brightness(1.0) saturate(1.1)' },
  };

  const isSciFiMode = ideaText.toLowerCase().includes('alien') || 
                      ideaText.toLowerCase().includes('creature') || 
                      ideaText.toLowerCase().includes('monster') ||
                      ideaText.toLowerCase().includes('predator') ||
                      ideaText.toLowerCase().includes('futuristic') || 
                      ideaText.toLowerCase().includes('cyber') ||
                      genre === 'Sci-Fi';

  const isBroadcastMode = (ideaText.toLowerCase().includes('judo') || 
                           ideaText.toLowerCase().includes('competition') || 
                           ideaText.toLowerCase().includes('match')) && !isSciFiMode;

  const isWondersMode = scenes.length > 0 && scenes[0].id && scenes[0].id.startsWith('ww');
  const isCultureMode = scenes.length > 0 && scenes[0].id && scenes[0].id.startsWith('ch');

  const currentFaceConfig = (isSciFiMode ? sciFiFaceConfigs : 
                            (scenes[activeScene]?.id?.startsWith('ww') ? wondersFaceConfigs : cultureFaceConfigs))[scenes[activeScene]?.id] || null;

  useParticleCanvas(canvasRef, isPlaying);
  useEpicAudio(isPlaying, isMuted, activeScene, scenes.length, scenes);

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

              {/* Neural Face Integration System (Rajagopal Kannan) */}
              {currentFaceConfig && (
                <div 
                  className="cinematic-hero-integration" 
                  style={{ 
                    top: currentFaceConfig.top, 
                    left: currentFaceConfig.left,
                    transform: `translate(-50%, -50%) scale(${currentFaceConfig.scale})`
                  }}
                >
                  <div className="neural-face-subtractor" />
                  <img 
                    src={heroSrc} 
                    className="hero-integrated-cinematic" 
                    alt="Rajagopal Kannan"
                    style={{ filter: currentFaceConfig.filter }}
                  />
                </div>
              )}


              {/* GAN badge removed per user request */}

              {/* VFX LAYERS (ROMANTIC MASTERPIECE) */}
              <div className="vfx-grain" />
              <div className="vfx-chromatic" />
              <div className="vfx-god-rays" />
              <div className={`vfx-cloak-flicker ${activeScene < 3 ? 'active' : ''}`} />
              <div className={`vfx-rose-petals ${(isCultureMode || isWondersMode) ? 'active' : ''}`} />
              
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
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3>NEURAL FRAMES</h3>
             <button 
               className="btn-download-all"
               onClick={() => {
                 scenes.forEach((scene, i) => {
                   const link = document.createElement('a');
                   link.href = scene.url;
                   link.download = `scene_${i + 1}_${scene.label.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
                   link.click();
                 });
               }}
             >
               <Download size={14} /> ALL
             </button>
           </div>
           <div className="rail-grid">
             {scenes.map((scene, i) => (
               <div 
                 key={i} 
                 className={`rail-card ${activeScene === i ? 'active' : ''}`}
                 onClick={() => setElapsed(i * SCENE_DURATION)}
               >
                 <div className="rail-thumb" style={{ backgroundImage: `url('${scene.url}')` }}>
                   {activeScene === i && <div className="playing-pulse"></div>}
                   <a 
                     className="thumb-download-btn"
                     href={scene.url} 
                     download={`scene_${i + 1}.png`}
                     onClick={(e) => e.stopPropagation()}
                     title={`Download Scene ${i + 1}`}
                   >
                     <Download size={12} />
                   </a>
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
                <div className="status-row"><span>Subject:</span> <span>Rajagopal Kannan</span></div>
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
