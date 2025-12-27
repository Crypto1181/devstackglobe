# 📄 Standalone Admin Panel HTML File

## ✅ How to Use

1. **Open the file**: Double-click `admin-panel.html` or right-click → Open with → Chrome

2. **Login**: 
   - Email: `admin1181@gmail.com`
   - Password: `Devstackglobe`

3. **That's it!** You'll see the admin panel with 3 tabs:
   - 📊 Portfolio
   - 📄 Templates  
   - 🛒 Marketplace

## 🎯 Features

- ✅ **No npm/node required** - Just open in Chrome
- ✅ **All CRUD operations** - Create, Read, Update, Delete
- ✅ **Connected to Supabase** - Real-time database operations
- ✅ **Login built-in** - Authentication included
- ✅ **Works offline** (after initial load) - All libraries loaded from CDN

## 📝 What You Can Do

### Portfolio Tab
- Add portfolio items (Type, Name, Description, Programming Language)
- Edit existing portfolios
- Delete portfolios

### Templates Tab
- Add templates (Name, Description, Programming Language, Price, Review)
- Edit templates
- Delete templates

### Marketplace Tab
- Add marketplace items (Name, Description, Type, Price, Review)
- Edit items
- Delete items

## ⚠️ Important Notes

1. **Internet Required**: The file needs internet connection to:
   - Load React, Supabase libraries from CDN
   - Connect to your Supabase database

2. **Database Setup**: Make sure you've run `SUPABASE_SCHEMA.sql` in Supabase first

3. **Admin User**: Make sure `admin1181@gmail.com` has admin role set in Supabase user metadata

## 🔧 Troubleshooting

### Can't login?
- Check internet connection
- Verify credentials are correct
- Make sure user exists in Supabase

### "Permission denied" errors?
- Set user metadata `role: "admin"` in Supabase
- Run the SQL schema file

### File won't open?
- Make sure you're using Chrome or modern browser
- Check browser console for errors (F12)

## 📍 File Location

The file is saved as: `admin-panel.html` in your project root folder.

Just double-click it to open! 🚀

