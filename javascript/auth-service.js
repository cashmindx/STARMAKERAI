// Authentication Service for STARMAKER AI
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './firebase-config.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.initializeAuth();
  }

  initializeAuth() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.notifyAuthStateListeners(user);
      
      if (user) {
        console.log('User signed in:', user.email);
        this.updateUIForAuthenticatedUser(user);
      } else {
        console.log('User signed out');
        this.updateUIForUnauthenticatedUser();
      }
    });
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign up with email and password
  async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Add auth state listener
  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);
    // Call immediately with current state
    if (this.currentUser !== null) {
      callback(this.currentUser);
    }
  }

  // Notify all auth state listeners
  notifyAuthStateListeners(user) {
    this.authStateListeners.forEach(callback => {
      try {
        callback(user);
      } catch (error) {
        console.error('Auth state listener error:', error);
      }
    });
  }

  // Update UI for authenticated user
  updateUIForAuthenticatedUser(user) {
    const authButtons = document.querySelectorAll('.auth-button');
    const userInfo = document.querySelectorAll('.user-info');
    
    authButtons.forEach(button => {
      button.style.display = 'none';
    });
    
    userInfo.forEach(info => {
      info.style.display = 'block';
      const userName = info.querySelector('.user-name');
      if (userName) {
        userName.textContent = user.displayName || user.email;
      }
    });
  }

  // Update UI for unauthenticated user
  updateUIForUnauthenticatedUser() {
    const authButtons = document.querySelectorAll('.auth-button');
    const userInfo = document.querySelectorAll('.user-info');
    
    authButtons.forEach(button => {
      button.style.display = 'block';
    });
    
    userInfo.forEach(info => {
      info.style.display = 'none';
    });
  }

  // Show authentication modal
  showAuthModal(type = 'signin') {
    const modal = document.getElementById('authModal');
    const modalTitle = document.getElementById('authModalTitle');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    
    if (modal) {
      modal.style.display = 'block';
      
      if (type === 'signin') {
        modalTitle.textContent = 'Sign In';
        signInForm.style.display = 'block';
        signUpForm.style.display = 'none';
      } else {
        modalTitle.textContent = 'Sign Up';
        signInForm.style.display = 'none';
        signUpForm.style.display = 'block';
      }
    }
  }

  // Hide authentication modal
  hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}

// Initialize auth service
const authService = new AuthService();

// Export for use in other modules
window.AuthService = authService;
export default authService;