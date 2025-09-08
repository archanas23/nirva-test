# 🧪 Stripe Testing Guide

## 🔧 **Current Setup Status:**
- ✅ Test Payment Component: Ready
- ✅ Admin Panel Integration: Added
- ❌ Stripe API Endpoint: Currently mocked
- ❌ Environment Variables: Need setup

## 🚀 **How to Test Stripe Payments:**

### **1. Quick Test (Current)**
1. Login as admin: `nirvayogastudio@gmail.com` + `nirva2024`
2. Go to Admin Panel → Payment Testing tab
3. Click "Test $1.00 Payment" - shows mock response

### **2. Real Stripe Testing (Recommended)**

#### **Step 1: Get Stripe Test Keys**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Test Mode** (toggle in top-left)
3. Go to **Developers** → **API Keys**
4. Copy your **Publishable Key** and **Secret Key**

#### **Step 2: Set Environment Variables**
Add to your `.env` file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

#### **Step 3: Update Netlify Environment Variables**
1. Go to Netlify Dashboard
2. Site Settings → Environment Variables
3. Add:
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
   - `STRIPE_SECRET_KEY` = `sk_test_...`

#### **Step 4: Create Real Stripe API Endpoint**
Replace the mocked endpoint with real Stripe integration.

## 🧪 **Test Cards (Stripe Test Mode):**

### **Successful Payments:**
- **Visa:** `4242424242424242`
- **Mastercard:** `5555555555554444`
- **American Express:** `378282246310005`

### **Declined Payments:**
- **Generic Decline:** `4000000000000002`
- **Insufficient Funds:** `4000000000009995`
- **Lost Card:** `4000000000009987`

### **3D Secure (Authentication Required):**
- **Visa:** `4000002500003155`
- **Mastercard:** `4000002760003184`

## 🔍 **What to Test:**

### **1. Basic Payment Flow:**
- Single class booking ($11)
- Package purchases ($53, $105)
- Payment success/failure handling

### **2. Error Scenarios:**
- Declined cards
- Network errors
- Invalid card numbers

### **3. User Experience:**
- Loading states
- Error messages
- Success confirmations

## 📊 **Monitoring:**
- **Stripe Dashboard:** View test payments
- **Netlify Logs:** Check for errors
- **Browser Console:** Debug issues

## ⚠️ **Important Notes:**
- **Test Mode Only:** Never use real cards in test mode
- **Environment Variables:** Keep secret keys secure
- **Webhooks:** Set up for production
- **PCI Compliance:** Stripe handles this automatically

## 🚀 **Next Steps:**
1. Set up Stripe test keys
2. Update environment variables
3. Create real API endpoint
4. Test payment flows
5. Deploy to production with live keys
