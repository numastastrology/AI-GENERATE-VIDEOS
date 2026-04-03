// ── All available cinematic shot types ───────────────────────────────────────
const ALL_SHOT_TYPES = [
  "Macro Close-Up Shot — extreme detail on hands/face/weapon",
  "Slowly Pulling Back — reveals the full arena/environment",
  "Slow Zoom-In — tension-building approach on subject's eyes",
  "Low Angle Shot — hero dominates frame, sky behind",
  "High Angle Shot — overhead view showing full combat zone",
  "Dutch Tilt (Canted Angle) — psychological unease, 15° tilt",
  "Tracking Shot — camera follows hero laterally mid-action",
  "Crash Zoom — explosive sudden push to subject face",
  "POV (Point of View) Shot — through the hero's eyes",
  "Aerial / Bird's Eye Shot — top-down wide arena coverage",
  "Over-the-Shoulder Shot — hero from behind, opponent ahead",
  "Whip Pan — rapid horizontal pan between combatants",
  "Slow-Motion Close-Up — 240fps sweat, impact, expression",
  "Wide Establishing Shot — full arena, crowd, atmosphere",
  "Insert/Cutaway Shot — belt tightening, feet stance, grip",
  "Reaction Shot — opponent or crowd reaction, medium close",
];

// ── Genre-based action templates ─────────────────────────────────────────────
const GENRE_ACTIONS = {
  Action: [
    "Hero enters in slow-motion, scanning the environment",
    "Opponents rush in coordinated attack formation",
    "Dynamic hand-to-hand combat sequence begins",
    "Hero executes signature finishing technique",
    "Slow-motion capture of decisive winning moment",
    "Camera pans out as crowd erupts",
  ],
  Romance: [
    "Protagonists lock eyes from across the room",
    "Slow walk towards each other with gentle lighting",
    "A tender moment of whispered dialogue",
    "Soft focus close-ups on overlapping hands",
    "Intimate embrace under diffused golden light",
  ],
  Horror: [
    "Protagonist walks down a dimly lit silent corridor",
    "Shadows flicker — a sudden noise echoes",
    "Quick zoom to protagonist's terrified expression",
    "A figure appears in the background, out of focus",
    "Jump scare setup with abruptly cut audio",
  ],
  Emotional: [
    "Character sits alone in contemplative silence",
    "Slow pan reveals tears forming in extreme close-up",
    "Memory flashback sequence in desaturated tones",
    "Breakthrough moment captured in lingering wide shot",
  ],
  Song: [
    "Performer takes stage amid swirling spotlights",
    "Crowd sways in synchronized motion",
    "Close-up on instrument strings vibrating",
    "Aerial shot of light patterns across the crowd",
  ],
  'Sci-Fi': [
    "PHASE 1: Invisible Shadow — Elite operative (Hero) covered in mud, scanning jungle clearing",
    "Plasma Caster Laser Lock — Red dots dance across Hero's chest from Ceiba tree",
    "Counter-Blast — 40mm grenade disrupts Cloaking Device, Predator flickers",
    "PHASE 2: Guerrilla Tactics — Predator leaps with Combi-Stick telescoping spear",
    "Log-Trap Ambush — Human emerges from brush, neon-green blood splatters ferns",
    "PHASE 3: Honorable Kill — Wrist Blade lunge, Hero kicks leaves into hidden pit",
    "AFTERMATH — Self-Destruct Gauntlet countdown, blinding white light consumes crater",
  ],
};

// ── Build shot assignment for scenes ─────────────────────────────────────────
const assignShotsToScene = (sceneIndex, totalScenes, genreShots) => {
  // Select shots that rotate through the full shot types list
  const shotsPerScene = 4;
  const offset = sceneIndex * shotsPerScene;
  const shots = [];
  for (let i = 0; i < shotsPerScene; i++) {
    shots.push(ALL_SHOT_TYPES[(offset + i) % ALL_SHOT_TYPES.length]);
  }
  return shots;
};

