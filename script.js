// Smooth scroll for navigation
// Custom smooth scroll with easing and arrival animation
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollToTarget(target, duration = 700, offset = 80) {
  if (!target) return;
  const startY = window.scrollY || window.pageYOffset;
  const rect = target.getBoundingClientRect();
  const targetY = startY + rect.top - offset;
  const startTime = performance.now();

  // ensure native smooth isn't interfering
  const step = (time) => {
    const elapsed = time - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = easeInOutCubic(t);
    window.scrollTo(0, Math.round(startY + (targetY - startY) * eased));
    if (t < 1) requestAnimationFrame(step);
    else {
      // arrival animation
      target.classList.add('incoming');
      setTimeout(() => target.classList.remove('incoming'), 800);
    }
  };

  requestAnimationFrame(step);
}

// Attach smooth scroll to all same-page anchor links (skip plain "#")
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href === '#') return;
  link.addEventListener('click', e => {
    // Only handle links that target an element on the page
    const target = document.querySelector(href);
    if (!target) return; // let default behavior occur for non-targets
    e.preventDefault();
    smoothScrollToTarget(target, 800, 92);
  });
});

// Lightbox / simple modal for images and video
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.lightbox-close');

function openLightbox(type, src) {
  lightboxContent.innerHTML = '';
  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Preview';
    lightboxContent.appendChild(img);
  } else if (type === 'video') {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    lightboxContent.appendChild(video);
  }
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  // stop any playing video
  const v = lightboxContent.querySelector('video');
  if (v) { v.pause(); v.src = ''; }
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxContent.innerHTML = '';
}

document.querySelectorAll('.gallery-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type || 'image';
    const src = btn.dataset.src;
    if (!src) return;
    openLightbox(type, src);
  });
});

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

// Reveal sections and stagger project cards on scroll
const sections = document.querySelectorAll('.section');
const projectCards = document.querySelectorAll('.project-card');

// Observer toggles visibility; project-cards should animate each time they enter/exit the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    // If this is a project card, toggle visible on intersect so animation can replay
    if (el.classList.contains('project-card')) {
      if (entry.isIntersecting) {
        el.classList.add('visible');
        el.classList.remove('reveal');
      } else {
        el.classList.remove('visible');
        // re-add reveal state so when it re-enters it transitions again
        el.classList.add('reveal');
      }
      return; // continue for other entries
    }

    // for regular sections: reveal once and stop observing
    if (entry.isIntersecting) {
      el.classList.add('visible');
      el.classList.remove('reveal');
      observer.unobserve(el);
    }
  });
},{ threshold: 0.12 });

sections.forEach(s => { s.classList.add('reveal'); observer.observe(s); });
projectCards.forEach((c, i) => { c.classList.add('reveal','slide-in-right'); c.style.transitionDelay = `${i * 80}ms`; observer.observe(c); });

