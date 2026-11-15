"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function VideoCard({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-vv-navy-soft">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0"
            aria-label={`Play ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-vv-orange text-vv-navy shadow-lg">
                <Play size={28} fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/60">{description}</p>
        )}
      </div>
    </div>
  );
}