// AI Service Module for STARMAKER AI
class AIService {
  constructor() {
    this.openaiApiKey = null;
    this.elevenLabsApiKey = null;
    this.isConfigured = false;
    this.baseUrl = 'https://api.openai.com/v1';
    this.elevenLabsUrl = 'https://api.elevenlabs.io/v1';
  }

  // Initialize AI services with API keys
  async initialize(openaiKey, elevenLabsKey) {
    this.openaiApiKey = openaiKey;
    this.elevenLabsApiKey = elevenLabsKey;
    this.isConfigured = !!openaiKey && !!elevenLabsKey;
    
    if (this.isConfigured) {
      console.log('AI services initialized successfully');
      return true;
    } else {
      console.warn('AI services not fully configured - using simulation mode');
      return false;
    }
  }

  // Generate movie script using OpenAI
  async generateScript(genre, duration, userPersonality = '') {
    if (!this.isConfigured) {
      return this.simulateScriptGeneration(genre, duration);
    }

    try {
      const prompt = this.buildScriptPrompt(genre, duration, userPersonality);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional screenwriter specializing in creating engaging, cinematic scripts for AI-generated movies.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseScriptResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Script generation error:', error);
      return this.simulateScriptGeneration(genre, duration);
    }
  }

  // Build script generation prompt
  buildScriptPrompt(genre, duration, userPersonality) {
    const durationMinutes = Math.ceil(duration / 60);
    
    return `Create a ${durationMinutes}-minute ${genre} movie script with the following requirements:

Genre: ${genre}
Duration: ${duration} seconds (approximately ${durationMinutes} minutes)
User Personality: ${userPersonality || 'General audience'}

Requirements:
- Engaging opening scene
- Clear character development
- Dynamic dialogue
- Cinematic action sequences
- Emotional climax
- Satisfying conclusion

Format the script with:
- Scene descriptions
- Character dialogue
- Action directions
- Camera suggestions

Make it suitable for AI video generation with clear visual elements.`;
  }

  // Parse script response
  parseScriptResponse(content) {
    return {
      title: this.extractTitle(content),
      scenes: this.extractScenes(content),
      dialogue: this.extractDialogue(content),
      duration: this.estimateDuration(content),
      raw: content
    };
  }

  // Extract title from script
  extractTitle(content) {
    const titleMatch = content.match(/TITLE[:\s]+(.+)/i);
    return titleMatch ? titleMatch[1].trim() : 'Your AI Movie';
  }

  // Extract scenes from script
  extractScenes(content) {
    const scenes = content.split(/(?:SCENE|INT\.|EXT\.)/i).filter(scene => scene.trim());
    return scenes.map((scene, index) => ({
      id: index + 1,
      description: scene.trim(),
      duration: this.estimateSceneDuration(scene)
    }));
  }

  // Extract dialogue from script
  extractDialogue(content) {
    const dialogueMatches = content.match(/([A-Z\s]+):\s*([^\n]+)/g);
    return dialogueMatches ? dialogueMatches.map(dialogue => {
      const [character, line] = dialogue.split(':').map(s => s.trim());
      return { character, line };
    }) : [];
  }

