import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import { getLevel, getSubjects } from "@/lib/data";

type Props = { params: Promise<{ level: string }> };

export default function LevelPage({ params }: Props) {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-white/60">Loading…</p>}>
        <LevelContent params={params} />
      </Suspense>
    </PageShell>
  );
}

async function LevelContent({ params }: Props) {
  const { level: levelSlug } = await params;
  const level = await getLevel(levelSlug);
  if (!level) notFound();
  const subjects = await getSubjects(level.id);

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: level.name }]} />
      <h1 className="text-3xl font-bold md:text-4xl">
        {level.name} <span className="text-vv-orange">Subjects</span>
      </h1>
      <p className="mt-2 text-white/60">Pick a subject to see notes, papers and solutions.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <Link
            key={s.id}
            href={`/${level.slug}/${s.slug}`}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-vv-navy-soft p-6 transition hover:-translate-y-1 hover:border-vv-cyan/50"
          >
            <span className="text-xl font-semibold">{s.name}</span>
            <ArrowRight className="text-vv-orange transition group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </>
  );
}