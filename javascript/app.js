// Smooth scroll for navigation links
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

  // Button click feedback
  document.getElementById('startJourneyBtn')?.addEventListener('click', function() {
    alert('Start Your Journey clicked!');
  });
  document.getElementById('watchDemoBtn')?.addEventListener('click', function() {
    alert('Watch Demo clicked!');
  });

  // Modal logic for gallery lightbox
  // Create modal if not present
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.85)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = 9999;
    modal.innerHTML = `
      <div id="modalContent" style="position:relative;max-width:90vw;max-height:90vh;">
        <button id="modalClose" style="position:absolute;top:10px;right:10px;font-size:2rem;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>
        <div id="modalBody" style="display:flex;justify-content:center;align-items:center;"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Open image in modal/lightbox
  document.querySelectorAll('.gallery-section img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      const modalBody = document.getElementById('modalBody');
      modalBody.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="max-width:80vw;max-height:80vh;border-radius:12px;">`;
      modal.style.display = 'flex';
    });
  });

  // Modal close logic
  document.getElementById('modalClose').addEventListener('click', function() {
    modal.style.display = 'none';
  });
  // Close modal on background click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Video controls: add play/pause/fullscreen buttons below each video
  document.querySelectorAll('.gallery-section video').forEach(video => {
    // Create controls container
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.justifyContent = 'center';
    controls.style.gap = '10px';
    controls.style.margin = '8px 0';

    // Play button
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';
    playBtn.className = 'btn btn-secondary';
    playBtn.onclick = () => video.play();

    // Pause button
    const pauseBtn =
Absolutely! Here is a full, clean, and interactive app.js that matches your classic HTML and CSS, and includes:

Smooth scroll for navigation links
Button click feedback
Gallery image lightbox/modal
Video controls (play, pause, fullscreen) below each video
Modal close on background or button click
// Smooth scroll for navigation links
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

  // Button click feedback
  document.getElementById('startJourneyBtn')?.addEventListener('click', function() {
    alert('Start Your Journey clicked!');
  });
  document.getElementById('watchDemoBtn')?.addEventListener('click', function() {
    alert('Watch Demo clicked!');
  });

  // Modal logic for gallery lightbox
  // Create modal if not present
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.85)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = 9999;
    modal.innerHTML = `
      <div id="modalContent" style="position:relative;max-width:90vw;max-height:90vh;">
        <button id="modalClose" style="position:absolute;top:10px;right:10px;font-size:2rem;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>
        <div id="modalBody" style="display:flex;justify-content:center;align-items:center;"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Open image in modal/lightbox
  document.querySelectorAll('.gallery-section img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      const modalBody = document.getElementById('modalBody');
      modalBody.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="max-width:80vw;max-height:80vh;border-radius:12px;">`;
      modal.style.display = 'flex';
    });
  });

  // Modal close logic
  document.getElementById('modalClose').addEventListener('click', function() {
    modal.style.display = 'none';
  });
  // Close modal on background click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Video controls: add play/pause/fullscreen buttons below each video
  document.querySelectorAll('.gallery-section video').forEach(video => {
    // Create controls container
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.justifyContent = 'center';
    controls.style.gap = '10px';
    controls.style.margin = '8px 0';

    // Play button
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';
    playBtn.className = 'btn btn-secondary';
    playBtn.onclick = () => video.play();

    // Pause button
    const pauseBtn = document.createElement('button');
    pauseBtn.textContent = 'Pause';
    pauseBtn.className = 'btn btn-secondary';
    pauseBtn.onclick = () => video.pause();

    // Fullscreen button
    const fsBtn = document.createElement('button');
    fsBtn.textContent = 'Fullscreen';
    fsBtn.className = 'btn btn-secondary';
    fsBtn.onclick = () => {
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      else if (video.msRequestFullscreen) video.msRequestFullscreen();
    };

    controls.appendChild(playBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(fsBtn);

    // Insert controls after video
    video.parentNode.insertBefore(controls, video.nextSibling);
  });
});
