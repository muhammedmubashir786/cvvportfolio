import { createBrowserClient } from "@supabase/ssr";

/**
 * Use this inside "use client" components — e.g. the admin login form,
 * or any component that needs to read/write Supabase directly from
 * the browser after the page has loaded.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
