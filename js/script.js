/* ==========================================================================
   Veeva Master Template (MT) 3.0 JavaScript Logic
   Augmentin ABRS Adult eDetailing
   ========================================================================== */

let currentSlide = 0;
const slidesWrapper = document.getElementById('slidesWrapper');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

const btnHome = document.getElementById('btnHome');
const btnMenu = document.getElementById('btnMenu');
const btnPI = document.getElementById('btnPI');
const btnRef = document.getElementById('btnRef');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

const slide1Video = document.getElementById('slide1Video');

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateSlideState();
  initVideoPlayback();
});

function initVideoPlayback() {
  if (slide1Video) {
    // Attempt play on load
    const promise = slide1Video.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Autoplay policy prevented immediate playback; play on first user interaction
        const startPlayOnInteraction = () => {
          if (currentSlide === 0) {
            slide1Video.play().catch(() => {});
          }
          document.removeEventListener('click', startPlayOnInteraction);
          document.removeEventListener('touchstart', startPlayOnInteraction);
          document.removeEventListener('keydown', startPlayOnInteraction);
        };
        document.addEventListener('click', startPlayOnInteraction, { once: true });
        document.addEventListener('touchstart', startPlayOnInteraction, { once: true });
        document.addEventListener('keydown', startPlayOnInteraction, { once: true });
      });
    }
  }
}

function setupEventListeners() {
  if (btnHome) btnHome.addEventListener('click', () => goToSlide(0));
  if (btnMenu) btnMenu.addEventListener('click', () => openModal('modalMenu'));
  if (btnPI) btnPI.addEventListener('click', () => openModal('modalPI'));
  if (btnRef) btnRef.addEventListener('click', () => openModal('modalRef'));
  if (btnPrev) btnPrev.addEventListener('click', () => prevSlide());
  if (btnNext) btnNext.addEventListener('click', () => nextSlide());

  // Close modals on clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') nextSlide();
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
    if (e.key === 'Escape') {
      closeModal('modalPI');
      closeModal('modalRef');
      closeModal('modalMenu');
    }
  });

  // Universal Swipe & Drag Handling (Touch on iPad/Tablets & Mouse/Pointer on Desktop)
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let isSwiping = false;
  const threshold = 35; // px minimum horizontal displacement for swipe

  function isModalOpen() {
    return document.querySelector('.modal-overlay.open') !== null;
  }

  function handleSwipeGesture() {
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // Must be predominantly horizontal gesture to avoid triggering during vertical scroll
    if (Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Pointer Events (Unified handler for Touch, Mouse, Pen)
  window.addEventListener('pointerdown', (e) => {
    if (isModalOpen()) return;
    if (e.target.closest('.veeva-bottom-bar') || e.target.closest('.modal-overlay') || e.target.closest('button')) return;

    startX = e.clientX;
    startY = e.clientY;
    endX = e.clientX;
    endY = e.clientY;
    isSwiping = true;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isSwiping) return;
    endX = e.clientX;
    endY = e.clientY;
  });

  window.addEventListener('pointerup', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    endX = e.clientX;
    endY = e.clientY;
    handleSwipeGesture();
  });

  window.addEventListener('pointercancel', () => {
    isSwiping = false;
  });

  // Touch Events Fallback for legacy iOS Safari / WebViews
  window.addEventListener('touchstart', (e) => {
    if (isModalOpen() || e.touches.length > 1) return;
    if (e.target.closest('.veeva-bottom-bar') || e.target.closest('.modal-overlay') || e.target.closest('button')) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    endX = startX;
    endY = startY;
    isSwiping = true;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isSwiping || e.touches.length === 0) return;
    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    handleSwipeGesture();
  }, { passive: true });
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  currentSlide = index;
  updateSlideState();
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlideState();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlideState();
  }
}

function updateSlideState() {
  slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

  slides.forEach((slide, i) => {
    if (i === currentSlide) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  if (slide1Video) {
    if (currentSlide === 0) {
      slide1Video.play().catch(() => {});
    } else {
      slide1Video.pause();
    }
  }

  if (btnPI) {
    btnPI.classList.remove('active');
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

const video = document.getElementById("myVideo");
const button = document.getElementById("playPause");

button.addEventListener("click", () => {
    if (video.paused) {
        video.play();
        button.textContent = "Pause";
    } else {
        video.pause();
        button.textContent = "Play";
    }
});

video.addEventListener("ended", () => {
    button.textContent = "Play";
});
