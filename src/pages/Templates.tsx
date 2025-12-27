import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Check, Smartphone, Globe, Layers, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const iconMap: Record<string, typeof Smartphone> = {
  'React Native': Smartphone,
  'Next.js': Globe,
  'React': Globe,
  'Flutter': Smartphone,
  'Vue.js': Globe,
  'default': Layers,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Templates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userReview, setUserReview] = useState({ reviewer_name: '', review_text: '', rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading templates:', error);
        toast({
          title: 'Error',
          description: 'Failed to load templates. Please check your connection.',
          variant: 'destructive',
        });
        setTemplates([]);
      } else {
        const transformed = (data || []).map((item) => {
          const allImages = item.images && Array.isArray(item.images) && item.images.length > 0
            ? item.images
            : item.image
              ? [item.image]
              : ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop'];

          const programmingLang = item.programming_language || '';
          const langArray = programmingLang.split(',').map((t: string) => t.trim()).filter(Boolean);
          const firstLang = langArray[0] || '';

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
            features: langArray.length > 0 ? langArray : ['Not specified'],
            icon: iconMap[firstLang] || iconMap.default,
            image: allImages[0],
          };
        });
        setTemplates(transformed);
      }
    } catch (error: any) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load templates',
        variant: 'destructive',
      });
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (template: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    addToCart({
      id: template.id,
      name: template.name,
      price: template.price,
      image: template.image,
      type: 'template',
    });
    toast({
      title: 'Added to cart',
      description: `${template.name} has been added to your cart.`,
    });
  };

  const handleSubmitReview = async () => {
    if (!selectedTemplate?.id) return;
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
      const { data: templateData, error: fetchError } = await supabase
        .from('templates')
        .select('reviews')
        .eq('id', selectedTemplate.id)
        .single();

      if (fetchError) throw fetchError;

      const currentReviews = (templateData?.reviews || []) as any[];
      const newReview = {
        ...userReview,
        created_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('templates')
        .update({
          reviews: [...currentReviews, newReview],
        })
        .eq('id', selectedTemplate.id);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Your review has been submitted!',
      });

      setUserReview({ reviewer_name: '', review_text: '', rating: 5 });
      
      // Reload templates and update selected template
      const { data: updatedData, error: reloadError } = await supabase
        .from('templates')
        .select('*')
        .eq('id', selectedTemplate.id)
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
            : ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop'];

        const programmingLang = updatedData.programming_language || '';
        const langArray = programmingLang.split(',').map((t: string) => t.trim()).filter(Boolean);

        const updatedTemplate = {
          ...updatedData,
          rating: updatedData.review || 4.5,
          reviewCount: reviews.length,
          reviews: reviews,
          allImages: allImages,
          features: langArray.length > 0 ? langArray : ['Not specified'],
          icon: iconMap[langArray[0] || ''] || iconMap.default,
          image: allImages[0],
        };

        setSelectedTemplate(updatedTemplate);
        setCurrentImageIndex(0);
      }
      
      loadTemplates();
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
    if (selectedTemplate?.allImages) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedTemplate.allImages.length);
    }
  };

  const prevImage = () => {
    if (selectedTemplate?.allImages) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedTemplate.allImages.length) % selectedTemplate.allImages.length);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            App <span className="text-gradient">Templates</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Production-ready templates to kickstart your next project
          </p>
        </motion.div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading templates...</div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No templates available yet. Check back soon!</div>
          </div>
        ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {templates.map((template) => (
            <motion.div
              key={template.id}
              variants={item}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => {
                  // Ensure reviews is always a valid array
                  const safeTemplate = {
                    ...template,
                    reviews: Array.isArray(template.reviews) 
                      ? template.reviews.filter((r: any) => r && typeof r === 'object')
                      : []
                  };
                  setSelectedTemplate(safeTemplate);
                  setCurrentImageIndex(0);
                }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                {template.badge && (
                  <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                    {template.badge}
                  </span>
                )}
                <div className="absolute top-4 left-4 p-2 rounded-lg bg-muted/80 backdrop-blur-sm">
                  <template.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                    <span className="text-muted-foreground text-sm">({template.reviewCount || 0} reviews)</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{template.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{template.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-accent" />
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-primary">${template.price}</span>
                  </div>
                  <Button
                      onClick={(e) => handleAddToCart(template, e)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>

      {/* Template Detail Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedTemplate(null);
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
                {selectedTemplate.allImages && selectedTemplate.allImages.length > 0 ? (
                  <>
                    <img
                      src={selectedTemplate.allImages[currentImageIndex]}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    {selectedTemplate.allImages.length > 1 && (
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
                          {selectedTemplate.allImages.map((_: any, idx: number) => (
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
                      src={selectedTemplate.image}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectedTemplate(null);
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
                    <span className="text-lg font-medium">{selectedTemplate.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({selectedTemplate.reviewCount || 0} reviews)</span>
                </div>
                <h2 className="font-display text-3xl font-bold mt-2 mb-4">{selectedTemplate.name}</h2>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{selectedTemplate.description}</p>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-lg">Programming Languages & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.features.map((feature: string) => (
                      <span key={feature} className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary flex items-center gap-1">
                        <Check className="w-4 h-4 text-accent" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-6 pt-6 border-t">
                  <h4 className="font-semibold mb-4 text-lg">Customer Reviews</h4>
                  <div className="space-y-4 mb-6">
                    {selectedTemplate.reviews && Array.isArray(selectedTemplate.reviews) && selectedTemplate.reviews.length > 0 ? (
                      selectedTemplate.reviews
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
                                className={`w-6 h-6 transition-colors ${star <= userReview.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
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
                          placeholder="Share your thoughts about this template..."
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
                    <span className="font-display text-4xl font-bold text-primary">${selectedTemplate.price}</span>
                  </div>
                  <Button
                    onClick={() => {
                      handleAddToCart(selectedTemplate);
                      setSelectedTemplate(null);
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
