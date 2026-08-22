"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type BreakingHeadline = {
  title: string;
  time: string;
  href: string;
};

const breakingTickerInterval = 7000;

const tuneInUrl = "https://tunein.com/radio/Pio-Deportes-1080-s182264/";
const tuneInStreamUrl = "https://radio.streamingcpanel.com:7006/;";
const waveBars = Array.from({ length: 22 }, (_, index) => index);

function toPlaybackStreamUrl(url: string) {
  // Shoutcast's trailing "/;" is a Winamp-era hack that Safari fails to fetch.
  return url.endsWith("/;") ? `${url.slice(0, -2)}/stream` : url;
}

function getAudioContextConstructor() {
  if (typeof window === "undefined") return undefined;
  return window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

function enableInlineAudio(audio: HTMLAudioElement) {
  audio.setAttribute("playsinline", "true");
  audio.setAttribute("webkit-playsinline", "true");
}

function usesWebKitMediaPlayback() {
  if (typeof navigator === "undefined") return false;
  const userAgent = navigator.userAgent;
  const iOS = /iP(ad|hone|od)/.test(userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const desktopSafari = /Safari/i.test(userAgent)
    && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|OPiOS|Android/i.test(userAgent);
  return iOS || desktopSafari;
}

const halfWaveBarCount = waveBars.length / 2;
const idleHalfWaveLevels = [0.92, 0.8, 0.68, 0.56, 0.46, 0.37, 0.29, 0.22, 0.17, 0.12, 0.09];
const idleWaveLevels = [...idleHalfWaveLevels].reverse().concat(idleHalfWaveLevels);

type RadioContextValue = {
  playing: boolean;
  loading: boolean;
  failed: boolean;
  visualizerReady: boolean;
  levels: number[];
  flyoverVisible: boolean;
  toggle: () => Promise<void>;
  dismissFlyover: () => void;
};

type BreakingTickerContextValue = {
  index: number;
  paused: boolean;
  setPaused: (paused: boolean) => void;
};

const RadioContext = createContext<RadioContextValue | null>(null);
const BreakingTickerContext = createContext<BreakingTickerContextValue | null>(null);

function useRadio() {
  const context = useContext(RadioContext);
  if (!context) throw new Error("Radio controls must be rendered inside RadioProvider");
  return context;
}

function useBreakingTicker() {
  const context = useContext(BreakingTickerContext);
  if (!context) throw new Error("BreakingTicker must be rendered inside BreakingTickerProvider");
  return context;
}

function RadioWave({ compact = false }: { compact?: boolean }) {
  const { levels, playing, visualizerReady } = useRadio();
  const mode = visualizerReady ? " is-realtime" : playing ? " is-fallback" : "";
  const displayedLevels = visualizerReady ? levels : idleWaveLevels;

  return (
    <div className={`radio-wave${compact ? " radio-wave-compact" : ""}${mode}`} aria-hidden="true">
      {waveBars.map((bar) => (
        <span
          className={`wave-${(bar % 6) + 1}`}
          key={bar}
          style={{ height: `${Math.max(8, displayedLevels[bar] * 100)}%` }}
        />
      ))}
    </div>
  );
}

function RadioFlyover() {
  const { playing, loading, flyoverVisible, toggle, dismissFlyover } = useRadio();
  if (!flyoverVisible) return null;

  return (
    <aside className="radio-flyover" aria-label="Pio Deportes Radio en vivo">
      <div className="shell radio-flyover-inner">
        <span className="radio-flyover-live"><i /> En vivo</span>
        <strong>Pio Deportes Radio</strong>
        <RadioWave compact />
        <span className="radio-flyover-status">{loading ? "Conectando con la señal…" : "Transmisión en curso"}</span>
        <div className="radio-flyover-actions">
          <button className="radio-flyover-toggle" type="button" onClick={toggle} aria-label={playing ? "Pausar Pio Deportes Radio" : "Reproducir Pio Deportes Radio"}>
            {loading ? "···" : playing ? "Ⅱ" : "▶"}
          </button>
          <button
            className="radio-flyover-close"
            type="button"
            onClick={dismissFlyover}
            aria-label="Cerrar la barra de radio; la transmisión continuará"
            title="Cerrar barra"
          >
            ×
          </button>
        </div>
      </div>
    </aside>
  );
}

export function RadioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visualizerReady, setVisualizerReady] = useState(false);
  const [levels, setLevels] = useState(idleWaveLevels);
  const [flyoverDismissed, setFlyoverDismissed] = useState(false);
  const [webkitPlayback, setWebkitPlayback] = useState(false);
  const streamUrl = toPlaybackStreamUrl(process.env.NEXT_PUBLIC_RADIO_STREAM_URL || tuneInStreamUrl);
  const flyoverVisible = (playing || loading) && !flyoverDismissed;

  const prepareAnalyzer = async () => {
    const audio = audioRef.current;
    const AudioContextConstructor = getAudioContextConstructor();
    if (!audio || !AudioContextConstructor || usesWebKitMediaPlayback()) return;

    audio.crossOrigin = "anonymous";
    if (!audioContextRef.current) audioContextRef.current = new AudioContextConstructor();
    const audioContext = audioContextRef.current;

    if (!sourceRef.current) {
      const source = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.72;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      sourceRef.current = source;
      analyserRef.current = analyser;
      setVisualizerReady(true);
    }

    if (audioContext.state === "suspended") await audioContext.resume();
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }

    setFlyoverDismissed(false);
    setLoading(true);
    setFailed(false);
    try {
      const webkit = usesWebKitMediaPlayback();
      enableInlineAudio(audio);

      if (webkit) {
        audio.removeAttribute("crossorigin");
      } else {
        audio.crossOrigin = "anonymous";
      }

      if (audio.getAttribute("src") !== streamUrl) audio.src = streamUrl;
      audio.load();

      // Start play() in the same user gesture. Safari rejects it if Web Audio
      // setup runs first; iOS also expires the gesture if we await too long.
      const analyzerPromise = webkit
        ? Promise.resolve()
        : prepareAnalyzer().catch(() => { setVisualizerReady(false); });

      await audio.play();
      await analyzerPromise;
    } catch {
      setFailed(true);
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const webkit = usesWebKitMediaPlayback();
    setWebkitPlayback(webkit);
    if (!audio) return;
    enableInlineAudio(audio);
    if (webkit) audio.removeAttribute("crossorigin");
  }, []);

  useEffect(() => {
    if (!playing || !visualizerReady || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const timeout = window.setTimeout(() => {
      const probe = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(probe);
      if (!probe.some((value) => value > 0)) setVisualizerReady(false);
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [playing, visualizerReady]);

  useEffect(() => {
    if (!playing || !analyserRef.current) {
      setLevels(idleWaveLevels);
      return;
    }

    const analyser = analyserRef.current;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    let animationFrame = 0;
    let lastUpdate = 0;

    const updateWave = (timestamp: number) => {
      if (timestamp - lastUpdate >= 45) {
        analyser.getByteFrequencyData(frequencyData);
        const usableBins = Math.max(halfWaveBarCount, Math.floor(frequencyData.length * 0.78));
        const halfLevels = Array.from({ length: halfWaveBarCount }, (_, index) => {
          const start = Math.floor((index * usableBins) / halfWaveBarCount);
          const end = Math.max(start + 1, Math.floor(((index + 1) * usableBins) / halfWaveBarCount));
          let total = 0;
          for (let bin = start; bin < end; bin += 1) total += frequencyData[bin] ?? 0;
          const energy = total / Math.max(1, end - start);
          return Math.min(1, Math.max(0.08, Math.pow(energy / 205, 0.78)));
        });
        const nextLevels = [...halfLevels].reverse().concat(halfLevels);
        setLevels(nextLevels);
        lastUpdate = timestamp;
      }
      animationFrame = window.requestAnimationFrame(updateWave);
    };

    animationFrame = window.requestAnimationFrame(updateWave);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [playing]);

  useEffect(() => () => {
    if (audioContextRef.current) void audioContextRef.current.close();
  }, []);

  const value = {
    playing,
    loading,
    failed,
    visualizerReady,
    levels,
    flyoverVisible,
    toggle,
    dismissFlyover: () => setFlyoverDismissed(true),
  };

  return (
    <RadioContext.Provider value={value}>
      <div className={`radio-page-frame${flyoverVisible ? " has-radio-flyover" : ""}`}>{children}</div>
      <RadioFlyover />
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="none"
        playsInline
        crossOrigin={webkitPlayback ? undefined : "anonymous"}
        onPlaying={() => { setPlaying(true); setFailed(false); setFlyoverDismissed(false); }}
        onPause={() => setPlaying(false)}
        onError={() => { setPlaying(false); setFailed(true); setLoading(false); }}
      >
        <track kind="captions" src="/radio-captions.vtt" srcLang="es" label="Español" default />
      </audio>
    </RadioContext.Provider>
  );
}

export function BreakingTickerProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(
      () => setIndex((current) => current + 1),
      breakingTickerInterval,
    );
    return () => window.clearInterval(interval);
  }, [paused]);

  return (
    <BreakingTickerContext.Provider value={{ index, paused, setPaused }}>
      {children}
    </BreakingTickerContext.Provider>
  );
}

export function BreakingTicker({ headlines }: { headlines: BreakingHeadline[] }) {
  const { index, paused, setPaused } = useBreakingTicker();
  const visibleHeadlines = headlines.slice(0, 20);

  useEffect(() => () => setPaused(false), [setPaused]);

  const headline = visibleHeadlines[index % Math.max(visibleHeadlines.length, 1)];
  if (!headline) return null;

  return (
    <div
      className={`breaking-story-window${paused ? " is-paused" : ""}`}
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Link className="breaking-story" href={headline.href} key={headline.title}>
        <span className="breaking-copy">{headline.title}</span>
        <time className="breaking-time">{headline.time}</time>
      </Link>
    </div>
  );
}

export function LiveInfo() {
  const [temperature, setTemperature] = useState<string>("29°");
  const [time, setTime] = useState<string>("—");

  useEffect(() => {
    const updateTime = () =>
      setTime(
        new Intl.DateTimeFormat("es-DO", {
          timeZone: "America/Santo_Domingo",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    updateTime();
    const interval = window.setInterval(updateTime, 30000);

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current=temperature_2m&timezone=America%2FSanto_Domingo",
    )
      .then((response) => response.json())
      .then((data) => {
        if (typeof data?.current?.temperature_2m === "number") {
          setTemperature(`${Math.round(data.current.temperature_2m)}°`);
        }
      })
      .catch(() => undefined);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="live-info" aria-label="Clima y hora de Santo Domingo">
      <span className="weather-icon" aria-hidden="true">●</span>
      <span>Santo Domingo</span>
      <strong>{temperature}</strong>
      <span className="utility-divider" />
      <span>{time} AST</span>
    </div>
  );
}

export function CurrentDate() {
  const date = new Intl.DateTimeFormat("es-DO", {
    timeZone: "America/Santo_Domingo",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return <span className="utility-date" suppressHydrationWarning>{date}</span>;
}

export function AudioPlayer() {
  const { playing, loading, failed, toggle } = useRadio();

  return (
    <div className={`radio-player${playing ? " is-playing" : ""}`}>
      <div className="radio-live-label"><i /><span>1080 AM · En vivo</span></div>

      <RadioWave />

      <div className="radio-copy">
        <span className="radio-brand">Pio Deportes <b>Radio</b></span>
        <strong>{playing ? "Estás escuchando en vivo" : failed ? "La señal no respondió" : "Escucha nuestra programación"}</strong>
        <small>{failed ? "Puedes intentarlo nuevamente o escucharnos directamente en TuneIn." : "Noticias, análisis, entrevistas y conversación deportiva en directo."}</small>
      </div>

      <div className="radio-controls">
        <button
          type="button"
          className="play-button"
          onClick={toggle}
          disabled={loading}
          aria-label={playing ? "Pausar Pio Deportes Radio" : "Escuchar Pio Deportes Radio"}
        >
          {loading ? "···" : playing ? "Ⅱ" : "▶"}
        </button>
        <div><strong>{playing ? "Pausar señal" : loading ? "Conectando…" : "Escuchar ahora"}</strong><small>Señal digital en vivo</small></div>
      </div>

      <a className="radio-tunein-link" href={tuneInUrl} target="_blank" rel="noreferrer">También en TuneIn <span>↗</span></a>
    </div>
  );
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <div>
      <form
        className="newsletter-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setState("sending");
          setMessage("");
          try {
            const response = await fetch("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, source: "footer" }),
            });
            const result = (await response.json()) as { message?: string };
            if (!response.ok) throw new Error(result.message || "No pudimos completar la suscripción.");
            setState("sent");
            setMessage("Suscripción confirmada.");
            setEmail("");
          } catch (error) {
            setState("error");
            setMessage(error instanceof Error ? error.message : "No pudimos completar la suscripción.");
          }
        }}
      >
        <label className="sr-only" htmlFor="newsletter-email">Correo electrónico</label>
        <input id="newsletter-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="tu@email.com" required />
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Enviando…" : state === "sent" ? "¡Listo!" : "Suscribirme"}</button>
      </form>
      {message ? <small className={`newsletter-form-status is-${state}`} role="status">{message}</small> : null}
    </div>
  );
}

export type DirectAdAsset = {
  src: string;
  width: number;
  height: number;
};

export type DirectAdCreative = {
  href: string;
  alt: string;
  desktop: DirectAdAsset;
  mobile?: DirectAdAsset;
  wide?: DirectAdAsset;
};

export function AdSlot({
  size = "970 × 90",
  slot,
  creative,
}: {
  size?: string;
  slot?: string;
  creative?: DirectAdCreative;
}) {
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const configuredSlot =
    slot ??
    (size.includes("300")
      ? process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_RECTANGLE_SLOT
      : process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_TOP_SLOT);

  useEffect(() => {
    if (creative || !client || !configuredSlot) return;
    try {
      const ads = window as typeof window & { adsbygoogle?: unknown[] };
      (ads.adsbygoogle = ads.adsbygoogle || []).push({});
    } catch {
      // Ad blockers should never affect the rest of the portal.
    }
  }, [client, configuredSlot, creative]);

  if (creative) {
    return (
      <a
        className="ad-slot ad-slot-direct"
        href={creative.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={`Publicidad: ${creative.alt}`}
      >
        <picture>
          {creative.mobile ? (
            <source
              media="(max-width: 760px)"
              srcSet={creative.mobile.src}
              width={creative.mobile.width}
              height={creative.mobile.height}
            />
          ) : null}
          {creative.wide ? (
            <source
              media="(min-width: 1100px)"
              srcSet={creative.wide.src}
              width={creative.wide.width}
              height={creative.wide.height}
            />
          ) : null}
          {/* Animated GIF creatives must not go through the image optimizer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={creative.desktop.src}
            alt={creative.alt}
            width={creative.desktop.width}
            height={creative.desktop.height}
          />
        </picture>
      </a>
    );
  }

  if (client && configuredSlot) {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={configuredSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }

  return (
    <div className="ad-slot" aria-label={`Espacio publicitario ${size}`}>
      <span>Publicidad</span>
      <small>{size} · Google Ads o anuncio directo</small>
    </div>
  );
}
