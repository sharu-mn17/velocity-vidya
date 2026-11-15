import { Search } from "lucide-react";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form
      action="/search"
      className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-white/15 bg-vv-navy-soft p-1.5 pl-5"
    >
      <Search size={18} className="text-white/50" />
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search notes, papers, chapters…"
        className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-white/40"
      />
      <button className="rounded-full bg-vv-orange px-5 py-2 text-sm font-semibold text-vv-navy">
        Search
      </button>
    </form>
  );
}