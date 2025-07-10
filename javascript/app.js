// AI Movie Creation
document.addEventListener('DOMContentLoaded', function() {
  const aiService = new AIService();
  
  // Initialize AI service when Firebase is ready
  if (window.firebase) {
    aiService.initialize(window.firebase.app());
  }

  // Generate script button
  document.getElementById('generateScriptBtn')?.addEventListener('click', async function() {
    const movieTitle = document.getElementById('movieTitle').value;
    const genre = document.getElementById('movieGenre').value;
    const duration = document.getElementById('movieDuration').value;
    const personality = document.getElementById('userPersonality').value;

    if (!movieTitle || !genre || !duration) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      this.textContent = 'Generating...';
      this.disabled = true;

      const result = await aiService.generateScript(genre, duration, personality, movieTitle);
      
      document.getElementById('scriptContent').innerHTML = result.script.replace(/\n/g, '<br>');
      document.getElementById('scriptResult').style.display = 'block';
      
      this.textContent = 'Generate Movie Script';
      this.disabled = false;
    } catch (error) {
      alert('Failed to generate script: ' + error.message);
      this.textContent = 'Generate Movie Script';
      this.disabled = false;
    }
  });

  // Generate voice button
  document.getElementById('generateVoiceBtn')?.addEventListener('click', async function() {
    const scriptText = document.getElementById('scriptContent').textContent;
    
    try {
      this.textContent = 'Generating Voice...';
      this.disabled = true;

      const result = await aiService.generateVoice(scriptText, 'narrator', 'Main Character');
      
      // Convert base64 to audio and play
      const audio = new Audio('data:audio/mpeg;base64,' + result.audioData);
      audio.play();
      
      this.textContent = 'Generate Voice';
      this.disabled = false;
    } catch (error) {
      alert('Failed to generate voice: ' + error.message);
      this.textContent = 'Generate Voice';
      this.disabled = false;
    }
  });
});