// Hero subtle parallax (mouse move)
const hero = document.querySelector('.section-hero');
const heroName = document.querySelector('.hero-name-bg');
const heroPhoto = document.querySelector('.hero-photo img');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (heroName) heroName.style.transform = `translate3d(${x * 30}px, ${y * 20}px, 0) rotate(${x * 2}deg)`;
    if (heroPhoto) heroPhoto.style.transform = `translate3d(${x * -12}px, ${y * -8}px, 0) rotate(${x * -1.5}deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    if (heroName) heroName.style.transform = '';
    if (heroPhoto) heroPhoto.style.transform = '';
  });
}

// Interactive tilt for project tiles
const tiltMax = 10; // degrees
projectCards.forEach(card => {
  let height, width, left, top;
  const media = card.querySelector('.project-media');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    height = rect.height; width = rect.width; left = rect.left; top = rect.top;
    const relX = (e.clientX - left) / width - 0.5; // -0.5..0.5
    const relY = (e.clientY - top) / height - 0.5;
    const rotY = relX * tiltMax * -1;
    const rotX = relY * tiltMax;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Skills slider: pause on hover/focus for accessibility
const skillsTrack = document.querySelector('.skills-track');
if (skillsTrack) {
  const pause = () => skillsTrack.classList.add('paused');
  const resume = () => skillsTrack.classList.remove('paused');
  skillsTrack.addEventListener('mouseenter', pause);
  skillsTrack.addEventListener('mouseleave', resume);
  skillsTrack.addEventListener('focusin', pause);
  skillsTrack.addEventListener('focusout', resume);
}

// When hovering an individual skill, pause and highlight it while blurring others
if (skillsTrack) {
  const skillCards = skillsTrack.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      skillsTrack.classList.add('paused','has-focus');
      card.classList.add('focused');
    });
    card.addEventListener('mouseleave', () => {
      // remove focused state from this card; keep paused/has-focus until leaving the whole track
      card.classList.remove('focused');
    });
  });

  // when leaving the whole track, resume animation and clear focus
  skillsTrack.addEventListener('mouseleave', () => {
    skillsTrack.classList.remove('paused','has-focus');
    skillCards.forEach(c => c.classList.remove('focused'));
  });
}

// Highlight project card on hover/focus and blur others
const projectList = document.querySelector('.project-list');
if (projectList) {
  const cards = projectList.querySelectorAll('.project-card');

  function clearProjectFocus() {
    projectList.classList.remove('projects-focus');
    cards.forEach(c => c.classList.remove('focused'));
  }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      projectList.classList.add('projects-focus');
      cards.forEach(c => c.classList.remove('focused'));
      card.classList.add('focused');
    });

    // also support keyboard focus for accessibility
    card.addEventListener('focusin', () => {
      projectList.classList.add('projects-focus');
      cards.forEach(c => c.classList.remove('focused'));
      card.classList.add('focused');
    });
  });

  projectList.addEventListener('mouseleave', clearProjectFocus);
  projectList.addEventListener('focusout', (e) => {
    // if focus moves outside the projectList entirely, clear focus
    if (!projectList.contains(document.activeElement)) clearProjectFocus();
  });
}

// Autoplay/pause project videos on hover
document.querySelectorAll('.project-media').forEach(container => {
  const v = container.querySelector('video');
  if (!v) return;
  // ensure muted so autoplay is allowed
  v.muted = true;
  v.pause();

  let playPromise = null;
  container.addEventListener('mouseenter', () => {
    // try to play; ignore errors
    playPromise = v.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(()=>{});
    }
    container.classList.add('video-playing');
  });

  container.addEventListener('mouseleave', () => {
    v.pause();
    container.classList.remove('video-playing');
  });

  // also pause when focus is lost
  v.addEventListener('pause', ()=> container.classList.remove('video-playing'));
});

// project link clicks (open in new tab)
document.querySelectorAll('.project-links a').forEach(a => {
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href && href !== '#') window.open(href, '_blank');
  });
});

// Theme toggle (persists in localStorage)
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme) {
  if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
  if (themeToggle) themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
}

const savedTheme = localStorage.getItem('site-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('site-theme', next);
  });
}

// Contact form handling: supports posting to an external endpoint (Formspree, Netlify, custom)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const notice = document.getElementById('contactNotice');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();
    if (!name || !email || !message) {
      if (notice) notice.textContent = 'Please fill in all fields.';
      return;
    }

    const endpoint = contactForm.dataset.endpoint && contactForm.dataset.endpoint.trim();
    // Show immediate feedback
    if (notice) notice.textContent = 'Sending...';

    // If no endpoint provided, simulate send (local demo)
    if (!endpoint) {
      setTimeout(() => {
        contactForm.reset();
        if (notice) notice.textContent = 'Thanks — your message was sent (simulated). Replace `data-endpoint` on the form to enable real delivery.';
      }, 700);
      return;
    }

    // Submit via fetch using FormData. Formspree and many endpoints accept this.
    try {
      const formData = new FormData(contactForm);
      // For Formspree, they accept multipart/form-data with Accept: application/json for JSON response
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.reset();
        if (notice) notice.textContent = 'Thanks — your message was sent. I will get back to you soon.';
      } else {
        // Try to parse json message from Formspree
        let text = 'Sending failed. Please check the form endpoint or try again later.';
        try { const j = await res.json(); if (j && j.error) text = j.error; } catch (err) {}
        if (notice) notice.textContent = text;
        console.error('Form submit error', res.status, res.statusText);
      }
    } catch (err) {
      if (notice) notice.textContent = 'Error sending message. Check your network or form endpoint.';
      console.error(err);
    }
  });
}

// Mobile sidebar toggle
const hamburger = document.getElementById('hamburger');
const mobileSidebar = document.getElementById('mobileSidebar');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');
function isMobileView() {
  return window.matchMedia && window.matchMedia('(max-width: 880px)').matches;
}

function openSidebar() {
  if (!isMobileView()) return; // only open on mobile
  if (mobileSidebar) mobileSidebar.classList.add('open');
  if (mobileOverlay) mobileOverlay.classList.add('open');
  if (hamburger) hamburger.setAttribute('aria-expanded','true');
  document.documentElement.style.overflow = 'hidden';
}

function closeSidebar() {
  if (mobileSidebar) mobileSidebar.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('open');
  if (hamburger) hamburger.setAttribute('aria-expanded','false');
  document.documentElement.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', () => {
  if (!isMobileView()) return;
  // toggle
  if (mobileSidebar && mobileSidebar.classList.contains('open')) closeSidebar();
  else openSidebar();
});
if (mobileClose) mobileClose.addEventListener('click', () => { if (isMobileView()) closeSidebar(); });
if (mobileOverlay) mobileOverlay.addEventListener('click', () => { if (isMobileView()) closeSidebar(); });

// close sidebar when a mobile nav link is clicked (and smooth scroll will handle navigation)
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    if (isMobileView()) setTimeout(closeSidebar, 120);
  });
});

// Close sidebar on resize when switching to desktop
window.addEventListener('resize', () => {
  if (!isMobileView() && mobileSidebar && mobileSidebar.classList.contains('open')) {
    closeSidebar();
  }
});

// Close sidebar on Escape (only when open and in mobile view)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMobileView() && mobileSidebar && mobileSidebar.classList.contains('open')) {
    closeSidebar();
  }
});
