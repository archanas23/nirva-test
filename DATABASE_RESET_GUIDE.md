# 🗄️ Database Reset Guide

## 🚨 **IMPORTANT: This will delete ALL data!**

## 📋 **Step-by-Step Instructions:**

### 1. **Backup Your Data (Optional but Recommended)**
- Go to Supabase Dashboard → Settings → Database
- Click "Download backup" to save your current data
- This is optional but recommended for safety

### 2. **Clear the Database**
Choose one of these options:

#### Option A: **Simple Clear** (Recommended)
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `clear-database-simple.sql`
3. Click "Run" to execute
4. Verify all tables show count = 0

#### Option B: **Full Reset with Sample Data**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `reset-database.sql`
3. Uncomment the sample data section if you want test data
4. Click "Run" to execute

### 3. **Verify the Reset**
After running the script, you should see:
```
table_name           | count
---------------------|-------
user_booked_classes  | 0
password_reset_tokens| 0
class_instances      | 0
classes             | 0
users               | 0
```

### 4. **Set Up Fresh Data**
After clearing, you can:
- **Add classes** through the admin panel
- **Create user accounts** through the signup process
- **Book classes** through the classes page
- **View analytics** in the admin panel

## 🔄 **What Gets Cleared:**
- ✅ All user accounts
- ✅ All class bookings
- ✅ All class instances
- ✅ All class templates
- ✅ All password reset tokens
- ✅ All user data

## ⚠️ **What Stays:**
- ✅ Database structure (tables, columns, indexes)
- ✅ Row Level Security policies
- ✅ Functions and triggers
- ✅ Your Supabase project settings

## 🎯 **After Reset:**
1. **Test the signup process** - Create a new user account
2. **Add some classes** - Use the admin panel to create class templates
3. **Create class instances** - Use the session manager to add specific class dates
4. **Book a class** - Test the booking flow
5. **Check analytics** - Verify the analytics tab shows the new data

## 🆘 **If Something Goes Wrong:**
- Check the Supabase logs for any errors
- Make sure you're running the script in the correct database
- Verify all tables exist before running the clear script
- Contact support if you need help restoring from backup

## 📝 **Notes:**
- This is a **permanent action** - data cannot be recovered after deletion
- Make sure to test in a development environment first if possible
- The database structure remains intact, so the app will continue to work
- You'll need to recreate all your class schedules and user accounts

---
**Ready to reset? Choose your option and run the SQL script!** 🚀
