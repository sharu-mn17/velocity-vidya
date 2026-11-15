import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Item = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/50">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.href ? (
            <Link href={it.href} className="hover:text-vv-orange">
              {it.label}
            </Link>
          ) : (
            <span className="text-white/80">{it.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight size={14} />}
        </span>
      ))}
    </nav>
  );
}