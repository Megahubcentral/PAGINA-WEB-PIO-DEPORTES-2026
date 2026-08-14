import { NextResponse } from "next/server";
import { escapeHtml, sendMail } from "../../../lib/server-services";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const company = clean(body.company, 140);
  const email = clean(body.email, 180).toLowerCase();
  const phone = clean(body.phone, 60);
  const city = clean(body.city, 120);
  const campaignUrl = clean(body.campaignUrl, 250);
  const objective = clean(body.objective, 180);
  const budget = clean(body.budget, 100);
  const startDate = clean(body.startDate, 20);
  const endDate = clean(body.endDate, 20);
  const audience = clean(body.audience, 500);
  const message = clean(body.message, 3000);
  const formats = Array.isArray(body.formats)
    ? body.formats.map((item) => clean(item, 80)).filter(Boolean).slice(0, 8)
    : [];
  const accepted = body.accepted === true;

  if (!name || !company || !emailPattern.test(email) || !objective || !message || !accepted) {
    return NextResponse.json(
      { message: "Completa los campos obligatorios y acepta el aviso de privacidad." },
      { status: 422 },
    );
  }

  const rows = [
    ["Nombre", name],
    ["Empresa o marca", company],
    ["Correo", email],
    ["Teléfono", phone || "No indicado"],
    ["Ciudad / país", city || "No indicado"],
    ["Sitio o red social", campaignUrl || "No indicado"],
    ["Objetivo", objective],
    ["Formatos", formats.join(", ") || "Por definir"],
    ["Presupuesto", budget || "Por definir"],
    ["Fechas", `${startDate || "Por definir"} — ${endDate || "Por definir"}`],
    ["Audiencia", audience || "Por definir"],
    ["Mensaje", message],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:10px;border-bottom:1px solid #ddd;vertical-align:top">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const destination = process.env.ADVERTISING_INBOX;
  if (!destination) {
    return NextResponse.json(
      { message: "No pudimos enviar la solicitud en este momento. Intenta nuevamente más tarde." },
      { status: 503 },
    );
  }
  const delivery = await sendMail({
    to: destination,
    replyTo: email,
    subject: `Nueva solicitud comercial — ${company}`,
    text,
    html: `<h1 style="font-family:Arial,sans-serif">Nueva solicitud de Anúnciate</h1><table style="border-collapse:collapse;font-family:Arial,sans-serif;width:100%;max-width:760px">${htmlRows}</table>`,
    idempotencyKey: `advertising-${Date.now()}-${email.slice(0, 50)}`,
  });

  if (!delivery.delivered) {
    return NextResponse.json(
      { message: "No pudimos enviar la solicitud en este momento. Intenta nuevamente más tarde." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
