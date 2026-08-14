"use client";

import { useState } from "react";

const formatOptions = [
  "Display y banners",
  "Video y Pio TV",
  "Patrocinio de radio",
  "Contenido de marca",
  "Coberturas y especiales",
  "Redes sociales",
];

type FormStatus = { state: "idle" | "sending" | "success" | "error"; message?: string };

export default function AdvertisingForm() {
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "sending" });
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: form.get("name"),
      company: form.get("company"),
      email: form.get("email"),
      phone: form.get("phone"),
      city: form.get("city"),
      campaignUrl: form.get("campaignUrl"),
      objective: form.get("objective"),
      formats: form.getAll("formats"),
      budget: form.get("budget"),
      startDate: form.get("startDate"),
      endDate: form.get("endDate"),
      audience: form.get("audience"),
      message: form.get("message"),
      website: form.get("website"),
      accepted: form.get("accepted") === "yes",
    };

    try {
      const response = await fetch("/api/advertising", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "No pudimos enviar la solicitud.");
      formElement.reset();
      setStatus({
        state: "success",
        message: "Recibimos tu propuesta. Nuestro equipo comercial te contactará con los próximos pasos.",
      });
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "No pudimos enviar la solicitud.",
      });
    }
  }

  return (
    <form className="commercial-form" onSubmit={submit} aria-describedby="commercial-form-note">
      <div className="commercial-form-heading">
        <span className="eyebrow">Solicitud comercial</span>
        <h2>Cuéntanos qué quieres lograr</h2>
        <p id="commercial-form-note">Los campos marcados con * son obligatorios. Respondemos normalmente dentro de dos días laborables.</p>
      </div>

      <div className="form-grid">
        <label>
          <span>Nombre y apellido *</span>
          <input name="name" autoComplete="name" maxLength={100} required />
        </label>
        <label>
          <span>Empresa o marca *</span>
          <input name="company" autoComplete="organization" maxLength={140} required />
        </label>
        <label>
          <span>Correo corporativo *</span>
          <input name="email" type="email" autoComplete="email" maxLength={180} required />
        </label>
        <label>
          <span>Teléfono</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={60} />
        </label>
        <label>
          <span>Ciudad y país</span>
          <input name="city" autoComplete="address-level2" maxLength={120} placeholder="Santo Domingo, República Dominicana" />
        </label>
        <label>
          <span>Sitio web o red social</span>
          <input name="campaignUrl" type="url" inputMode="url" maxLength={250} placeholder="https://" />
        </label>
        <label className="form-span-2">
          <span>Objetivo principal *</span>
          <select name="objective" required defaultValue="">
            <option value="" disabled>Selecciona una opción</option>
            <option>Reconocimiento de marca</option>
            <option>Lanzamiento de producto o servicio</option>
            <option>Tráfico, registros o ventas</option>
            <option>Patrocinio de contenido o transmisión</option>
            <option>Cobertura de evento</option>
            <option>Otro objetivo</option>
          </select>
        </label>
      </div>

      <fieldset className="format-selector">
        <legend>Formatos de interés</legend>
        <div>
          {formatOptions.map((option) => (
            <label key={option}><input type="checkbox" name="formats" value={option} /><span>{option}</span></label>
          ))}
        </div>
      </fieldset>

      <div className="form-grid">
        <label>
          <span>Inversión estimada</span>
          <select name="budget" defaultValue="Por definir">
            <option>Por definir</option>
            <option>Hasta RD$50,000</option>
            <option>RD$50,000 – RD$150,000</option>
            <option>RD$150,000 – RD$400,000</option>
            <option>Más de RD$400,000</option>
          </select>
        </label>
        <label>
          <span>Audiencia que deseas alcanzar</span>
          <input name="audience" maxLength={500} placeholder="Fanáticos de MLB en RD y EE. UU." />
        </label>
        <label>
          <span>Inicio estimado</span>
          <input name="startDate" type="date" />
        </label>
        <label>
          <span>Fin estimado</span>
          <input name="endDate" type="date" />
        </label>
        <label className="form-span-2">
          <span>Detalles de la campaña *</span>
          <textarea name="message" rows={7} maxLength={3000} required placeholder="Producto, alcance, entregables, mercados y cualquier dato que nos ayude a preparar una propuesta relevante." />
        </label>
      </div>

      <label className="form-honeypot" aria-hidden="true">
        <span>Sitio web personal</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent-check">
        <input type="checkbox" name="accepted" value="yes" required />
        <span>Acepto que Pío Deportes use estos datos para responder mi solicitud, de acuerdo con su <a href="/terminos#privacidad">política de privacidad</a>.</span>
      </label>

      <div className="commercial-submit-row">
        <button type="submit" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Enviando…" : "Solicitar propuesta"}
        </button>
        {status.message ? <p className={`form-response is-${status.state}`} role="status">{status.message}</p> : null}
      </div>
    </form>
  );
}
