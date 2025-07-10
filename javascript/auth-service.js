// Authentication Service for STARMAKER AI
class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authToken = null;
    this.firebaseConfig = {
      apiKey: "your-firebase-api-key",
      authDomain: "starmakerai.firebaseapp.com",
      projectId: "starmakerai",
      storageBucket: "starmakerai.appspot.com",
      messagingSenderId: "123456789",
      appId: "your-firebase-app-id"
    };
    this.firebase = null;
    this.auth = null;
    this.db = null;
  }

  // Initialize Firebase
  async initialize() {
    try {
      // Load Firebase SDK
      if (!window.firebase) {
        await this.loadFirebaseScript();
      }
      
      // Initialize Firebase
      this.firebase = window.firebase;
      this.firebase.initializeApp(this.firebaseConfig);
      this.auth = this.firebase.auth();
      this.db = this.firebase.firestore();
      
      // Set up auth state listener
      this.auth.onAuthStateChanged((user) => {
        this.handleAuthStateChange(user);
      });
      
      console.log('Authentication service initialized');
      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return false;
    }
  }

  // Load Firebase scripts
  loadFirebaseScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
      script.onload = () => {
        const authScript = document.createElement('script');
        authScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
        authScript.onload = () => {
          const firestoreScript = document.createElement('script');
          firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
          firestoreScript.onload = resolve;
          firestoreScript.onerror = reject;
          document.head.appendChild(firestoreScript);
        };
        authScript.onerror = reject;
        document.head.appendChild(authScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Handle auth state changes
  handleAuthStateChange(user) {
    if (user) {
      this.currentUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      };
      this.isAuthenticated = true;
      this.authToken = user.getIdToken();
      this.saveUserToLocalStorage();
      this.emitAuthEvent('login');
    } else {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.authToken = null;
      this.clearUserFromLocalStorage();
      this.emitAuthEvent('logout');
    }
  }

  // Register new user
  async register(email, password, displayName) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update display name
      await user.updateProfile({
        displayName: displayName
      });
      
      // Create user profile in Firestore
      await this.createUserProfile(user.uid, {
        email: email,
        displayName: displayName,
        createdAt: new Date(),
        subscription: null,
        moviesCreated: 0,
        totalWatchTime: 0
      });
      
      this.showNotification('Account created successfully!', 'success');
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      this.showNotification(this.getAuthErrorMessage(error), 'error');
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      this.showNotification('Welcome back!', 'success');
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      this.showNotification(this.getAuthErrorMessage(error), 'error');
      throw error;
    }
  }

  // Google OAuth login
  async loginWithGoogle() {
    try {
      const provider = new this.firebase.auth.GoogleAuthProvider();
      const result = await this.auth.signInWithPopup(provider);
      
      // Check if this is a new user
      if (result.additionalUserInfo.isNewUser) {
        await this.createUserProfile(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date(),
          subscription: null,
          moviesCreated: 0,
          totalWatchTime: 0
        });
      }
      
      this.showNotification('Logged in with Google!', 'success');
      return result.user;
    } catch (error) {
      console.error('Google login error:', error);
      this.showNotification(this.getAuthErrorMessage(error), 'error');
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await this.auth.signOut();
      this.showNotification('Logged out successfully', 'info');
    } catch (error) {
      console.error('Logout error:', error);
      this.showNotification('Logout failed', 'error');
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      this.showNotification('Password reset email sent!', 'success');
    } catch (error) {
      console.error('Password reset error:', error);
      this.showNotification(this.getAuthErrorMessage(error), 'error');
      throw error;
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      await user.updateProfile(updates);
      
      // Update Firestore profile
      await this.updateUserProfile(user.uid, updates);
      
      this.showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile update error:', error);
      this.showNotification('Profile update failed', 'error');
      throw error;
    }
  }

  // Create user profile in Firestore
  async createUserProfile(uid, profileData) {
    try {
      await this.db.collection('users').doc(uid).set(profileData);
    } catch (error) {
      console.error('Profile creation error:', error);
    }
  }

  // Update user profile in Firestore
  async updateUserProfile(uid, updates) {
    try {
      await this.db.collection('users').doc(uid).update(updates);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  }

  // Get user profile from Firestore
  async getUserProfile(uid) {
    try {
      const doc = await this.db.collection('users').doc(uid).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  }

  // Save movie to user's history
  async saveMovie(movieData) {
    try {
      if (!this.isAuthenticated) return;
      
      const movieRef = await this.db.collection('users').doc(this.currentUser.uid)
        .collection('movies').add({
          ...movieData,
          createdAt: new Date(),
          userId: this.currentUser.uid
        });
      
      // Update user stats
      await this.updateUserProfile(this.currentUser.uid, {
        moviesCreated: this.firebase.firestore.FieldValue.increment(1)
      });
      
      return movieRef.id;
    } catch (error) {
      console.error('Movie save error:', error);
    }
  }

  // Get user's movie history
  async getMovieHistory() {
    try {
      if (!this.isAuthenticated) return [];
      
      const snapshot = await this.db.collection('users').doc(this.currentUser.uid)
        .collection('movies')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Movie history fetch error:', error);
      return [];
    }
  }

  // Delete movie from history
  async deleteMovie(movieId) {
    try {
      if (!this.isAuthenticated) return;
      
      await this.db.collection('users').doc(this.currentUser.uid)
        .collection('movies').doc(movieId).delete();
      
      this.showNotification('Movie deleted from history', 'success');
    } catch (error) {
      console.error('Movie deletion error:', error);
      this.showNotification('Failed to delete movie', 'error');
    }
  }

  // Local storage methods
  saveUserToLocalStorage() {
    if (this.currentUser) {
      localStorage.setItem('starmaker_user', JSON.stringify(this.currentUser));
    }
  }

  clearUserFromLocalStorage() {
    localStorage.removeItem('starmaker_user');
  }

  loadUserFromLocalStorage() {
    const userData = localStorage.getItem('starmaker_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.isAuthenticated = true;
    }
  }

  // Event system
  emitAuthEvent(type, data = null) {
    const event = new CustomEvent('authStateChange', { 
      detail: { type, user: this.currentUser, data } 
    });
    document.dispatchEvent(event);
  }

  // Error message helper
  getAuthErrorMessage(error) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already registered',
      'auth/weak-password': 'Password is too weak',
      'auth/invalid-email': 'Invalid email address',
      'auth/too-many-requests': 'Too many failed attempts. Try again later',
      'auth/popup-closed-by-user': 'Login cancelled',
      'auth/cancelled-popup-request': 'Login cancelled'
    };
    
    return errorMessages[error.code] || error.message || 'Authentication failed';
  }

  // Notification helper
  showNotification(message, type = 'info') {
    if (window.app && window.app.showNotification) {
      window.app.showNotification(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  // Utility methods
  isEmailValid(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  isPasswordValid(password) {
    return password.length >= 6;
  }

  generateUsername(email) {
    return email.split('@')[0] + Math.floor(Math.random() * 1000);
  }
}

// Export for global access
window.AuthService = AuthService;