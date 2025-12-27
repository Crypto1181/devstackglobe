import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Portfolio, Template, MarketplaceItem } from '@/types/database';
import { Plus, Trash2, Edit, Save, X, Database, FileCode, ShoppingCart, Star, Upload } from 'lucide-react';

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('portfolio');

  // Portfolio state
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfolioForm, setPortfolioForm] = useState<Portfolio>({
    type: '',
    name: '',
    description: '',
    programming_language: '',
  });
  const [editingPortfolio, setEditingPortfolio] = useState<string | null>(null);

  // Template state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateForm, setTemplateForm] = useState<Template>({
    name: '',
    description: '',
    programming_language: '',
    price: 0,
    review: 0,
    images: [],
    reviews: [],
  });
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [newReview, setNewReview] = useState({ reviewer_name: '', review_text: '', rating: 5 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Marketplace state
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [marketplaceForm, setMarketplaceForm] = useState<MarketplaceItem>({
    name: '',
    description: '',
    price: 0,
    review: 0,
    type: 'plugin',
    images: [],
    reviews: [],
  });
  const [editingMarketplace, setEditingMarketplace] = useState<string | null>(null);
  const [newMarketplaceReview, setNewMarketplaceReview] = useState({ reviewer_name: '', review_text: '', rating: 5 });
  const marketplaceFileInputRef = useRef<HTMLInputElement>(null);

  // Load data on mount
  useEffect(() => {
    loadPortfolios();
    loadTemplates();
    loadMarketplaceItems();
  }, []);

  // Portfolio functions
  const loadPortfolios = async () => {
    const { data, error } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading portfolios:', error);
      toast({ title: 'Error', description: 'Failed to load portfolios', variant: 'destructive' });
    } else {
      setPortfolios(data || []);
    }
  };

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPortfolio) {
      const { error } = await supabase
        .from('portfolio')
        .update({ ...portfolioForm, updated_at: new Date().toISOString() })
        .eq('id', editingPortfolio);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update portfolio', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Portfolio updated successfully' });
        setEditingPortfolio(null);
        resetPortfolioForm();
        loadPortfolios();
      }
    } else {
      const { error } = await supabase.from('portfolio').insert([portfolioForm]);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create portfolio', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Portfolio created successfully' });
        resetPortfolioForm();
        loadPortfolios();
      }
    }
  };

  const handlePortfolioEdit = (portfolio: Portfolio) => {
    setPortfolioForm(portfolio);
    setEditingPortfolio(portfolio.id || null);
  };

  const handlePortfolioDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete portfolio', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Portfolio deleted successfully' });
      loadPortfolios();
    }
  };

  const resetPortfolioForm = () => {
    setPortfolioForm({ type: '', name: '', description: '', programming_language: '' });
    setEditingPortfolio(null);
  };

  // Template functions
  const loadTemplates = async () => {
    const { data, error } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading templates:', error);
      toast({ title: 'Error', description: 'Failed to load templates', variant: 'destructive' });
    } else {
      setTemplates(data || []);
    }
  };

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...templateForm,
      images: templateForm.images || [],
      reviews: templateForm.reviews || [],
      updated_at: new Date().toISOString(),
    };
    
    if (editingTemplate) {
      const { error } = await supabase
        .from('templates')
        .update(submitData)
        .eq('id', editingTemplate);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update template', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Template updated successfully' });
        setEditingTemplate(null);
        resetTemplateForm();
        loadTemplates();
      }
    } else {
      const { error } = await supabase.from('templates').insert([submitData]);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create template', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Template created successfully' });
        resetTemplateForm();
        loadTemplates();
      }
    }
  };

  const handleTemplateEdit = (template: Template) => {
    setTemplateForm({
      ...template,
      images: Array.isArray(template.images) ? template.images : (template.images ? [template.images] : []),
      reviews: Array.isArray(template.reviews) ? template.reviews : [],
    });
    setEditingTemplate(template.id || null);
  };

  const handleTemplateDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete template', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Template deleted successfully' });
      loadTemplates();
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({ name: '', description: '', programming_language: '', price: 0, review: 0, images: [], reviews: [] });
    setEditingTemplate(null);
    setNewReview({ reviewer_name: '', review_text: '', rating: 5 });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `templates/${fileName}`;

    try {
      if (index !== undefined) {
        const newUploading = [...uploadingImages];
        newUploading[index] = true;
        setUploadingImages(newUploading);
      } else {
        setUploadingImages([...uploadingImages, true]);
      }

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      const imageUrl = data.publicUrl;

      const currentImages = templateForm.images || [];
      if (index !== undefined) {
        const updated = [...currentImages];
        updated[index] = imageUrl;
        setTemplateForm({ ...templateForm, images: updated });
      } else {
        setTemplateForm({ ...templateForm, images: [...currentImages, imageUrl] });
      }

      if (index !== undefined) {
        const newUploading = [...uploadingImages];
        newUploading[index] = false;
        setUploadingImages(newUploading);
      } else {
        setUploadingImages(uploadingImages.map((_, i) => i === uploadingImages.length ? false : uploadingImages[i]));
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to upload image', variant: 'destructive' });
      if (index !== undefined) {
        const newUploading = [...uploadingImages];
        newUploading[index] = false;
        setUploadingImages(newUploading);
      }
    }
  };

  const handleImageUrlAdd = (url: string) => {
    const currentImages = templateForm.images || [];
    setTemplateForm({ ...templateForm, images: [...currentImages, url] });
  };

  const handleImageRemove = (index: number) => {
    const currentImages = templateForm.images || [];
    setTemplateForm({ ...templateForm, images: currentImages.filter((_, i) => i !== index) });
  };

  const handleAddReview = () => {
    if (!newReview.reviewer_name || !newReview.review_text) {
      toast({ title: 'Error', description: 'Please fill in reviewer name and review text', variant: 'destructive' });
      return;
    }
    const currentReviews = templateForm.reviews || [];
    setTemplateForm({
      ...templateForm,
      reviews: [...currentReviews, { ...newReview, created_at: new Date().toISOString() }],
    });
    setNewReview({ reviewer_name: '', review_text: '', rating: 5 });
  };

  const handleRemoveReview = (index: number) => {
    const currentReviews = templateForm.reviews || [];
    setTemplateForm({ ...templateForm, reviews: currentReviews.filter((_, i) => i !== index) });
  };

  // Marketplace functions
  const loadMarketplaceItems = async () => {
    const { data, error } = await supabase.from('marketplace').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading marketplace items:', error);
      toast({ title: 'Error', description: 'Failed to load marketplace items', variant: 'destructive' });
    } else {
      setMarketplaceItems(data || []);
    }
  };

  const handleMarketplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMarketplace) {
      const { error } = await supabase
        .from('marketplace')
        .update({ ...marketplaceForm, updated_at: new Date().toISOString() })
        .eq('id', editingMarketplace);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update marketplace item', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Marketplace item updated successfully' });
        setEditingMarketplace(null);
        resetMarketplaceForm();
        loadMarketplaceItems();
      }
    } else {
      const { error } = await supabase.from('marketplace').insert([marketplaceForm]);
      if (error) {
        toast({ title: 'Error', description: 'Failed to create marketplace item', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Marketplace item created successfully' });
        resetMarketplaceForm();
        loadMarketplaceItems();
      }
    }
  };

  const handleMarketplaceEdit = (item: MarketplaceItem) => {
    setMarketplaceForm(item);
    setEditingMarketplace(item.id || null);
  };

  const handleMarketplaceDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this marketplace item?')) return;
    const { error } = await supabase.from('marketplace').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete marketplace item', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Marketplace item deleted successfully' });
      loadMarketplaceItems();
    }
  };

  const resetMarketplaceForm = () => {
    setMarketplaceForm({ name: '', description: '', price: 0, review: 0, type: 'plugin', images: [], reviews: [] });
    setEditingMarketplace(null);
    setNewMarketplaceReview({ reviewer_name: '', review_text: '', rating: 5 });
  };

  const handleMarketplaceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `marketplace/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      const imageUrl = data.publicUrl;

      const currentImages = marketplaceForm.images || [];
      if (index !== undefined) {
        const updated = [...currentImages];
        updated[index] = imageUrl;
        setMarketplaceForm({ ...marketplaceForm, images: updated });
      } else {
        setMarketplaceForm({ ...marketplaceForm, images: [...currentImages, imageUrl] });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to upload image', variant: 'destructive' });
    }
  };

  const handleMarketplaceImageUrlAdd = (url: string) => {
    const currentImages = marketplaceForm.images || [];
    setMarketplaceForm({ ...marketplaceForm, images: [...currentImages, url] });
  };

  const handleMarketplaceImageRemove = (index: number) => {
    const currentImages = marketplaceForm.images || [];
    setMarketplaceForm({ ...marketplaceForm, images: currentImages.filter((_, i) => i !== index) });
  };

  const handleAddMarketplaceReview = () => {
    if (!newMarketplaceReview.reviewer_name || !newMarketplaceReview.review_text) {
      toast({ title: 'Error', description: 'Please fill in reviewer name and review text', variant: 'destructive' });
      return;
    }
    const currentReviews = marketplaceForm.reviews || [];
    setMarketplaceForm({
      ...marketplaceForm,
      reviews: [...currentReviews, { ...newMarketplaceReview, created_at: new Date().toISOString() }],
    });
    setNewMarketplaceReview({ reviewer_name: '', review_text: '', rating: 5 });
  };

  const handleRemoveMarketplaceReview = (index: number) => {
    const currentReviews = marketplaceForm.reviews || [];
    setMarketplaceForm({ ...marketplaceForm, reviews: currentReviews.filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Admin <span className="text-gradient">Panel</span>
          </h1>
          <p className="text-muted-foreground">Manage portfolios, templates, and marketplace items</p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Add/Edit Portfolio</h2>
              <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Portfolio Type</Label>
                    <Input
                      value={portfolioForm.type}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, type: e.target.value })}
                      placeholder="e.g., Mobile App, Web Application, Backend System"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Programming Language</Label>
                    <Input
                      value={portfolioForm.programming_language}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, programming_language: e.target.value })}
                      placeholder="e.g., React, TypeScript, Node.js"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={portfolioForm.name}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, name: e.target.value })}
                    placeholder="Portfolio item name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={portfolioForm.description}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                    placeholder="Detailed description"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary">
                    {editingPortfolio ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Portfolio
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Portfolio
                      </>
                    )}
                  </Button>
                  {editingPortfolio && (
                    <Button type="button" variant="outline" onClick={resetPortfolioForm}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Portfolio List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Portfolio Items ({portfolios.length})</h2>
              <div className="space-y-4">
                {portfolios.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No portfolio items yet</p>
                ) : (
                  portfolios.map((portfolio) => (
                    <div key={portfolio.id} className="p-4 border rounded-lg flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                            {portfolio.type}
                          </span>
                          <span className="text-sm text-muted-foreground">{portfolio.programming_language}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{portfolio.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{portfolio.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePortfolioEdit(portfolio)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => portfolio.id && handlePortfolioDelete(portfolio.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Add/Edit Template</h2>
              <form onSubmit={handleTemplateSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      placeholder="Template name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Programming Language</Label>
                    <Input
                      value={templateForm.programming_language}
                      onChange={(e) => setTemplateForm({ ...templateForm, programming_language: e.target.value })}
                      placeholder="e.g., React, Vue, Angular"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={templateForm.price}
                      onChange={(e) => setTemplateForm({ ...templateForm, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Review Rating (0-5)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={templateForm.review}
                      onChange={(e) => setTemplateForm({ ...templateForm, review: parseFloat(e.target.value) || 0 })}
                      placeholder="4.5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                    placeholder="Template description"
                    rows={4}
                    required
                  />
                </div>

                {/* Multiple Images Section */}
                <div className="space-y-4 border-t pt-4">
                  <Label className="text-lg font-semibold">Template Images (for carousel)</Label>
                  <div className="space-y-3">
                    {(templateForm.images || []).map((img, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img src={img} alt={`Template ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <Input
                            value={img}
                            onChange={(e) => {
                              const updated = [...(templateForm.images || [])];
                              updated[index] = e.target.value;
                              setTemplateForm({ ...templateForm, images: updated });
                            }}
                            placeholder="Image URL"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, index)}
                            />
                          </label>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleImageRemove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Image
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const url = prompt('Enter image URL:');
                          if (url) handleImageUrlAdd(url);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Image URL
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="space-y-4 border-t pt-4">
                  <Label className="text-lg font-semibold">Reviews</Label>
                  <div className="space-y-3">
                    {(templateForm.reviews || []).map((review, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.reviewer_name}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveReview(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.review_text}</p>
                      </div>
                    ))}
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Reviewer Name</Label>
                          <Input
                            value={newReview.reviewer_name}
                            onChange={(e) => setNewReview({ ...newReview, reviewer_name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rating (1-5)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) || 5 })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Review Text</Label>
                        <Textarea
                          value={newReview.review_text}
                          onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                          placeholder="Write a review..."
                          rows={3}
                        />
                      </div>
                      <Button type="button" onClick={handleAddReview} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Review
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary">
                    {editingTemplate ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Template
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Template
                      </>
                    )}
                  </Button>
                  {editingTemplate && (
                    <Button type="button" variant="outline" onClick={resetTemplateForm}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Templates List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Templates ({templates.length})</h2>
              <div className="space-y-4">
                {templates.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No templates yet</p>
                ) : (
                  templates.map((template) => (
                    <div key={template.id} className="p-4 border rounded-lg flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">{template.programming_language}</span>
                          <span className="text-sm font-bold text-primary">${template.price}</span>
                          {template.review && (
                            <span className="text-sm text-muted-foreground">⭐ {template.review}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTemplateEdit(template)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => template.id && handleTemplateDelete(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Add/Edit Marketplace Item</h2>
              <form onSubmit={handleMarketplaceSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={marketplaceForm.name}
                      onChange={(e) => setMarketplaceForm({ ...marketplaceForm, name: e.target.value })}
                      placeholder="Item name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={marketplaceForm.type}
                      onValueChange={(value) => setMarketplaceForm({ ...marketplaceForm, type: value as MarketplaceItem['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plugin">Plugin</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="vps">VPS</SelectItem>
                        <SelectItem value="server">Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={marketplaceForm.price}
                      onChange={(e) => setMarketplaceForm({ ...marketplaceForm, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Review Rating (0-5)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={marketplaceForm.review}
                      onChange={(e) => setMarketplaceForm({ ...marketplaceForm, review: parseFloat(e.target.value) || 0 })}
                      placeholder="4.5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={marketplaceForm.description}
                    onChange={(e) => setMarketplaceForm({ ...marketplaceForm, description: e.target.value })}
                    placeholder="Item description"
                    rows={4}
                    required
                  />
                </div>

                {/* Multiple Images Section */}
                <div className="space-y-4 border-t pt-4">
                  <Label className="text-lg font-semibold">Product Images (for carousel)</Label>
                  <div className="space-y-3">
                    {(marketplaceForm.images || []).map((img, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img src={img} alt={`Product ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <Input
                            value={img}
                            onChange={(e) => {
                              const updated = [...(marketplaceForm.images || [])];
                              updated[index] = e.target.value;
                              setMarketplaceForm({ ...marketplaceForm, images: updated });
                            }}
                            placeholder="Image URL"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleMarketplaceImageUpload(e, index)}
                            />
                          </label>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleMarketplaceImageRemove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        ref={marketplaceFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleMarketplaceImageUpload(e)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => marketplaceFileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Image
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const url = prompt('Enter image URL:');
                          if (url) handleMarketplaceImageUrlAdd(url);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Image URL
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="space-y-4 border-t pt-4">
                  <Label className="text-lg font-semibold">Reviews</Label>
                  <div className="space-y-3">
                    {(marketplaceForm.reviews || []).map((review, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.reviewer_name}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMarketplaceReview(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.review_text}</p>
                      </div>
                    ))}
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Reviewer Name</Label>
                          <Input
                            value={newMarketplaceReview.reviewer_name}
                            onChange={(e) => setNewMarketplaceReview({ ...newMarketplaceReview, reviewer_name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rating (1-5)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={newMarketplaceReview.rating}
                            onChange={(e) => setNewMarketplaceReview({ ...newMarketplaceReview, rating: parseInt(e.target.value) || 5 })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Review Text</Label>
                        <Textarea
                          value={newMarketplaceReview.review_text}
                          onChange={(e) => setNewMarketplaceReview({ ...newMarketplaceReview, review_text: e.target.value })}
                          placeholder="Write a review..."
                          rows={3}
                        />
                      </div>
                      <Button type="button" onClick={handleAddMarketplaceReview} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Review
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary">
                    {editingMarketplace ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Item
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </>
                    )}
                  </Button>
                  {editingMarketplace && (
                    <Button type="button" variant="outline" onClick={resetMarketplaceForm}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Marketplace List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Marketplace Items ({marketplaceItems.length})</h2>
              <div className="space-y-4">
                {marketplaceItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No marketplace items yet</p>
                ) : (
                  marketplaceItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary uppercase">
                            {item.type}
                          </span>
                          <span className="text-sm font-bold text-primary">${item.price}</span>
                          {item.review && (
                            <span className="text-sm text-muted-foreground">⭐ {item.review}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarketplaceEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => item.id && handleMarketplaceDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

