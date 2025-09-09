# 🔧 Environment Variables Checklist

## ✅ **Required Environment Variables for Production**

### **Client-Side Variables (VITE_ prefix)**
These are used in your React components and are safe to expose to the browser:

| Variable | Used In | Purpose |
|----------|---------|---------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `lib/stripe.ts`, `utils/stripe-payment.ts` | Stripe payment processing |
| `VITE_SUPABASE_URL` | `lib/supabase.ts`, `utils/database.ts` | Supabase database connection |
| `VITE_SUPABASE_ANON_KEY` | `lib/supabase.ts`, `utils/database.ts` | Supabase authentication |

### **Server-Side Variables (VITE_ prefix for Netlify Functions)**
These are used in Netlify Functions and should be set in Netlify dashboard:

| Variable | Used In | Purpose |
|----------|---------|---------|
| `VITE_RESEND_API_KEY` | `netlify/functions/send-email.js` | Email sending service |
| `VITE_ZOOM_ACCOUNT_ID` | `netlify/functions/create-zoom-meeting*.js` | Zoom API authentication |
| `VITE_ZOOM_CLIENT_ID` | `netlify/functions/create-zoom-meeting*.js` | Zoom API authentication |
| `VITE_ZOOM_CLIENT_SECRET` | `netlify/functions/create-zoom-meeting*.js` | Zoom API authentication |
| `STRIPE_SECRET_KEY` | `netlify/functions/create-payment-intent.js`, `netlify/functions/stripe-webhook.js` | Stripe server-side operations |
| `STRIPE_WEBHOOK_SECRET` | `netlify/functions/stripe-webhook.js` | Stripe webhook verification |

## 🔍 **Current Status Check**

### **✅ Fixed Issues:**
- [x] Updated `src/vite-env.d.ts` with all required variables
- [x] Fixed `lib/supabase.ts` to use `VITE_` prefix
- [x] Fixed `lib/stripe.ts` to use `VITE_` prefix
- [x] All Netlify functions use `VITE_` prefix correctly

### **⚠️ Need to Verify in Netlify Dashboard:**

#### **Client-Side Variables (Set in Netlify Environment Variables):**
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (for production)
- [ ] `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **Server-Side Variables (Set in Netlify Environment Variables):**
- [ ] `VITE_RESEND_API_KEY` = `re_...`
- [ ] `VITE_ZOOM_ACCOUNT_ID` = `your-zoom-account-id`
- [ ] `VITE_ZOOM_CLIENT_ID` = `your-zoom-client-id`
- [ ] `VITE_ZOOM_CLIENT_SECRET` = `your-zoom-client-secret`
- [ ] `STRIPE_SECRET_KEY` = `sk_live_...` (for production)
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_...`

## 🚨 **Critical Notes:**

### **1. Stripe Keys:**
- **Test Mode**: Use `pk_test_...` and `sk_test_...`
- **Live Mode**: Use `pk_live_...` and `sk_live_...`
- **Switch to live keys only when ready for production!**

### **2. Netlify Functions:**
- Netlify Functions can access `VITE_` prefixed variables
- They are available as `process.env.VITE_*` in serverless functions
- This is the correct approach for your setup

### **3. Security:**
- `VITE_` variables are exposed to the browser
- Only put non-sensitive data in `VITE_` variables
- Sensitive data (like `STRIPE_SECRET_KEY`) should NOT have `VITE_` prefix

## 🧪 **Testing Your Environment Variables:**

### **1. Use Admin Panel:**
- Go to your website
- Press `Ctrl+Shift+A` for admin access
- Use the testing tools to verify each service

### **2. Check Browser Console:**
- Open browser dev tools
- Look for any "Missing environment variable" errors
- All `VITE_` variables should be available

### **3. Test Each Service:**
- **Database**: Use "Database Test" tab
- **Email**: Use "Email Test" tab  
- **Payment**: Use "Payment Test" tab
- **Zoom**: Use "Zoom Debug" tab

## 📋 **Quick Setup Commands:**

### **For Netlify Dashboard:**
1. Go to your Netlify site dashboard
2. Go to Site Settings → Environment Variables
3. Add each variable from the list above
4. Redeploy your site

### **For Local Development:**
Create a `.env.local` file in your project root:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_RESEND_API_KEY=re_...
VITE_ZOOM_ACCOUNT_ID=your-zoom-account-id
VITE_ZOOM_CLIENT_ID=your-zoom-client-id
VITE_ZOOM_CLIENT_SECRET=your-zoom-client-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## ✅ **Ready for Production?**

Once all environment variables are set correctly:
1. Test each service using admin panel
2. Build and deploy: `npm run build`
3. Verify everything works on live site
4. Switch Stripe to live mode when ready

**Need Help?** If you see any "Missing environment variable" errors, check this checklist and verify the variable is set in Netlify dashboard.
