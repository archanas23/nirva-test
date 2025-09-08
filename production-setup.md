# Nirva Yoga Studio - Production Setup Guide

## 🎯 **Overview**
This guide walks you through deploying your Nirva Yoga website from prototype to production-ready business application.

## 🗄️ **Phase 1: Database Setup (Supabase)**

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project: "nirva-yoga-studio"
3. Save your project URL and API keys

### 1.2 Database Schema (SQL to run in Supabase SQL Editor)

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Class packages table
CREATE TABLE user_class_packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  five_pack INTEGER DEFAULT 0,
  ten_pack INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Classes table
CREATE TABLE classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  teacher VARCHAR NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration VARCHAR NOT NULL,
  level VARCHAR NOT NULL,
  max_students INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Class bookings table
CREATE TABLE class_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  class_date DATE NOT NULL,
  payment_method VARCHAR NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  stripe_payment_id VARCHAR, -- For Stripe transaction tracking
  status VARCHAR DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR NOT NULL,
  package_type VARCHAR, -- 'single', 'five', 'ten'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample classes
INSERT INTO classes (name, teacher, day_of_week, start_time, end_time, duration, level) VALUES
('Morning Flow', 'Harshada', 1, '08:00:00', '09:00:00', '60 min', 'All Levels'),
('Power Flow', 'Archana', 1, '18:00:00', '19:00:00', '60 min', 'Intermediate'),
('Evening Restore', 'Harshada', 2, '19:00:00', '20:00:00', '60 min', 'Beginner'),
('Vinyasa Flow', 'Archana', 3, '07:00:00', '08:00:00', '60 min', 'All Levels'),
('Gentle Flow', 'Harshada', 4, '18:30:00', '19:30:00', '60 min', 'Beginner'),
('Strong Flow', 'Archana', 5, '17:00:00', '18:00:00', '60 min', 'Advanced');
```

### 1.3 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_class_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Class packs policies
CREATE POLICY "Users can view own class packs" ON user_class_packs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own class packs" ON user_class_packs FOR UPDATE USING (auth.uid() = user_id);

-- Booking policies  
CREATE POLICY "Users can view own bookings" ON class_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON class_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payment policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
```

## 💳 **Phase 2: Payment Processing (Zelle)**

### 2.1 Zelle Setup (Recommended - Zero Fees!)
1. Ensure your bank account supports Zelle
2. Register your phone number with Zelle through your bank app
3. Update the phone number in `/components/payment-page.tsx` (currently set to `(555) 123-YOGA`)
4. Test receiving payments from friends/family first

### 2.2 Zelle Benefits for Your Studio
- **Zero transaction fees** (vs 2.9% + 30¢ for Stripe)
- **Instant transfers** directly to your bank
- **No merchant account** setup required
- **Familiar to customers** (built into most banking apps)
- **Simple reconciliation** - appears in your bank statement

## 📧 **Phase 3: Email Service**

### Option A: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain: nirvayogastudio.com
3. Get API key

### Option B: SendGrid Alternative
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify domain and get API key

## 🔐 **Phase 4: Authentication**

### Supabase Auth Setup
```sql
-- Enable email confirmation
-- In Supabase Dashboard > Authentication > Settings:
-- Set "Enable email confirmations" = true
-- Set "Site URL" = https://nirvayogastudio.com
```

## 🌐 **Phase 5: Hosting & Domain**