// ── Keyword helpers ────────────────────────────────────────────────────────────
const extractKeywords = (text) => {
  const keywords = [];
  if (text.match(/judo|throw|grapple|tatami|ippon/i)) keywords.push('judo competition', 'martial arts');
  if (text.match(/night|dark|shadow/i)) keywords.push('night scene');
  if (text.match(/rain|storm|wet/i)) keywords.push('heavy rain');
  if (text.match(/russian|russia/i)) keywords.push('Russian opponent');
  if (text.match(/win|victor|champion/i)) keywords.push('triumphant victory');
  return keywords.length ? keywords : ['cinematic action'];
};

// ── Visual DNA Analysis Builder ──────────────────────────────────────────────
const buildHeroVisualDNA = (heroName, genre, ideaText) => {
  const keywords = extractKeywords(ideaText);
  const isAction = genre === 'Action';
  const isSports = keywords.some(k => k.includes('judo') || k.includes('martial'));

  return {
    metadata: {
      confidence_score: 'high',
      image_type: 'photograph',
      primary_purpose: isSports ? 'sports character reference / action hero' : 'portrait / character reference',
    },
    composition: {
      rule_applied: 'center composition with slight rule-of-thirds offset',
      aspect_ratio: '2:3 portrait',
      layout: 'single subject',
      focal_points: [
        'Primary: face and eyes — commanding forward gaze at center frame',
        'Secondary: upper torso and clothing pattern creating visual texture',
      ],
      visual_hierarchy: 'Eye drawn immediately to face/eyes, then tracks down to torso. Strong central anchor with neutral background eliminating distraction.',
      balance: 'symmetric — subject centered, bilateral facial symmetry emphasized',
    },
    color_profile: {
      dominant_colors: [
        { color: 'Off-white / Warm White', hex: '#F5F4F0', percentage: '55%', role: 'background' },
        { color: 'Deep Navy Blue', hex: '#1A1E2E', percentage: '20%', role: 'primary clothing stripe' },
        { color: 'Warm Skin Tone — Medium Brown', hex: '#8B6355', percentage: '15%', role: 'primary subject skin' },
        { color: 'Crimson Red', hex: '#C0392B', percentage: '7%', role: 'clothing accent stripe' },
        { color: 'Charcoal Gray', hex: '#3D3D3D', percentage: '3%', role: 'shadow areas and mustache' },
      ],
      color_palette: 'triadic — navy/red/neutral with skin tone anchor',
      temperature: 'neutral with slight warm bias from skin tones',
      saturation: 'moderate — not oversaturated, natural photographic palette',
      contrast: 'medium contrast — clear separation between subject and background',
    },
    lighting: {
      type: 'artificial studio — diffused softbox or umbrella setup',
      source_count: 'single primary source with ambient fill — 2 sources total',
      direction: 'slightly elevated front — approximately 15-20 degrees above eye level',
      directionality: 'moderately directional with soft ambient fill reducing shadow depth',
      quality: 'soft light — large light source producing gradual shadow edges',
      intensity: 'bright, high-key — subject evenly illuminated without harsh highlights',
      contrast_ratio: 'low contrast — flat even illumination across the face',
      mood: 'professional, neutral, clean — identification/reference quality',
      shadows: {
        type: 'soft gradual edges — no harsh defined shadow lines',
        density: 'gray — no deep black shadows, ambient fill present',
        placement: 'faint shadow under chin and slight shadow on neck',
        length: 'short — minimal shadow projection indicating frontal light source',
      },
      highlights: {
        treatment: 'preserved — no blown-out highlights, full detail retained',
        placement: 'forehead, nose bridge, upper cheeks — frontal light catchpoints',
      },
      ambient_fill: 'present — secondary fill light or large reflective background reducing all shadows',
      light_temperature: 'neutral to slightly cool white — 5500-6000K studio daylight',
    },
    technical_specs: {
      medium: 'digital photography',
      style: 'realistic — natural photographic representation, no artistic processing',
      texture: 'sharp — fine skin texture and fabric weave clearly resolved',
      sharpness: 'tack sharp — face and clothing in full focus',
      grain: 'none — clean digital capture at sufficient ISO',
      depth_of_field: 'deep — background and subject both in focus, simple background aids subject',
      perspective: 'straight on — lens at eye level, minimal barrel or pincushion distortion',
    },
    artistic_elements: {
      genre: 'portrait — identification/character reference',
      influences: ['Studio headshot photography', 'Passport/ID portrait style', 'Corporate headshot aesthetic'],
      mood: isSports ? 'composed, determined, ready for competition' : 'calm, professional, approachable',
      atmosphere: 'neutral and controlled — all environmental variables removed to focus entirely on subject',
      visual_style: 'clean and minimal — maximum focus on facial features and character identity',
    },
    typography: {
      present: false,
      fonts: [],
      placement: 'none',
      integration: 'none',
    },
    subject_analysis: {
      primary_subject: `${heroName} — adult male, approximately 45-55 years, South Indian ethnic features, medium-heavy build`,
      positioning: 'center — perfectly centered in frame with slight left offset',
      scale: 'medium close-up — head to mid-chest framing',
      interaction: 'isolated — no environmental interaction, full focus on subject',
      facial_expression: {
        mouth: 'neutral to slight closed resting expression — lips together, no visible tension',
        smile_intensity: 'no smile — serious neutral expression appropriate for reference photography',
        eyes: 'direct gaze into lens — steady, confident, slightly intense, not aggressive',
        eyebrows: 'neutral/slightly relaxed — natural resting position, no deliberate raise or furrow',
        overall_emotion: 'serious, composed, confident — conveys authority and calm determination',
        authenticity: 'posed formal — deliberate composed expression for reference/identification purpose',
      },
      hair: {
        length: 'shaved/clipper-cut — approximately 1-3mm stubble-length buzz cut across entire crown',
        cut: 'uniform buzz cut — no taper, no fade, consistent length across scalp',
        texture: 'coily — very short, tight natural coil pattern barely visible at this length',
        texture_quality: 'coarse — thick individual strand width typical of South Indian hair type',
        natural_imperfections: 'slight shine variation across scalp surface from studio lighting — no flyaways at this length',
        styling: 'unstyled — natural, no product, zero styling effort at buzz-cut length',
        styling_detail: 'completely unstyled, no product visibility, static with no movement',
        part: 'no part — uniform buzz cut eliminates any part line',
        volume: 'flat — buzz cut has minimal volume by nature',
        details: 'slight receding at temples and thinning at crown typical of male pattern; full dark coloring with minimal gray integration',
      },
      hands_and_gestures: {
        left_hand: 'not visible — below frame cutoff, at sides',
        right_hand: 'not visible — below frame cutoff, at sides',
        finger_positions: 'not visible in frame',
        finger_interlacing: 'not applicable — hands not in frame',
        hand_tension: 'not assessable — below frame',
        interaction: 'hands at sides — relaxed, non-gesturing standing pose',
        naturalness: 'static formal pose — standard portrait stance',
      },
      body_positioning: {
        posture: 'standing — upright, no lean',
        angle: 'facing camera directly — zero degree rotation, full frontal',
        weight_distribution: 'centered — equal bilateral stance',
        shoulders: 'level — horizontal, squared and back, confident posture',
      },
    },
    background: {
      setting_type: 'indoor studio — controlled portrait photography environment',
      spatial_depth: 'shallow — no foreground/background separation, uniform flat backdrop',
      elements_detailed: [],
      wall_surface: {
        material: 'painted drywall or seamless paper backdrop — standard portrait studio material',
        surface_treatment: 'smooth paint or matte seamless — no texture visible',
        texture: 'perfectly smooth — no tactile variation visible',
        finish: 'matte — no specular hotspots or reflections',
        color: 'warm off-white — approximately #F5F4F0, cream-white with neutral undertone',
        color_variation: 'uniform — edge-to-edge consistent tone with slight darkening at extreme corners',
        features: 'clean, pristine — no marks, water stains, cracks, or surface features',
        wear_indicators: 'pristine — professional studio condition',
      },
      floor_surface: { material: 'not visible — below frame', color: 'not applicable', pattern: 'not applicable' },
      objects_catalog: 'No objects — pure studio isolation of subject against plain backdrop',
      background_treatment: 'sharp — background in full focus, same plane as subject depth',
    },
    generation_parameters: {
      prompts: [
        `${heroName}, South Indian male, 45-55 years, medium-heavy build, shaved head, thick dark mustache, direct confident gaze, wearing horizontal stripe polo shirt in navy/white/red, studio portrait, neutral off-white background, even frontal soft lighting, photorealistic 8K, sharp focus, medium close-up, reference photo quality`,
        `${heroName} as ${isAction ? 'action hero protagonist' : 'lead character'} in ${genre} film, same facial features as reference — shaved head, thick mustache, composed determined expression, ${isSports ? 'in judo gi uniform' : 'hero costume'}, dramatic cinematic lighting, ${isAction ? 'low angle heroic shot' : 'medium close-up'}, 8K photoreal`,
      ],
      keywords: [
        `${heroName.toLowerCase().replace(' ', '-')}`,
        'south-indian-male-portrait',
        isSports ? 'judo-champion-hero' : 'action-hero-protagonist',
        'shaved-head-mustache',
        'studio-portrait-reference',
        'confident-direct-gaze',
        `${genre.toLowerCase()}-film-character`,
      ],
      technical_settings: 'Canon EOS R5 equivalent, 85mm portrait lens at f/2.8-f/5.6, ISO 100-400, 1/125s shutter, softbox at 45° elevated front position, reflector fill on opposite side, RAW capture',
      post_processing: 'Minimal processing — slight clarity boost, neutral white balance correction, no skin retouching to preserve natural features, sharpening at 40% with masking',
    },
  };
};

