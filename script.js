/* =========================================================
   The Bowler Family Archive — interaction layer
   ========================================================= */

(function () {
  'use strict';

  // ---- Reveal on scroll
  const revealSelectors = [
    '.story',
    '.t-event',
    '.gg-card',
    '.node-card',
    '.deepest-frame',
    '.dna-panel',
    '.compare-row',
    '.section-head'
  ];

  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.9s ease-out, transform 0.9s cubic-bezier(.2,.7,.3,1)';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = Math.min(i * 60, 300);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => io.observe(el));

  // ---- Smooth nav scroll with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---- Nav active state on scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const setActive = () => {
    const scrollPos = window.scrollY + (window.innerHeight * 0.3);
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.id;
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--oxblood)';
          }
        });
      }
    });
  };
  let scrollTimer;
  window.addEventListener('scroll', () => {
    if (scrollTimer) cancelAnimationFrame(scrollTimer);
    scrollTimer = requestAnimationFrame(setActive);
  }, { passive: true });
  setActive();

  // ---- Bars: when their parent row reveals, animate the width
  // CSS already does the static fill via --w. We just trigger a subtle bloom.
  const bars = document.querySelectorAll('.bar:not(.bar-empty)');
  bars.forEach(bar => {
    const finalWidth = bar.style.getPropertyValue('--w') || '0%';
    bar.style.setProperty('--w', '0%');
    const barIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.setProperty('--w', finalWidth);
          }, 200);
          barIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    barIo.observe(bar);
  });

  // ---- Subtle parallax on hero frame
  const heroFrame = document.querySelector('.hero-frame');
  if (heroFrame) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 800) {
        heroFrame.style.transform = `translateY(${scrolled * 0.08}px)`;
        heroFrame.style.opacity = `${Math.max(0, 1 - scrolled / 600)}`;
      }
    }, { passive: true });
  }

  // ---- Surname cloud: slight randomised tilt for handwritten feel
  document.querySelectorAll('.sn').forEach((sn) => {
    const tilt = (Math.random() - 0.5) * 6;
    sn.style.transform = `rotate(${tilt}deg)`;
    sn.style.transition = 'transform 0.3s, color 0.3s';
    sn.addEventListener('mouseenter', () => {
      sn.style.transform = `rotate(${tilt * 0.3}deg) translateY(-3px)`;
    });
    sn.addEventListener('mouseleave', () => {
      sn.style.transform = `rotate(${tilt}deg)`;
    });
  });
})();
