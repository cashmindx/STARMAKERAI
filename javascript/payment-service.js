// Payment Service for STARMAKER AI
class PaymentService {
  constructor() {
    this.stripe = null;
    this.isConfigured = false;
    this.publishableKey = null;
    this.secretKey = null;
    this.currentUser = null;
    this.subscriptionPlans = {
      starter: {
        id: 'price_starter',
        name: 'Starter',
        price: 9,
        currency: 'usd',
        interval: 'one-time',
        features: ['1-minute movie', 'HD quality', 'Basic effects', '3 genres']
      },
      pro: {
        id: 'price_pro',
        name: 'Pro',
        price: 19,
        currency: 'usd',
        interval: 'one-time',
        features: ['5-minute movie', '4K quality', 'Advanced effects', 'All genres', 'AI co-stars', 'Priority processing']
      },
      studio: {
        id: 'price_studio',
        name: 'Studio',
        price: 49,
        currency: 'usd',
        interval: 'one-time',
        features: ['10-minute movie', '4K HDR quality', 'Premium effects', 'Custom scripts', 'Multiple scenes', '24/7 support']
      }
    };
  }

  // Initialize Stripe
  async initialize(publishableKey) {
    this.publishableKey = publishableKey;
    this.isConfigured = !!publishableKey;
    
    if (this.isConfigured) {
      try {
        // Load Stripe.js
        if (!window.Stripe) {
          await this.loadStripeScript();
        }
        
        this.stripe = Stripe(publishableKey);
        console.log('Payment service initialized successfully');
        return true;
      } catch (error) {
        console.error('Payment service initialization failed:', error);
        return false;
      }
    } else {
      console.warn('Payment service not configured - using simulation mode');
      return false;
    }
  }

  // Load Stripe.js script
  loadStripeScript() {
    return new Promise((resolve, reject) => {
      if (window.Stripe) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Create payment intent for movie generation
  async createPaymentIntent(planId, movieData = {}) {
    if (!this.isConfigured) {
      return this.simulatePaymentIntent(planId, movieData);
    }

    try {
      const plan = this.subscriptionPlans[planId];
      if (!plan) {
        throw new Error('Invalid plan selected');
      }

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price * 100, // Convert to cents
          currency: plan.currency,
          movieData: movieData
        })
      });

      if (!response.ok) {
        throw new Error('Payment intent creation failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment intent creation error:', error);
      return this.simulatePaymentIntent(planId, movieData);
    }
  }

  // Process payment
  async processPayment(paymentIntentId, paymentMethod) {
    if (!this.isConfigured) {
      return this.simulatePayment(paymentIntentId, paymentMethod);
    }

    try {
      const result = await this.stripe.confirmCardPayment(paymentIntentId, {
        payment_method: paymentMethod
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        success: true,
        paymentIntent: result.paymentIntent,
        transactionId: result.paymentIntent.id
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create subscription
  async createSubscription(planId, paymentMethod) {
    if (!this.isConfigured) {
      return this.simulateSubscription(planId, paymentMethod);
    }

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planId,
          paymentMethod: paymentMethod
        })
      });

      if (!response.ok) {
        throw new Error('Subscription creation failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Subscription creation error:', error);
      return this.simulateSubscription(planId, paymentMethod);
    }
  }

  // Get user's active subscription
  async getActiveSubscription() {
    if (!this.isConfigured) {
      return this.simulateActiveSubscription();
    }

    try {
      const response = await fetch('/api/subscription');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription fetch error:', error);
      return this.simulateActiveSubscription();
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    if (!this.isConfigured) {
      return this.simulateCancelSubscription(subscriptionId);
    }

    try {
      const response = await fetch(`/api/subscription/${subscriptionId}/cancel`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Subscription cancellation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      return this.simulateCancelSubscription(subscriptionId);
    }
  }

  // Get payment history
  async getPaymentHistory() {
    if (!this.isConfigured) {
      return this.simulatePaymentHistory();
    }

    try {
      const response = await fetch('/api/payment-history');
      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment history fetch error:', error);
      return this.simulatePaymentHistory();
    }
  }

  // Show payment modal
  async showPaymentModal(planId, movieData = {}) {
    const plan = this.subscriptionPlans[planId];
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    const content = `
      <div class="payment-modal">
        <h4>Complete Your Purchase</h4>
        <div class="plan-summary">
          <h5>${plan.name} Plan</h5>
          <p class="price">$${plan.price}</p>
          <ul class="features">
            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div class="payment-form">
          <div id="card-element" class="card-element"></div>
          <div id="card-errors" class="card-errors" role="alert"></div>
        </div>
        
        <div class="payment-actions">
          <button class="btn btn-primary" id="payButton" onclick="app.processPayment('${planId}')">
            Pay $${plan.price}
          </button>
          <button class="btn btn-secondary" onclick="app.hideModal()">
            Cancel
          </button>
        </div>
        
        <div class="payment-security">
          <p><i data-lucide="shield"></i> Secure payment powered by Stripe</p>
        </div>
      </div>
    `;

    app.showModal('Payment', content);
    
    // Initialize Stripe Elements if configured
    if (this.isConfigured && this.stripe) {
      this.initializeStripeElements();
    }
  }

  // Initialize Stripe Elements
  initializeStripeElements() {
    const elements = this.stripe.elements();
    const card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#f2f2f2',
          '::placeholder': {
            color: '#666',
          },
        },
      },
    });

    card.mount('#card-element');

    card.addEventListener('change', ({error}) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });

    this.cardElement = card;
  }

  // Simulation methods
  simulatePaymentIntent(planId, movieData) {
    return {
      clientSecret: 'pi_simulated_secret_' + Date.now(),
      amount: this.subscriptionPlans[planId]?.price * 100 || 1900,
      currency: 'usd',
      status: 'requires_payment_method'
    };
  }

  simulatePayment(paymentIntentId, paymentMethod) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentIntent: {
            id: paymentIntentId,
            status: 'succeeded',
            amount: 1900,
            currency: 'usd'
          },
          transactionId: paymentIntentId
        });
      }, 2000);
    });
  }

  simulateSubscription(planId, paymentMethod) {
    return {
      subscriptionId: 'sub_simulated_' + Date.now(),
      status: 'active',
      planId: planId,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  simulateActiveSubscription() {
    return {
      subscriptionId: 'sub_simulated_active',
      status: 'active',
      planId: 'pro',
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      features: this.subscriptionPlans.pro.features
    };
  }

  simulateCancelSubscription(subscriptionId) {
    return {
      success: true,
      subscriptionId: subscriptionId,
      status: 'cancelled'
    };
  }

  simulatePaymentHistory() {
    return {
      payments: [
        {
          id: 'pi_1',
          amount: 1900,
          currency: 'usd',
          status: 'succeeded',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Pro Plan - Action Movie'
        },
        {
          id: 'pi_2',
          amount: 900,
          currency: 'usd',
          status: 'succeeded',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Starter Plan - Comedy Movie'
        }
      ]
    };
  }

  // Utility methods
  formatCurrency(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  getPlanFeatures(planId) {
    return this.subscriptionPlans[planId]?.features || [];
  }

  getPlanPrice(planId) {
    return this.subscriptionPlans[planId]?.price || 0;
  }

  validatePaymentMethod(paymentMethod) {
    // Basic validation
    return paymentMethod && paymentMethod.card && paymentMethod.card.last4;
  }
}

// Export for global access
window.PaymentService = PaymentService;