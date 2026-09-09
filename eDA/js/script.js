/**
 * Ceftum Monsoon eDetailer - Master Presentation Controller
 * Architecture: 5 Chapters with Subpages
 * - Chapter 1 (Hub Page 1): Subpages 2, 3, 4, 5
 * - Chapter 2 (Hub Page 6): Subpages 7, 8, 9, 10 (A Case of Bacterial RTI and Treatment)
 * - Chapter 3 (Hub Page 11): Subpages 12, 13, 14, 15 (A Case of URTI: Clinical Management)
 * - Chapter 4 (Hub Page 16): Subpages 17, 18, 19, 20 (A Case of AECOPD)
 * - Chapter 5 (Hub Page 21): Subpages 22, 23 (Thank you for Creating Ripples of Recovery)
 * Subpages return to the Main Hub (Page 1) after the last subpage.
 */

// Slide mapping (1-based page numbers converted to 0-based indices)
const CHAPTERS = [
  {
    id: 1,
    hubPage: 1, // index 0
    name: "Initiating Ripples of Recovery",
    subpages: [2, 3, 4, 5] // indices 1, 2, 3, 4
  },
  {
    id: 2,
    hubPage: 6, // index 5
    name: "A Case of Bacterial RTI and Treatment",
    subpages: [7, 8, 9, 10] // indices 6, 7, 8, 9
  },
  {
    id: 3,
    hubPage: 11, // index 10
    name: "A Case of URTI: Clinical Management",
    subpages: [12, 13, 14, 15] // indices 11, 12, 13, 14
  },
  {
    id: 4,
    hubPage: 16, // index 15
    name: "A Case of AECOPD",
    subpages: [17, 18, 19, 20] // indices 16, 17, 18, 19
  },
  {
    id: 5,
    hubPage: 21, // index 20
    name: "Thank you for Creating Ripples of Recovery",
    subpages: [22, 23] // indices 21, 22
  }
];

let currentSlideIndex = 0; // 0-based (Page 1 = 0)
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Find which chapter a slide belongs to
function getChapterForSlide(pageNumber) {
  for (const chap of CHAPTERS) {
    if (chap.hubPage === pageNumber || chap.subpages.includes(pageNumber)) {
      return chap;
    }
  }
  return null;
}

