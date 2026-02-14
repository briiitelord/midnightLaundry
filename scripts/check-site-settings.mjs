// Debug script to check site_settings in database

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://knpgxbafbxwrzsgetlnm.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucGd4YmFmYnh3cnpzZ2V0bG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjA4NjEsImV4cCI6MjA4NTA5Njg2MX0.voC9-LsTRNs-gqTb5hyZLlOqjeyJXTJRWmkQRz15ufs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSiteSettings() {
  console.log('🔍 Checking site_settings table...\n');
  
  // Check if table exists
  const { data: tables, error: tablesError } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1);

  if (tablesError) {
    console.error('❌ Error accessing site_settings table:', tablesError.message);
    console.log('\n💡 Solution: Create the table first!');
    console.log(`
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);
    return;
  }

  // Fetch all settings
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .in('setting_key', [
      'background_image',
      'button_theme_image',
      'header_image',
      'footer_image'
    ]);

  if (error) {
    console.error('❌ Error fetching settings:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('⚠️  No settings found in database!\n');
    console.log('💡 Solution: Upload images via Admin Dashboard → Site Build section');
    console.log('   OR insert default values:');
    console.log(`
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
  ('background_image', '/laundry-sketch.JPG', 'Main site background'),
  ('header_image', '/nebula-bg.jpg', 'Navigation header background'),
  ('footer_image', '/nebula-bg.jpg', 'Footer background'),
  ('button_theme_image', '/forest-texture.jpg', 'Button theme texture')
ON CONFLICT (setting_key) DO NOTHING;
    `);
    return;
  }

  console.log('✅ Found', data.length, 'setting(s) in database:\n');
  data.forEach((setting) => {
    console.log(`📄 ${setting.setting_key}`);
    console.log(`   Value: ${setting.setting_value}`);
    console.log(`   Description: ${setting.description || 'N/A'}`);
    console.log(`   Updated: ${new Date(setting.updated_at).toLocaleString()}\n`);
  });

  console.log('✅ Database is configured correctly!');
  console.log('\n💡 Next steps:');
  console.log('1. Make sure the app is rebuilt: npm run build');
  console.log('2. Deploy the new build to production');
  console.log('3. Clear browser cache and refresh the page');
}

checkSiteSettings().catch(console.error);
