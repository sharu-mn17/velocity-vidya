import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import MaterialCard from "@/components/MaterialCard";
import { getLevel, getSubject, getCategory, getMaterials } from "@/lib/data";

type Props = {
  params: Promise<{ level: string; subject: string; category: string }>;
};

export default function CategoryPage({ params }: Props) {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-white/60">Loading…</p>}>
        <CategoryContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function CategoryContent({ params }: Props) {
  const { level: ls, subject: ss, category: cs } = await params;
  const level = await getLevel(ls);
  if (!level) notFound();
  const [subject, category] = await Promise.all([
    getSubject(level.id, ss),
    getCategory(cs),
  ]);
  if (!subject || !category) notFound();
  const materials = await getMaterials(subject.id, category.id);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: level.name, href: `/${level.slug}` },
          { label: subject.name, href: `/${level.slug}/${subject.slug}` },
          { label: category.name },
        ]}
      />
      <h1 className="text-3xl font-bold md:text-4xl">
        {subject.name} · <span className="text-vv-orange">{category.name}</span>
      </h1>

      {materials.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-white/10 bg-vv-navy-soft p-8 text-center text-white/60">
          No materials here yet. Check back soon!
        </p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {materials.map((m) => (
            <MaterialCard
              key={m.id}
              m={m}
              href={`/${level.slug}/${subject.slug}/${category.slug}/${m.slug}`}
            />
          ))}
        </div>
      )}
    </>
  );
}