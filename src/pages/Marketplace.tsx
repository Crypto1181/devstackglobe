import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Plug, Code, Server, Cloud, Database, Zap, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const categories = [
  { id: 'all', label: 'All Products', icon: Zap },
  { id: 'plugin', label: 'Plugins', icon: Plug },
  { id: 'api', label: 'APIs', icon: Code },
  { id: 'vps', label: 'VPS', icon: Server },
  { id: 'server', label: 'Servers', icon: Cloud },
];

const iconMap: Record<string, typeof Plug> = {
  plugin: Plug,
  api: Code,
  vps: Server,
  server: Cloud,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userReview, setUserReview] = useState({ reviewer_name: '', review_text: '', rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  const loadMarketplaceItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading marketplace items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load marketplace items. Please check your connection.',
          variant: 'destructive',
        });
        setProducts([]);
      } else {
        const transformed = (data || []).map((item) => {
          const allImages = item.images && Array.isArray(item.images) && item.images.length > 0
            ? item.images
            : item.image
              ? [item.image]
              : ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'];

          // Parse reviews if they're stored as JSONB string
          let reviews = [];
          if (item.reviews) {
            if (typeof item.reviews === 'string') {
              try {
                reviews = JSON.parse(item.reviews);
              } catch (e) {
                reviews = [];
              }
            } else if (Array.isArray(item.reviews)) {
              reviews = item.reviews;
            }
          }

          return {
            ...item,
            rating: item.review || 4.5,
            reviewCount: reviews.length,
            reviews: reviews,
            allImages: allImages,
            icon: iconMap[item.type] || Plug,
            image: allImages[0],
          };
        });
        setProducts(transformed);
      }
    } catch (error: any) {
      console.error('Error loading marketplace items:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load marketplace items',
        variant: 'destructive',
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.type === activeCategory);

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: product.type,
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct?.id) return;
    if (!userReview.reviewer_name || !userReview.review_text) {
      toast({
        title: 'Error',
        description: 'Please fill in your name and review text',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const { data: productData, error: fetchError } = await supabase
        .from('marketplace')
        .select('reviews')
        .eq('id', selectedProduct.id)
        .single();

      if (fetchError) throw fetchError;

      const currentReviews = (productData?.reviews || []) as any[];
      const newReview = {
        ...userReview,
        created_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('marketplace')
        .update({
          reviews: [...currentReviews, newReview],
        })
        .eq('id', selectedProduct.id);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Your review has been submitted!',
      });

      setUserReview({ reviewer_name: '', review_text: '', rating: 5 });
      
      // Reload product and update selected product
      const { data: updatedData, error: reloadError } = await supabase
        .from('marketplace')
        .select('*')
        .eq('id', selectedProduct.id)
        .single();

      if (!reloadError && updatedData) {
        // Parse reviews if needed
        let reviews = [];
        if (updatedData.reviews) {
          if (typeof updatedData.reviews === 'string') {
            try {
              reviews = JSON.parse(updatedData.reviews);
            } catch (e) {
              reviews = [];
            }
          } else if (Array.isArray(updatedData.reviews)) {
            reviews = updatedData.reviews;
          }
        }

        const allImages = updatedData.images && Array.isArray(updatedData.images) && updatedData.images.length > 0
          ? updatedData.images
          : updatedData.image
            ? [updatedData.image]
            : ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'];

        const updatedProduct = {
          ...updatedData,
          rating: updatedData.review || 4.5,
          reviewCount: reviews.length,
          reviews: reviews,
          allImages: allImages,
          icon: iconMap[updatedData.type] || Plug,
          image: allImages[0],
        };

        setSelectedProduct(updatedProduct);
        setCurrentImageIndex(0);
      }
      
      loadMarketplaceItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const nextImage = () => {
    if (selectedProduct?.allImages) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.allImages.length);
    }
  };

  const prevImage = () => {
    if (selectedProduct?.allImages) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.allImages.length) % selectedProduct.allImages.length);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Digital <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Plugins, APIs, VPS, and server solutions for your projects
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No products available in this category. Check back soon!</div>
          </div>
        ) : (
        <motion.div
          key={activeCategory}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={item}
              className="glass-card overflow-hidden group cursor-pointer"
              onClick={() => {
                // Ensure reviews is always a valid array
                const safeProduct = {
                  ...product,
                  reviews: Array.isArray(product.reviews) 
                    ? product.reviews.filter((r: any) => r && typeof r === 'object')
                    : []
                };
                setSelectedProduct(safeProduct);
                setCurrentImageIndex(0);
              }}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute top-3 left-3 p-2 rounded-lg bg-muted/80 backdrop-blur-sm">
                  <product.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-muted-foreground text-xs">({product.reviewCount || 0} reviews)</span>
                </div>
                <h3 className="font-display font-bold mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-xl font-bold text-primary">${product.price}</span>
                    {product.monthly && <span className="text-xs text-muted-foreground">/mo</span>}
                  </div>
                  <Button
                    onClick={(e) => handleAddToCart(product, e)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedProduct(null);
              setCurrentImageIndex(0);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Carousel */}
              <div className="relative h-80">
                {selectedProduct.allImages && selectedProduct.allImages.length > 0 ? (
                  <>
                    <img
                      src={selectedProduct.allImages[currentImageIndex]}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    {selectedProduct.allImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors z-10"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors z-10"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {selectedProduct.allImages.map((_: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(idx);
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-6' : 'bg-background/50'
                                }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setCurrentImageIndex(0);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="text-lg font-medium">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({selectedProduct.reviewCount || 0} reviews)</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {selectedProduct.type}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold mt-2 mb-4">{selectedProduct.name}</h2>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{selectedProduct.description}</p>

                {/* Reviews Section */}
                <div className="mb-6 pt-6 border-t">
                  <h4 className="font-semibold mb-4 text-lg">Customer Reviews</h4>
                  <div className="space-y-4 mb-6">
                    {selectedProduct.reviews && Array.isArray(selectedProduct.reviews) && selectedProduct.reviews.length > 0 ? (
                      selectedProduct.reviews
                        .filter((review: any) => review && typeof review === 'object' && review.reviewer_name && review.review_text)
                        .map((review: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">{String(review.reviewer_name || 'Anonymous')}</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= (Number(review.rating) || 0) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{String(review.review_text || '')}</p>
                            {review.created_at && (
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
                    )}
                  </div>

                  {/* Add Review Form */}
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h5 className="font-semibold mb-3">Write a Review</h5>
                    <div className="space-y-3">
                      <div>
                        <Label>Your Name</Label>
                        <Input
                          value={userReview.reviewer_name}
                          onChange={(e) => setUserReview({ ...userReview, reviewer_name: e.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label>Rating</Label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserReview({ ...userReview, rating: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  star <= userReview.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Your Review</Label>
                        <Textarea
                          value={userReview.review_text}
                          onChange={(e) => setUserReview({ ...userReview, review_text: e.target.value })}
                          placeholder="Share your thoughts about this product..."
                          rows={3}
                        />
                      </div>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={submittingReview}
                        className="w-full"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-primary">${selectedProduct.price}</span>
                    {selectedProduct.monthly && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <Button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                      setCurrentImageIndex(0);
                    }}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
