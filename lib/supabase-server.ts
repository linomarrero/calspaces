import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. Uses env vars at request time (not build time),
 * so the waitlist works as soon as you set vars in Vercel and redeploy.
 */
function getServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function getWaitlistCountServer(): Promise<number> {
  const client = getServerSupabase();
  if (!client) return 0;
  const { count, error } = await client
    .from("waitlist")
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function joinWaitlistServer(
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const client = getServerSupabase();
  if (!client) {
    return {
      ok: false,
      error: "Waitlist not configured. In Vercel: Settings → Environment Variables → add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for Production, then redeploy.",
    };
  }
  const { error } = await client.from("waitlist").insert({ email });
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Already on the list." };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
