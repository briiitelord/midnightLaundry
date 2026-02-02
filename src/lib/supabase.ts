import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Debug helper: perform direct REST calls to Supabase and log request/response
export async function debugRest(method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: any
) {
  const url = `${supabaseUrl}/rest/v1/${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    Prefer: 'return=representation',
  };

  console.log('[supabase debug] Request:', { method, url, headers, body });

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch (err) {
    parsed = text;
  }

  console.log('[supabase debug] Response:', { status: res.status, ok: res.ok, body: parsed });
  return { status: res.status, ok: res.ok, body: parsed, headers: res.headers };
}
