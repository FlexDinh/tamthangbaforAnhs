/* ============================================================
   WOMEN'S DAY v2 — script.js
   Advanced: Typewriter · Confetti · AOS · Tilt · Haptic · Timer
   ============================================================ */

'use strict';

/* ── CONFIG ──────────────────────────────────────────────── */
// ⚠️ Đổi ngày yêu nhau tại đây (năm, tháng-1, ngày)
const COUPLE_START = new Date(2024, 0, 1);

/* ════════════════════════════════════════════════════════════
   1. HEART / SPARKLE CANVAS
════════════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  const SYMBOLS = ['❤️', '💖', '💗', '✨', '🌸', '💓', '💕'];
  const POOL_SIZE = 30;
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rnd(a, b) { return Math.random() * (b - a) + a; }

  class Particle {
    constructor(randomY = false) { this.reset(randomY); }
    reset(anyY = false) {
      this.x = rnd(0, W);
      this.y = anyY ? rnd(0, H) : H + 30;
      this.vy = rnd(0.25, 0.75);
      this.vx = rnd(-0.2, 0.2);
      this.size = rnd(14, 26);
      this.alpha = rnd(0.25, 0.65);
      this.wobble = rnd(0, Math.PI * 2);
      this.wobbleSpd = rnd(0.01, 0.025);
      this.sym = SYMBOLS[0 | (Math.random() * SYMBOLS.length)];
    }
    update() {
      this.y -= this.vy;
      this.wobble += this.wobbleSpd;
      this.x += Math.sin(this.wobble) * 0.55 + this.vx;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.font = `${this.size}px serif`;
      ctx.fillText(this.sym, this.x, this.y);
      ctx.restore();
    }
  }

  const pool = Array.from({ length: POOL_SIZE }, () => new Particle(true));

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    pool.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ════════════════════════════════════════════════════════════
   2. SCROLL REVEAL (AOS-lite)
════════════════════════════════════════════════════════════ */
(function initAos() {
  const items = document.querySelectorAll('[data-aos]');
  const delays = new Map();

  items.forEach(el => {
    const d = parseInt(el.dataset.aosDelay || '0');
    delays.set(el, d);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      setTimeout(() => el.classList.add('aos-visible'), delays.get(el) || 0);
      io.unobserve(el);
    });
  }, { threshold: 0.14 });

  items.forEach(el => io.observe(el));
})();

