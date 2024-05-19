import { createBrowserClient } from "@supabase/ssr";

/**
 *  To access Supabase from within components.
 */
export function createSupabaseComponentClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
