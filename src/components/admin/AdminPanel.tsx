"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { Check, Copy, Eye, EyeOff, LogOut, Trash2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { refreshSite } from "@/app/admin/actions";
import VideoAdmin from "@/components/admin/VideoAdmin";

type Level = { id: number; slug: string; name: string };
type Subject = { id: number; level_id: number; slug: string; name: string };
type Category = { id: number; slug: string; name: string };
type Row = {
  id: string;
  title: string;
  slug: string;
  file_path: string;
  is_published: boolean;
  levels: { slug: string };
  subjects: { slug: string; name: string };
  categories: { slug: string; name: string };
};

const inputCls =
  "w-full rounded-lg border border-white/15 bg-vv-navy px-3 py-2.5 text-sm outline-none focus:border-vv-cyan";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-white/80">{label}</span>
      {children}
    </label>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(data === true));
  }, [session]);

  if (!ready) return <Shell><p className="text-white/60">Loading…</p></Shell>;
  if (!session) return <Shell><LoginForm /></Shell>;
  if (isAdmin === null) return <Shell><p className="text-white/60">Checking access…</p></Shell>;
  if (!isAdmin)
    return (
      <Shell>
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-vv-navy-soft p-8 text-center">
          <p className="mb-4">This account is not an admin.</p>
          <button onClick={() => supabase.auth.signOut()} className="rounded-full bg-vv-orange px-5 py-2 font-semibold text-vv-navy">
            Log out
          </button>
        </div>
      </Shell>
    );
  return <Shell><Dashboard session={session} /></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-md space-y-4 rounded-2xl border border-white/10 bg-vv-navy-soft p-8">
      <h1 className="text-2xl font-bold">Admin <span className="text-vv-orange">Login</span></h1>
      <Field label="Email">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Password">
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
      </Field>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-vv-orange py-3 font-semibold text-vv-navy disabled:opacity-60">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function Dashboard({ session }: { session: Session }) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rows, setRows] = useState<Row[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [levelId, setLevelId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pucYear, setPucYear] = useState("");
  const [examYear, setExamYear] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [newLink, setNewLink] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const loadRows = useCallback(async () => {
    const { data } = await supabase
      .from("materials")
      .select("id, title, slug, file_path, is_published, levels(slug), subjects(slug, name), categories(slug, name)")
      .order("created_at", { ascending: false })
      .limit(50);
    setRows((data as unknown as Row[]) ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const [l, s, c] = await Promise.all([
        supabase.from("levels").select("id, slug, name").order("sort_order"),
        supabase.from("subjects").select("id, level_id, slug, name").order("sort_order"),
        supabase.from("categories").select("id, slug, name").order("sort_order"),
      ]);
      setLevels(l.data ?? []);
      setSubjects(s.data ?? []);
      setCategories(c.data ?? []);
      await loadRows();
    })();
  }, [loadRows]);

  const level = levels.find((l) => l.id === Number(levelId));
  const isPuc = level?.slug === "puc";
  const levelSubjects = subjects.filter((s) => s.level_id === Number(levelId));

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNewLink("");
    const subject = subjects.find((s) => s.id === Number(subjectId));
    const category = categories.find((c) => c.id === Number(categoryId));
    if (!title.trim() || !level || !subject || !category || !file) {
      setError("Please fill title, level, subject, category and choose a file.");
      return;
    }
    if (isPuc && !pucYear) {
      setError("Please choose 1st PUC or 2nd PUC.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File is larger than 50 MB. Please compress it first.");
      return;
    }

    setBusy(true);
    try {
      // Make a clean, unique link name from the title
      const base = slugify(title) || `material-${Date.now().toString(36)}`;
      const { data: existing } = await supabase.from("materials").select("slug").like("slug", `${base}%`);
      const taken = new Set((existing ?? []).map((r) => r.slug));
      let slug = base;
      let n = 2;
      while (taken.has(slug)) slug = `${base}-${n++}`;

      const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
      const path = `${level.slug}/${subject.slug}/${category.slug}/${slug}.${ext}`;

      const up = await supabase.storage.from("materials").upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (up.error) throw up.error;

      const ins = await supabase.from("materials").insert({
        title: title.trim(),
        slug,
        description: description.trim() || null,
        level_id: level.id,
        subject_id: subject.id,
        category_id: category.id,
        puc_year: isPuc ? Number(pucYear) : null,
        exam_year: examYear ? Number(examYear) : null,
        file_path: path,
        file_size: file.size,
      });
      if (ins.error) {
        await supabase.storage.from("materials").remove([path]);
        throw ins.error;
      }

      await refreshSite(session.access_token);
      setNewLink(`${window.location.origin}/${level.slug}/${subject.slug}/${category.slug}/${slug}`);
      setTitle("");
      setDescription("");
      setExamYear("");
      setFile(null);
      setFileKey((k) => k + 1);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const urlFor = (r: Row) =>
    `${window.location.origin}/${r.levels.slug}/${r.subjects.slug}/${r.categories.slug}/${r.slug}`;

  async function copy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 1500);
  }

  async function togglePublish(r: Row) {
    await supabase.from("materials").update({ is_published: !r.is_published }).eq("id", r.id);
    await refreshSite(session.access_token);
    await loadRows();
  }

  async function remove(r: Row) {
    if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    await supabase.storage.from("materials").remove([r.file_path]);
    await supabase.from("materials").delete().eq("id", r.id);
    await refreshSite(session.access_token);
    await loadRows();
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">
          Admin <span className="text-vv-orange">Dashboard</span>
        </h1>
        <div className="flex gap-3 text-sm">
          <Link href="/" className="rounded-full border border-white/20 px-4 py-2 hover:border-vv-cyan">
            View site
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:border-vv-orange"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Upload form */}
        <form onSubmit={onUpload} className="space-y-4 rounded-2xl border border-white/10 bg-vv-navy-soft p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Upload material</h2>

          <Field label="Title *">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="SSLC Maths Model Paper 2025" />
          </Field>
          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
          </Field>
          <Field label="Level *">
            <select
              value={levelId}
              onChange={(e) => { setLevelId(e.target.value); setSubjectId(""); }}
              className={inputCls}
            >
              <option value="">Select level</option>
              {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </Field>
          <Field label="Subject *">
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className={inputCls} disabled={!levelId}>
              <option value="">Select subject</option>
              {levelSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Category *">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          {isPuc && (
            <Field label="PUC year *">
              <select value={pucYear} onChange={(e) => setPucYear(e.target.value)} className={inputCls}>
                <option value="">Select</option>
                <option value="1">1st PUC</option>
                <option value="2">2nd PUC</option>
              </select>
            </Field>
          )}
          <Field label="Exam year (for previous papers)">
            <input type="number" value={examYear} onChange={(e) => setExamYear(e.target.value)} className={inputCls} placeholder="2025" />
          </Field>
          <Field label="File * (PDF recommended, max 50 MB)">
            <input
              key={fileKey}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className={`${inputCls} file:mr-3 file:rounded-full file:border-0 file:bg-vv-blue file:px-4 file:py-1.5 file:text-white`}
            />
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-vv-orange py-3 font-semibold text-vv-navy disabled:opacity-60"
          >
            <Upload size={18} /> {busy ? "Uploading…" : "Upload"}
          </button>

          {newLink && (
            <div className="rounded-xl border border-vv-cyan/40 bg-vv-cyan/10 p-4 text-sm">
              <p className="mb-2 font-semibold text-vv-cyan">Uploaded! Share this link:</p>
              <p className="break-all text-white/80">{newLink}</p>
              <button
                type="button"
                onClick={() => copy(newLink, "new")}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-vv-cyan px-4 py-1.5 font-semibold text-vv-navy"
              >
                {copiedId === "new" ? <Check size={16} /> : <Copy size={16} />} {copiedId === "new" ? "Copied" : "Copy link"}
              </button>
            </div>
          )}
        </form>

        {/* Existing materials */}
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-semibold">Your uploads ({rows.length})</h2>
          <div className="space-y-3">
            {rows.length === 0 && <p className="text-white/60">Nothing uploaded yet.</p>}
            {rows.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-vv-navy-soft p-4">
                <div className="min-w-0">
                  <p className="font-medium">
                    {r.title}{" "}
                    {!r.is_published && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">Hidden</span>}
                  </p>
                  <p className="text-xs text-white/50">{r.subjects.name} · {r.categories.name}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copy(urlFor(r), r.id)} title="Copy link" className="rounded-lg border border-white/15 p-2 hover:border-vv-cyan">
                    {copiedId === r.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button onClick={() => togglePublish(r)} title={r.is_published ? "Hide" : "Show"} className="rounded-lg border border-white/15 p-2 hover:border-vv-orange">
                    {r.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => remove(r)} title="Delete" className="rounded-lg border border-white/15 p-2 hover:border-red-400 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <VideoAdmin session={session} />
    </>
  );
}