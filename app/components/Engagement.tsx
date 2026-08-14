"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type OneSignalClient = {
  init: (options: { appId: string; notifyButton: { enable: boolean } }) => Promise<void>;
  Notifications: {
    permission: boolean;
    isPushSupported: () => boolean;
    requestPermission: () => Promise<void>;
  };
  User: {
    PushSubscription: {
      optedIn: boolean;
      optIn: () => Promise<void>;
    };
  };
};

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignalClient) => void | Promise<void>>;
  }
}

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/newsletter-popup", { cache: "no-store" });
        const result = (await response.json()) as { show?: boolean };
        if (result.show) setOpen(true);
      } catch {
        // A persistence failure should never interrupt reading the portal.
      }
    }, 6500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "popup" }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "No pudimos completar la suscripción.");
      setState("success");
      setMessage("¡Listo! Ya eres parte del resumen de Pío Deportes.");
      window.setTimeout(() => setOpen(false), 1800);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No pudimos completar la suscripción.");
    }
  }

  return (
    <div className="newsletter-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) setOpen(false);
    }}>
      <section className="newsletter-modal" role="dialog" aria-modal="true" aria-labelledby="newsletter-modal-title">
        <button ref={closeButton} className="newsletter-modal-close" type="button" onClick={() => setOpen(false)} aria-label="Cerrar invitación">×</button>
        <div className="newsletter-modal-image">
          <Image src="/og.png" alt="Pío Deportes, el deporte vive aquí" fill sizes="(max-width: 720px) 100vw, 50vw" priority />
        </div>
        <div className="newsletter-modal-copy">
          <span className="eyebrow">El resumen que sí importa</span>
          <h2 id="newsletter-modal-title">La jornada, directo a tu correo</h2>
          <p>Noticias clave, resultados, análisis y las historias dominicanas que están marcando el juego.</p>
          {state === "success" ? (
            <div className="newsletter-success" role="status">{message}</div>
          ) : (
            <form onSubmit={subscribe}>
              <label className="sr-only" htmlFor="popup-newsletter-email">Correo electrónico</label>
              <input id="popup-newsletter-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="tu@email.com" required />
              <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Enviando…" : "Quiero recibirlo"}</button>
            </form>
          )}
          {state === "error" ? <p className="newsletter-modal-error" role="alert">{message}</p> : null}
          <small>Al suscribirte aceptas recibir el boletín. Puedes salir cuando quieras. <Link href="/terminos#privacidad">Privacidad</Link>.</small>
        </div>
      </section>
    </div>
  );
}

export function PushNotificationButton() {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const [status, setStatus] = useState<"idle" | "loading" | "enabled" | "unsupported" | "error">("idle");

  if (!appId) return null;
  const oneSignalAppId = appId;

  async function enable() {
    setStatus("loading");

    try {
      await new Promise<void>((resolve, reject) => {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async (oneSignal) => {
          try {
            await oneSignal.init({ appId: oneSignalAppId, notifyButton: { enable: false } });
            if (!oneSignal.Notifications.isPushSupported()) {
              setStatus("unsupported");
              resolve();
              return;
            }
            if (!oneSignal.Notifications.permission) await oneSignal.Notifications.requestPermission();
            if (oneSignal.Notifications.permission && !oneSignal.User.PushSubscription.optedIn) {
              await oneSignal.User.PushSubscription.optIn();
            }
            setStatus(oneSignal.Notifications.permission ? "enabled" : "idle");
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        if (!document.getElementById("onesignal-web-sdk")) {
          const script = document.createElement("script");
          script.id = "onesignal-web-sdk";
          script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
          script.defer = true;
          script.onerror = () => reject(new Error("No se pudo cargar el servicio de alertas"));
          document.head.appendChild(script);
        }
      });
    } catch {
      setStatus("error");
    }
  }

  const label =
    status === "enabled" ? "Alertas activadas" :
    status === "loading" ? "Activando…" :
    status === "unsupported" ? "No disponible en este navegador" :
    status === "error" ? "Intentar activar nuevamente" :
    "Activar alertas deportivas";

  return (
    <div className="push-preference">
      <button type="button" onClick={enable} disabled={status === "loading" || status === "enabled" || status === "unsupported"}>
        <span aria-hidden="true">●</span>{label}
      </button>
      <small>Notificaciones de noticias importantes en macOS y Windows.</small>
    </div>
  );
}
