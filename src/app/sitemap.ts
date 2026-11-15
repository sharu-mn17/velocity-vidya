import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Row = {
  slug: string;
  created_at: string;
  levels: { slug: string };
  subjects: { slug: string };
  categories: { slug: string };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase
    .from("materials")
    .select("slug, created_at, levels(slug), subjects(slug), categories(slug)")
    .eq("is_published", true);
  const rows = (data as unknown as Row[]) ?? [];

  const pages = new Set<string>(["/sslc", "/puc", "/kcet"]);
  const entries: MetadataRoute.Sitemap = [{ url: SITE, changeFrequency: "weekly", priority: 1 }];

  for (const r of rows) {
    const l = r.levels.slug;
    const s = `${l}/${r.subjects.slug}`;
    const c = `${s}/${r.categories.slug}`;
    pages.add(`/${s}`);
    pages.add(`/${c}`);
    entries.push({
      url: `${SITE}/${c}/${r.slug}`,
      lastModified: r.created_at,
      priority: 0.6,
    });
  }
  for (const p of pages) entries.push({ url: `${SITE}${p}`, priority: 0.8 });
  return entries;
}