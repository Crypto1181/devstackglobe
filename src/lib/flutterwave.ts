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

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
    document.body.appendChild(script);
  });
};

export const makePayment = (config: FlutterwaveConfig) => {
  if (!window.FlutterwaveCheckout) {
    throw new Error('Flutterwave script not loaded');
  }

  window.FlutterwaveCheckout({
    public_key: config.public_key,
    tx_ref: config.tx_ref,
    amount: config.amount,
    currency: config.currency,
    payment_options: config.payment_options,
    customer: config.customer,
    customizations: config.customizations,
    callback: config.callback,
    onclose: config.onclose,
  });
};

