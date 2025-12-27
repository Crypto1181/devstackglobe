# Admin Panel Setup Guide

## Overview
The admin panel allows you to manage three types of content:
1. **Portfolio** - Projects showcase (type, name, description, programming language)
2. **Templates** - Template items (name, description, programming language, price, review)
3. **Marketplace** - Marketplace items (name, description, price, review, type)

## Step 1: Create Database Tables in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `SUPABASE_SCHEMA.sql`
4. Click **Run** to execute the SQL

This will create:
- `portfolio` table
- `templates` table
- `marketplace` table
- Row Level Security (RLS) policies
- Auto-update triggers for `updated_at` timestamps

## Step 2: Set Up Admin User

You have two options to create an admin user:

### Option A: Set User Metadata (Recommended)
1. Go to **Authentication > Users** in Supabase dashboard
2. Find or create your admin user account
3. Click **Edit** on the user
4. In the **User Metadata** section, add:
   ```json
   {
     "role": "admin"
   }
   ```
   OR
   ```json
   {
     "is_admin": true
   }
   ```
5. Save the changes

### Option B: Create Admin Users Table (Alternative)
If you prefer a separate admin table, uncomment the code in `src/lib/admin.ts` and create this table:

```sql
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 3: Access Admin Panel

1. Start your development server: `npm run dev`
2. Log in with your admin account
3. Navigate to `/admin` in your browser
4. You should see the admin panel with three tabs

## Admin Panel Features

### Portfolio Management
- **Add Portfolio**: Fill in type, name, description, and programming language
- **Edit Portfolio**: Click the edit icon on any portfolio item
- **Delete Portfolio**: Click the delete icon (with confirmation)

### Template Management
- **Add Template**: Fill in name, description, programming language, price, and review rating
- **Edit Template**: Click the edit icon on any template
- **Delete Template**: Click the delete icon (with confirmation)

### Marketplace Management
- **Add Item**: Fill in name, description, type, price, and review rating
- **Edit Item**: Click the edit icon on any marketplace item
- **Delete Item**: Click the delete icon (with confirmation)

## Security Notes

- **Row Level Security (RLS)** is enabled on all tables
- Only users with admin role can INSERT, UPDATE, or DELETE
- All users can SELECT (view) the data
- Make sure to set admin metadata correctly, otherwise you'll get permission errors

## Troubleshooting

### "Permission denied" errors
- Check that your user has admin metadata set correctly
- Verify RLS policies are created correctly
- Check Supabase logs for detailed error messages

### Tables not found
- Make sure you ran the SQL schema file
- Check that table names match exactly: `portfolio`, `templates`, `marketplace`

### Can't access /admin route
- Make sure you're logged in
- Check browser console for errors
- Verify the route is added in `App.tsx`

## Next Steps

1. Customize the admin check logic in `src/lib/admin.ts` if needed
2. Add image upload functionality for portfolio/template/marketplace items
3. Add bulk operations (delete multiple items)
4. Add search and filter functionality
5. Add pagination for large datasets

