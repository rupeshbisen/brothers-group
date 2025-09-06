import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Get environment variables with proper error handling
function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL environment variable is required"
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required"
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

// Get service role key for admin operations
function getServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY environment variable is required for admin operations"
    );
  }

  return serviceRoleKey;
}

// Client-side Supabase client (lazy initialization)
export const supabase = (() => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
})();

// Server-side Supabase client
export async function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options?: CookieOptions) {
        try {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        } catch {
          // The `remove` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

// Admin Supabase client with service role (bypasses RLS)
export async function createAdminClient() {
  const { supabaseUrl } = getSupabaseConfig();
  const serviceRoleKey = getServiceRoleKey();

  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}
