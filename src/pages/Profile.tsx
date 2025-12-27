import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Edit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      // Get user metadata
      const fullName = user.user_metadata?.full_name || '';
      const email = user.email || '';
      
      // Try to get additional profile data from a profiles table (if it exists)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error('Error loading profile:', error);
      }

      setProfileData({
        full_name: data?.full_name || fullName || '',
        email: email,
        phone: data?.phone || '',
        bio: data?.bio || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
        },
      });

      if (updateError) throw updateError;

      // Try to upsert to profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.full_name,
          phone: profileData.phone,
          bio: profileData.bio,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (profileError && profileError.code !== '42P01') {
        // 42P01 means table doesn't exist, which is fine
        console.error('Error saving profile:', profileError);
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });

      setEditing(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-12">
        <div className="container px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Please login to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              My <span className="text-gradient">Profile</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    {profileData.full_name || 'User'}
                  </h2>
                  <p className="text-muted-foreground">{profileData.email}</p>
                </div>
              </div>
              {!editing ? (
                <Button
                  variant="outline"
                  onClick={() => setEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      loadProfile();
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  {editing ? (
                    <Input
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      placeholder="Your full name"
                      className="bg-muted/50 border-border/50 focus:border-primary"
                    />
                  ) : (
                    <p className="text-foreground py-2">{profileData.full_name || 'Not set'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2 text-muted-foreground py-2">
                    <Mail className="w-4 h-4" />
                    <p>{profileData.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                {editing ? (
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="bg-muted/50 border-border/50 focus:border-primary"
                  />
                ) : (
                  <p className="text-foreground py-2">{profileData.phone || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                {editing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary resize-none"
                  />
                ) : (
                  <p className="text-foreground py-2 whitespace-pre-wrap">
                    {profileData.bio || 'No bio added yet'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

