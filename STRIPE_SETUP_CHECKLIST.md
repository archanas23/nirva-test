# 💳 **Stripe Production Setup Checklist**

## 🏦 **Bank Account Connection**

### **Step 1: Create Stripe Account**
- [ ] Go to [stripe.com](https://stripe.com)
- [ ] Sign up with your business email
- [ ] Complete account verification

### **Step 2: Business Information**
- [ ] Business name: "Nirva Yoga Studio"
- [ ] Business type: Individual or Business
- [ ] Business address
- [ ] Phone number
- [ ] Tax ID (if you have one)

### **Step 3: Add Bank Account**
- [ ] Go to **Payments → Payouts** in Stripe dashboard
- [ ] Click **"Add bank account"**
- [ ] Enter your bank account details:
  - Bank name
  - Account number
  - Routing number
  - Account holder name
- [ ] Wait for micro-deposit verification (1-2 business days)
- [ ] Verify micro-deposits in Stripe dashboard

---

## 🔑 **API Keys Setup**

### **Step 4: Get Live API Keys**
- [ ] Switch to **Live Mode** in Stripe dashboard (toggle top-left)
- [ ] Go to **Developers → API Keys**
- [ ] Copy **Publishable key** (starts with `pk_live_`)
- [ ] Copy **Secret key** (starts with `sk_live_`)

### **Step 5: Set Up Webhooks**
- [ ] Go to **Developers → Webhooks**
- [ ] Click **"Add endpoint"**
- [ ] Endpoint URL: `https://your-domain.com/.netlify/functions/stripe-webhook`
- [ ] Select events:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
- [ ] Copy **Webhook secret** (starts with `whsec_`)

---

## ⚙️ **Netlify Configuration**

### **Step 6: Environment Variables**
Add these to your Netlify environment variables:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **Step 7: Deploy**
- [ ] Deploy your updated code to Netlify
- [ ] Test webhook endpoint is accessible

---

## 🧪 **Testing**

### **Step 8: Test Payments**
- [ ] Test with small amount ($1.00)
- [ ] Verify payment appears in Stripe dashboard
- [ ] Check webhook logs in Netlify functions
- [ ] Confirm user credits are updated

### **Step 9: Go Live**
- [ ] Test with real payment methods
- [ ] Monitor Stripe dashboard for transactions
- [ ] Set up email notifications for payments

---

## 💰 **Payouts & Fees**

### **Stripe Fees:**
- **Credit Cards**: 2.9% + 30¢ per transaction
- **International Cards**: 3.9% + 30¢ per transaction
- **Payouts**: Free (2-7 business days)

### **Payout Schedule:**
- **Default**: Every 2 business days
- **Custom**: Can be set to daily, weekly, or monthly
- **Minimum**: $1.00

---

## 🔒 **Security Notes**

- ✅ Never share your secret key
- ✅ Use environment variables for all keys
- ✅ Enable webhook signature verification
- ✅ Monitor for suspicious activity
- ✅ Keep Stripe dashboard secure

---

## 📞 **Support**

- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Status Page**: [status.stripe.com](https://status.stripe.com)

---

**🎉 Once completed, your Nirva Yoga Studio will accept real payments!**

