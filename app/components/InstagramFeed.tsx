"use client";

/* eslint-disable @next/next/no-img-element -- Instagram returns short-lived CDN media URLs that are refreshed by the server feed. */
import { useEffect, useState } from "react";
import type { InstagramFeed as InstagramFeedData, InstagramPost } from "../../lib/instagram-provider";

const clientRefreshInterval = 600_000;

function postLabel(post: InstagramPost) {
  if (post.mediaProductType === "REELS") return "Reel";
  if (post.mediaType === "VIDEO") return "Video";
  if (post.mediaType === "CAROUSEL_ALBUM") return "Galería";
  return "Publicación";
}

function postDate(timestamp: string) {
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "short",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(timestamp));
}

export function InstagramFeed({ feed }: { feed: InstagramFeedData }) {
  const [currentFeed, setCurrentFeed] = useState(feed);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      fetch("/api/instagram")
        .then((response) => response.ok ? response.json() as Promise<InstagramFeedData> : undefined)
        .then((latest) => {
          if (active && latest?.posts.length) setCurrentFeed(latest);
        })
        .catch(() => undefined);
    };

    const interval = window.setInterval(refresh, clientRefreshInterval);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="instagram-section" aria-labelledby="instagram-title">
      <div className="shell">
        <div className="instagram-heading">
          <div className="instagram-heading-copy">
            <span className="instagram-mark" aria-hidden="true">IG</span>
            <div><small>Desde la redacción y la cancha</small><h2 id="instagram-title">Pio en Instagram</h2></div>
          </div>
          <a href={currentFeed.profileUrl} target="_blank" rel="noreferrer">
            @{currentFeed.username} <span>↗</span>
          </a>
        </div>

        {currentFeed.posts.length ? (
          <div className="instagram-grid">
            {currentFeed.posts.slice(0, 10).map((post) => (
              <a
                className="instagram-card"
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                key={post.id}
                aria-label={`${postLabel(post)} de Pio Deportes en Instagram`}
              >
                <img src={post.imageUrl} alt="" loading="lazy" />
                <span className="instagram-media-type">{post.mediaType === "VIDEO" || post.mediaProductType === "REELS" ? "▶" : post.mediaType === "CAROUSEL_ALBUM" ? "▣" : "↗"}</span>
                <span className="instagram-card-shade" />
                <span className="instagram-card-copy">
                  <small>{postLabel(post)} · {postDate(post.timestamp)}</small>
                  <strong>{post.caption || "Toda la actualidad deportiva en @piodeportes"}</strong>
                </span>
              </a>
            ))}
          </div>
        ) : (
          <a className="instagram-fallback" href={currentFeed.profileUrl} target="_blank" rel="noreferrer">
            <span className="instagram-fallback-handle">@{currentFeed.username}</span>
            <strong>La conversación deportiva continúa en Instagram.</strong>
            <p>Noticias, entrevistas, resultados y el contenido detrás de cada jornada.</p>
            <b>Ver perfil <i>↗</i></b>
          </a>
        )}
      </div>
    </section>
  );
}
