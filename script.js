/**
 * ============================================================================
 * ASHISH – THE INITIATIVE
 * Advanced Avengers-Inspired AI Engineer Portfolio Engine
 * Client Architecture:
 *   1. System Diagnostics & Cinematic Bootloader
 *   2. Native Web Speech API Voice Synthesizer (F.R.I.D.A.Y. / J.A.R.V.I.S.)
 *   3. Interactive Nanotech Particle Canvas Engine
 *   4. Custom Precision HUD Cursor Mechanics
 *   5. Navigation & Intersection Observation Engine
 *   6. Tech Arsenal Dynamic Categorization & Audit System
 *   7. Mission Dossier Modal Controller
 *   8. Resume Preview & Download Manager
 *   9. Tactical Transmission Dispatcher
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. GLOBAL CONFIGURATION & DATA REPOSITORIES
     -------------------------------------------------------------------------- */
  const SYSTEM_CONFIG = {
    agentName: 'F.R.I.D.A.Y.',
    architect: 'Ashish Sharma',
    institution: 'Shoolini University',
    degree: 'B.Tech CSE (Artificial Intelligence)',
    voiceRate: 1.0,
    voicePitch: 1.02,
    enableParticleRepulsion: true
  };

  // Detailed Mission Dossier Database
  const MISSIONS_DATABASE = {
    campusgear: {
      id: 'DOSSIER #AS-CG01',
      title: 'CampusGear',
      category: 'DBMS and Web Development',
      status: 'IN PROGRESS',
      shortDesc: 'A university-related project focused on developing a web application with database connectivity and CRUD operations.',
      fullDesc: 'CampusGear is engineered to resolve campus equipment logistics and inventory tracking. Built with Node.js and a structured MySQL database, it features secure user authentication, database normalization, relational integrity checks, and a reactive dashboard for students and lab administrators to requisition and return assets with audited timestamps.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'MySQL', 'DBMS Architecture', 'RESTful CRUD'],
      repoUrl: 'https://github.com/ashishsharma73170',
      schematicType: 'db'
    },
    'crop-recommendation': {
      id: 'DOSSIER #AS-CR02',
      title: 'Crop Recommendation System',
      category: 'Machine Learning',
      status: 'ACADEMIC ML',
      shortDesc: 'An academic machine learning project focused on crop recommendation using agricultural and environmental input data.',
      fullDesc: 'The Crop Recommendation System leverages supervised machine learning algorithms to evaluate multi-dimensional agricultural metrics: Nitrogen, Phosphorus, Potassium (N-P-K) soil ratios, ambient temperature, humidity, pH levels, and rainfall. By synthesizing these agronomic data vectors, the model predicts the optimal crop variety to maximize agricultural yields and reduce harvest risks.',
      technologies: ['Python', 'Machine Learning', 'Scikit-Learn', 'NumPy', 'Pandas', 'Predictive Modeling'],
      repoUrl: 'https://github.com/ashishsharma73170',
      schematicType: 'ml'
    },
    neoverse: {
      id: 'DOSSIER #AS-NV03',
      title: 'NeoVerse Portfolio',
      category: 'Frontend Web Development',
      status: 'LIVE SHOWCASE',
      shortDesc: 'A personal portfolio website showcasing programming skills, projects, and web development capabilities.',
      fullDesc: 'NeoVerse Portfolio embodies the intersection of superhero cinema and modern computer engineering. Engineered completely in vanilla web standards without bulky frameworks, it integrates the browser Web Speech API for contextual voice narration, interactive HTML5 particle physics, glassmorphism HUD cards, and custom CSS-crafted Arc Reactor energy cores.',
      technologies: ['HTML5', 'CSS3 Animations', 'JavaScript ES6+', 'Web Speech API', 'HTML5 Canvas', 'Responsive HUD'],
      repoUrl: 'https://github.com/ashishsharma73170',
      schematicType: 'web'
    }
  };

  /* --------------------------------------------------------------------------
     2. SPEECH SYNTHESIS ENGINE (MANDATORY REQUIREMENT)
     -------------------------------------------------------------------------- */
  class VoiceAssistant {
    constructor() {
      this.synth = window.speechSynthesis || null;
      this.isVoiceEnabled = true;
      this.isPaused = false;
      this.isSpeaking = false;
      this.selectedVoice = null;
      this.hasUserInteracted = false;
      this.queue = [];

      // DOM Elements
      this.statusBadge = document.getElementById('voiceStatusBadge');
      this.statusText = document.getElementById('voiceStatusText');
      this.waveform = document.getElementById('voiceWaveform');
      this.toggleBtn = document.getElementById('voiceToggleBtn');
      this.toggleIcon = document.getElementById('voiceToggleIcon');
      this.pauseBtn = document.getElementById('voicePauseBtn');
      this.pauseIcon = document.getElementById('voicePauseIcon');
      this.stopBtn = document.getElementById('voiceStopBtn');
      this.quickMuteBtn = document.getElementById('quickMuteBtn');
      this.quickMuteIcon = document.getElementById('quickMuteIcon');
      this.quickStopBtn = document.getElementById('quickStopBtn');
      this.capsuleStateText = document.getElementById('capsuleStateText');
      this.liveAnnouncer = document.getElementById('speechLiveAnnouncer');

      this.init();
    }

    init() {
      if (!this.synth) {
        console.warn('Speech Synthesis API not supported in this browser.');
        this.updateHUDStatus('VOICE PROTOCOL OFFLINE', false);
        return;
      }

      // Load available voices
      this.populateVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.populateVoices();
      }

      // Listen for first interaction to unlock audio
      const unlockAudio = () => {
        if (!this.hasUserInteracted) {
          this.hasUserInteracted = true;
          this.updateHUDStatus('F.R.I.D.A.Y. ONLINE', true);
          // Optional warm-up cancelled immediately so browser activates speech
          try {
            const silent = new SpeechSynthesisUtterance('');
            this.synth.speak(silent);
          } catch (e) {}
        }
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });

      // Bind button controls
      this.bindControls();
    }

    populateVoices() {
      if (!this.synth) return;
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) return;

      // Prefer high-quality English voice (UK or US) with modern clear timbre
      const preferredVoices = [
        'Google UK English Female',
        'Google UK English Male',
        'Microsoft Hazel',
        'Microsoft George',
        'Microsoft David',
        'Microsoft Mark',
        'Samantha',
        'Daniel',
        'Karen',
        'en-GB',
        'en-US'
      ];

      for (const pref of preferredVoices) {
        const found = voices.find(v => v.name.includes(pref) || v.lang.includes(pref));
        if (found) {
          this.selectedVoice = found;
          break;
        }
      }

      if (!this.selectedVoice && voices.length > 0) {
        // Fallback to first English voice
        this.selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }
    }

    speak(text) {
      if (!text || !this.isVoiceEnabled) {
        return;
      }

      // Announce for accessibility screen-readers
      if (this.liveAnnouncer) {
        this.liveAnnouncer.textContent = text;
      }

      if (!this.synth) {
        this.showToast('Speech Synthesizer unavailable.');
        return;
      }

      // Cancel previous speech before speaking a new message
      this.synth.cancel();
      this.isPaused = false;
      this.updatePauseIcon(false);

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = SYSTEM_CONFIG.voiceRate;
      utterance.pitch = SYSTEM_CONFIG.voicePitch;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.setWaveformActive(true);
        this.updateHUDStatus('F.R.I.D.A.Y. TRANSMITTING', true);
        if (this.capsuleStateText) {
          this.capsuleStateText.textContent = 'TRANSMITTING...';
          this.capsuleStateText.style.color = '#FFD700';
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.setWaveformActive(false);
        this.updateHUDStatus('F.R.I.D.A.Y. ONLINE', true);
        if (this.capsuleStateText) {
          this.capsuleStateText.textContent = 'STANDBY // READY';
          this.capsuleStateText.style.color = '#00F0FF';
        }
      };

      utterance.onerror = (event) => {
        // Interrupted is normal when speech is replaced
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.warn('SpeechSynthesis error:', event);
        }
        this.isSpeaking = false;
        this.setWaveformActive(false);
        this.updateHUDStatus('F.R.I.D.A.Y. READY', true);
      };

      this.synth.speak(utterance);
    }

    stop() {
      if (!this.synth) return;
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.setWaveformActive(false);
      this.updatePauseIcon(false);
      this.updateHUDStatus('F.R.I.D.A.Y. ONLINE', true);
      if (this.capsuleStateText) {
        this.capsuleStateText.textContent = 'SPEECH HALTED';
        setTimeout(() => {
          if (this.capsuleStateText && !this.isSpeaking) {
            this.capsuleStateText.textContent = 'STANDBY // READY';
            this.capsuleStateText.style.color = '#00F0FF';
          }
        }, 1500);
      }
    }

    togglePause() {
      if (!this.synth) return;

      if (this.synth.speaking) {
        if (this.isPaused) {
          this.synth.resume();
          this.isPaused = false;
          this.setWaveformActive(true);
          this.updatePauseIcon(false);
          this.updateHUDStatus('F.R.I.D.A.Y. RESUMED', true);
        } else {
          this.synth.pause();
          this.isPaused = true;
          this.setWaveformActive(false);
          this.updatePauseIcon(true);
          this.updateHUDStatus('F.R.I.D.A.Y. PAUSED', true);
        }
      }
    }

    toggleVoice() {
      this.isVoiceEnabled = !this.isVoiceEnabled;
      if (!this.isVoiceEnabled) {
        this.stop();
        this.updateToggleIcon(false);
        this.updateHUDStatus('F.R.I.D.A.Y. MUTED', false);
        if (this.capsuleStateText) {
          this.capsuleStateText.textContent = 'MUTED // SILENT';
          this.capsuleStateText.style.color = '#E23636';
        }
      } else {
        this.updateToggleIcon(true);
        this.updateHUDStatus('F.R.I.D.A.Y. ONLINE', true);
        if (this.capsuleStateText) {
          this.capsuleStateText.textContent = 'STANDBY // READY';
          this.capsuleStateText.style.color = '#00F0FF';
        }
        this.speak('Voice synthesizer re-engaged. Standing by for instructions.');
      }
    }

    updateToggleIcon(enabled) {
      const iconClass = enabled ? 'fa-volume-high' : 'fa-volume-xmark';
      if (this.toggleIcon) {
        this.toggleIcon.className = `fa-solid ${iconClass}`;
      }
      if (this.quickMuteIcon) {
        this.quickMuteIcon.className = `fa-solid ${iconClass}`;
      }
      if (this.toggleBtn) {
        this.toggleBtn.classList.toggle('active', enabled);
      }
    }

    updatePauseIcon(isPaused) {
      if (this.pauseIcon) {
        this.pauseIcon.className = isPaused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
      }
    }

    setWaveformActive(active) {
      if (this.waveform) {
        this.waveform.classList.toggle('active', active);
      }
    }

    updateHUDStatus(text, isOnline) {
      if (this.statusText) {
        this.statusText.textContent = text;
        this.statusText.style.color = isOnline ? '#00F0FF' : '#E23636';
      }
    }

    bindControls() {
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleVoice();
        });
      }

      if (this.quickMuteBtn) {
        this.quickMuteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleVoice();
        });
      }

      if (this.pauseBtn) {
        this.pauseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.togglePause();
        });
      }

      if (this.stopBtn) {
        this.stopBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.stop();
        });
      }

      if (this.quickStopBtn) {
        this.quickStopBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.stop();
        });
      }

      // Voice capsule status click
      const capsuleTrigger = document.getElementById('capsuleVoiceTrigger');
      if (capsuleTrigger) {
        capsuleTrigger.addEventListener('click', () => {
          this.speak('Initiative voice protocol online. Ashish Sharma, Artificial Intelligence and Full Stack Engineer. Click any module for tactical briefing.');
        });
      }
    }

    showToast(msg) {
      const existing = document.getElementById('hudToast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.id = 'hudToast';
      toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: rgba(14, 21, 35, 0.95);
        border: 1px solid #00F0FF;
        color: #F0F4FC;
        padding: 10px 18px;
        border-radius: 4px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.8rem;
        z-index: 12000;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
        pointer-events: none;
        animation: fadeIn 0.3s ease-out;
      `;
      toast.textContent = `> ${msg}`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
      }, 3000);
    }
  }

  /* --------------------------------------------------------------------------
     3. CINEMATIC PRELOADER CONTROLLER
     -------------------------------------------------------------------------- */
  function initPreloader(voice) {
    const preloader = document.getElementById('preloader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderLog = document.getElementById('loaderLog');
    const skipBtn = document.getElementById('skipLoaderBtn');

    if (!preloader || !loaderBar) return;

    const bootSteps = [
      { progress: 15, msg: '> ARC REACTOR CORE: ONLINE (OUTPUT: 3.5 GJ/s)' },
      { progress: 35, msg: '> LOADING SHOOLINI ACADEMIC DOSSIER...' },
      { progress: 55, msg: '> INITIALIZING NEURAL CLASSIFIERS & PYTHON RUNTIME...' },
      { progress: 75, msg: '> SYNCHRONIZING F.R.I.D.A.Y. VOICE INTERFACE...' },
      { progress: 95, msg: '> CALIBRATING NANOTECH HUD & STARK THEME...' },
      { progress: 100, msg: '> THE INITIATIVE READY. WELCOME TO ASHISH\'S UNIVERSE.' }
    ];

    let currentStep = 0;
    let isSkipped = false;

    function finishLoading() {
      if (isSkipped) return;
      isSkipped = true;
      loaderBar.style.width = '100%';
      document.body.classList.remove('loading-active');
      preloader.classList.add('hidden');

      // Trigger hero typewriter animation
      startTypewriterAnimation();

      // Trigger brief welcome briefing once user has engaged
      setTimeout(() => {
        voice.updateHUDStatus('F.R.I.D.A.Y. STANDBY', true);
      }, 1000);
    }

    function executeStep() {
      if (isSkipped) return;
      if (currentStep < bootSteps.length) {
        const step = bootSteps[currentStep];
        loaderBar.style.width = `${step.progress}%`;
        if (loaderLog) {
          loaderLog.innerHTML = `<span class="log-line">${step.msg}</span>`;
        }
        currentStep++;
        const nextDelay = currentStep === bootSteps.length ? 450 : 280;
        setTimeout(executeStep, nextDelay);
      } else {
        setTimeout(finishLoading, 400);
      }
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        voice.speak('Skipping initialization. Welcome to Ashish Sharma\'s Initiative.');
        finishLoading();
      });
    }

    // Begin sequence
    setTimeout(executeStep, 200);
  }

  /* --------------------------------------------------------------------------
     4. HERO TYPEWRITER & TELEMETRY ANIMATION
     -------------------------------------------------------------------------- */
  function startTypewriterAnimation() {
    const el = document.getElementById('typewriterStatus');
    if (!el) return;

    const phrases = [
      'INITIALIZING SYSTEM... WELCOME TO MY DIGITAL UNIVERSE.',
      'ARC REACTOR EFFICIENCY: 100% NOMINAL // READY',
      'AI × CODE × FUTURE // ASHISH SHARMA',
      'SHOOLINI UNIVERSITY // B.TECH CSE (AI)'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex++;
        el.textContent = currentPhrase.substring(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(tick, 2200);
          return;
        }
      } else {
        charIndex--;
        el.textContent = currentPhrase.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 450);
          return;
        }
      }

      const typingSpeed = isDeleting ? 25 : 45;
      setTimeout(tick, typingSpeed);
    }

    setTimeout(tick, 600);
  }

  /* --------------------------------------------------------------------------
     5. INTERACTIVE AMBIENT PARTICLE CANVAS (STARK NANOTECH MESH)
     -------------------------------------------------------------------------- */
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
    const mouse = { x: -1000, y: -1000, radius: 120 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2 + 1;
        // Iron Man color scheme: mostly cyan/blue, some gold and red sparks
        const rand = Math.random();
        if (rand < 0.65) {
          this.color = '#00F0FF';
        } else if (rand < 0.88) {
          this.color = '#FFD700';
        } else {
          this.color = '#E23636';
        }
        this.baseAlpha = Math.random() * 0.4 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse repulsion
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.baseAlpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00F0FF';
            ctx.globalAlpha = (1 - dist / 110) * 0.18;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      for (const p of particles) {
        p.update();
        p.draw();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* --------------------------------------------------------------------------
     6. CUSTOM HUD CURSOR MECHANICS (DESKTOP)
     -------------------------------------------------------------------------- */
  function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const reticle = document.getElementById('cursorReticle');

    if (!dot || !ring || !reticle) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      reticle.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Smooth follower ring physics
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover detection on interactive elements
    const interactiveSelectors = 'a, button, .skill-card, .project-card, .timeline-card, .trait-box, .hologram-hud-card, input, textarea, [data-speak]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('hovering-interactive');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('hovering-interactive');
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. GLOBAL DATA-SPEAK BINDINGS & VOICE HOOKS
     -------------------------------------------------------------------------- */
  function initVoiceInteractionListeners(voice) {
    // 1. Delegated click handler for any element with data-speak
    document.addEventListener('click', (e) => {
      const speakTarget = e.target.closest('[data-speak]');
      if (speakTarget) {
        const text = speakTarget.getAttribute('data-speak');
        if (text) {
          voice.speak(text);
        }
      }
    });

    // 2. Skill Card Voice Hook
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
      card.addEventListener('click', () => {
        const skillName = card.getAttribute('data-skill') || 'Technology';
        const speakText = card.getAttribute('data-speak') || `${skillName} module activated in Tech Arsenal.`;
        voice.speak(speakText);
      });
    });

    // 3. Project Card Voice Hook (if card clicked outside of specific button)
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Only if the user didn't click directly on the VIEW PROJECT button or REPO link (which have their own hooks)
        if (!e.target.closest('.view-project-btn') && !e.target.closest('.project-github-link')) {
          const speakText = card.getAttribute('data-speak');
          if (speakText) {
            voice.speak(speakText);
          }
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. NAVIGATION, ACTIVE LINK SPY & MOBILE DRAWER
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('backToTopBtn');

    // Mobile drawer toggle
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileBtn.classList.toggle('open', isOpen);
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileBtn.classList.remove('open');
          mobileBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Scroll spy for active navigation item
    function updateActiveNav() {
      const scrollY = window.pageYOffset;

      sections.forEach(sec => {
        const sectionHeight = sec.offsetHeight;
        const sectionTop = sec.offsetTop - 120;
        const sectionId = sec.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });

      // Floating Back-to-Top Button Visibility
      if (backToTopBtn) {
        if (scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* --------------------------------------------------------------------------
     9. TECH ARSENAL FILTERING & ANIMATED PROGRESS BARS
     -------------------------------------------------------------------------- */
  function initTechArsenal() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });

    // Animate progress bars when scrolled into view
    const progressBars = document.querySelectorAll('.progress-fill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.style.getPropertyValue('--target-width') || '80%';
          bar.style.width = targetWidth;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => observer.observe(bar));
  }

  /* --------------------------------------------------------------------------
     10. MISSION DOSSIER MODALS (PROJECT DEEP DIVE)
     -------------------------------------------------------------------------- */
  function initProjectModals(voice) {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeProjectModalBtn');
    const viewButtons = document.querySelectorAll('.view-project-btn');

    const modalTitle = document.getElementById('modalProjectTitle');
    const modalDossierId = document.getElementById('modalDossierId');
    const modalCategory = document.getElementById('modalProjectCategory');
    const modalStatus = document.getElementById('modalProjectStatus');
    const modalDesc = document.getElementById('modalProjectDescription');
    const modalTechBadges = document.getElementById('modalProjectTechBadges');
    const modalGithubLink = document.getElementById('modalGithubLink');
    const modalBlueprint = document.getElementById('modalBlueprint');
    const modalSpeakSummaryBtn = document.getElementById('modalSpeakSummaryBtn');

    let currentProjectData = null;

    function openModal(projectId) {
      const data = MISSIONS_DATABASE[projectId];
      if (!data) return;

      currentProjectData = data;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalDossierId) modalDossierId.textContent = data.id;
      if (modalCategory) modalCategory.innerHTML = `<i class="fa-solid fa-tag"></i> ${data.category}`;
      if (modalStatus) modalStatus.textContent = data.status;
      if (modalDesc) modalDesc.textContent = data.fullDesc;

      // Populate Tech Badges
      if (modalTechBadges) {
        modalTechBadges.innerHTML = '';
        data.technologies.forEach(tech => {
          const badge = document.createElement('span');
          badge.className = 'tech-badge';
          badge.innerHTML = `<i class="fa-solid fa-microchip"></i> ${tech}`;
          modalTechBadges.appendChild(badge);
        });
      }

      // Populate schematic preview
      if (modalBlueprint) {
        modalBlueprint.innerHTML = `
          <div class="project-graphic-frame" style="height: 140px;">
            <div class="blueprint-grid"></div>
            <div class="blueprint-schematic ${data.schematicType}-schematic" style="transform: scale(0.85);">
              <div class="schematic-center-node">
                <i class="fa-solid fa-atom"></i>
                <span>${data.title}</span>
              </div>
            </div>
            <div class="graphic-overlay-tag">${data.id}</div>
          </div>
        `;
      }

      if (modalGithubLink) {
        modalGithubLink.href = data.repoUrl;
      }

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Read dossier summary
      voice.speak(`Accessing ${data.title}. Category: ${data.category}. Status: ${data.status}. ${data.shortDesc}`);
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      currentProjectData = null;
    }

    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = btn.getAttribute('data-project');
        openModal(projectId);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    if (modalSpeakSummaryBtn) {
      modalSpeakSummaryBtn.addEventListener('click', () => {
        if (currentProjectData) {
          voice.speak(`Mission dossier for ${currentProjectData.title}. ${currentProjectData.fullDesc}`);
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     11. RESUME PREVIEW & DOWNLOAD CONTROLS
     -------------------------------------------------------------------------- */
  function initResumeModal(voice) {
    const resumeBtn = document.getElementById('downloadResumeBtn');
    const resumeModal = document.getElementById('resumeModal');
    const closeResumeBtn = document.getElementById('closeResumeModalBtn');
    const printResumeBtn = document.getElementById('printResumeBtn');

    if (!resumeModal) return;

    function openResume() {
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      voice.speak("Opening Ashish Sharma's Resume Dossier. You can review qualifications or download the document.");
    }

    function closeResume() {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (resumeBtn) {
      resumeBtn.addEventListener('click', openResume);
    }

    if (closeResumeBtn) {
      closeResumeBtn.addEventListener('click', closeResume);
    }

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResume();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
        closeResume();
      }
    });

    if (printResumeBtn) {
      printResumeBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /* --------------------------------------------------------------------------
     12. CONTACT TRANSMISSION DISPATCHER
     -------------------------------------------------------------------------- */
  function initContactForm(voice) {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('transmissionSubject').value.trim();
      const message = document.getElementById('messageBody').value.trim();

      if (!name || !email || !message) {
        e.preventDefault();
        if (feedback) {
          feedback.className = 'form-feedback-hud error';
          feedback.textContent = '> ERROR: ALL TELEMETRY FIELDS MANDATORY.';
        }
        voice.speak('Error. Please fill in all transmission fields.');
        return;
      }

      // Construct verified mailto link to guarantee real email transmission
      const encodedSubject = encodeURIComponent(`[INITIATIVE CONTACT] ${subject || 'Project Inquiry'}`);
      const encodedBody = encodeURIComponent(`Agent Identification: ${name}\nReturn Frequency: ${email}\n\nTransmission Content:\n${message}\n\n[Transmitted via Ashish Sharma - The Initiative Portfolio]`);
      const mailtoUrl = `mailto:ashishsharma73170@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      if (feedback) {
        feedback.className = 'form-feedback-hud success';
        feedback.textContent = '> TRANSMISSION ENCRYPTED. LAUNCHING SECURE DISPATCH PROTOCOL...';
      }

      voice.speak(`Transmission packaged, Agent ${name}. Opening your communication client to dispatch.`);

      // Let mail client open
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      e.preventDefault();
    });
  }

  /* --------------------------------------------------------------------------
     13. SYSTEM INITIALIZATION ORCHESTRATOR
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Voice Assistant
    const voice = new VoiceAssistant();

    // 2. Initialize Preloader & Typewriter
    initPreloader(voice);

    // 3. Initialize Ambient Nanotech Canvas
    initAmbientCanvas();

    // 4. Initialize Desktop HUD Cursor
    initCustomCursor();

    // 5. Initialize Navigation & Scroll-Spy
    initNavigation();

    // 6. Initialize Global Data-Speak Listeners
    initVoiceInteractionListeners(voice);

    // 7. Initialize Tech Arsenal & Animated Progress Bars
    initTechArsenal();

    // 8. Initialize Mission Dossier Modals
    initProjectModals(voice);

    // 9. Initialize Resume Modal
    initResumeModal(voice);

    // 10. Initialize Contact Transmission Form
    initContactForm(voice);

    // Set dynamic copyright year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    console.log('%c[STARK INDUSTRIES - THE INITIATIVE]', 'color: #00F0FF; font-family: monospace; font-size: 14px; font-weight: bold;');
    console.log('%cArchitect: Ashish Sharma // Shoolini University', 'color: #FFD700; font-family: monospace;');
    console.log('%cF.R.I.D.A.Y. Speech Synthesizer initialized and ready.', 'color: #E23636; font-family: monospace;');
  });

})();
