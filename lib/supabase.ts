import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) _supabase = createClient(url, key);
  return _supabase;
}

export async function getWaitlistCount(): Promise<number> {
  const client = getSupabase();
  if (!client) return 0;
  const { count, error } = await client
    .from("waitlist")
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function joinWaitlist(email: string): Promise<{ ok: boolean; error?: string }> {
  const client = getSupabase();
  if (!client) return { ok: false, error: "Service not configured." };
  const { error } = await client.from("waitlist").insert({ email });
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Already on the list." };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
