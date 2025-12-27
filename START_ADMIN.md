# 🚀 How to Open Admin Panel

## ⚠️ Important: This is NOT a standalone HTML file!

This is a **React application** that needs to be **running** to access the admin panel.

---

## 📋 Step-by-Step Instructions

### 1️⃣ First Time Setup (One-time)

#### A. Create Admin User in Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `ymzepgivjjdmytcshnrx`
3. Navigate to **Authentication** → **Users**
4. Click **Add User** → **Create new user**
5. Enter:
   - **Email**: `admin1181@gmail.com`
   - **Password**: `Devstackglobe`
   - **Auto Confirm User**: ✅ (check this)
6. Click **Create User**
7. After user is created, click **Edit** on that user
8. Scroll to **User Metadata** section
9. Click **Add Row**:
   - Key: `role`
   - Value: `admin`
10. Click **Save**

#### B. Run Database Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Open the file `SUPABASE_SCHEMA.sql` from your project
3. Copy all the SQL code
4. Paste it in SQL Editor
5. Click **Run** (or press F5)

---

### 2️⃣ Start the Application (Every Time)

Open your terminal/command prompt in the project folder and run:

```bash
npm run dev
```

**Wait for this message:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
```

---

### 3️⃣ Access Admin Panel

**Option A: Direct Access**
1. Open your web browser
2. Go to: **http://localhost:8080/admin**
3. You'll be redirected to login if not logged in
4. Login with:
   - Email: `admin1181@gmail.com`
   - Password: `Devstackglobe`
5. After login, you'll see the admin panel!

**Option B: Through Login Page**
1. Go to: **http://localhost:8080**
2. Click **Login** button
3. Enter credentials:
   - Email: `admin1181@gmail.com`
   - Password: `Devstackglobe`
4. After login, manually go to: **http://localhost:8080/admin**

---

## 🎯 Admin Panel URL

Once everything is set up:
```
http://localhost:8080/admin
```

---

## 📱 What You'll See

The admin panel has **3 tabs**:
1. **Portfolio** - Manage portfolio items
2. **Templates** - Manage templates
3. **Marketplace** - Manage marketplace items

Each tab has:
- ✅ Add/Edit form at the top
- ✅ List of existing items below
- ✅ Edit and Delete buttons for each item

---

## 🔧 Troubleshooting

### ❌ "Permission denied" error?
- Make sure you set `role: "admin"` in user metadata in Supabase
- Check that you ran `SUPABASE_SCHEMA.sql` in Supabase

### ❌ Can't login?
- Verify email/password are correct
- Check that user exists in Supabase Authentication
- Make sure user is confirmed (Auto Confirm was checked)

### ❌ Port 8080 already in use?
```bash
npm run dev -- --port 3000
```
Then access: `http://localhost:3000/admin`

### ❌ "Tables not found" error?
- Run the SQL schema file (`SUPABASE_SCHEMA.sql`) in Supabase SQL Editor

---

## 💡 Quick Reference

| What | Command/URL |
|------|-------------|
| Start app | `npm run dev` |
| Admin URL | `http://localhost:8080/admin` |
| Login URL | `http://localhost:8080/login` |
| Admin Email | `admin1181@gmail.com` |
| Admin Password | `Devstackglobe` |

---

## 🎉 You're All Set!

Once you see the admin panel with 3 tabs, you're ready to manage your content!

