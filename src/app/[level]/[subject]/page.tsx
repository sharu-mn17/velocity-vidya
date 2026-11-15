import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import {
  getLevel,
  getSubject,
  getCategories,
  getCategoryCounts,
} from "@/lib/data";

type Props = { params: Promise<{ level: string; subject: string }> };

export default function SubjectPage({ params }: Props) {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-white/60">Loading…</p>}>
        <SubjectContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function SubjectContent({ params }: Props) {
  const { level: levelSlug, subject: subjectSlug } = await params;
  const level = await getLevel(levelSlug);
  if (!level) notFound();
  const subject = await getSubject(level.id, subjectSlug);
  if (!subject) notFound();
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryCounts(subject.id),
  ]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: level.name, href: `/${level.slug}` },
          { label: subject.name },
        ]}
      />
      <h1 className="text-3xl font-bold md:text-4xl">
        {level.name} · <span className="text-vv-orange">{subject.name}</span>
      </h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${level.slug}/${subject.slug}/${c.slug}`}
            className="group rounded-2xl border border-white/10 bg-vv-navy-soft p-6 transition hover:-translate-y-1 hover:border-vv-cyan/50"
          >
            <h2 className="text-xl font-semibold">{c.name}</h2>
            <p className="mt-1 text-sm text-white/60">
              {counts[c.id] ?? 0} {(counts[c.id] ?? 0) === 1 ? "file" : "files"}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-vv-orange">
              Open <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}