// ===== Loading Screen Fade Out =====
window.addEventListener('load', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.transition = 'opacity 0.6s';
    loadingScreen.style.opacity = 0;
    setTimeout(() => loadingScreen.style.display = 'none', 700);
  }
});

// ===== Mobile Navigation Toggle =====
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
});

// ===== Studio Movie Preview Controls =====
document.addEventListener('DOMContentLoaded', function() {
  const moviePreview = document.getElementById('moviePreview');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const previewPlaceholder = document.getElementById('previewPlaceholder');

  if (moviePreview && playBtn && pauseBtn && fullscreenBtn) {
    playBtn.addEventListener('click', function() {
      moviePreview.style.display = 'block';
      if (previewPlaceholder) previewPlaceholder.style.display = 'none';
      moviePreview.play();
    });
    pauseBtn.addEventListener('click', function() {
      moviePreview.pause();
    });
    fullscreenBtn.addEventListener('click', function() {
      if (moviePreview.requestFullscreen) {
        moviePreview.requestFullscreen();
      } else if (moviePreview.webkitRequestFullscreen) { /* Safari */
        moviePreview.webkitRequestFullscreen();
      } else if (moviePreview.msRequestFullscreen) { /* IE11 */
        moviePreview.msRequestFullscreen();
      }
    });
  }
});

// ===== Smooth Scroll for Navigation Links =====
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 60,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});

// ===== Modal Close Button =====
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  if (modal && modalClose) {
    modalClose.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
});

// ===== Lucide Icons (refresh after DOM changes) =====
document.addEventListener('DOMContentLoaded', function() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// ===== Image Upload Preview =====
document.addEventListener('DOMContentLoaded', function() {
  const photoUpload = document.getElementById('photoUpload');
  const uploadedPhotos = document.getElementById('uploadedPhotos');
  const uploadArea = document.getElementById('uploadArea');

  // Show file dialog when clicking the upload area
  if (uploadArea && photoUpload) {
    uploadArea.addEventListener('click', () => photoUpload.click());
  }

  // Handle file selection
  if (photoUpload && uploadedPhotos) {
    photoUpload.addEventListener('change', function() {
      uploadedPhotos.innerHTML = ''; // Clear previous previews
      Array.from(photoUpload.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            img.style.maxWidth = '120px';
            img.style.margin = '8px';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            uploadedPhotos.appendChild(img);
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }
});
