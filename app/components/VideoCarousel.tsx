"use client";

/* eslint-disable @next/next/no-img-element -- WordPress controls the video poster CDN. */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { VideoItem } from "../../lib/wordpress";

export function VideoCarousel({ videos }: { videos: VideoItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeVideos = videos.length ? videos : [];

  useEffect(() => {
    if (paused || safeVideos.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % safeVideos.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, safeVideos.length]);

  if (!safeVideos.length) return null;
  const video = safeVideos[active];

  const move = (direction: number) => {
    setActive((current) => (current + direction + safeVideos.length) % safeVideos.length);
  };

  return (
    <div className="video-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="video-stage">
        <img src={video.thumbnail} alt="" />
        <div className="video-stage-shade" />
        <Link className="video-stage-link" href={`/videos/${video.slug}`}>
          <span className="round-play large">▶</span>
          <div>
            <small>{video.section} · {video.duration}</small>
            <h3>{video.title}</h3>
            <span className="watch-copy">Reproducir video</span>
          </div>
        </Link>
        <div className="carousel-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Video anterior">←</button>
          <span>{String(active + 1).padStart(2, "0")} / {String(safeVideos.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => move(1)} aria-label="Video siguiente">→</button>
        </div>
      </div>
      <div className="video-rail" role="tablist" aria-label="Videos de Pío Deportes">
        {safeVideos.map((item, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={active === index}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            key={`${item.id}-${index}`}
          >
            <span className="video-thumb"><img src={item.thumbnail} alt="" /><i>▶</i></span>
            <span className="video-rail-copy"><small>{item.section} · {item.duration}</small><strong>{item.title}</strong></span>
          </button>
        ))}
      </div>
    </div>
  );
}
