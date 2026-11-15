import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="py-20 text-center">
        <p className="text-6xl font-extrabold text-vv-orange">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-white/60">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-vv-orange px-6 py-3 font-semibold text-vv-navy"
        >
          Back to home
        </Link>
      </div>
    </PageShell>
  );
}