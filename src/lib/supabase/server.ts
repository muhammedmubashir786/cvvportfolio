import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Use this inside Server Components, Server Actions, and Route Handlers
 * (anything that runs on the server, not in the browser). It reads the
 * visitor's auth cookies so Supabase knows whether they're logged in —
 * this is what makes /admin "remember" your login across page loads.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component sometimes, where
            // cookies can't be written. Safe to ignore if you have
            // middleware refreshing sessions (we add that next).
          }
        },
      },
    }
  );
}
