import { NextResponse } from "next/server";
import { escapeHtml, runRedisCommand, sendMail } from "../../../lib/server-services";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown; source?: unknown; website?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 180) : "";
  const source = typeof body.source === "string" ? body.source.trim().slice(0, 60) : "portal";
  if (!emailPattern.test(email)) {
    return NextResponse.json({ message: "Escribe un correo electrónico válido." }, { status: 422 });
  }

  let stored = false;
  try {
    const redis = await runRedisCommand(["SADD", "pio:newsletter:subscribers", email]);
    stored = redis.configured;
  } catch (error) {
    console.error("Newsletter Redis write failed", error);
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, consentedAt: new Date().toISOString() }),
        cache: "no-store",
      });
      stored = stored || response.ok;
    } catch (error) {
      console.error("Newsletter webhook failed", error);
    }
  }

  const notification = await sendMail({
    to: process.env.NEWSLETTER_INBOX ?? "info@piodeportes.com",
    replyTo: email,
    subject: "Nueva suscripción al resumen de Pío Deportes",
    text: `Correo: ${email}\nOrigen: ${source}`,
    html: `<p><strong>Correo:</strong> ${escapeHtml(email)}</p><p><strong>Origen:</strong> ${escapeHtml(source)}</p>`,
    idempotencyKey: `newsletter-${Date.now()}-${email.slice(0, 50)}`,
  });

  if (!stored && !notification.delivered) {
    return NextResponse.json(
      { message: "No pudimos registrar tu suscripción en este momento. Intenta nuevamente más tarde." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