  // Estimate script duration
  estimateDuration(content) {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 150); // Rough estimate: 150 words per minute
  }

  // Estimate scene duration
  estimateSceneDuration(scene) {
    const wordCount = scene.split(/\s+/).length;
    return Math.ceil(wordCount / 100); // Rough estimate: 100 words per scene minute
  }

  // Clone voice using ElevenLabs
  async cloneVoice(audioBlob, voiceName = 'User Voice') {
    if (!this.isConfigured) {
      return this.simulateVoiceCloning(audioBlob);
    }

    try {
      // First, create a voice clone
      const formData = new FormData();
      formData.append('name', voiceName);
      formData.append('files', audioBlob, 'voice_sample.wav');
      formData.append('description', 'User voice for movie generation');

      const createResponse = await fetch(`${this.elevenLabsUrl}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.elevenLabsApiKey,
        },
        body: formData
      });

      if (!createResponse.ok) {
        throw new Error(`ElevenLabs API error: ${createResponse.status}`);
      }

      const voiceData = await createResponse.json();
      return {
        voiceId: voiceData.voice_id,
        voiceName: voiceName,
        success: true
      };
    } catch (error) {
      console.error('Voice cloning error:', error);
      return this.simulateVoiceCloning(audioBlob);
    }
  }

  // Generate speech from text using cloned voice
  async generateSpeech(text, voiceId) {
    if (!this.isConfigured) {
      return this.simulateSpeechGeneration(text);
    }

    try {
      const response = await fetch(`${this.elevenLabsUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Speech generation error:', error);
      return this.simulateSpeechGeneration(text);
    }
  }

  // Analyze photos for character creation
  async analyzePhotos(photos) {
    if (!this.isConfigured) {
      return this.simulatePhotoAnalysis(photos);
    }

    try {
      const analysisResults = [];
      
      for (const photo of photos) {
        const formData = new FormData();
        formData.append('image', photo.file);
        
        const response = await fetch(`${this.baseUrl}/images/analyses`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
          },
          body: formData
        });

        if (response.ok) {
          const analysis = await response.json();
          analysisResults.push({
            photoId: photo.id,
            analysis: analysis,
            features: this.extractFeatures(analysis)
          });
        }
      }

      return analysisResults;
    } catch (error) {
      console.error('Photo analysis error:', error);
      return this.simulatePhotoAnalysis(photos);
    }
  }

  // Extract features from photo analysis
  extractFeatures(analysis) {
    return {
      age: analysis.age || 'unknown',
      gender: analysis.gender || 'unknown',
      emotions: analysis.emotions || [],
      facialFeatures: analysis.facial_features || [],
      lighting: analysis.lighting || 'neutral',
      quality: analysis.quality || 'good'
    };
  }

  // Generate movie using AI video generation (simulation for now)
  async generateMovie(script, voiceId, photos) {
    if (!this.isConfigured) {
      return this.simulateMovieGeneration(script, voiceId, photos);
    }

    try {
      // This would integrate with Sora API or similar video generation service
      // For now, we'll simulate the process
      
      const movieData = {
        id: Date.now().toString(),
        title: script.title,
        duration: script.duration,
        scenes: script.scenes.length,
        status: 'generating',
        progress: 0
      };

      // Simulate generation progress
      for (let i = 0; i <= 100; i += 10) {
        movieData.progress = i;
        // Emit progress event
        this.emitProgress(movieData);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      movieData.status = 'completed';
      movieData.videoUrl = this.generateDemoVideoUrl();
      
      return movieData;
    } catch (error) {
      console.error('Movie generation error:', error);
      return this.simulateMovieGeneration(script, voiceId, photos);
    }
  }

  // Simulation methods for when AI services are not configured
  simulateScriptGeneration(genre, duration) {
    const scripts = {
      action: {
        title: 'The Last Stand',
        scenes: [
          { id: 1, description: 'Hero emerges from shadows, dramatic lighting', duration: 30 },
          { id: 2, description: 'Intense chase sequence through city streets', duration: 45 },
          { id: 3, description: 'Climactic showdown with villain', duration: 30 }
        ],
        dialogue: [
          { character: 'HERO', line: 'This ends now.' },
          { character: 'VILLAIN', line: 'You think you can stop me?' },
          { character: 'HERO', line: 'I know I can.' }
        ],
        duration: Math.ceil(duration / 60),
        raw: 'Simulated action script...'
      },
      romance: {
        title: 'Love in the City',
        scenes: [
          { id: 1, description: 'Chance meeting at coffee shop', duration: 30 },
          { id: 2, description: 'Romantic walk in the park', duration: 45 },
          { id: 3, description: 'Emotional confession scene', duration: 30 }
        ],
        dialogue: [
          { character: 'LOVER', line: 'I never believed in love at first sight...' },
          { character: 'BELOVED', line: 'Until now?' },
          { character: 'LOVER', line: 'Until you.' }
        ],
        duration: Math.ceil(duration / 60),
        raw: 'Simulated romance script...'
      },
      comedy: {
        title: 'The Great Mishap',
        scenes: [
          { id: 1, description: 'Awkward situation at work', duration: 30 },
          { id: 2, description: 'Hilarious misunderstanding', duration: 45 },
          { id: 3, description: 'Happy resolution with laughs', duration: 30 }
        ],
        dialogue: [
          { character: 'COMEDIAN', line: 'Well, this is embarrassing...' },
          { character: 'FRIEND', line: 'You think?' },
          { character: 'COMEDIAN', line: 'At least it\'s funny!' }
        ],
        duration: Math.ceil(duration / 60),
        raw: 'Simulated comedy script...'
      }
    };

    return scripts[genre] || scripts.action;
  }

  simulateVoiceCloning(audioBlob) {
    return {
      voiceId: 'simulated_voice_' + Date.now(),
      voiceName: 'User Voice Clone',
      success: true
    };
  }

  simulateSpeechGeneration(text) {
    // Return a demo audio URL
    return 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
  }

  simulatePhotoAnalysis(photos) {
    return photos.map(photo => ({
      photoId: photo.id,
      analysis: {
        age: '25-35',
        gender: 'unknown',
        emotions: ['confident', 'friendly'],
        facial_features: ['clear', 'well-lit'],
        lighting: 'good',
        quality: 'high'
      },
      features: {
        age: '25-35',
        gender: 'unknown',
        emotions: ['confident', 'friendly'],
        facialFeatures: ['clear', 'well-lit'],
        lighting: 'good',
        quality: 'high'
      }
    }));
  }

  simulateMovieGeneration(script, voiceId, photos) {
    return {
      id: Date.now().toString(),
      title: script.title,
      duration: script.duration,
      scenes: script.scenes.length,
      status: 'completed',
      progress: 100,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    };
  }

  generateDemoVideoUrl() {
    return 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
  }

  // Event system for progress updates
  emitProgress(data) {
    const event = new CustomEvent('aiProgress', { detail: data });
    document.dispatchEvent(event);
  }

  // Utility methods
  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  validateApiKey(key) {
    return key && key.length > 20;
  }
}

// Export for global access
window.AIService = AIService;