/* ════════════════════════════════════════════════════════════
   3. MODAL — Love Letter with Typewriter
════════════════════════════════════════════════════════════ */
(function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const openBtn = document.getElementById('openLetter');
  const closeBtn = document.getElementById('closeModal');
  const bodyEl = document.getElementById('letterBody');

  const LETTER_PARAGRAPHS = [
    'Hôm nay là ngày dành riêng cho những người phụ nữ tuyệt vời — và trong trái tim anh, em chính là người tuyệt vời .',
    'Ngày 8/3 này, anh muốn nói với em rằng: Em xứng đáng được yêu thương, được trân trọng, được hạnh phúc — không chỉ hôm nay, mà mỗi ngày trong cuộc đời này.',
  ];

  let typeTimeout = null;
  let typing = false;

  async function typewrite(text, container) {
    return new Promise(resolve => {
      let i = 0;
      const p = document.createElement('p');
      const cursor = document.createElement('span');
      cursor.className = 'letter-cursor';
      p.appendChild(cursor);
      container.appendChild(p);

      function tick() {
        if (!typing) { resolve(); return; }
        if (i < text.length) {
          p.insertBefore(document.createTextNode(text[i]), cursor);
          i++;
          typeTimeout = setTimeout(tick, 28 + Math.random() * 22);
        } else {
          cursor.remove();
          resolve();
        }
      }
      typeTimeout = setTimeout(tick, 80);
    });
  }

  async function startTyping() {
    typing = true;
    bodyEl.innerHTML = '';
    for (const para of LETTER_PARAGRAPHS) {
      if (!typing) break;
      await typewrite(para, bodyEl);
      await new Promise(r => setTimeout(r, 180));
    }
  }

  function stopTyping() {
    typing = false;
    clearTimeout(typeTimeout);
  }

  function open() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    haptic('medium');
    // Small delay for modal entrance animation
    setTimeout(startTyping, 400);
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    stopTyping();
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ════════════════════════════════════════════════════════════
   4. LOVE TIMER
════════════════════════════════════════════════════════════ */
(function initUniverse() {
  const canvas = document.getElementById('universeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const msgEl = document.getElementById('starMessage');

  const LOVE_REASONS = [
    '❤️ Vì nụ cười của em làm cả thế giới sáng rực hơn',
    '🌸 Vì em yêu thương mọi người xung quanh rất sâu sắc',
    '🌟 Vì đôi mắt em lưu giữ cả một bầu trời riêng',
    '💜 Vì giọng em nói chuyện là giai điệu anh muốn nghe mãi mãi',
    '✨ Vì em luôn cố gắng dù mọi thứ khó khăn tới đâu',
    '🎙️ Vì tiếng cười khúc khích của em là âm thanh anh yêu nhất trên đời',
    '🌹 Vì em đẹp — không chỉ bên ngoài mà cả trong tâm hồn',
    '💗 Vì mỗi ngày bên em, anh đều học được điều gì đó mới',
    '🌙 Vì em làm nơi chốn trong lòng anh ấm áp hơn cả đêm đông',
    '💎 Vì em hiểu được anh dù khi anh chẳng nói gì',
    '🌌 Vì em là ngôi sao sáng nhất trong vũ trụ của anh',
    '💖 Vì được yêu em là điều may mắn nhất đời anh',
  ];

  let W, H, stars;
  let msgTimeout;
  let lastShownIdx = -1;
  let logicalW = 1, logicalH = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = devicePixelRatio || 1;
    W = canvas.width = rect.width * dpr;
    H = canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    logicalW = rect.width;
    logicalH = rect.height;
    buildStars(logicalW, logicalH);
  }

  function rnd(a, b) { return Math.random() * (b - a) + a; }

  function buildStars(w, h) {
    const count = Math.max(50, Math.floor(w * h / 1800));
    stars = Array.from({ length: count }, () => ({
      x: rnd(0, w),
      y: rnd(0, h),
      r: rnd(1.2, 4.5),
      alpha: rnd(0.35, 1),
      twinkleSpeed: rnd(0.008, 0.025),
      twinkleOffset: rnd(0, Math.PI * 2),
      color: ['#ffffff', '#ffe8f7', '#c9b8ff', '#ffcce8', '#fffbc0'][0 | (Math.random() * 5)],
      glow: 0,
      glowDecay: 0,
    }));
  }

  let tick = 0;

  function draw() {
    ctx.clearRect(0, 0, logicalW, logicalH);
    tick += 0.016;

    stars.forEach(s => {
      const tw = Math.sin(tick * (s.twinkleSpeed * 60) + s.twinkleOffset);
      const a = s.alpha * (0.55 + 0.45 * tw) + s.glow * 0.6;
      const rad = s.r + s.glow * 6;

      if (s.glow > 0.01) {
        ctx.save();
        const gg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, rad * 6);
        gg.addColorStop(0, `rgba(255,180,255,${(s.glow * 0.5).toFixed(2)})`);
        gg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rad * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        s.glow = Math.max(0, s.glow - s.glowDecay);
      }

      ctx.save();
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillStyle = s.color;
      ctx.shadowBlur = rad * 4;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  function getNearestStar(cx, cy) {
    let best = null, bestD = 35;
    stars.forEach(s => {
      const d = Math.hypot(s.x - cx, s.y - cy);
      if (d < bestD) { bestD = d; best = s; }
    });
    return best || stars[0 | (Math.random() * stars.length)];
  }

  function showMessage(star) {
    let idx;
    do { idx = 0 | (Math.random() * LOVE_REASONS.length); }
    while (idx === lastShownIdx && LOVE_REASONS.length > 1);
    lastShownIdx = idx;
    star.glow = 1;
    star.glowDecay = 0.016;
    haptic('medium');
    msgEl.classList.remove('visible');
    clearTimeout(msgTimeout);
    msgTimeout = setTimeout(() => {
      msgEl.textContent = LOVE_REASONS[idx];
      msgEl.classList.add('visible');
      msgTimeout = setTimeout(() => msgEl.classList.remove('visible'), 4200);
    }, 80);
  }

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    showMessage(getNearestStar(e.clientX - rect.left, e.clientY - rect.top));
  });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    if (!t) return;
    const rect = canvas.getBoundingClientRect();
    showMessage(getNearestStar(t.clientX - rect.left, t.clientY - rect.top));
  }, { passive: false });

  if (window.ResizeObserver) {
    new ResizeObserver(() => resize()).observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }

  resize();
  draw();
})();

/* ════════════════════════════════════════════════════════════
   5. MUSIC TOGGLE
════════════════════════════════════════════════════════════ */
(function initMusic() {
  const btn = document.getElementById('musicBtn');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  // Try to preload
  audio.volume = 0.35;

  btn.addEventListener('click', () => {
    haptic('light');
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      btn.querySelector('.music-icon').textContent = '🎵';
    } else {
      audio.play().catch(() => { }); // Silently fail on autoplay block
      btn.classList.add('playing');
      btn.querySelector('.music-icon').textContent = '🎶';
    }
    playing = !playing;
  });
})();

