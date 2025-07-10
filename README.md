# 🎬 STARMAKER AI

**Transform your photos into Hollywood-worthy movies with AI-powered technology**

STARMAKER AI is a cutting-edge web application that allows users to create personalized movies by uploading photos, recording voice, and selecting movie genres. The platform uses advanced AI technology to generate cinematic content with professional-grade visual effects.

## ✨ Features

### 🎯 Core Functionality
- **Photo Upload**: Drag & drop or click to upload 3-5 photos from different angles
- **Voice Recording**: Record your voice to clone tone and emotions
- **Genre Selection**: Choose from Action, Romance, Comedy, Thriller, Sci-Fi, and Drama
- **AI Movie Generation**: Create personalized movies with custom scripts and effects
- **Real-time Preview**: Watch your movie as it's being generated

### 🎨 Advanced Features
- **AI Script Generation**: Custom movie scripts tailored to your personality
- **AI Co-stars**: Choose from a library of AI-generated actors
- **Multi-language Support**: Create movies in 30+ languages
- **4K Quality Output**: Cinema-quality video with professional effects
- **Style Filters**: Apply cinematic filters and color grading
- **Easy Sharing**: Share directly to social media platforms

### 💎 Premium Features
- **Custom Duration**: 30 seconds to 10 minutes
- **Multiple Styles**: Modern, Vintage, Cinematic, Artistic
- **Priority Processing**: Faster generation for premium users
- **Advanced Effects**: Professional-grade visual effects
- **24/7 Support**: Dedicated customer support

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Microphone access for voice recording
- Camera access for photo uploads
- Internet connection

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/starmakerai.git
   cd starmakerai
   ```

2. **Open the application**
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   
   # Or simply open index.html in your browser
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`
   - Or open `index.html` directly in your browser

### Development Setup

1. **Install dependencies** (if using a build system)
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
starmakerai/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Main stylesheet
├── javascript/
│   └── app.js              # Main JavaScript application
├── public/
│   └── Videos/             # Sample videos and assets
├── app.js                  # Legacy app file (can be removed)
├── java script             # Legacy JavaScript file (can be removed)
└── README.md               # This file
```

## 🎭 How It Works

### Step 1: Upload Photos
- Upload 3-5 clear photos of yourself from different angles
- Supported formats: JPG, PNG, WebP
- Maximum file size: 10MB per photo
- AI analyzes facial features and expressions

### Step 2: Record Voice
- Click the microphone button to start recording
- Speak a few lines to capture your voice
- AI clones your tone, pitch, and emotional patterns
- Recording automatically stops after 30 seconds

### Step 3: Choose Genre & Settings
- Select your preferred movie genre
- Choose duration (30s - 10min)
- Pick visual style (Modern, Vintage, Cinematic, Artistic)
- Configure additional settings

### Step 4: Generate Movie
- AI processes your photos and voice
- Generates custom script based on genre
- Creates cinematic scenes with effects
- Renders final movie in 4K quality

## 💰 Pricing Plans

### Starter - $9/movie
- 1-minute movie
- HD quality
- Basic effects
- 3 genres available

### Pro - $19/movie ⭐ Most Popular
- 5-minute movie
- 4K quality
- Advanced effects
- All genres
- AI co-stars
- Priority processing

### Studio - $49/movie
- 10-minute movie
- 4K HDR quality
- Premium effects
- Custom scripts
- Multiple scenes
- 24/7 support

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Interactive functionality and AI integration
- **Lucide Icons**: Beautiful, customizable icons

### AI & Backend (Future Implementation)
- **OpenAI API**: Text generation and script creation
- **Sora API**: Video generation and effects
- **Voice Cloning**: Advanced voice synthesis
- **Face Recognition**: Photo analysis and mapping

### Deployment
- **Netlify**: Hosting and CDN
- **GitHub**: Version control and collaboration

## 🎨 Design Features

### Modern UI/UX
- **Dark Theme**: Cinematic dark interface
- **Responsive Design**: Works on all devices
- **Smooth Animations**: CSS transitions and keyframes
- **Interactive Elements**: Hover effects and micro-interactions

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color scheme
- **Focus Management**: Clear focus indicators

## 🔧 Customization

### Styling
The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #ff004f;
  --secondary-color: #00d4ff;
  --background-dark: #0b0b0c;
  --background-light: #121212;
  /* ... more variables */
}
```

### Configuration
Modify the JavaScript configuration in `app.js`:

```javascript
this.movieSettings = {
  genre: 'action',
  duration: '60',
  style: 'modern'
};
```

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build` (if using build system)
3. Set publish directory: `.` (or `dist` if using build system)
4. Deploy automatically on push to main branch

### Manual Deployment
1. Upload all files to your web server
2. Ensure `index.html` is in the root directory
3. Configure server to serve static files
4. Set up HTTPS for microphone access

## 🔒 Privacy & Security

### Data Protection
- **No Data Storage**: Photos and audio are processed locally
- **Secure Processing**: All AI processing done securely
- **Privacy First**: No personal data collected or stored
- **GDPR Compliant**: Full compliance with privacy regulations

### Security Features
- **HTTPS Only**: Secure connections required
- **Input Validation**: All user inputs validated
- **XSS Protection**: Sanitized user inputs
- **CSP Headers**: Content Security Policy implemented

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test on multiple browsers and devices
- Ensure accessibility compliance
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact us at info@starmakerai.com

### Common Issues

#### Microphone Access Denied
- Ensure you're using HTTPS
- Check browser permissions
- Try refreshing the page

#### Photo Upload Issues
- Check file format (JPG, PNG, WebP)
- Ensure file size < 10MB
- Try different photos

#### Video Generation Fails
- Check internet connection
- Ensure all steps completed
- Try again in a few minutes

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic photo upload
- ✅ Voice recording
- ✅ Genre selection
- ✅ Movie generation simulation

### Phase 2 (Next)
- 🔄 Real AI integration
- 🔄 Advanced voice cloning
- 🔄 Custom script generation
- 🔄 Multiple scene support

### Phase 3 (Future)
- 📋 Social sharing features
- 📋 User accounts and history
- 📋 Advanced editing tools
- 📋 Mobile app development

## 🙏 Acknowledgments

- **OpenAI** for AI technology and APIs
- **Lucide** for beautiful icons
- **Google Fonts** for typography
- **Netlify** for hosting and deployment
- **Community contributors** for feedback and support

---

**Made with ❤️ by the STARMAKER AI Team**

*Transform your dreams into cinematic reality*