// ============================================================
// TMAC — TAM Analytics Consulting
// app.js — Interactive Logic & Animations
// ============================================================

(function () {
  'use strict';

  // ── PARTICLE CANVAS BACKGROUND ──────────────────────────────
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#00B4D8' : '#1565C0',
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 180, 216, ${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba').replace('#', '');
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });


  // ── STICKY HEADER ───────────────────────────────────────────
  const header = document.getElementById('main-header');
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });


  // ── MOBILE MENU TOGGLE ──────────────────────────────────────
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item, #mobile-nav-cta');

  function toggleMobileMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    toggleMobileMenu(!isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });


  // ── TYPEWRITER HEADLINE ANIMATION ───────────────────────────
  const typewriterEl = document.getElementById('typewriter-el');
  const phrases = [
    'Build. Analyze. Automate.',
    'Engineering Intelligent Business Systems.',
    'Built for Africa. Built for the World.',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeDelay = 80;

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        typeDelay = 3200; // Pause at complete phrase
      } else {
        typeDelay = 65;
      }
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeDelay = 400;
      } else {
        typeDelay = 35;
      }
    }
    setTimeout(typeWriter, typeDelay);
  }

  // Start typewriter after a short delay
  setTimeout(typeWriter, 800);


  // ── SCROLL REVEAL ANIMATIONS ────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  revealEls.forEach(el => revealObserver.observe(el));


  // ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerH = header.offsetHeight;
        const targetY = targetEl.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });


  // ── CONTACT FORM HANDLING ────────────────────────────────────
  const form = document.getElementById('enquiry-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      // Simulate submission (replace with real endpoint)
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        submitBtn.textContent = 'Send My Enquiry';
        submitBtn.disabled = false;
      }, 1400);
    });
  }

  function validateForm() {
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim() || (field.type === 'email' && !isValidEmail(field.value))) {
        field.style.borderColor = '#dc2626';
        if (valid) field.focus();
        valid = false;
      }
    });

    const description = document.getElementById('f-desc');
    if (description && description.value.trim().length < 50) {
      description.style.borderColor = '#dc2626';
      valid = false;
    }

    return valid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  // ── NEWSLETTER MINI FORM ─────────────────────────────────────
  const nlSubmit = document.getElementById('nl-submit-btn');
  const nlInput = document.getElementById('nl-email');

  if (nlSubmit) {
    nlSubmit.addEventListener('click', () => {
      if (!nlInput.value || !isValidEmail(nlInput.value)) {
        nlInput.style.borderColor = '#dc2626';
        nlInput.focus();
        return;
      }
      nlInput.style.borderColor = '';
      nlSubmit.textContent = '✓';
      nlSubmit.style.background = '#27c93f';
      nlInput.value = '';
      nlInput.placeholder = 'Subscribed!';
      setTimeout(() => {
        nlSubmit.textContent = '→';
        nlSubmit.style.background = '';
        nlInput.placeholder = 'your@email.com';
      }, 3000);
    });
  }


  // ── ACTIVE NAV LINK HIGHLIGHTING ON SCROLL ──────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item');

  function highlightNav() {
    const scrollY = window.scrollY + header.offsetHeight + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active-nav');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-nav');
          }
        });
      }
    });
  }

  // Add active nav style
  const navStyle = document.createElement('style');
  navStyle.textContent = `.active-nav { color: white !important; } .active-nav::after { width: 100% !important; }`;
  document.head.appendChild(navStyle);

  window.addEventListener('scroll', highlightNav, { passive: true });


  // ── KPI COUNTER ANIMATION ───────────────────────────────────
  function animateCounter(el, target, suffix) {
    let current = 0;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      current = Math.round(ease * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Observe KPI values and animate on entry
  const kpiValues = document.querySelectorAll('.kpi-val');
  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        if (text === '247') animateCounter(el, 247, '');
        else if (text === '96.4%') { let v = 0; const t = setInterval(() => { v += 2.7; if (v >= 96.4) { v = 96.4; clearInterval(t); } el.textContent = v.toFixed(1) + '%'; }, 50); }
        kpiObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  kpiValues.forEach(el => kpiObserver.observe(el));


  // ── PILLAR CARD MICRO INTERACTION ────────────────────────────
  document.querySelectorAll('.pillar-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const accent = card.querySelector('.pillar-accent');
      if (accent) accent.style.transform = 'scaleX(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      const accent = card.querySelector('.pillar-accent');
      if (accent) accent.style.transform = '';
    });
  });


  // ── INDUSTRY TILE HOVER GLOW ─────────────────────────────────
  document.querySelectorAll('.industry-tile').forEach(tile => {
    tile.addEventListener('mouseenter', () => {
      tile.style.boxShadow = '0 8px 32px rgba(0, 180, 216, 0.15)';
    });
    tile.addEventListener('mouseleave', () => {
      tile.style.boxShadow = '';
    });
  });


  // ── SOLUTION CARD SCROLL ANIMATE ─────────────────────────────
  document.querySelectorAll('.solution-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const num = card.querySelector('.sol-num');
      if (num) num.style.opacity = '0.08';
    });
    card.addEventListener('mouseleave', () => {
      const num = card.querySelector('.sol-num');
      if (num) num.style.opacity = '';
    });
  });


  // ── CASE CARD IMAGE PARALLAX ─────────────────────────────────
  document.querySelectorAll('.case-img').forEach(img => {
    img.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      img.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    });
    img.addEventListener('mouseleave', () => {
      img.style.backgroundPosition = 'center';
    });
  });


  // ── TESTIMONIAL CARD SUBTLE FLOAT ────────────────────────────
  let tiltCleanups = [];

  document.querySelectorAll('.testi-card').forEach((card, i) => {
    const delay = i * 0.2;
    const floatAnim = card.animate([
      { transform: 'translateY(0px)' },
      { transform: 'translateY(-6px)' },
      { transform: 'translateY(0px)' },
    ], { duration: 4000 + i * 400, delay: delay * 1000, iterations: Infinity, easing: 'ease-in-out' });
    tiltCleanups.push(() => floatAnim.cancel());
  });


  // ── FOOTER YEAR ──────────────────────────────────────────────
  // Already hardcoded as 2026


  // ── SCROLL PROGRESS INDICATOR ───────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0;
    height: 3px; background: linear-gradient(90deg, #1565C0, #00B4D8, #F4A261);
    z-index: 9999; width: 0%; transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrollTop / docHeight) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });


  // ── BUTTON RIPPLE EFFECT ─────────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute; width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px;
        background: rgba(255,255,255,0.2); border-radius: 50%;
        transform: scale(0); animation: rippleOut 0.5s ease-out forwards;
        pointer-events: none;
      `;
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Ripple keyframe
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes rippleOut { to { transform: scale(1); opacity: 0; } }`;
  document.head.appendChild(rippleStyle);


  // ── FORM FIELD FOCUS STYLES ──────────────────────────────────
  document.querySelectorAll('.field-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.style.borderColor = '#1565C0';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '';
    });
  });


  // ── WHATSAPP BUTTON PULSE ────────────────────────────────────
  const waFloat = document.getElementById('whatsapp-float');
  if (waFloat) {
    const waStyle = document.createElement('style');
    waStyle.textContent = `
      @keyframes waPulse {
        0%, 100% { box-shadow: 0 6px 24px rgba(37,211,102,0.45), 0 0 0 0 rgba(37,211,102,0.4); }
        50% { box-shadow: 0 6px 24px rgba(37,211,102,0.45), 0 0 0 12px rgba(37,211,102,0); }
      }
    `;
    document.head.appendChild(waStyle);
    waFloat.style.animation = 'waPulse 3s ease-in-out infinite';
  }


  console.log('%c TMAC — TAM Analytics Consulting ', 'background: #0D1B2A; color: #00B4D8; font-weight: bold; font-size: 1rem; padding: 6px 12px; border-radius: 4px;');
  console.log('%c Build. Analyze. Automate. ', 'color: #F4A261; font-weight: bold;');

})();
