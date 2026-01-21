// Flutterwave Payment Integration
export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number?: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo?: string;
  };
  callback?: (response: any) => void;
  onclose?: () => void;
}

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export const initializeFlutterwave = () => {
  return new Promise<void>((resolve, reject) => {
    // Check if already loaded
    if (window.FlutterwaveCheckout) {
      resolve();
      return;
    }

    // Check if script already exists in HTML (from index.html)
    const existingScript = document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]');
    
    if (existingScript) {
      // Script exists, wait for it to be ready
      const checkInterval = setInterval(() => {
        if (window.FlutterwaveCheckout) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.FlutterwaveCheckout) {
          reject(new Error('Flutterwave script loaded but FlutterwaveCheckout is not available'));
        }
      }, 10000);

      // Also listen for load event if script hasn't loaded yet
      if (!existingScript.hasAttribute('data-loaded')) {
        existingScript.addEventListener('load', () => {
          existingScript.setAttribute('data-loaded', 'true');
          setTimeout(() => {
            if (window.FlutterwaveCheckout) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 500);
        });
      }
      return;
    }

    // Script doesn't exist, create it
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => {
      // Wait a bit for FlutterwaveCheckout to be available
      setTimeout(() => {
        if (window.FlutterwaveCheckout) {
          resolve();
        } else {
          reject(new Error('Flutterwave script loaded but FlutterwaveCheckout is not available'));
        }
      }, 500);
    };
    script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
    document.body.appendChild(script);
  });
};

export const makePayment = (config: FlutterwaveConfig) => {
  console.log('makePayment called', { 
    hasFlutterwaveCheckout: !!window.FlutterwaveCheckout,
    publicKey: config.public_key.substring(0, 15) + '...',
    amount: config.amount,
    txRef: config.tx_ref
  });
  
  if (!window.FlutterwaveCheckout) {
    console.error('FlutterwaveCheckout not available');
    throw new Error('Flutterwave script not loaded');
  }

  try {
    // Validate public key format (should start with FLWPUBK-)
    if (!config.public_key.startsWith('FLWPUBK-')) {
      console.warn('Public key format might be incorrect. Expected format: FLWPUBK-...');
    }
    
    console.log('Calling FlutterwaveCheckout with config:', {
      public_key: config.public_key.substring(0, 15) + '...',
      tx_ref: config.tx_ref,
      amount: config.amount,
      currency: config.currency,
    });
    
    // Flutterwave v3.js configuration
    // For V3 API keys (FLWPUBK-...), try public_key first, fallback to PBFPubKey if needed
    const flutterwaveConfig: any = {
      public_key: config.public_key, // Try public_key first for V3
      tx_ref: config.tx_ref,
      amount: config.amount,
      currency: config.currency,
      payment_options: config.payment_options,
      customer: config.customer,
      customizations: config.customizations,
      callback: config.callback,
      onclose: config.onclose,
      redirect_url: window.location.origin + '/cart', // Redirect after payment
    };
    
    // Remove any undefined values
    Object.keys(flutterwaveConfig).forEach(key => {
      if (flutterwaveConfig[key] === undefined) {
        delete flutterwaveConfig[key];
      }
    });
    
    console.log('Flutterwave config object (sanitized):', { 
      ...flutterwaveConfig, 
      public_key: flutterwaveConfig.public_key?.substring(0, 15) + '...' 
    });
    
    // Call FlutterwaveCheckout - this should open the payment modal automatically
    // The function returns a handler object with a close() method
    try {
      const flutterwaveHandler = window.FlutterwaveCheckout(flutterwaveConfig);
      console.log('FlutterwaveCheckout called, handler:', flutterwaveHandler);
      
      // The modal should open automatically when FlutterwaveCheckout is called
      // The handler object is returned for programmatic control (e.g., closing the modal)
      if (flutterwaveHandler && typeof flutterwaveHandler.close === 'function') {
        console.log('Flutterwave payment modal handler created - modal should be opening...');
        
        // Check if modal actually opened by looking for Flutterwave iframe/overlay
        setTimeout(() => {
          const flutterwaveModal = document.querySelector('iframe[src*="flutterwave"]') || 
                                   document.querySelector('[id*="flutterwave"]') ||
                                   document.querySelector('.flw-modal');
          if (flutterwaveModal) {
            console.log('Flutterwave modal detected in DOM');
          } else {
            console.warn('Flutterwave modal not detected in DOM - may be blocked or configuration error');
          }
        }, 1000);
        
        return flutterwaveHandler;
      } else {
        console.warn('FlutterwaveCheckout returned unexpected value:', flutterwaveHandler);
      }
    } catch (error: any) {
      // If public_key doesn't work, try PBFPubKey (for older V3 compatibility)
      if (error.message && error.message.includes('public_key')) {
        console.log('Trying with PBFPubKey instead of public_key...');
        const altConfig = { ...flutterwaveConfig };
        delete altConfig.public_key;
        altConfig.PBFPubKey = config.public_key;
        
        const flutterwaveHandler = window.FlutterwaveCheckout(altConfig);
        console.log('FlutterwaveCheckout called with PBFPubKey, handler:', flutterwaveHandler);
        return flutterwaveHandler;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error calling FlutterwaveCheckout:', error);
    throw error;
  }
};

