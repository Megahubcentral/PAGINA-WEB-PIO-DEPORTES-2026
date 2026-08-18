import { createHmac } from "node:crypto";
import { getSiteUrl } from "./site";

type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  idempotencyKey?: string;
};

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendMail(message: MailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return { delivered: false, reason: "not-configured" as const };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "PioDeportes/1.0",
      ...(message.idempotencyKey ? { "Idempotency-Key": message.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Resend delivery failed", response.status, details.slice(0, 500));
    return { delivered: false, reason: "provider-error" as const };
  }

  return { delivered: true };
}

export async function subscribeToBeehiiv(email: string, source: string) {
  const apiKey = process.env.BEEHIIV_API_KEY?.trim();
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID?.trim();
  if (!apiKey || !publicationId) return { stored: false, reason: "not-configured" as const };

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "PioDeportes/1.0",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: false,
        utm_source: source,
        utm_medium: "website",
        referring_site: getSiteUrl(),
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const details = await response.text();
    console.error("Beehiiv subscription failed", response.status, details.slice(0, 500));
    return { stored: false, reason: "provider-error" as const };
  }

  return { stored: true };
}

export async function runRedisCommand(command: Array<string | number>) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { configured: false, result: null };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Redis REST respondió ${response.status}`);
  const body = (await response.json()) as { result?: unknown; error?: string };
  if (body.error) throw new Error(body.error);
  return { configured: true, result: body.result ?? null };
}

export function anonymizeIp(ip: string) {
  const secret =
    process.env.NEWSLETTER_POPUP_SALT?.trim() ||
    getSiteUrl();
  return createHmac("sha256", secret).update(ip).digest("hex");
}
