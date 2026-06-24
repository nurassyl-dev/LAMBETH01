/* =========================================================
   LAMBETH — Premium Animations & UX
   File: script.js
========================================================= */

/* -------------------- 1) REVEAL ON SCROLL -------------------- */
const revealItems = document.querySelectorAll(
    '.hero .container, .about .container, .instagram-video-card, .price-card, .scroll-gallery img, .gallery-video-card, .trial .container, .footer .container'
  );
  
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    }
  );
  
  revealItems.forEach(el => revealObserver.observe(el));
  
  
  /* -------------------- 2) SMOOTH SCROLL FOR ANCHORS -------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
  
      if (!targetEl) return;
  
      e.preventDefault();
      const offset = 80; // header height
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
  
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    });
  });
  
  
  /* -------------------- 3) PREMIUM SWIPE FEEL (GALERIES) -------------------- */
  document.querySelectorAll('.scroll-gallery').forEach(gallery => {
    let isDown = false;
    let startX;
    let scrollLeft;
  
    gallery.addEventListener('mousedown', e => {
      isDown = true;
      gallery.classList.add('dragging');
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });
  
    gallery.addEventListener('mouseleave', () => {
      isDown = false;
      gallery.classList.remove('dragging');
    });
  
    gallery.addEventListener('mouseup', () => {
      isDown = false;
      gallery.classList.remove('dragging');
    });
  
    gallery.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.4;
      gallery.scrollLeft = scrollLeft - walk;
    });
  });


  /* -------------------- 4) GALLERY VIDEO PLAYER -------------------- */
  document.querySelectorAll('.gallery-video-card').forEach(card => {
    const video = card.querySelector('video');
    const playButton = card.querySelector('.gallery-video-play');

    if (!video || !playButton) return;

    const playVideo = () => {
      video.muted = false;
      video.play().catch(() => {
        card.classList.remove('is-playing');
      });
    };

    ['pointerdown', 'mousedown', 'touchstart'].forEach(eventName => {
      playButton.addEventListener(eventName, event => {
        event.stopPropagation();
      });
    });

    playButton.addEventListener('click', playVideo);

    video.addEventListener('play', () => {
      card.classList.add('is-playing');
    });

    video.addEventListener('click', () => {
      if (video.paused) {
        playVideo();
        return;
      }

      video.pause();
    });

    video.addEventListener('pause', () => {
      card.classList.remove('is-playing');
    });

    video.addEventListener('ended', () => {
      card.classList.remove('is-playing');
    });
  });
  
  
  /* -------------------- 5) HIDE / SHOW BOTTOM BAR ON SCROLL -------------------- */
  const bottomBar = document.querySelector('.bottom-bar');
  let lastScrollY = window.scrollY;
  
  if (bottomBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > lastScrollY && window.scrollY > 120) {
        bottomBar.style.transform = 'translateY(120%)';
      } else {
        bottomBar.style.transform = 'translateY(0)';
      }
      lastScrollY = window.scrollY;
    });
  }
  
  
  /* -------------------- 6) MICRO BUTTON FEEDBACK -------------------- */
  document.querySelectorAll('.btn, .bottom-bar a').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 180);
    });
  });
  
  
  /* -------------------- 7) SAFETY CHECK -------------------- */
  console.log('🔥 LAMBETH JS loaded successfully');

  /* -------------------- 8) INSTAGRAM EMBED REFRESH -------------------- */
  function processInstagramEmbeds() {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  }

  document.addEventListener('DOMContentLoaded', processInstagramEmbeds);
  window.addEventListener('load', processInstagramEmbeds);

  /* =========================================================
   HEADER MENU — ACTIVE + AUTO SCROLL
========================================================= */

const menuLinks = document.querySelectorAll('.header-menu a');
const sections = [...menuLinks].map(link =>
  document.querySelector(link.getAttribute('href'))
);
const menuContainer = document.querySelector('.header-center');
const siteHeader = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');

function closeMobileMenu() {
  if (!siteHeader || !menuToggle) return;

  siteHeader.classList.remove('is-menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}

if (siteHeader && menuToggle && menuContainer) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('is-menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  document.addEventListener('click', event => {
    if (!siteHeader.classList.contains('is-menu-open')) return;
    if (siteHeader.contains(event.target)) return;

    closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMobileMenu();
  });
}

function setActiveMenu() {
  let currentIndex = 0;

  sections.forEach((section, index) => {
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) {
      currentIndex = index;
    }
  });

  menuLinks.forEach(link => link.classList.remove('active'));
  const activeLink = menuLinks[currentIndex];
  if (!activeLink) return;

  activeLink.classList.add('active');

  /* автопрокрутка меню */
  const linkRect = activeLink.getBoundingClientRect();
  const containerRect = menuContainer.getBoundingClientRect();

  if (
    linkRect.left < containerRect.left ||
    linkRect.right > containerRect.right
  ) {
    menuContainer.scrollTo({
      left:
        activeLink.offsetLeft -
        menuContainer.offsetWidth / 2 +
        activeLink.offsetWidth / 2,
      behavior: 'smooth'
    });
  }
}

window.addEventListener('scroll', setActiveMenu);
window.addEventListener('load', setActiveMenu);

/* ================= WHY US INTERACTIONS ================= */

document.addEventListener("DOMContentLoaded", () => {

  /* reveal animation (если у тебя уже есть reveal — это совместимо) */
  const whySection = document.querySelector(".why-us .container");
  if (whySection) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(whySection);
  }

  /* focus active card on swipe (mobile) */
  const cards = document.querySelectorAll(".why-card");
  const wrapper = document.querySelector(".why-cards");

  if (wrapper && cards.length) {
    wrapper.addEventListener("scroll", () => {
      const center = wrapper.scrollLeft + wrapper.offsetWidth / 2;

      cards.forEach(card => {
        const cardCenter =
          card.offsetLeft + card.offsetWidth / 2;

        const distance = Math.abs(center - cardCenter);

        if (distance < card.offsetWidth / 2) {
          card.style.transform = "scale(1.02)";
        } else {
          card.style.transform = "";
        }
      });
    });
  }

});