### Option A: Vercel (Recommended for React)
1. Connect GitHub repo to [vercel.com](https://vercel.com)
2. Set environment variables (see Phase 6)
3. Configure custom domain: nirvayogastudio.com

### Option B: Netlify Alternative  
1. Connect repo to [netlify.com](https://netlify.com)
2. Configure build: `npm run build`
3. Set up domain

## 🔑 **Phase 6: Environment Variables**

Create `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://nirvayogastudio.com
ADMIN_EMAIL=nirvayogastudio@gmail.com
ZELLE_PHONE=(805) 807-4894
```

## 🚀 **Phase 7: Code Updates Required**

### 7.1 Replace Mock Authentication
- Update `handleLogin` to use Supabase Auth
- Add proper password handling
- Implement email verification

### 7.2 Replace Mock Payment Verification
- Set up manual payment verification process
- Add admin dashboard for confirming Zelle payments
- Create workflow for updating class pack balances after payment verification

### 7.3 Replace Mock Admin Notifications
- Use Resend/SendGrid for real emails
- Add proper error handling
- Store booking confirmations in database

### 7.4 Add Real Class Data
- Fetch classes from Supabase
- Implement real booking system with availability checking
- Add calendar integration for class scheduling

## 📊 **Phase 8: Analytics & Monitoring**

### 8.1 Add Analytics
- Google Analytics 4
- Stripe Dashboard for payment analytics
- Supabase Dashboard for user analytics

### 8.2 Error Monitoring
- Sentry for error tracking
- Uptime monitoring (UptimeRobot)

## 🔒 **Phase 9: Security & Compliance**

### 9.1 SSL Certificate
- Automatic with Vercel/Netlify
- Force HTTPS redirects

### 9.2 Privacy & Legal
- Update Privacy Policy with real data handling
- Terms of Service with your actual business terms
- Cookie consent (if using analytics)

## ✅ **Phase 10: Go-Live Checklist**

- [ ] Database setup complete
- [ ] Zelle phone number updated in code
- [ ] Zelle receiving tested with small amount
- [ ] Email notifications working
- [ ] Domain pointing to production site
- [ ] SSL certificate active
- [ ] Analytics tracking setup
- [ ] Admin access working (Ctrl+Shift+A)
- [ ] Mobile responsive tested
- [ ] Class booking flow tested end-to-end
- [ ] Zelle payment instructions clear to customers
- [ ] Payment verification workflow established
- [ ] Admin notification emails tested

## 💰 **Estimated Monthly Costs**

- **Supabase**: $25/month (Pro plan)
- **Zelle**: $0 (zero transaction fees!)
- **Resend**: $20/month (for 50k emails)
- **Vercel**: Free (for this usage)
- **Domain**: $12/year
- **Total**: ~$45/month (no transaction fees with Zelle!)

## 🆘 **Support & Maintenance**

### Regular Tasks
- Monitor payment webhooks
- Check email deliverability  
- Update class schedules
- Review booking analytics
- Backup database monthly

### Emergency Contacts
- Stripe Support: For payment issues
- Supabase Support: For database issues  
- Domain Registrar: For DNS issues

---

**Ready to deploy?** Start with Phase 1 (Database Setup) and work through each phase systematically. Each phase builds on the previous one.

## 🔧 **Fix 1: Mobile Menu**

```93:93:components/mobile-menu.tsx
                Classes from <span className="font-medium text-primary">$11</span>
```

## 🔧 **Fix 2: Navigation**

```137:137:components/navigation.tsx
              <span className="ml-1 font-semibold text-primary">$11</span>
```

## 🔧 **Fix 3: Studio Info**

```14:14:components/studio-info.tsx
          With live Zoom classes at just $11/class, we're committed to removing barriers 
```

## 🔧 **Fix 4: index.html (SEO Meta Tags)**

```8:8:index.html
    <meta name="description" content="Join Nirva Yoga Studio for virtual yoga classes with certified instructors. $11/class with flexible packages. Expert guidance for all levels with personalized attention." />
```

```15:15:index.html
    <meta property="og:description" content="Join our virtual yoga community with certified instructors. $11/class with flexible packages and personalized attention." />
```

```21:21:index.html
    <meta property="twitter:description" content="Join our virtual yoga community with certified instructors. $11/class with flexible packages and personalized attention." />
```

## 🚀 **After Making These Changes:**

```bash
<code_block_to_apply_changes_from>
```

**These are the last $11 references! Your pricing will be consistent at $11 everywhere.**