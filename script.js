document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initialize Lenis Smooth Scroll (Awwwards-grade smooth scroll effect)
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // Bind all anchor links to scroll smoothly via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: -80, // offset navbar height
            duration: 1.2
          });
        }
      });
    });
  }

  /* ==========================================================================
     0. LETTER POP ANIMATION FOR TITLE
     ========================================================================== */
  const letterAnimateElements = document.querySelectorAll('.letter-animate');
  
  letterAnimateElements.forEach(element => {
    const text = element.textContent || '';
    element.textContent = '';
    
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = char === ' ' ? 'letter space' : 'letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(span);
    });
  });

  /* ==========================================================================
     1. MOBILE MENU TOGGLE
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    // Toggle Menu
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is active
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close Menu when clicking Links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close Menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     2. STICKY NAVBAR ON SCROLL
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  
  const handleScrollNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollNavbar);
  handleScrollNavbar(); // Initial check on load

  /* ==========================================================================
     3. INTERSECTION OBSERVER - SCROLL REVEALS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Unobserve to keep performance optimal after animating
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     4. INTERSECTION OBSERVER - STATS COUNT-UP (Both Hero and About) - AUTO ANIMATE
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number, .stat-number-large, .stat-number-hero');
  
  console.log('Found stat elements:', statNumbers.length);
  
  const animateCount = (element) => {
    // Get target from data attribute or text content
    let target;
    let hasPlus = false;
    let isPercentage = false;
    
    if (element.hasAttribute('data-target')) {
      // If data-target exists, use it
      target = parseInt(element.getAttribute('data-target'), 10);
      // Check original content for + or %
      const originalText = element.textContent || '';
      hasPlus = originalText.includes('+');
      isPercentage = originalText.includes('%');
    } else {
      // Extract from text content
      const originalText = element.textContent || '';
      hasPlus = originalText.includes('+');
      isPercentage = originalText.includes('%');
      target = parseInt(originalText.replace(/\D/g, ''), 10);
      // Store for future reference
      element.setAttribute('data-target', target);
    }
    
    console.log('Animating element:', element, 'Target:', target, 'hasPlus:', hasPlus);
    
    if (isNaN(target)) {
      console.warn('Invalid target for element:', element);
      return;
    }
    
    const duration = 1500; // 1.5 second animation - fast and smooth
    const startTime = performance.now();
    
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Fast easing function (easeOutCubic for speed)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * target);
      
      // Update text
      if (hasPlus) {
        element.textContent = currentValue + '+';
      } else if (isPercentage) {
        element.textContent = currentValue + '%';
      } else {
        element.textContent = currentValue;
      }
      
      // Add pulse effect during counting
      if (progress < 1) {
        const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.05;
        element.style.transform = `scale(${scale})`;
        element.style.transition = 'transform 0.1s ease';
        requestAnimationFrame(update);
      } else {
        // Final value
        if (hasPlus) {
          element.textContent = target + '+';
        } else if (isPercentage) {
          element.textContent = target + '%';
        } else {
          element.textContent = target;
        }
        element.style.transform = 'scale(1)';
      }
    };
    
    // Start from 0
    element.textContent = '0' + (hasPlus ? '+' : isPercentage ? '%' : '');
    requestAnimationFrame(update);
  };

  // Use lower threshold so animation triggers more reliably
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Element entered viewport:', entry.target);
        // Animate immediately
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when just 10% visible
    rootMargin: '0px 0px -50px 0px'
  });

  statNumbers.forEach(num => {
    console.log('Observing:', num);
    statsObserver.observe(num);
  });

  /* ==========================================================================
     5. DYNAMIC SCROLL ACTIVE NAV LINK HIGHLIGHT
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  const highlightNav = () => {
    const scrollPosition = window.scrollY + 120; // offset for nav header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        let targetId = sectionId;
        if (sectionId === 'why-us') targetId = 'about';
        if (sectionId === 'process') targetId = 'services';

        const hasMatchingLink = Array.from(mainNavLinks).some(link => link.getAttribute('href') === `#${targetId}`);
        if (hasMatchingLink) {
          mainNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${targetId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Initial check on load

  /* ==========================================================================
     6. FAQ ACCORDION INTERACTION
     ========================================================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all other FAQ items for a clean single-open accordion feel
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
      });
      
      if (!isActive) {
        parent.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     7. SCROLL PROGRESS BAR
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  
  const updateScrollProgress = () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0 && scrollProgress) {
      const progressPercentage = (window.scrollY / totalScroll) * 100;
      scrollProgress.style.width = `${progressPercentage}%`;
    }
  };

  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress(); // Initial check

  /* ==========================================================================
     8. AWWWARDS CUSTOM TRAILING CURSOR
     ========================================================================== */
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (cursor && cursorDot) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let hasMoved = false;
    
    // Track mouse movements
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Small core dot follows mouse coordinates exactly
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      
      if (!hasMoved) {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        hasMoved = true;
      }
    });
    
    // Smooth custom physics outer ring loop
    const animateCursor = () => {
      const ease = 0.16; // trailing delay ease
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);
    
    // Hide when mouse departs document window
    document.addEventListener('mouseleave', () => {
      cursor.classList.add('hidden');
      cursorDot.classList.add('hidden');
    });
    
    document.addEventListener('mouseenter', () => {
      cursor.classList.remove('hidden');
      cursorDot.classList.remove('hidden');
    });
    
    // Expand outer ring on interactive hovers
    const hoverables = document.querySelectorAll('a, button, .why-card, .faq-header, .service-card, .project-card, .pillar-card, input, select, textarea');
    
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
      });
    });
  }

  /* ==========================================================================
     9. PRELOADER LOADING SCREEN DISMISSAL
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Dismiss preloader after loading animation completes
    setTimeout(() => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800); // matches CSS transition time
    }, 1600); // matches CSS progress bar loader time
  }

  /* ==========================================================================
     10. INTAKE FORM SUBMISSION OVERLAY SYSTEM
     ========================================================================== */
  const consultationForm = document.getElementById('consultation-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const resetFormBtn = document.getElementById('btn-reset-form');

  if (consultationForm && successOverlay) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      successOverlay.classList.add('active');
    });
  }

  if (resetFormBtn && consultationForm && successOverlay) {
    resetFormBtn.addEventListener('click', () => {
      consultationForm.reset();
      successOverlay.classList.remove('active');
    });
  }
});
