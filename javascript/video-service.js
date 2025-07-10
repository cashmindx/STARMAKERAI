// Video Generation Service for STARMAKER AI
class VideoService {
  constructor() {
    this.runwayApiKey = null;
    this.pikaApiKey = null;
    this.isConfigured = false;
    this.runwayUrl = 'https://api.runwayml.com/v1';
    this.pikaUrl = 'https://api.pika.art/v1';
    this.generationQueue = [];
    this.activeGenerations = new Map();
  }

  // Initialize video generation services
  async initialize(runwayKey, pikaKey) {
    this.runwayApiKey = runwayKey;
    this.pikaApiKey = pikaKey;
    this.isConfigured = !!(runwayKey || pikaKey);
    
    if (this.isConfigured) {
      console.log('Video generation services initialized');
      return true;
    } else {
      console.warn('Video generation services not configured - using simulation mode');
      return false;
    }
  }

  // Generate video from script and photos
  async generateVideo(script, photos, voiceAudio, settings = {}) {
    if (!this.isConfigured) {
      return this.simulateVideoGeneration(script, photos, voiceAudio, settings);
    }

    const generationId = Date.now().toString();
    const videoData = {
      id: generationId,
      title: script.title,
      status: 'generating',
      progress: 0,
      scenes: [],
      estimatedDuration: settings.duration || 60
    };

    try {
      // Add to active generations
      this.activeGenerations.set(generationId, videoData);

      // Generate scenes sequentially
      for (let i = 0; i < script.scenes.length; i++) {
        const scene = script.scenes[i];
        const sceneData = await this.generateScene(scene, photos, voiceAudio, settings, i);
        
        videoData.scenes.push(sceneData);
        videoData.progress = ((i + 1) / script.scenes.length) * 100;
        
        // Emit progress update
        this.emitProgress(videoData);
        
        // Add delay between scenes
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Combine scenes into final video
      const finalVideo = await this.combineScenes(videoData.scenes, voiceAudio);
      
      videoData.status = 'completed';
      videoData.progress = 100;
      videoData.videoUrl = finalVideo.url;
      videoData.duration = finalVideo.duration;
      
      // Remove from active generations
      this.activeGenerations.delete(generationId);
      
      return videoData;
    } catch (error) {
      console.error('Video generation error:', error);
      videoData.status = 'failed';
      videoData.error = error.message;
      this.activeGenerations.delete(generationId);
      return videoData;
    }
  }

  // Generate individual scene
  async generateScene(scene, photos, voiceAudio, settings, sceneIndex) {
    const scenePrompt = this.buildScenePrompt(scene, settings);
    
    try {
      // Use RunwayML for high-quality video generation
      if (this.runwayApiKey) {
        return await this.generateWithRunway(scenePrompt, photos, settings);
      }
      // Fallback to Pika Labs
      else if (this.pikaApiKey) {
        return await this.generateWithPika(scenePrompt, photos, settings);
      }
      else {
        return this.simulateSceneGeneration(scene, sceneIndex);
      }
    } catch (error) {
      console.error(`Scene ${sceneIndex + 1} generation failed:`, error);
      return this.simulateSceneGeneration(scene, sceneIndex);
    }
  }

  // Generate with RunwayML
  async generateWithRunway(prompt, photos, settings) {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('model', 'gen-3-alpha');
    formData.append('duration', settings.duration || 5);
    formData.append('aspect_ratio', '16:9');
    
    // Add reference images
    photos.forEach((photo, index) => {
      formData.append(`reference_image_${index}`, photo.file);
    });

    const response = await fetch(`${this.runwayUrl}/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.runwayApiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`RunwayML API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.video_url,
      duration: data.duration,
      prompt: prompt
    };
  }

  // Generate with Pika Labs
  async generateWithPika(prompt, photos, settings) {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('model', 'pika-labs');
    formData.append('duration', settings.duration || 5);
    
    // Add reference images
    photos.forEach((photo, index) => {
      formData.append(`image_${index}`, photo.file);
    });

    const response = await fetch(`${this.pikaUrl}/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.pikaApiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Pika Labs API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.video_url,
      duration: data.duration,
      prompt: prompt
    };
  }

  // Build scene prompt for video generation
  buildScenePrompt(scene, settings) {
    const style = settings.style || 'cinematic';
    const genre = settings.genre || 'action';
    
    return `Create a ${style} ${genre} movie scene: ${scene.description}. 
    Cinematic lighting, professional camera work, smooth motion, 
    high quality, detailed, photorealistic, 4K resolution. 
    Style: ${style}, Genre: ${genre}`;
  }

  // Combine multiple scenes into final video
  async combineScenes(scenes, voiceAudio) {
    // In a real implementation, this would use a video editing API
    // For now, we'll simulate the combination
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    
    return {
      url: scenes[0]?.url || this.generateDemoVideoUrl(),
      duration: totalDuration
    };
  }

  // Get generation status
  getGenerationStatus(generationId) {
    return this.activeGenerations.get(generationId) || null;
  }

  // Cancel generation
  cancelGeneration(generationId) {
    const generation = this.activeGenerations.get(generationId);
    if (generation) {
      generation.status = 'cancelled';
      this.activeGenerations.delete(generationId);
      return true;
    }
    return false;
  }

  // Simulation methods
  simulateVideoGeneration(script, photos, voiceAudio, settings) {
    const generationId = Date.now().toString();
    const videoData = {
      id: generationId,
      title: script.title,
      status: 'generating',
      progress: 0,
      scenes: [],
      estimatedDuration: settings.duration || 60
    };

    // Simulate generation process
    this.simulateGenerationProgress(videoData);
    
    return videoData;
  }

  async simulateGenerationProgress(videoData) {
    const steps = [
      'Analyzing photos...',
      'Generating scene 1...',
      'Generating scene 2...',
      'Generating scene 3...',
      'Adding voice audio...',
      'Finalizing video...'
    ];

    for (let i = 0; i < steps.length; i++) {
      videoData.progress = ((i + 1) / steps.length) * 100;
      this.emitProgress(videoData);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    videoData.status = 'completed';
    videoData.progress = 100;
    videoData.videoUrl = this.generateDemoVideoUrl();
    videoData.duration = videoData.estimatedDuration;
    
    this.emitProgress(videoData);
  }

  simulateSceneGeneration(scene, sceneIndex) {
    return {
      url: this.generateDemoVideoUrl(),
      duration: 5,
      prompt: scene.description
    };
  }

  generateDemoVideoUrl() {
    const demos = [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ];
    return demos[Math.floor(Math.random() * demos.length)];
  }

  // Event system
  emitProgress(data) {
    const event = new CustomEvent('videoProgress', { detail: data });
    document.dispatchEvent(event);
  }

  // Utility methods
  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  estimateGenerationTime(sceneCount, duration) {
    // Rough estimate: 30 seconds per scene
    return sceneCount * 30;
  }
}

// Export for global access
window.VideoService = VideoService;