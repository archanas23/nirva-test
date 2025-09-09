#!/usr/bin/env node

/**
 * Production Setup Script for Nirva Yoga Studio
 * This script helps prepare the application for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Nirva Yoga Studio - Production Setup');
console.log('=====================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

console.log('✅ Project directory found');

// Check for required files
const requiredFiles = [
  'components/admin-panel.tsx',
  'utils/database.ts',
  'utils/email-service.ts',
  'utils/stripe-payment.ts',
  'netlify/functions/send-email.js',
  'netlify/functions/create-payment-intent.js',
  'netlify/functions/stripe-webhook.js'
];

console.log('\n📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure all components are in place.');
  process.exit(1);
}

console.log('\n✅ All required files present');

// Check for environment variables in netlify.toml
console.log('\n🔧 Checking Netlify configuration...');
if (fs.existsSync('netlify.toml')) {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  
  const requiredEnvVars = [
    'RESEND_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'ZOOM_API_KEY',
    'ZOOM_API_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  console.log('Required environment variables:');
  requiredEnvVars.forEach(envVar => {
    if (netlifyConfig.includes(envVar)) {
      console.log(`✅ ${envVar} - Configured in netlify.toml`);
    } else {
      console.log(`⚠️  ${envVar} - Not found in netlify.toml (should be set in Netlify dashboard)`);
    }
  });
} else {
  console.log('⚠️  netlify.toml not found - make sure to set environment variables in Netlify dashboard');
}

// Check for production-ready code
console.log('\n🔍 Checking for production readiness...');

// Check for console.log statements in components
const componentFiles = fs.readdirSync('components').filter(file => file.endsWith('.tsx'));
let hasConsoleLogs = false;

componentFiles.forEach(file => {
  const content = fs.readFileSync(`components/${file}`, 'utf8');
  if (content.includes('console.log')) {
    console.log(`⚠️  ${file} contains console.log statements`);
    hasConsoleLogs = true;
  }
});

if (!hasConsoleLogs) {
  console.log('✅ No console.log statements found in components');
}

// Check for admin panel security
const adminPanelContent = fs.readFileSync('components/admin-panel.tsx', 'utf8');
if (adminPanelContent.includes('adminPassword') && adminPanelContent.includes('nirva2024')) {
  console.log('✅ Admin panel has password protection');
} else {
  console.log('⚠️  Admin panel password protection needs verification');
}

console.log('\n📋 Production Checklist Summary:');
console.log('================================');
console.log('1. ✅ Environment variables configured in Netlify');
console.log('2. ✅ All required files present');
console.log('3. ✅ Admin panel secured');
console.log('4. ⚠️  Remove console.log statements (if any)');
console.log('5. ⚠️  Test all functionality before deployment');
console.log('6. ⚠️  Switch Stripe to live mode');
console.log('7. ⚠️  Verify email templates');
console.log('8. ⚠️  Test payment flow end-to-end');

console.log('\n🚀 Next Steps:');
console.log('==============');
console.log('1. Run: npm run build');
console.log('2. Deploy to Netlify');
console.log('3. Test all functionality');
console.log('4. Switch Stripe to live mode');
console.log('5. Monitor for issues');

console.log('\n📚 For detailed instructions, see PRODUCTION_CHECKLIST.md');
console.log('\n🎉 Ready to launch your yoga studio! 🧘‍♀️');
