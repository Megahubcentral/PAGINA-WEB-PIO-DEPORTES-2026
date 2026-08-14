"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const breakingHeadlines = [
  { title: "República Dominicana define su ruta para la próxima gran cita internacional", time: "18:42", href: "/noticias/reinas-del-caribe-oro-y-premios" },
  { title: "El talento dominicano vuelve a marcar la jornada en las Grandes Ligas", time: "18:35", href: "/noticias/castillo-poncha-diez-white-sox" },
  { title: "La agenda de hoy reúne béisbol, baloncesto, fútbol y voleibol", time: "18:21", href: "/marcadores" },
  { title: "Pio TV estrena nuevos videos, entrevistas y análisis de la jornada", time: "18:08", href: "/videos" },
];

const tuneInUrl = "https://tunein.com/radio/Pio-Deportes-1080-s182264/";
const tuneInStreamUrl = "https://radio.streamingcpanel.com:7006/;";
const waveBars = Array.from({ length: 22 }, (_, index) => index);
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

const RadioContext = createContext<RadioContextValue | null>(null);

function useRadio() {
  const context = useContext(RadioContext);
  if (!context) throw new Error("Radio controls must be rendered inside RadioProvider");
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
  const streamUrl = process.env.NEXT_PUBLIC_RADIO_STREAM_URL || tuneInStreamUrl;
  const flyoverVisible = (playing || loading) && !flyoverDismissed;

  const prepareAnalyzer = async () => {
    const audio = audioRef.current;
    if (!audio || typeof window === "undefined") return;

    const AudioContextConstructor = window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;

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
      await prepareAnalyzer();
      await audio.play();
    } catch {
      setFailed(true);
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  };

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
        crossOrigin="anonymous"
        onPlaying={() => { setPlaying(true); setFailed(false); setFlyoverDismissed(false); }}
        onPause={() => setPlaying(false)}
        onError={() => { setPlaying(false); setFailed(true); setLoading(false); }}
      >
        <track kind="captions" src="/radio-captions.vtt" srcLang="es" label="Español" default />
      </audio>
    </RadioContext.Provider>
  );
}

export function BreakingTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(
      () => setIndex((current) => (current + 1) % breakingHeadlines.length),
      10000,
    );
    return () => window.clearInterval(interval);
  }, []);

  const headline = breakingHeadlines[index];

  return (
    <div className="breaking-story-window" aria-live="polite" aria-atomic="true">
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

export function AdSlot({ size = "970 × 90", slot }: { size?: string; slot?: string }) {
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const configuredSlot =
    slot ??
    (size.includes("300")
      ? process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_RECTANGLE_SLOT
      : process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_TOP_SLOT);

  useEffect(() => {
    if (!client || !configuredSlot) return;
    try {
      const ads = window as typeof window & { adsbygoogle?: unknown[] };
      (ads.adsbygoogle = ads.adsbygoogle || []).push({});
    } catch {
      // Ad blockers should never affect the rest of the portal.
    }
  }, [client, configuredSlot]);

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
