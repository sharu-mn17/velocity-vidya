import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import PageShell from "@/components/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import { supabase } from "@/lib/supabase";
import { getMaterial, formatSize } from "@/lib/data";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ level: string; subject: string; category: string; slug: string }>;
};

export default function MaterialPage({ params }: Props) {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-white/60">Loading…</p>}>
        <MaterialContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function MaterialContent({ params }: Props) {
  const { slug } = await params;
  const m = await getMaterial(slug);
  if (!m) notFound();

  const ext = m.file_path.split(".").pop() ?? "pdf";
  const { data } = supabase.storage
    .from("materials")
    .getPublicUrl(m.file_path, { download: `${m.slug}.${ext}` });

  const base = `/${m.levels.slug}`;
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: m.levels.name, href: base },
          { label: m.subjects.name, href: `${base}/${m.subjects.slug}` },
          { label: m.categories.name, href: `${base}/${m.subjects.slug}/${m.categories.slug}` },
          { label: m.title },
        ]}
      />
      <div className="max-w-3xl rounded-2xl border border-white/10 bg-vv-navy-soft p-8">
        <h1 className="text-2xl font-bold md:text-3xl">{m.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
          <span className="rounded-full bg-vv-blue/20 px-3 py-1 text-vv-cyan">{m.levels.name}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">{m.subjects.name}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">{m.categories.name}</span>
          {m.exam_year && <span className="rounded-full bg-white/10 px-3 py-1">{m.exam_year}</span>}
          {m.puc_year && (
            <span className="rounded-full bg-white/10 px-3 py-1">
              {m.puc_year === 1 ? "1st PUC" : "2nd PUC"}
            </span>
          )}
        </div>
        {m.description && <p className="mt-6 whitespace-pre-line text-white/75">{m.description}</p>}

        <a
          href={data.publicUrl}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-vv-orange px-7 py-3 font-semibold text-vv-navy shadow-lg shadow-vv-orange/30 transition hover:scale-105"
        >
          <Download size={20} /> Download {m.file_size ? `(${formatSize(m.file_size)})` : ""}
        </a>
      </div>
    </>
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMaterial(slug);
  if (!m) return { title: "Not found" };
  return {
    title: `${m.title} | Velocity Vidya`,
    description:
      m.description?.slice(0, 160) ??
      `${m.subjects.name} ${m.categories.name} for ${m.levels.name}. Free download on Velocity Vidya.`,
  };
}