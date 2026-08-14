import { NextRequest, NextResponse } from "next/server";
import { anonymizeIp, runRedisCommand } from "../../../lib/server-services";

export const runtime = "nodejs";

const cookieName = "pio_newsletter_seen";
const memoryStore = globalThis as typeof globalThis & { pioNewsletterSeen?: Set<string> };
memoryStore.pioNewsletterSeen = memoryStore.pioNewsletterSeen ?? new Set<string>();

function requestIp(request: NextRequest) {
  const direct =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "local";
  return direct.split(",")[0]?.trim() || "local";
}

export async function GET(request: NextRequest) {
  if (request.cookies.get(cookieName)?.value === "1") {
    return NextResponse.json({ show: false }, { headers: { "Cache-Control": "no-store" } });
  }

  let show = true;
  try {
    const ipKey = anonymizeIp(requestIp(request));
    const redis = await runRedisCommand(["SET", `pio:newsletter-popup:${ipKey}`, "1", "NX"]);
    if (redis.configured) {
      show = redis.result === "OK";
    } else if (memoryStore.pioNewsletterSeen?.has(ipKey)) {
      show = false;
    } else {
      memoryStore.pioNewsletterSeen?.add(ipKey);
    }
  } catch (error) {
    console.error("Newsletter popup persistence failed", error);
  }

  const response = NextResponse.json({ show }, { headers: { "Cache-Control": "no-store" } });
  if (show) {
    response.cookies.set(cookieName, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365 * 5,
      path: "/",
    });
  }
  return response;
}
