import { createHash } from "node:crypto";
import { runRedisCommand } from "./server-services";

export type WordpressSnapshot<T = unknown> = {
  data: T;
  total: number;
  totalPages: number;
  storedAt: string;
};

export const WP_LAST_GOOD_TTL_SECONDS = 60 * 60 * 24 * 3;
const memory = new Map<string, WordpressSnapshot>();

function redisKey(path: string) {
  return `wp:last-good:v1:${createHash("sha256").update(path).digest("hex")}`;
}

function snapshotAgeMs(snapshot: WordpressSnapshot) {
  const storedAt = Date.parse(snapshot.storedAt);
  return Number.isFinite(storedAt) ? Date.now() - storedAt : Number.POSITIVE_INFINITY;
}

export function snapshotHasContent(snapshot: Pick<WordpressSnapshot, "data"> | null | undefined) {
  if (!snapshot) return false;
  if (Array.isArray(snapshot.data)) return snapshot.data.length > 0;
  return snapshot.data != null;
}

export function isUsableWordpressSnapshot<T>(
  snapshot: WordpressSnapshot<T> | null | undefined,
): snapshot is WordpressSnapshot<T> {
  return Boolean(
    snapshot
    && snapshotHasContent(snapshot)
    && snapshotAgeMs(snapshot) >= 0
    && snapshotAgeMs(snapshot) < WP_LAST_GOOD_TTL_SECONDS * 1000,
  );
}

export async function readWordpressSnapshot<T = unknown>(path: string) {
  const local = memory.get(path);
  if (isUsableWordpressSnapshot(local)) return local as WordpressSnapshot<T>;

  try {
    const redis = await runRedisCommand(["GET", redisKey(path)]);
    if (!redis.configured || typeof redis.result !== "string") return null;
    const parsed = JSON.parse(redis.result) as WordpressSnapshot<T>;
    if (!isUsableWordpressSnapshot(parsed)) return null;
    memory.set(path, parsed);
    return parsed;
  } catch {
    return null;
  }
}

export async function writeWordpressSnapshot<T>(
  path: string,
  snapshot: Pick<WordpressSnapshot<T>, "data" | "total" | "totalPages">,
) {
  if (!snapshotHasContent(snapshot)) return;
  const stored: WordpressSnapshot<T> = {
    ...snapshot,
    storedAt: new Date().toISOString(),
  };
  memory.set(path, stored);
  try {
    await runRedisCommand([
      "SETEX",
      redisKey(path),
      WP_LAST_GOOD_TTL_SECONDS,
      JSON.stringify(stored),
    ]);
  } catch {
    // This instance still keeps the last good payload in memory.
  }
}