function showSlide(index) {
  if (index < 0) index = 0;
  if (index >= totalSlides) index = totalSlides - 1;

  slides.forEach((slide, idx) => {
    if (idx === index) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  currentSlideIndex = index;
  updateNavState();
}

// Next slide logic: navigate within chapter subpages without looping
function nextSlide() {
  const currentPage = currentSlideIndex + 1; // 1-based
  const currentChapter = getChapterForSlide(currentPage);

  // If inside subpages: advance to next subpage, but STOP at the end of the chapter
  if (currentChapter && currentChapter.subpages.includes(currentPage)) {
    const subIdx = currentChapter.subpages.indexOf(currentPage);
    if (subIdx < currentChapter.subpages.length - 1) {
      goToPage(currentChapter.subpages[subIdx + 1]);
    }
    // Stops at the last subpage (no loop)
    return;
  }

  // If on a Hub page, clicking/swiping next opens its first subpage
  if (currentChapter && currentChapter.hubPage === currentPage) {
    if (currentChapter.subpages.length > 0) {
      goToPage(currentChapter.subpages[0]);
    }
    return;
  }
}

// Previous slide logic: navigate within chapter subpages without looping
function prevSlide() {
  const currentPage = currentSlideIndex + 1; // 1-based
  const currentChapter = getChapterForSlide(currentPage);

  // If inside subpages: go to previous subpage, but STOP at first subpage
  if (currentChapter && currentChapter.subpages.includes(currentPage)) {
    const subIdx = currentChapter.subpages.indexOf(currentPage);
    if (subIdx > 0) {
      goToPage(currentChapter.subpages[subIdx - 1]);
    }
    // Stops at the first subpage (no loop)
    return;
  }
}

// Direct jump helpers
function goToSlide(zeroBasedIndex) {
  showSlide(zeroBasedIndex);
}

function goToPage(oneBasedPageNumber) {
  showSlide(oneBasedPageNumber - 1);
}

// Launch chapter by ID (1-5)
function openChapter(chapterId) {
  const chap = CHAPTERS.find(c => c.id === chapterId);
  if (chap && chap.subpages.length > 0) {
    goToPage(chap.subpages[0]);
  }
}

function updateNavState() {
  // Navigation indicators are removed from bottom bar for clean iPad layout
}

// Navigate to the Prescribing Information (PI) slide for the active chapter
function openCorrespondingPI() {
  const currentPage = currentSlideIndex + 1; // 1-based (1-23)
  const currentChapter = getChapterForSlide(currentPage);

  if (currentChapter && currentChapter.subpages && currentChapter.subpages.length > 0) {
    // The last subpage of each chapter is its official PI slide:
    // Chapter 1 (Pages 1-5) -> Page 5
    // Chapter 2 (Pages 6-10) -> Page 10
    // Chapter 3 (Pages 11-15) -> Page 15
    // Chapter 4 (Pages 16-20) -> Page 20
    // Chapter 5 (Pages 21-23) -> Page 23
    const piPage = currentChapter.subpages[currentChapter.subpages.length - 1];
    goToPage(piPage);
  } else {
    // Fallback to Chapter 1 PI (Page 5)
    goToPage(5);
  }
}

// Modal Controllers
function openModal(modalId) {
  if (modalId === 'modalPI') {
    openCorrespondingPI();
    return;
  }
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Modal backdrop click to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  // Attach bottom bar button events
  const btnHome = document.getElementById('btnHome');
  const btnMenu = document.getElementById('btnMenu');
  const btnPI = document.getElementById('btnPI');
  const btnRef = document.getElementById('btnRef');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  if (btnHome) btnHome.addEventListener('click', () => goToPage(1));
  if (btnMenu) btnMenu.addEventListener('click', () => openModal('modalMenu'));
  if (btnPI) btnPI.addEventListener('click', () => openCorrespondingPI());
  if (btnRef) btnRef.addEventListener('click', () => openModal('modalRef'));
  if (btnPrev) btnPrev.addEventListener('click', () => prevSlide());
  if (btnNext) btnNext.addEventListener('click', () => nextSlide());

  if (btnHome) btnHome.addEventListener('click', () => goToPage(1));
  if (btnMenu) btnMenu.addEventListener('click', () => openModal('modalMenu'));
  if (btnPI) btnPI.addEventListener('click', () => openCorrespondingPI());
  if (btnRef) btnRef.addEventListener('click', () => openModal('modalRef'));

  // Keyboard navigation for desktop testing
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
    } else if (e.key === 'Home') {
      goToPage(1);
    } else if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    }
  });

  // Comprehensive Swipe Function for iPad Touch & Desktop Drag
  let startX = 0;
  let startY = 0;
  let isPointerDown = false;
  const contentArea = document.getElementById('edaContainer') || document.body;

  // Touch Swipe Handlers (iPad / Mobile Veeva CRM)
  contentArea.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  contentArea.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      processSwipe(startX, startY, endX, endY);
    }
  }, { passive: true });

  // Mouse / Pointer Swipe Handlers (Desktop Testing)
  contentArea.addEventListener('mousedown', (e) => {
    // Only left click on slide area (not buttons or modals)
    if (e.button === 0 && !e.target.closest('button') && !e.target.closest('.modal-overlay')) {
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
    }
  });

  contentArea.addEventListener('mouseup', (e) => {
    if (isPointerDown) {
      isPointerDown = false;
      processSwipe(startX, startY, e.clientX, e.clientY);
    }
  });

  // Helper to detect horizontal swipe gestures
  function processSwipe(x1, y1, x2, y2) {
    const diffX = x2 - x1;
    const diffY = y2 - y1;

    // Minimum swipe threshold: 40px, predominantly horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // Swiped Left -> Move forward to next subpage
        nextSlide();
      } else {
        // Swiped Right -> Move back to previous subpage
        prevSlide();
      }
    }
  }

  // Initial display setup (starts on Page 1 Hub)
  showSlide(0);
});
