import { supabase } from './supabase';

/**
 * Check if the current user is an admin
 * This checks the user's metadata or a custom admin table
 * You can customize this based on your admin setup in Supabase
 */
export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  // Option 1: Check user metadata (set in Supabase dashboard or via admin)
  if (user.user_metadata?.role === 'admin' || user.user_metadata?.is_admin === true) {
    return true;
  }

  // Option 2: Check against an admin_users table (if you create one)
  // Uncomment this if you create an admin_users table
  /*
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single();
  
  return !error && !!data;
  */

  // Option 3: Check by email (for initial setup)
  // Replace with your admin email
  const adminEmails = ['admin1181@gmail.com', 'admin@devstackglobe.com']; // Add your admin emails here
  if (user.email && adminEmails.includes(user.email)) {
    return true;
  }

  return false;
}

