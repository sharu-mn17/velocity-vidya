"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { extractYouTubeId } from "@/lib/youtube";
import { refreshSite } from "@/app/admin/actions";

type Row = {
  id: string;
  youtube_id: string;
  title: string;
  description: string | null;
  is_published: boolean;
};

const inputCls =
  "w-full rounded-lg border border-white/15 bg-vv-navy px-3 py-2.5 text-sm outline-none focus:border-vv-cyan";

export default function VideoAdmin({ session }: { session: Session }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const parsed = link.trim() ? extractYouTubeId(link) : null;

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("videos")
      .select("id, youtube_id, title, description, is_published")
      .order("created_at", { ascending: false });
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!parsed) {
      setError("Please paste a valid YouTube link.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.from("videos").insert({
      youtube_id: parsed,
      title: title.trim(),
      description: description.trim() || null,
    });
    if (err) {
      setError(err.message);
    } else {
      await refreshSite(session.access_token);
      setLink("");
      setTitle("");
      setDescription("");
      await load();
    }
    setBusy(false);
  }

  async function toggle(r: Row) {
    await supabase.from("videos").update({ is_published: !r.is_published }).eq("id", r.id);
    await refreshSite(session.access_token);
    await load();
  }

  async function remove(r: Row) {
    if (!confirm(`Delete "${r.title}"?`)) return;
    await supabase.from("videos").delete().eq("id", r.id);
    await refreshSite(session.access_token);
    await load();
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-5">
      <form
        onSubmit={onAdd}
        className="space-y-4 rounded-2xl border border-white/10 bg-vv-navy-soft p-6 lg:col-span-2"
      >
        <h2 className="text-xl font-semibold">Add YouTube video</h2>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-white/80">YouTube link *</span>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={inputCls}
            placeholder="https://youtu.be/..."
          />
          {link.trim() && (
            <span className={`mt-1 block text-xs ${parsed ? "text-vv-cyan" : "text-red-400"}`}>
              {parsed ? `Video found: ${parsed}` : "Could not read this link"}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-white/80">Title *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-white/80">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputCls}
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-vv-orange py-3 font-semibold text-vv-navy disabled:opacity-60"
        >
          <Plus size={18} /> {busy ? "Adding…" : "Add video"}
        </button>
      </form>

      <div className="lg:col-span-3">
        <h2 className="mb-4 text-xl font-semibold">Your videos ({rows.length})</h2>
        <div className="space-y-3">
          {rows.length === 0 && <p className="text-white/60">No videos added yet.</p>}
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-vv-navy-soft p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${r.youtube_id}/default.jpg`}
                alt=""
                className="h-14 w-24 shrink-0 rounded-lg bg-black object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {r.title}
                  {!r.is_published && (
                    <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">Hidden</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(r)}
                  title={r.is_published ? "Hide" : "Show"}
                  className="rounded-lg border border-white/15 p-2 hover:border-vv-orange"
                >
                  {r.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => remove(r)}
                  title="Delete"
                  className="rounded-lg border border-white/15 p-2 hover:border-red-400 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}