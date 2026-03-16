// Supabase configuration
// Replace with your real Supabase credentials

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "https://jwibdneazdkupqyuahjb.supabase.co"
const supabaseKey = "sb_publishable_sOpFjqp2aJaiHdWvn30nQw_tUVI4Fpu"

export const supabase = createClient(supabaseUrl, supabaseKey)
