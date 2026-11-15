import Link from "next/link";
import { FileText, Download } from "lucide-react";
import { formatSize, type Material } from "@/lib/data";

export default function MaterialCard({ href, m }: { href: string; m: Material }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-vv-navy-soft p-5 transition hover:border-vv-cyan/50"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-vv-blue/20 text-vv-cyan">
        <FileText size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-snug">{m.title}</h3>
        {m.description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/60">{m.description}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
          {m.exam_year && (
            <span className="rounded-full bg-white/10 px-2 py-0.5">{m.exam_year}</span>
          )}
          {m.puc_year && (
            <span className="rounded-full bg-white/10 px-2 py-0.5">
              {m.puc_year === 1 ? "1st PUC" : "2nd PUC"}
            </span>
          )}
          {m.file_size ? <span>{formatSize(m.file_size)}</span> : null}
        </div>
      </div>
      <Download
        size={20}
        className="mt-1 shrink-0 text-vv-orange transition group-hover:translate-y-0.5"
      />
    </Link>
  );
}