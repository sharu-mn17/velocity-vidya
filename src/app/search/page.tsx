import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import SearchBar from "@/components/SearchBar";
import MaterialCard from "@/components/MaterialCard";
import { searchMaterials } from "@/lib/data";

type Props = { searchParams: Promise<{ q?: string }> };

export default function SearchPage({ searchParams }: Props) {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-white/60">Searching…</p>}>
        <SearchContent searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}

async function SearchContent({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 80);
  const results = query.length >= 2 ? await searchMaterials(query) : [];

  return (
    <>
      <h1 className="mb-6 text-center text-3xl font-bold">
        Search <span className="text-vv-orange">Materials</span>
      </h1>
      <SearchBar defaultValue={query} />

      <div className="mt-10">
        {query.length < 2 ? (
          <p className="text-center text-white/60">Type at least 2 letters to search.</p>
        ) : results.length === 0 ? (
          <p className="text-center text-white/60">No results for “{query}”.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((m) => (
              <MaterialCard
                key={m.id}
                m={m}
                href={`/${m.levels.slug}/${m.subjects.slug}/${m.categories.slug}/${m.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}