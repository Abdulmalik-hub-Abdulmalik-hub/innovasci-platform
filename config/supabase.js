// Supabase configuration
// Replace with your real Supabase credentials

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "YOUR_SUPABASE_URL"
const supabaseKey = "YOUR_ANON_PUBLIC_KEY"

export const supabase = createClient(supabaseUrl, supabaseKey)