/* ════════════════════════════════════════════════════════════
   6. CONFETTI BURST
════════════════════════════════════════════════════════════ */
(function initConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let pieces = [];
  let animId = null;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#f06292', '#e91e8c', '#ffd54f', '#ff80ab', '#ab47bc', '#42a5f5', '#66bb6a', '#ff7043'];
  const SHAPES = ['circle', 'rect', 'triangle'];

  class Piece {
    constructor(x, y) {
      this.x = x ?? W / 2;
      this.y = y ?? H * 0.4;
      this.vx = (Math.random() - 0.5) * 14;
      this.vy = -(Math.random() * 12 + 6);
      this.gravity = 0.45;
      this.size = Math.random() * 10 + 6;
      this.color = COLORS[0 | (Math.random() * COLORS.length)];
      this.shape = SHAPES[0 | (Math.random() * SHAPES.length)];
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpd = (Math.random() - 0.5) * 0.18;
      this.alpha = 1;
      this.alphaDecay = Math.random() * 0.012 + 0.008;
    }
    update() {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.rotSpd;
      this.vx *= 0.99;
      this.alpha -= this.alphaDecay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function burst(x, y, count = 90) {
    for (let i = 0; i < count; i++) pieces.push(new Piece(x, y));
    if (!animId) loop();
    haptic('heavy');
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    pieces = pieces.filter(p => p.alpha > 0);
    pieces.forEach(p => { p.update(); p.draw(); });
    if (pieces.length > 0) animId = requestAnimationFrame(loop);
    else { animId = null; }
  }

  document.getElementById('confettiBtn').addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 100);
  });

  // Also expose globally for click sparkle upgrade
  window.confettiBurst = burst;
})();

/* ════════════════════════════════════════════════════════════
   7. PETAL RAIN
════════════════════════════════════════════════════════════ */
(function initPetals() {
  const container = document.getElementById('petalRain');
  const FLOWERS = ['🌸', '🌺', '🌷', '🌹', '🏵️', '💮'];
  const COUNT = 22;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = FLOWERS[0 | (Math.random() * FLOWERS.length)];
    const left = Math.random() * 100;
    const dur = (Math.random() * 20 + 20).toFixed(1);
    const delay = (Math.random() * 20).toFixed(1);
    const drift = ((Math.random() - 0.5) * 30).toFixed(0);
    p.style.cssText = `left:${left}%;animation-duration:${dur}s;animation-delay:-${delay}s;--drift:${drift}px`;
    container.appendChild(p);
  }
})();

/* ════════════════════════════════════════════════════════════
   8. CLICK / TOUCH SPARKLE
════════════════════════════════════════════════════════════ */
(function initSparkle() {
  const EMOJIS = ['❤️', '✨', '🌸', '💗', '🌺', '💖', '⭐'];

  function spawnAt(x, y) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      const emoji = EMOJIS[0 | (Math.random() * EMOJIS.length)];
      const size = Math.random() * 16 + 14;
      el.textContent = emoji;
      el.style.cssText = `
        position:fixed;left:${x}px;top:${y}px;
        pointer-events:none;font-size:${size}px;
        z-index:9999;transform:translate(-50%,-50%);
        transition:all .75s cubic-bezier(.17,.67,.35,1.2);
        opacity:1;
      `;
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 70 + 30;
      const dx = (Math.cos(angle) * dist).toFixed(1);
      const dy = (Math.sin(angle) * dist).toFixed(1);

      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.3)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 800);
    }
    haptic('light');
  }

  // Desktop click
  document.addEventListener('click', e => {
    // Skip interactive elements
    if (e.target.closest('button,a,[role="button"]')) return;
    spawnAt(e.clientX, e.clientY);
  });

  // Mobile tap (touchend to avoid duplicates with click)
  let lastTouch = null;
  document.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    if (!t) return;
    // Prevent if it was a scroll
    if (lastTouch && Math.abs(t.clientY - lastTouch.clientY) > 10) return;
    if (e.target.closest('button,a,[role="button"]')) return;
    spawnAt(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    lastTouch = t ? { clientX: t.clientX, clientY: t.clientY } : null;
  }, { passive: true });
})();

/* ════════════════════════════════════════════════════════════
   9. 3D TILT on Message Cards (desktop only)
════════════════════════════════════════════════════════════ */
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // Skip touch devices

  const cards = document.querySelectorAll('.msg-card');
  const MAX = 12;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * MAX;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * -MAX;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
      card.style.boxShadow = `0 ${16 + Math.abs(rx)}px 50px rgba(194,24,91,0.22)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

/* ════════════════════════════════════════════════════════════
   10. HAPTIC FEEDBACK (Web Vibration API)
════════════════════════════════════════════════════════════ */
function haptic(intensity = 'light') {
  if (!navigator.vibrate) return;
  const patterns = { light: 10, medium: 30, heavy: [40, 30, 40] };
  navigator.vibrate(patterns[intensity] || 15);
}



/* ════════════════════════════════════════════════════════════
   12.  View Transitions API — Smooth section changes
════════════════════════════════════════════════════════════ */
if ('startViewTransition' in document) {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      document.startViewTransition(() => {
        target.scrollIntoView({ behavior: 'instant' });
      });
    });
  });
}
