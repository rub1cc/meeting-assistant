import { createClient as createClientPrimitive } from "@supabase/supabase-js";

/**
 * To access Supabase from getStaticProps
 */
export function createSupabaseStaticClient() {
  const supabase = createClientPrimitive(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return supabase;
}
