"use server";

import { updateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Called after an upload/delete so the public pages refresh immediately.
export async function refreshSite(accessToken: string) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
  const { data } = await sb.rpc("is_admin");
  if (data !== true) return { ok: false };
  updateTag("materials");
  return { ok: true };
}