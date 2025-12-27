# 🚀 Deployment Guide - devstackglobe.net

This guide will help you deploy your website to Vercel and connect it to your domain `devstackglobe.net`.

---

## 📋 Step-by-Step Instructions

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `devstackglobe` (or any name you prefer)
4. Description: `DevStack Globe Website`
5. Choose **Private** or **Public** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

---

### Step 2: Push Your Code to GitHub

Open your terminal in the project folder and run these commands:

```bash
# Navigate to your project folder (if not already there)
cd "/home/programmer/Documents/my flutter project/devstack-globe-7c6665f6-main"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit - DevStack Globe website"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/devstackglobe.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username. For example, if your username is `john`, it would be:
```bash
git remote add origin https://github.com/john/devstackglobe.git
```

---

### Step 3: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Click **Import Git Repository**
4. Find and select your `devstackglobe` repository
5. Click **Import**

---

### Step 4: Configure Vercel Project

#### A. Project Settings
- **Framework Preset:** Vite (should auto-detect)
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build` (should auto-fill)
- **Output Directory:** `dist` (should auto-fill)
- **Install Command:** `npm install` (should auto-fill)

#### B. Environment Variables
Click **Environment Variables** and add these:

1. **VITE_SUPABASE_URL**
   - Value: Your Supabase project URL
   - Example: `https://ymzepgivjjdmytcshnrx.supabase.co`
   - Environments: Production, Preview, Development (check all)

2. **VITE_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Environments: Production, Preview, Development (check all)

3. **VITE_FLW_PUBLIC_KEY** (if you're using Flutterwave)
   - Value: Your Flutterwave public key
   - Environments: Production, Preview, Development (check all)

4. **VITE_FLW_SECRET_KEY** (if you're using Flutterwave)
   - Value: Your Flutterwave secret key
   - Environments: Production, Preview, Development (check all)

**To find your Supabase keys:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Go to **Settings** → **API**
- Copy **Project URL** and **anon/public key**

---

### Step 5: Deploy

1. After adding environment variables, click **Deploy**
2. Wait for the build to complete (usually 1-2 minutes)
3. Once deployed, you'll get a URL like: `devstackglobe.vercel.app`

---

### Step 6: Connect Your Domain (devstackglobe.net)

#### A. In Vercel Dashboard

1. Go to your project dashboard
2. Click **Settings** tab
3. Click **Domains** in the left sidebar
4. Enter: `devstackglobe.net`
5. Click **Add**
6. Also add: `www.devstackglobe.net` (optional, for www version)

#### B. Configure DNS at Your Domain Registrar

Vercel will show you DNS records to add. You need to add these at your domain registrar:

**Option 1: A Record (Recommended)**
- **Type:** A
- **Name:** `@` (or leave blank)
- **Value:** `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IP)
- **TTL:** 3600 (or default)

**Option 2: CNAME Record (Easier)**
- **Type:** CNAME
- **Name:** `@` (or leave blank)
- **Value:** `cname.vercel-dns.com` (check Vercel dashboard for exact value)
- **TTL:** 3600 (or default)

**For www version:**
- **Type:** CNAME
- **Name:** `www`
- **Value:** `cname.vercel-dns.com` (or the value Vercel shows)
- **TTL:** 3600

#### C. Where to Add DNS Records

Go to your domain registrar's dashboard (where you bought devstackglobe.net):

**Common Registrars:**
- **Namecheap:** Domain List → Manage → Advanced DNS
- **GoDaddy:** My Products → DNS → Manage DNS
- **Google Domains:** DNS → Custom Records
- **Cloudflare:** DNS → Records

**Steps:**
1. Find DNS Management / DNS Settings
2. Add the records Vercel provided
3. Save changes
4. Wait 5-60 minutes for DNS to propagate

---

### Step 7: Verify Domain Connection

1. Go back to Vercel → Your Project → Settings → Domains
2. Wait for DNS to propagate (can take up to 24 hours, usually 5-60 minutes)
3. Once verified, you'll see a green checkmark ✅
4. Your site will be live at `https://devstackglobe.net`

---

## 🔧 Troubleshooting

### Build Fails?
- Check that all environment variables are set correctly
- Check the build logs in Vercel dashboard
- Make sure `npm run build` works locally first

### Domain Not Connecting?
- Wait 24-48 hours for DNS propagation
- Double-check DNS records match exactly what Vercel shows
- Use [DNS Checker](https://dnschecker.org) to verify DNS propagation

### Environment Variables Not Working?
- Make sure variable names start with `VITE_` for Vite projects
- Redeploy after adding new environment variables
- Check that variables are enabled for Production environment

### Site Shows 404?
- Make sure `vercel.json` is in your project root
- The rewrite rule should route all requests to `index.html` (for React Router)

---

## 📝 Quick Checklist

- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Connected repository to Vercel
- [ ] Added environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Deployed successfully
- [ ] Added domain in Vercel
- [ ] Configured DNS records at domain registrar
- [ ] Verified domain connection
- [ ] Tested website at devstackglobe.net

---

## 🎉 After Deployment

Once your site is live:

1. **Test all features:**
   - Login/Register
   - Portfolio, Templates, Marketplace pages
   - Admin panel
   - Contact form
   - Cart and checkout

2. **Update Supabase settings:**
   - Go to Supabase Dashboard → Settings → API
   - Add `https://devstackglobe.net` to **Allowed Redirect URLs**
   - Add `https://www.devstackglobe.net` if using www version

3. **Enable HTTPS:**
   - Vercel automatically provides SSL certificates
   - Your site will be accessible via `https://devstackglobe.net`

---

## 📞 Need Help?

If you encounter any issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Make sure DNS records are correct

Good luck! 🚀

