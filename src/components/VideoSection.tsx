import { Play } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { getVideos } from "@/lib/data";
import { CHANNEL_URL } from "@/lib/videos";

export default async function VideoSection() {
  const videos = await getVideos();

  return (
    <section id="videos" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Watch & <span className="text-vv-orange">Learn</span>
        </h2>
        <p className="mt-3 text-white/60">Easy video lessons on our YouTube channel.</p>
      </div>

      {videos.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-vv-navy-soft p-8 text-center text-white/60">
          Video lessons are coming soon. Subscribe so you don&apos;t miss them!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard
              key={v.id}
              id={v.youtube_id}
              title={v.title}
              description={v.description}
            />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 font-semibold text-white transition hover:scale-105"
        >
          <Play size={20} fill="currentColor" /> Subscribe on YouTube
        </a>
      </div>
    </section>
  );
}