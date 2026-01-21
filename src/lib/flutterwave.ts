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
    if (window.FlutterwaveCheckout) {
      resolve();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]');
    if (existingScript) {
      // Wait for it to load
      existingScript.addEventListener('load', () => {
        if (window.FlutterwaveCheckout) {
          resolve();
        } else {
          reject(new Error('Flutterwave script loaded but FlutterwaveCheckout is not available'));
        }
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load Flutterwave script'));
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => {
      // Double check that FlutterwaveCheckout is available
      if (window.FlutterwaveCheckout) {
        resolve();
      } else {
        reject(new Error('Flutterwave script loaded but FlutterwaveCheckout is not available'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
    document.body.appendChild(script);
  });
};

export const makePayment = (config: FlutterwaveConfig) => {
  console.log('makePayment called', { 
    hasFlutterwaveCheckout: !!window.FlutterwaveCheckout,
    publicKey: config.public_key.substring(0, 10) + '...',
    amount: config.amount,
    txRef: config.tx_ref
  });
  
  if (!window.FlutterwaveCheckout) {
    console.error('FlutterwaveCheckout not available');
    throw new Error('Flutterwave script not loaded');
  }

  try {
    console.log('Calling FlutterwaveCheckout with config:', {
      public_key: config.public_key.substring(0, 10) + '...',
      tx_ref: config.tx_ref,
      amount: config.amount,
      currency: config.currency,
    });
    
    // Flutterwave v3.js expects PBFPubKey parameter
    // V3 API uses PBFPubKey format (public key starting with FLWPUBK-)
    const flutterwaveConfig: any = {
      PBFPubKey: config.public_key, // v3.js requires PBFPubKey format
      tx_ref: config.tx_ref,
      amount: config.amount,
      currency: config.currency,
      payment_options: config.payment_options,
      customer: config.customer,
      customizations: config.customizations,
      callback: config.callback,
      onclose: config.onclose,
    };
    
    console.log('Flutterwave config object:', { ...flutterwaveConfig, public_key: flutterwaveConfig.public_key?.substring(0, 10) + '...' || flutterwaveConfig.PBFPubKey?.substring(0, 10) + '...' });
    
    const result = window.FlutterwaveCheckout(flutterwaveConfig);
    console.log('FlutterwaveCheckout result:', result);
    console.log('FlutterwaveCheckout called successfully');
  } catch (error) {
    console.error('Error calling FlutterwaveCheckout:', error);
    throw error;
  }
};

