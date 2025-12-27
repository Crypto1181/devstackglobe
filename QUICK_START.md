# Quick Start Guide - Access Admin Panel

## ⚡ Quick Steps to Access Admin Panel

### Step 1: Set Up Admin User in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Users**
4. Find or create user with email: `admin1181@gmail.com`
5. Click **Edit** on that user
6. Scroll to **User Metadata** section
7. Click **Add Row** and add:
   - Key: `role`
   - Value: `admin`
8. Click **Save**

**OR** add this JSON:
```json
{
  "role": "admin"
}
```

### Step 2: Start the Application

Open terminal in your project folder and run:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### Step 3: Access Admin Panel

1. Open your browser
2. Go to: **http://localhost:8080**
3. Click **Login** (or go directly to `/login`)
4. Login with:
   - **Email**: `admin1181@gmail.com`
   - **Password**: `Devstackglobe`
5. After login, go to: **http://localhost:8080/admin**

**OR** you can directly go to: **http://localhost:8080/admin** (it will redirect to login if not authenticated)

## 📍 Admin Panel URL

Once logged in, you can access the admin panel at:
```
http://localhost:8080/admin
```

## 🔧 Important Notes

- **This is NOT a standalone HTML file** - it's a React application that needs to run
- The app runs on **port 8080** by default
- Make sure you've run the SQL schema (`SUPABASE_SCHEMA.sql`) in Supabase first
- Admin access is controlled by Supabase Row Level Security (RLS) policies

## 🚨 Troubleshooting

### Can't login?
- Make sure the user exists in Supabase Authentication
- Check that email/password are correct
- Verify Supabase connection in `.env` file

### Permission denied errors?
- Make sure you set `role: "admin"` in user metadata
- Check that RLS policies are created (run `SUPABASE_SCHEMA.sql`)

### Port 8080 already in use?
- Change port in `vite.config.ts` or use: `npm run dev -- --port 3000`

## 📱 Alternative: Build for Production

If you want a standalone version:

```bash
npm run build
npm run preview
```

This creates a production build that you can deploy anywhere.

