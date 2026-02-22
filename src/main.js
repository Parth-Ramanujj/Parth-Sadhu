import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Update footer year dynamically
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger lines
    const lines = hamburger.querySelectorAll('.line');
    if (navLinks.classList.contains('active')) {
      lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  });

  // Sticky Navbar on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100; // Trigger earlier

    revealElements.forEach((el) => {
      const revealTop = el.getBoundingClientRect().top;
      if (revealTop < windowHeight - revealPoint) {
        el.classList.add('active');
      }
    });

    // Update active nav link based on scroll position
    const navLinksArray = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinksArray.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);

  // Trigger initially for visible elements
  setTimeout(() => {
    revealOnScroll();
    // Special trigger for hero section elements initially
    const heroElements = document.querySelectorAll('.hero .reveal');
    heroElements.forEach(el => el.classList.add('active'));
  }, 100);

  // Smooth scroll for nav links (specifically to offset sticky header)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);

      // Close mobile menu if open
      if (navLinks.classList.contains('active')) {
        hamburger.click();
      }

      if (targetEl) {
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form handling (Mocked)
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.innerHTML;

    // Simulate loading state
    btn.innerHTML = '<span>Sending...</span>';
    btn.style.opacity = '0.8';

    setTimeout(() => {
      btn.innerHTML = '<span>Sent Successfully!</span>';
      btn.style.background = '#10b981'; // Success Color
      contactForm.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.opacity = '1';
      }, 3000);
    }, 1500);
  });
  // Music Player Handling (Forced loop with optional mute)
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const musicText = document.getElementById('musicText');

  if (bgMusic) {
    bgMusic.volume = 0.3; // Set a pleasant default volume

    // Attempt to start music on the very first user interaction
    const initAudio = () => {
      // If user hasn't actively muted it, and it's paused, try to play
      if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Audio logic blocked:', e));
      }

      // Clean up the listeners so this only runs once
      ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt =>
        document.removeEventListener(evt, initAudio)
      );
    };

    ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt =>
      document.addEventListener(evt, initAudio)
    );

    if (musicToggle) {
      // Sync UI with actual play state
      const updateMusicBtnUI = () => {
        if (bgMusic.paused) {
          musicIcon.textContent = '🔇';
          musicText.textContent = 'Play Music';
        } else {
          musicIcon.textContent = '🔊';
          musicText.textContent = 'Mute Music';
        }
      };

      bgMusic.addEventListener('play', updateMusicBtnUI);
      bgMusic.addEventListener('pause', updateMusicBtnUI);
      // Run once to catch initial state
      updateMusicBtnUI();

      musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
          bgMusic.play().catch(e => console.log('Audio play blocked:', e));
        } else {
          bgMusic.pause();
        }
      });
    }
  }
  // Lightbox Implementation
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  // Get all images in the gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryImages = document.querySelectorAll('.gallery-item img');
  let currentImageIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    // Open lightbox
    galleryItems.forEach((item, index) => {
      item.style.cursor = 'pointer'; // Add pointer cursor
      item.addEventListener('click', () => {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });
    });

    const updateLightboxImage = () => {
      lightboxImg.src = galleryImages[currentImageIndex].src;
    };

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scrolling
    };

    closeBtn.addEventListener('click', closeLightbox);

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
      }
    });

    // Navigation
    const nextImage = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      updateLightboxImage();
    };

    const prevImage = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    };

    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  }

  // Custom Audio for Videos
  const highlightVideos = document.querySelectorAll('.highlight-video');
  highlightVideos.forEach(video => {
    const audioSrc = video.getAttribute('data-bg-audio');
    if (audioSrc) {
      const vidAudio = new Audio(audioSrc);
      vidAudio.loop = true;
      vidAudio.volume = 0.6; // Aesthetic video background volume

      video.addEventListener('play', () => {
        // Lower global background music so it doesn't clash
        if (bgMusic) bgMusic.volume = 0.05;
        vidAudio.play().catch(e => console.log('Video custom audio blocked:', e));
      });

      video.addEventListener('pause', () => {
        vidAudio.pause();
        // Restore global music if no other video is playing
        const isAnyVideoPlaying = Array.from(highlightVideos).some(v => !v.paused && !v.ended);
        if (!isAnyVideoPlaying && bgMusic) {
          bgMusic.volume = 0.3;
        }
      });

      video.addEventListener('ended', () => {
        vidAudio.pause();
        const isAnyVideoPlaying = Array.from(highlightVideos).some(v => !v.paused && !v.ended);
        if (!isAnyVideoPlaying && bgMusic) {
          bgMusic.volume = 0.3;
        }
      });

      // Completely force-mute original video voice if user tries to unmute
      video.muted = true;
      video.addEventListener('volumechange', () => {
        if (!video.muted || video.volume > 0) {
          video.muted = true;
          video.volume = 0;
        }
      });
    }
  });

  // Prevent downloading of images and videos
  document.addEventListener('contextmenu', event => {
    if (event.target.tagName === 'IMG' || event.target.tagName === 'VIDEO') {
      event.preventDefault();
    }
  });

  // Prevent drag and drop for images
  document.addEventListener('dragstart', event => {
    if (event.target.tagName === 'IMG') {
      event.preventDefault();
    }
  });

});
