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

  // Website Bio-Data PDF Downloader
  const downloadBtns = document.querySelectorAll('.download-bio-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Creates a pristine, strictly A4-styled virtual element in memory
      const printableContent = document.createElement('div');
      printableContent.style.width = '800px';
      printableContent.style.padding = '60px';
      printableContent.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
      printableContent.style.background = 'white';
      printableContent.style.color = '#222';
      printableContent.style.boxSizing = 'border-box';
      // Append strictly off-screen
      printableContent.style.position = 'absolute';
      printableContent.style.left = '-9999px';
      printableContent.style.top = '-9999px';

      printableContent.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 38px; color: #111; margin: 0; font-weight: 800; letter-spacing: 1px;">PARTH SADHU</h1>
          <h3 style="font-size: 18px; color: #10b981; margin: 10px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Full Stack Developer & AI Engineer</h3>
          <p style="margin: 15px 0 0 0; color: #555; font-size: 14px;">Rajkot, Gujarat • parth.ramanujj@gmail.com • github.com/Parth-Ramanujj</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Professional Summary</h2>
          <p style="font-size: 14.5px; line-height: 1.6; color: #444; margin: 10px 0 0 0;">
            Highly motivated and visionary Full Stack Developer specializing in AI integrations and modern web applications. 
            Proven ability to architect full-scale platforms from complex React-based dynamic dashboards to intelligent predictive algorithms using Machine Learning. Deeply passionate about writing robust logic, executing clean cloud infrastructure, and deploying flawless digital experiences.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Technical & Core Skills</h2>
          <div style="margin-top: 15px;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color:#111;">Languages & Web:</strong> HTML5, CSS3, JavaScript, TypeScript, React, Vite, Node.js, Express</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color:#111;">Database & Cloud:</strong> MongoDB, SQL, Firebase, AWS</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color:#111;">AI / ML Engineering:</strong> Python Automation, Predictive Data Models, Computer Vision</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Highlight Projects</h2>
          
          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0; font-size: 16px; color: #222;">PadosiAgent-s (AI Solution)</h4>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #444; line-height: 1.5;">Advanced artificial intelligence infrastructure capable of autonomous localized web responses.</p>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0; font-size: 16px; color: #222;">Fleet Flow Logistics Management System</h4>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #444; line-height: 1.5;">Comprehensive enterprise-grade fleet administration frontend. Tracks multiple active vehicles simultaneously with interactive mapping architectures.</p>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0; font-size: 16px; color: #222;">apiCrop Machine Learning API</h4>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #444; line-height: 1.5;">Smart predictive models utilizing high-level Python analysis libraries to output crucial environmental statistics.</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Education & Leadership</h2>
          <div style="margin-bottom: 10px;">
            <h4 style="margin: 0; font-size: 16px; color: #222;">Academic Career</h4>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #444;">Continuous dedicated learning toward advanced software infrastructure, algorithms, and applied machine learning logic.</p>
          </div>
          <div style="margin-bottom: 10px;">
            <h4 style="margin: 0; font-size: 16px; color: #222;">NCC - National Cadet Corps</h4>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #444;">Active disciplined participant. Strong emphasis on collaborative physical leadership, structural integrity, and dedicated focus.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px;">
          Dynamically verified & generated via Parth Sadhu's Portfolio.
        </div>
      `;

      // Momentarily attach hidden element to document body to ensure true CSS scaling rendering
      document.body.appendChild(printableContent);

      // Give slightly more standard PDF margins for A4 clean format 
      const opt = {
        margin: 10,
        filename: 'Parth_BioData.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          backgroundColor: '#FFFFFF'
        },
        jsPDF: { unit: 'px', format: [820, printableContent.scrollHeight + 50], orientation: 'portrait' }
      };

      html2pdf().set(opt).from(printableContent).save().then(() => {
        // Guarantee clean DOM removal
        if (document.body.contains(printableContent)) {
          document.body.removeChild(printableContent);
        }
      });
    });
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
