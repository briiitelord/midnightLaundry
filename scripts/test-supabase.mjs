import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env manually (no external dependency)
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    process.env[key] = val;
  });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment or .env');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runTest() {
  console.log('Connecting to Supabase:', SUPABASE_URL);
  try {
    // Try selecting from a few likely tables. If a table does not exist we'll catch the error.
    const tablesToTry = ['music_items', 'videos', 'writing_pieces', 'research_papers', 'social_posts'];
    for (const tbl of tablesToTry) {
      console.log(`\nQuerying table: ${tbl} (limit 1)`);
      const { data, error } = await supabase.from(tbl).select('*').limit(1);
      if (error) {
        console.error(`  Table ${tbl} query error:`, error.message || error);
      } else {
        console.log(`  Success — rows returned: ${Array.isArray(data) ? data.length : 0}`);
        if (Array.isArray(data) && data.length > 0) {
          console.log('  Sample row:', JSON.stringify(data[0], Object.keys(data[0]).slice(0,5), 2));
        }
      }
    }

    console.log('\nSupabase connectivity test completed.');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  }
}

runTest();
