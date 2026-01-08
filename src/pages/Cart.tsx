import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { initializeFlutterwave, makePayment } from '@/lib/flutterwave';
import { useEffect, useState, useRef } from 'react';

// Flutterwave Configuration
// Using V4 API keys from dashboard
// For v3.js script, we need to use PBFPubKey format
const FLUTTERWAVE_PUBLIC_KEY = 'Hh7ZS03ZS9tKLi5CVZVSdVw39170yxxY'; // Client Secret from V4 dashboard (corrected)
const FLUTTERWAVE_CLIENT_ID = '9a0edb63-a73d-49f5-ba45-ed0e65840960';
const FLUTTERWAVE_ENCRYPTION_KEY = 'vjO+KVabmDNT+5mCuB7u19qj1CKNLFDshPSO+dUonlk='; // Corrected from dashboard

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const modalOpenedRef = useRef(false);

  // Initialize Flutterwave on component mount
  useEffect(() => {
    initializeFlutterwave().catch((error) => {
      console.error('Failed to initialize Flutterwave:', error);
    });
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to complete checkout.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // Ensure Flutterwave is initialized
      try {
        console.log('Initializing Flutterwave...');
        await initializeFlutterwave();
        console.log('Flutterwave script loaded');
        
        // Wait a bit for Flutterwave to be fully ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if Flutterwave is actually loaded
        if (!window.FlutterwaveCheckout) {
          console.error('FlutterwaveCheckout not available after loading');
          throw new Error('Flutterwave script failed to load. Please refresh the page and try again.');
        }
        console.log('FlutterwaveCheckout is available');
      } catch (initError: any) {
        console.error('Flutterwave initialization error:', initError);
        setIsProcessing(false);
        toast({
          title: 'Payment Error',
          description: initError.message || 'Failed to load payment gateway. Please refresh and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Generate unique transaction reference
      const txRef = `DSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Get user email and name
      const userEmail = user.email || '';
      const userName = user.user_metadata?.full_name || userEmail.split('@')[0] || 'Customer';

      // Validate required fields
      if (!userEmail) {
        setIsProcessing(false);
        toast({
          title: 'Payment Error',
          description: 'Email is required for payment. Please update your profile.',
          variant: 'destructive',
        });
        return;
      }

      // Set a timeout to reset processing state if modal doesn't open
      modalOpenedRef.current = false;
      const timeoutId = setTimeout(() => {
        if (!modalOpenedRef.current) {
          setIsProcessing(false);
          toast({
            title: 'Payment Timeout',
            description: 'Payment modal did not open. Please try again.',
            variant: 'destructive',
          });
        }
      }, 5000);

      // Prepare payment configuration
      try {
        console.log('Preparing Flutterwave payment...', {
          public_key: FLUTTERWAVE_PUBLIC_KEY.substring(0, 10) + '...',
          tx_ref: txRef,
          amount: totalPrice,
          currency: 'USD',
          email: userEmail,
        });
        
        modalOpenedRef.current = true;
        makePayment({
          public_key: FLUTTERWAVE_PUBLIC_KEY,
          tx_ref: txRef,
          amount: totalPrice,
          currency: 'USD',
          payment_options: 'card,ussd,mobilemoney,banktransfer',
          customer: {
            email: userEmail,
            phone_number: user.user_metadata?.phone || '',
            name: userName,
          },
          customizations: {
            title: 'DevStackGlobe',
            description: `Payment for ${items.length} item(s)`,
            logo: window.location.origin + '/favicon.svg',
          },
          callback: async (response: any) => {
            console.log('Flutterwave callback received:', response);
            clearTimeout(timeoutId);
            modalOpenedRef.current = false;
            setIsProcessing(false);
            
            if (response.status === 'successful') {
              try {
                // Save consultation purchases to database
                const consultationItems = items.filter(item => item.type === 'consultation');
                
                if (consultationItems.length > 0) {
                  const purchases = consultationItems.map(item => {
                    const consultationType = item.name.includes('Product Support') ? 'product' : 'general';
                    return {
                      user_id: user.id,
                      consultation_type: consultationType,
                      amount: item.price,
                      status: 'completed',
                      transaction_id: response.transaction_id,
                      tx_ref: txRef,
                    };
                  });

                  const { error } = await supabase
                    .from('consultation_purchases')
                    .insert(purchases);

                  if (error) {
                    console.error('Error saving consultation purchase:', error);
                  }
                }

                toast({
                  title: 'Payment Successful!',
                  description: 'Your order has been processed. Thank you for your purchase!',
                });

                // Clear cart after successful checkout
                clearCart();
                
                // Redirect to contact page
                navigate('/contact');
              } catch (error: any) {
                console.error('Error processing payment callback:', error);
                toast({
                  title: 'Payment Successful',
                  description: 'Payment completed but there was an error saving your order details.',
                });
              }
            } else {
              toast({
                title: 'Payment Failed',
                description: 'Payment was not successful. Please try again.',
                variant: 'destructive',
              });
            }
          },
          onclose: () => {
            clearTimeout(timeoutId);
            modalOpenedRef.current = false;
            setIsProcessing(false);
            // User closed the payment modal without completing payment
            toast({
              title: 'Payment Cancelled',
              description: 'Payment was cancelled. You can try again when ready.',
              variant: 'destructive',
            });
          },
        });
      } catch (paymentError: any) {
        clearTimeout(timeoutId);
        modalOpenedRef.current = false;
        setIsProcessing(false);
        console.error('Payment error:', paymentError);
        toast({
          title: 'Payment Error',
          description: paymentError.message || 'Failed to open payment modal. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setIsProcessing(false);
      console.error('Checkout error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Browse our templates and marketplace to find what you need
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/templates">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Browse Templates
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline">Visit Marketplace</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="font-display text-4xl font-bold">
            Shopping <span className="text-gradient">Cart</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-xs font-medium text-primary uppercase">{item.type}</span>
                      <h3 className="font-display font-bold">{item.name}</h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-md bg-muted hover:bg-muted/80"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-md bg-muted hover:bg-muted/80"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-display text-lg font-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-display text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by Flutterwave
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