// ── Main export ───────────────────────────────────────────────────────────────
// ── Main export ───────────────────────────────────────────────────────────────
export const parsePromptToMockJSON = (ideaText, duration, genre, includeHero, heroName = 'Lead Protagonist', aspectRatio = '16:9', engine = 'GAN (Adversarial)') => {
  const keywords = extractKeywords(ideaText);
  const numScenes = ideaText.toLowerCase().includes('predator') ? 10 : (duration >= 3 ? 3 : duration >= 2 ? 2 : 1);
  const durLabel = duration === 1 ? '1 minute' : `${duration} minutes`;
  const actions = GENRE_ACTIONS[genre] || GENRE_ACTIONS['Action'];

  // Build scenes with per-scene shot lists
  const sequence = Array.from({ length: numScenes }, (_, i) => {
    const shots = assignShotsToScene(i, numScenes, actions);
    return {
      scene: `Sequence ${i + 1} of ${numScenes}`,
      description: actions[i % actions.length],
      camera: {
        primary_shot: shots[0],
        secondary_shot: shots[1],
        transition_shot: shots[2],
        reaction_shot: shots[3],
      },
      duration_seconds: Math.round((duration * 60) / numScenes),
      keywords: keywords,
    };
  });

  const characters = [];
  if (includeHero) {
    characters.push({
      role: heroName,
      reference_image: 'uploaded_hero_photo',
      traits: ['commanding presence', 'detailed facial features', 'expressive eyes'],
      shot_preference: 'Low Angle Shot for power, Macro Close-Up for emotion',
    });
  }

  // Engine specific metadata based on user research
  const engineMeta = {
    'GAN (Adversarial)': {
      architecture: 'Generator-Discriminator Competitive Network',
      synthesis_engine: 'StyleGAN3-XL',
      adversarial_params: {
        generator_iterations: 12500,
        discriminator_confidence_threshold: 0.992,
        loss_function: 'Minimax Cross-Entropy',
        optimization: 'Adversarial Refinement Pass',
        mode_collapse_prevention: 'Enabled (Diversity Loss enabled)'
      },
      strengths: ['Hyper-realistic skin textures', 'Superior face preservation'],
      type: 'Local/Offline Capability (Z Image optimized)'
    },
    'Stable Diffusion (Latent)': {
      architecture: 'Latent Diffusion Model (LDM)',
      sampler: 'DPMPP_2M_Karras',
      denoising_steps: 50,
      cfg_scale: 7.5,
      latent_space: '512x512 Upscaled to 4K',
      strengths: ['Highly customizable styles', 'Open-source flexibility'],
      type: 'Local GPU Accelerated'
    },
    'Runway (Cinematic)': {
      architecture: 'Gen-3 Alpha Neural Video',
      consistency_mode: 'Temporal Vector Flow',
      resolution: '4K Cinematic 60fps',
      cloud_processing: true,
      strengths: ['Fluid movement', 'Integrated editing suite'],
      type: 'High-speed Cloud Rendering'
    }
  }[engine] || {};

  return {
    title: `${genre} Sequence — "${ideaText.substring(0, 40)}..."`,
    description: ideaText,
    duration: durLabel,
    hero: heroName,
    ai_engine: engine,
    engine_metadata: engineMeta,
    aspect_ratio: {
      selected: aspectRatio,
      css_value: aspectRatio === '2.39:1' ? '2.39/1' : aspectRatio === '9:16' ? '9/16' : aspectRatio === '4:3' ? '4/3' : '16/9',
      note: 'All scenes must be rendered and cropped to this ratio without letterboxing distortion',
    },
    face_preservation: {
      hero: heroName,
      directive: 'Hero face must remain undistorted across ALL shot types and angles',
      gan_refinement: engine === 'GAN (Adversarial)',
      rules: [
        'Maintain facial proportions on Low Angle and High Angle shots using lens correction',
        'Apply face-stabilization on Tracking Shot and Whip Pan movements',
        'Use face-anchor lock during Crash Zoom to prevent warp distortion',
        'Portrait crop must always favor upper 30% of frame for face visibility',
        'CGI overlays must not obscure or distort the hero face region',
        'Dutch Tilt: face remains upright via counter-rotation of face layer',
      ],
    },
    keywords,
    characters,
    setting: {
      location: keywords.join(', '),
      atmosphere: `High drama, 8K photorealistic, ${genre.toLowerCase()} tone, cinematic lighting`,
    },
    sequence,
    visual_style: {
      shot_library: ALL_SHOT_TYPES,
      tone: `${genre} — cinematic, emotionally driven`,
      color_grading: 'High contrast, teal-orange color grade, volumetric light rays',
      cgi_effects: [
        'AIGC Post-Processing — Super-resolution refinement (Nano Banana 2 Engine)',
        'Neural Style Transfer — Consistent cinematic aesthetic',
        'Impact shockwave blast — radial energy ring on throw/strike contact',
        'Hyper-realistic sweat & dust particles — 240fps slow-motion droplets',
        'Volumetric god rays — light shafts through arena roof during victory',
        'Depth-of-field rack focus — sharp/blur transition between combatants',
        'Sky replacement CGI — dramatic storm or golden dusk sky swap',
      ],
      effects: ['slow-motion impact frames', 'particle dust', 'lens flare', 'depth blur'],
      audio: 'Lyria 3 Generated Narrative Score — Tribal-industrial hybrid with Taiko percussion and eerie woodwind flourishes',
    },
    ...(includeHero ? { hero_visual_analysis: buildHeroVisualDNA(heroName, genre, ideaText) } : {}),
  };
};

