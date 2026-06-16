document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

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
     4. INTERSECTION OBSERVER - STATS COUNT-UP
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCount = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1800; // 1.8 seconds duration
    const startTime = performance.now();
    const isPercentage = target === 100;
    
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      element.textContent = currentValue + (isPercentage ? '%' : '+');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + (isPercentage ? '%' : '+');
      }
    };
    
    requestAnimationFrame(update);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(num => statsObserver.observe(num));

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
        mainNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
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
    const hoverables = document.querySelectorAll('a, button, .why-card, .faq-header, .service-card, input, select, textarea');
    
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
