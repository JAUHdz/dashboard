import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gyitfkcnhwslnbhfkomx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5aXRma2NuaHdzbG5iaGZrb214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MjY1NTcsImV4cCI6MjA2OTQwMjU1N30.cPHyYrurNhS78BPTvGyLrsCcfSdelImTip6Xqk-WmEQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
