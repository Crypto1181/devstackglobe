# 🌐 Connect devstackglobe.net to Vercel - Step by Step

Follow these steps to connect your domain to Vercel.

---

## Step 1: Add Domain in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **devstackglobe** project
3. Go to **Settings** tab (top navigation)
4. Click **Domains** in the left sidebar
5. In the "Add Domain" field, enter: `devstackglobe.net`
6. Click **Add**
7. Also add: `www.devstackglobe.net` (optional, but recommended)

---

## Step 2: Get DNS Configuration from Vercel

After adding the domain, Vercel will show you DNS records to add. You'll see something like:

**For devstackglobe.net:**
- **Type:** A or CNAME
- **Name:** `@` (or leave blank)
- **Value:** An IP address or CNAME value (Vercel will show this)

**For www.devstackglobe.net:**
- **Type:** CNAME
- **Name:** `www`
- **Value:** `cname.vercel-dns.com` (or similar - Vercel will show exact value)

**📝 Important:** Copy the exact values Vercel shows you - they may differ from examples above!

---

## Step 3: Configure DNS at Your Domain Registrar

You need to add these DNS records where you bought your domain (Namecheap, GoDaddy, etc.).

### Where to Find DNS Settings:

**Common Registrars:**

1. **Namecheap:**
   - Go to [Namecheap Dashboard](https://www.namecheap.com)
   - Click **Domain List** → Find `devstackglobe.net` → Click **Manage**
   - Go to **Advanced DNS** tab
   - Add the records Vercel provided

2. **GoDaddy:**
   - Go to [GoDaddy Dashboard](https://www.godaddy.com)
   - Click **My Products** → Find `devstackglobe.net` → Click **DNS**
   - Click **Manage DNS**
   - Add the records Vercel provided

3. **Google Domains:**
   - Go to [Google Domains](https://domains.google.com)
   - Click on `devstackglobe.net`
   - Go to **DNS** → **Custom Records**
   - Add the records Vercel provided

4. **Cloudflare:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select your domain
   - Go to **DNS** → **Records**
   - Add the records Vercel provided

5. **Other Registrars:**
   - Look for "DNS Management", "DNS Settings", or "Name Servers"
   - Add the records Vercel provided

---

## Step 4: Add DNS Records

### For devstackglobe.net (Root Domain):

**Option A: A Record (if Vercel provides an IP)**
- **Type:** A
- **Name/Host:** `@` (or leave blank, or `devstackglobe.net`)
- **Value/Target:** The IP address Vercel shows (e.g., `76.76.21.21`)
- **TTL:** 3600 (or Auto/Default)

**Option B: CNAME Record (if Vercel provides CNAME)**
- **Type:** CNAME
- **Name/Host:** `@` (or leave blank, or `devstackglobe.net`)
- **Value/Target:** The CNAME value Vercel shows (e.g., `cname.vercel-dns.com`)
- **TTL:** 3600 (or Auto/Default)

### For www.devstackglobe.net:

- **Type:** CNAME
- **Name/Host:** `www`
- **Value/Target:** The CNAME value Vercel shows (e.g., `cname.vercel-dns.com`)
- **TTL:** 3600 (or Auto/Default)

**⚠️ Important Notes:**
- Some registrars don't allow CNAME for root domain (`@`). If that's the case, use A record.
- Use the **exact values** Vercel shows you, not the examples above!
- Save/Apply changes after adding records

---

## Step 5: Wait for DNS Propagation

After adding DNS records:
- DNS changes can take **5 minutes to 48 hours** to propagate
- Usually takes **15-60 minutes**
- Vercel will show the status in the Domains section

**Check Status:**
- Go back to Vercel → Your Project → Settings → Domains
- You'll see:
  - ⏳ **Pending** - DNS is propagating (wait)
  - ✅ **Valid** - Domain is connected! (success)
  - ❌ **Invalid** - Check DNS records (something wrong)

---

## Step 6: Verify Domain Connection

Once Vercel shows ✅ **Valid**:

1. **Test the domain:**
   - Open `https://devstackglobe.net` in your browser
   - Should show your website!

2. **Test www version:**
   - Open `https://www.devstackglobe.net`
   - Should also work!

3. **Check SSL Certificate:**
   - Vercel automatically provides SSL (HTTPS)
   - Your site should load with `https://` (secure)

---

## 🔧 Troubleshooting

### Domain Still Not Working After 24 Hours?

1. **Check DNS Records:**
   - Use [DNS Checker](https://dnschecker.org)
   - Enter `devstackglobe.net`
   - Check if DNS records are propagated globally

2. **Verify Records Match Vercel:**
   - Go back to Vercel → Settings → Domains
   - Compare the records you added with what Vercel shows
   - Make sure they match exactly

3. **Check for Typos:**
   - Double-check the values you entered
   - Make sure there are no extra spaces

4. **Contact Support:**
   - If still not working after 48 hours, contact Vercel support
   - Or your domain registrar support

### Common Issues:

**Issue:** "Invalid Configuration" in Vercel
- **Solution:** Check that DNS records match exactly what Vercel shows

**Issue:** Site loads but shows "Not Secure"
- **Solution:** Wait a few minutes - Vercel needs to issue SSL certificate

**Issue:** www works but root domain doesn't (or vice versa)
- **Solution:** Make sure you added both DNS records correctly

---

## ✅ Checklist

- [ ] Added `devstackglobe.net` in Vercel Domains
- [ ] Added `www.devstackglobe.net` in Vercel Domains (optional)
- [ ] Copied DNS records from Vercel
- [ ] Added DNS records at domain registrar
- [ ] Saved DNS changes
- [ ] Waited for DNS propagation (15-60 minutes)
- [ ] Verified domain shows ✅ Valid in Vercel
- [ ] Tested `https://devstackglobe.net` in browser
- [ ] Tested `https://www.devstackglobe.net` in browser (if added)

---

## 🎉 After Domain is Connected

Once your domain is working:

1. **Update Supabase Redirect URLs:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Settings → API → URL Configuration
   - Add to **Redirect URLs:**
     - `https://devstackglobe.net`
     - `https://www.devstackglobe.net` (if using www)
     - `https://devstackglobe.vercel.app` (keep this too)

2. **Test All Features:**
   - Login/Register
   - All pages load correctly
   - Admin panel works
   - Images load properly

3. **Share Your Website:**
   - Your site is now live at `https://devstackglobe.net`! 🚀

---

## 📞 Need Help?

If you get stuck:
1. Check Vercel's domain documentation
2. Check your domain registrar's DNS help docs
3. Use [DNS Checker](https://dnschecker.org) to verify DNS propagation

Good luck! 🎯

