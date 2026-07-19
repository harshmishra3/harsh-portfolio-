/* ====================================================================
   HARSH MISHRA — PORTFOLIO SCRIPT
   Organized by feature. Every feature is self-contained and safe to
   remove independently if you don't need it.
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. LOADING SCREEN
  --------------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderBarFill = document.getElementById('loaderBarFill');

  window.addEventListener('load', () => {
    if (loaderBarFill) loaderBarFill.style.transition = 'width .9s cubic-bezier(0.16,1,0.3,1)';
    requestAnimationFrame(() => { if (loaderBarFill) loaderBarFill.style.width = '100%'; });

    setTimeout(() => {
      loader?.classList.add('is-hidden');
      document.body.style.overflow = '';
    }, 900);
  });
  // Safety fallback in case 'load' fires late (slow assets)
  setTimeout(() => { loader?.classList.add('is-hidden'); }, 3500);
  document.body.style.overflow = 'hidden';


  /* ---------------------------------------------------------------
     2. CUSTOM CURSOR + MOUSE GLOW
  --------------------------------------------------------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouchDevice && cursorDot && cursorRing) {
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .skill-card, .service-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)');
      el.addEventListener('mouseleave', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  } else {
    cursorDot?.remove();
    cursorRing?.remove();
  }


  /* ---------------------------------------------------------------
     3. SCROLL PROGRESS BAR
  --------------------------------------------------------------- */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
  };


  /* ---------------------------------------------------------------
     4. STICKY NAV — scroll state, active link, mobile toggle
  --------------------------------------------------------------- */
  const nav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id]');

  const updateNavState = () => {
    if (window.scrollY > 40) nav?.classList.add('is-scrolled');
    else nav?.classList.remove('is-scrolled');
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const highlightActiveLink = () => {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });

    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };


  /* ---------------------------------------------------------------
     5. BACK TO TOP BUTTON
  --------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  const updateBackToTop = () => {
    backToTop?.classList.toggle('is-visible', window.scrollY > 600);
  };
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------------------------------------------------------------
     Combined scroll listener (perf: one rAF-throttled handler)
  --------------------------------------------------------------- */
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavState();
        highlightActiveLink();
        updateBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
  // Run once on load
  updateScrollProgress(); updateNavState(); highlightActiveLink(); updateBackToTop();


  /* ---------------------------------------------------------------
     6. TYPING ANIMATION (Hero)
  --------------------------------------------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const typingWords = [
    'Data Analyst',
    'Power BI Developer',
    'SQL Developer',
    'Python Enthusiast',
    'Business Intelligence Learner'
  ];

  if (typedTextEl) {
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    const type = () => {
      const currentWord = typingWords[wordIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      typedTextEl.textContent = currentWord.substring(0, charIndex);

      let speed = isDeleting ? 40 : 85;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1600; // pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
        speed = 300;
      }

      setTimeout(type, speed);
    };
    type();
  }


  /* ---------------------------------------------------------------
     7. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ---------------------------------------------------------------
     8. ANIMATED COUNTERS (KPI floats + achievements)
  --------------------------------------------------------------- */
  const counterEls = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counterEls.forEach(el => counterObserver.observe(el));


  /* ---------------------------------------------------------------
     9. HERO CANVAS — subtle animated dot-grid ("dashboard" motif)
  --------------------------------------------------------------- */
  const canvas = document.getElementById('heroGrid');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dots = [];
    const spacing = 42;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      dots = [];
      for (let x = 0; x < w; x += spacing * devicePixelRatio) {
        for (let y = 0; y < h; y += spacing * devicePixelRatio) {
          dots.push({ x, y, base: 0.5 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2 });
        }
      }
    };

    let mouseX = -9999, mouseY = -9999;
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * devicePixelRatio;
      mouseY = (e.clientY - rect.top) * devicePixelRatio;
    });
    canvas.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frame += 0.01;
      dots.forEach(d => {
        const dist = Math.hypot(d.x - mouseX, d.y - mouseY);
        const proximityBoost = dist < 160 * devicePixelRatio ? (1 - dist / (160 * devicePixelRatio)) : 0;
        const pulse = 0.3 + 0.2 * Math.sin(frame + d.phase);
        const alpha = Math.min(0.9, pulse * d.base + proximityBoost * 0.7);
        const size = (1.2 + proximityBoost * 1.8) * devicePixelRatio;

        ctx.beginPath();
        ctx.fillStyle = `rgba(59,130,246,${alpha})`;
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
  }


  /* ---------------------------------------------------------------
     10. CONTACT FORM — Web3Forms integration
     Replace the access_key hidden input value in index.html with your
     own free key from https://web3forms.com — no backend required.
  --------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const accessKey = contactForm.querySelector('[name="access_key"]').value;
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      formStatus.textContent = 'Form is not connected yet — add your Web3Forms access key in index.html.';
      formStatus.className = 'form-status is-error';
      return;
    }

    const originalLabel = formSubmitBtn.innerHTML;
    formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    formSubmitBtn.disabled = true;
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        formStatus.textContent = "Message sent — thank you! I'll reply soon.";
        formStatus.className = 'form-status is-success';
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Something went wrong.');
      }
    } catch (err) {
      formStatus.textContent = 'Could not send message. Please try again or email me directly.';
      formStatus.className = 'form-status is-error';
    } finally {
      formSubmitBtn.innerHTML = originalLabel;
      formSubmitBtn.disabled = false;
    }
  });


  /* ---------------------------------------------------------------
     11. FOOTER YEAR
  --------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
