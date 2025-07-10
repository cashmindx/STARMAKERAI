// STARMAKER AI - Main Application JavaScript
class StarmakerAI {
  constructor() {
    this.uploadedPhotos = [];
    this.recordedAudio = null;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.currentStep = 1;
    this.movieSettings = {
      genre: 'action',
      duration: '60',
      style: 'modern'
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeLucideIcons();
    this.showLoadingScreen();
    this.setupSmoothScrolling();
    this.setupIntersectionObserver();
  }

  setupEventListeners() {
    // Loading screen
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 3000);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Hero buttons
    document.getElementById('startJourneyBtn')?.addEventListener('click', () => {
      document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('watchDemoBtn')?.addEventListener('click', () => {
      this.showModal('Demo Video', this.getDemoModalContent());
    });

    // Photo upload
    const uploadArea = document.getElementById('uploadArea');
    const photoUpload = document.getElementById('photoUpload');

    uploadArea?.addEventListener('click', () => {
      photoUpload?.click();
    });

    uploadArea?.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea?.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea?.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files);
      this.handlePhotoUpload(files);
    });

    photoUpload?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.handlePhotoUpload(files);
    });

    // Voice recording
    document.querySelector('.record-btn')?.addEventListener('click', () => {
      this.toggleRecording();
    });

    // Genre selection
    document.querySelectorAll('.genre-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectGenre(option.dataset.genre);
      });
    });

    // Movie generation
    document.getElementById('generateMovieBtn')?.addEventListener('click', () => {
      this.generateMovie();
    });

    // Settings changes
    document.getElementById('genreSelect')?.addEventListener('change', (e) => {
      this.movieSettings.genre = e.target.value;
    });

    document.getElementById('durationSelect')?.addEventListener('change', (e) => {
      this.movieSettings.duration = e.target.value;
    });

    document.getElementById('styleSelect')?.addEventListener('change', (e) => {
      this.movieSettings.style = e.target.value;
    });

    // Modal
    document.getElementById('modalClose')?.addEventListener('click', () => {
      this.hideModal();
    });

    document.getElementById('modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal') {
        this.hideModal();
      }
    });

    // CTA buttons
    document.getElementById('finalCtaBtn')?.addEventListener('click', () => {
      document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
    });

    // Pricing buttons
    document.querySelectorAll('.pricing-card .btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showModal('Choose Plan', this.getPricingModalContent());
      });
    });

    // Mobile menu toggle
    document.querySelector('.nav-toggle')?.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });
  }

  initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.step, .feature-card, .pricing-card').forEach(el => {
      observer.observe(el);
    });
  }

  handlePhotoUpload(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      this.showNotification('Please select image files only', 'error');
      return;
    }

    if (this.uploadedPhotos.length + imageFiles.length > 5) {
      this.showNotification('Maximum 5 photos allowed', 'warning');
      return;
    }

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = {
          id: Date.now() + Math.random(),
          src: e.target.result,
          file: file
        };
        this.uploadedPhotos.push(photo);
        this.displayUploadedPhoto(photo);
      };
      reader.readAsDataURL(file);
    });

    this.showNotification(`${imageFiles.length} photo(s) uploaded successfully`, 'success');
  }

  displayUploadedPhoto(photo) {
    const container = document.getElementById('uploadedPhotos');
    if (!container) return;

    const photoElement = document.createElement('div');
    photoElement.className = 'uploaded-photo';
    photoElement.dataset.photoId = photo.id;

    photoElement.innerHTML = `
      <img src="${photo.src}" alt="Uploaded photo">
      <button class="remove-btn" onclick="app.removePhoto('${photo.id}')">
        <i data-lucide="x"></i>
      </button>
    `;

    container.appendChild(photoElement);
    this.initializeLucideIcons();
  }

  removePhoto(photoId) {
    this.uploadedPhotos = this.uploadedPhotos.filter(photo => photo.id !== photoId);
    const photoElement = document.querySelector(`[data-photo-id="${photoId}"]`);
    if (photoElement) {
      photoElement.remove();
    }
  }

  async toggleRecording() {
    const recordBtn = document.querySelector('.record-btn');
    const waveform = document.querySelector('.waveform');

    if (!this.isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.recordedAudio = URL.createObjectURL(audioBlob);
          this.showNotification('Voice recording completed!', 'success');
        };

        this.mediaRecorder.start();
        this.isRecording = true;
        recordBtn.innerHTML = '<i data-lucide="square"></i>';
        recordBtn.style.background = '#ff4444';
        waveform.style.display = 'flex';
        this.initializeLucideIcons();
      } catch (error) {
        this.showNotification('Microphone access denied', 'error');
      }
    } else {
      this.mediaRecorder.stop();
      this.isRecording = false;
      recordBtn.innerHTML = '<i data-lucide="mic"></i>';
      recordBtn.style.background = '';
      waveform.style.display = 'none';
      this.initializeLucideIcons();
    }
  }

  selectGenre(genre) {
    document.querySelectorAll('.genre-option').forEach(option => {
      option.classList.remove('selected');
    });
    document.querySelector(`[data-genre="${genre}"]`).classList.add('selected');
    this.movieSettings.genre = genre;
  }

  async generateMovie() {
    if (this.uploadedPhotos.length === 0) {
      this.showNotification('Please upload at least one photo', 'warning');
      return;
    }

    if (!this.recordedAudio) {
      this.showNotification('Please record your voice', 'warning');
      return;
    }

    const generateBtn = document.getElementById('generateMovieBtn');
    const originalText = generateBtn.innerHTML;
    
    generateBtn.innerHTML = '<i data-lucide="loader-2"></i> Generating...';
    generateBtn.disabled = true;
    this.initializeLucideIcons();

    // Simulate AI processing
    await this.simulateMovieGeneration();

    generateBtn.innerHTML = originalText;
    generateBtn.disabled = false;
    this.initializeLucideIcons();

    this.showGeneratedMovie();
  }

  async simulateMovieGeneration() {
    const steps = [
      'Analyzing photos...',
      'Processing voice...',
      'Generating script...',
      'Creating scenes...',
      'Adding effects...',
      'Finalizing movie...'
    ];

    for (let i = 0; i < steps.length; i++) {
      this.showNotification(steps[i], 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  showGeneratedMovie() {
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const moviePreview = document.getElementById('moviePreview');

    if (previewPlaceholder && moviePreview) {
      // Simulate a generated movie (replace with actual AI-generated video)
      const demoVideoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
      
      moviePreview.src = demoVideoUrl;
      moviePreview.style.display = 'block';
      previewPlaceholder.style.display = 'none';

      this.showNotification('Your movie is ready!', 'success');
    }
  }

  showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (modal && modalTitle && modalBody) {
      modalTitle.textContent = title;
      modalBody.innerHTML = content;
      modal.classList.add('active');
      this.initializeLucideIcons();
    }
  }

  hideModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  getDemoModalContent() {
    return `
      <div class="demo-video-container">
        <video controls width="100%">
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <p style="margin-top: 1rem; text-align: center;">
          Watch how STARMAKER AI transforms ordinary photos into cinematic masterpieces!
        </p>
      </div>
    `;
  }

  getPricingModalContent() {
    return `
      <div class="pricing-modal">
        <h4>Choose Your Plan</h4>
        <p>Select the perfect plan for your movie creation needs:</p>
        <div class="plan-options">
          <div class="plan-option">
            <h5>Starter - $9</h5>
            <p>Perfect for trying out the service</p>
          </div>
          <div class="plan-option">
            <h5>Pro - $19</h5>
            <p>Most popular choice for creators</p>
          </div>
          <div class="plan-option">
            <h5>Studio - $49</h5>
            <p>Professional-grade features</p>
          </div>
        </div>
        <button class="btn btn-primary" onclick="app.hideModal()">
          Continue to Payment
        </button>
      </div>
    `;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i data-lucide="${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()">
          <i data-lucide="x"></i>
        </button>
      </div>
    `;

    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      max-width: 300px;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);
    this.initializeLucideIcons();

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'alert-circle',
      warning: 'alert-triangle',
      info: 'info'
    };
    return icons[type] || 'info';
  }

  getNotificationColor(type) {
    const colors = {
      success: '#00ff88',
      error: '#ff4444',
      warning: '#ffaa00',
      info: '#00d4ff'
    };
    return colors[type] || '#00d4ff';
  }

  toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.classList.toggle('active');
    }
  }

  // Utility methods
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
  app = new StarmakerAI();
});

// Add some additional CSS for notifications
const notificationStyles = `
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .notification-content button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: auto;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Export for global access
window.app = app;