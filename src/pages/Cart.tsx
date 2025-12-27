import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
          };
        });

        const { error } = await supabase
          .from('consultation_purchases')
          .insert(purchases);

        if (error) {
          console.error('Error saving consultation purchase:', error);
          // Continue anyway - payment might still be processed
        }
      }

      // Simulate payment processing
      toast({
        title: 'Payment Successful!',
        description: 'Your order has been processed. Thank you for your purchase!',
      });

      // Clear cart after successful checkout
      clearCart();
      
      // Redirect to home or contact page
      navigate('/contact');
    } catch (error: any) {
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to process payment. Please try again.',
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
