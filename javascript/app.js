// AI Movie Creation
document.addEventListener('DOMContentLoaded', function() {
  const aiService = new AIService();
  const videoService = new VideoService();
  
  // Initialize services when Firebase is ready
  if (window.firebase) {
    aiService.initialize(window.firebase.app());
  }

  // Store generated data for movie creation
  let generatedScript = null;
  let generatedVoiceId = null;
  let uploadedPhotos = [];

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
      
      // Store the generated script
      generatedScript = result;
      
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
    
    if (!scriptText || scriptText.trim() === '') {
      alert('Please generate a script first');
      return;
    }
    
    try {
      this.textContent = 'Generating Voice...';
      this.disabled = true;

      const result = await aiService.generateVoice(scriptText, 'narrator', 'Main Character');
      
      // Store the generated voice ID
      generatedVoiceId = result.voiceId || 'simulated_voice_' + Date.now();
      
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

  // Generate Movie button (the missing handler)
  document.getElementById('generateMovieBtn')?.addEventListener('click', async function() {
    // Validate all required parameters
    if (!generatedScript || !generatedScript.title) {
      alert('Please generate a movie script first');
      return;
    }

    if (!generatedVoiceId) {
      alert('Please generate voice audio first');
      return;
    }

    if (!uploadedPhotos || uploadedPhotos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    try {
      this.textContent = 'Generating Movie...';
      this.disabled = true;

      // Ensure all parameters are valid strings/objects, not null
      const validScript = {
        title: generatedScript.title || 'Untitled Movie',
        scenes: generatedScript.scenes || [],
        duration: generatedScript.duration || 60
      };

      const validVoiceId = generatedVoiceId || 'default_voice';
      const validPhotos = uploadedPhotos.length > 0 ? uploadedPhotos : [{ id: 'default', file: null }];

      const result = await aiService.generateMovie(validScript, validVoiceId, validPhotos);
      
      if (result.status === 'completed') {
        alert('Movie generated successfully!');
        // Handle successful movie generation
        if (result.videoUrl) {
          // Display or download the generated movie
          window.open(result.videoUrl, '_blank');
        }
      } else if (result.status === 'failed') {
        throw new Error(result.error || 'Movie generation failed');
      }
      
      this.textContent = 'Generate Movie';
      this.disabled = false;
    } catch (error) {
      console.error('Movie generation error:', error);
      alert('Failed to generate movie: ' + error.message);
      this.textContent = 'Generate Movie';
      this.disabled = false;
    }
  });

  // Photo upload handler
  const photoUpload = document.getElementById('photoUpload');
  if (photoUpload) {
    photoUpload.addEventListener('change', function(event) {
      const files = Array.from(event.target.files);
      uploadedPhotos = files.map((file, index) => ({
        id: 'photo_' + index,
        file: file,
        name: file.name
      }));
      
      console.log(`Uploaded ${uploadedPhotos.length} photos`);
    });
  }
});
