/**
 * REGESIT - EVENT REGISTRATION PLATFORM - MAIN JAVASCRIPT LOGIC & INTERACTIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Kinetic Text Scramble Reveal for Hero Title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent.trim();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let iteration = 0;
    
    const scrambleInterval = setInterval(() => {
      heroTitle.textContent = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(scrambleInterval);
      }
      iteration += 1 / 3;
    }, 35);
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDropdown = document.getElementById('mobileNavDropdown');

  if (mobileToggle && mobileDropdown) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDropdown.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    mobileDropdown.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDropdown.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Interactive Services List Hover & Floating Yellow Cursor Follower
  const servicesList = document.getElementById('servicesList');
  const servicesCursor = document.getElementById('servicesCursor');
  const servicesHoverPreview = document.getElementById('servicesHoverPreview');
  const servicesPreviewImg = document.getElementById('servicesPreviewImg');
  const serviceItems = document.querySelectorAll('.service-item');

  if (servicesList && servicesCursor && servicesHoverPreview) {
    let mouseX = 0;
    let mouseY = 0;
    let currentCursorX = 0;
    let currentCursorY = 0;
    let isHoveringServices = false;

    // Track mouse position on window
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth animation loop for cursor follower and hover preview
    const renderCursor = () => {
      if (isHoveringServices) {
        currentCursorX += (mouseX - currentCursorX) * 0.18;
        currentCursorY += (mouseY - currentCursorY) * 0.18;

        servicesCursor.style.left = `${currentCursorX}px`;
        servicesCursor.style.top = `${currentCursorY}px`;

        servicesHoverPreview.style.left = `${currentCursorX + 90}px`;
        servicesHoverPreview.style.top = `${currentCursorY - 40}px`;
      }
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    servicesList.addEventListener('mouseenter', () => {
      isHoveringServices = true;
      servicesCursor.classList.add('active');
    });

    servicesList.addEventListener('mouseleave', () => {
      isHoveringServices = false;
      servicesCursor.classList.remove('active');
      servicesHoverPreview.classList.remove('active');
    });

    serviceItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const imgUrl = item.getAttribute('data-image');
        if (imgUrl && servicesPreviewImg) {
          servicesPreviewImg.src = imgUrl;
          servicesHoverPreview.classList.add('active');
        }
      });

      item.addEventListener('mouseleave', () => {
        // Optional: keep image until next hover or fade
      });
    });
  }

  // 3. Animated Number Counters on Scroll
  const counters = [
    { el: document.getElementById('projectCounter'), target: 304, decimals: 0, suffix: '' },
    { el: document.getElementById('ratingCounter'), target: 4.9, decimals: 1, suffix: '*' }
  ];

  let hasCounted = false;

  const animateCounters = () => {
    counters.forEach(({ el, target, decimals, suffix }) => {
      if (!el) return;

      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quad
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = (easeOut * target).toFixed(decimals);

        el.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = `${target.toFixed(decimals)}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasCounted) {
            hasCounted = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(metricsSection);
  }

  // 4. Timeline Slider / Carousel
  const timelineWrap = document.querySelector('.timeline-carousel-wrap');
  const prevBtn = document.getElementById('timelinePrev');
  const nextBtn = document.getElementById('timelineNext');

  if (timelineWrap && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      timelineWrap.scrollBy({ left: -340, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      timelineWrap.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }

  // 5. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
