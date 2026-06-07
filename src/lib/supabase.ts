import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase. A anon key é pública por design — a segurança vem do RLS.
 * Mesmo projeto do app v1 (conta compartilhada, tabelas app_state / push_subs).
 */
const SUPABASE_URL = 'https://mtbdbahmwbjmmuljvxfn.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10YmRiYWhtd2JqbW11bGp2eGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODg2MzksImV4cCI6MjA5NjI2NDYzOX0.SJ9Upx2cXeA84LGomHh8nJnIha-s2Rl1Jv0AFM1kiFI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
