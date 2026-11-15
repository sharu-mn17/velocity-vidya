import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "@/lib/supabase";

export type Level = { id: number; slug: string; name: string };
export type Subject = { id: number; slug: string; name: string };
export type Category = { id: number; slug: string; name: string };
export type Material = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  puc_year: number | null;
  exam_year: number | null;
  file_path: string;
  file_size: number | null;
  created_at: string;
};
export type MaterialFull = Material & {
  levels: { slug: string; name: string };
  subjects: { slug: string; name: string };
  categories: { slug: string; name: string };
};

const MATERIAL_FIELDS =
  "id, title, slug, description, puc_year, exam_year, file_path, file_size, created_at";

export async function getLevel(slug: string): Promise<Level | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("materials");
  const { data } = await supabase
    .from("levels")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getSubjects(levelId: number): Promise<Subject[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("materials");
  const { data } = await supabase
    .from("subjects")
    .select("id, slug, name")
    .eq("level_id", levelId)
    .order("sort_order");
  return data ?? [];
}

export async function getSubject(
  levelId: number,
  slug: string
): Promise<Subject | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("materials");
  const { data } = await supabase
    .from("subjects")
    .select("id, slug, name")
    .eq("level_id", levelId)
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("materials");
  const { data } = await supabase
    .from("categories")
    .select("id, slug, name")
    .order("sort_order");
  return data ?? [];
}

export async function getCategory(slug: string): Promise<Category | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("materials");
  const { data } = await supabase
    .from("categories")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getCategoryCounts(
  subjectId: number
): Promise<Record<string, number>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("materials");
  const { data } = await supabase
    .from("materials")
    .select("category_id")
    .eq("subject_id", subjectId)
    .eq("is_published", true);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}

export async function getMaterials(
  subjectId: number,
  categoryId: number
): Promise<Material[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("materials");
  const { data } = await supabase
    .from("materials")
    .select(MATERIAL_FIELDS)
    .eq("subject_id", subjectId)
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .order("exam_year", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getMaterial(slug: string): Promise<MaterialFull | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("materials");
  const { data } = await supabase
    .from("materials")
    .select(
      `${MATERIAL_FIELDS}, levels(slug, name), subjects(slug, name), categories(slug, name)`
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}

export function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb >= 1
    ? `${mb.toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
export async function searchMaterials(q: string): Promise<MaterialFull[]> {
  const term = q.replace(/[%,()*\\]/g, " ").trim();
  if (!term) return [];
  const { data } = await supabase
    .from("materials")
    .select(
      `${MATERIAL_FIELDS}, levels(slug, name), subjects(slug, name), categories(slug, name)`
    )
    .eq("is_published", true)
    .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
    .order("created_at", { ascending: false })
    .limit(30);
  return (data as unknown as MaterialFull[]) ?? [];
}
export type Video = {
  id: string;
  youtube_id: string;
  title: string;
  description: string | null;
};

export async function getVideos(): Promise<Video[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("videos");
  const { data } = await supabase
    .from("videos")
    .select("id, youtube_id, title, description")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(12);
  return data ?? [];
}