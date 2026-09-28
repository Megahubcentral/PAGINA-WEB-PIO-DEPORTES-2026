import { newsEntriesToUrlset, xmlResponse } from "../../../lib/sitemaps";
import { getSitemapIndexMeta, getSitemapNewsChunk } from "../../../lib/wordpress";

export const revalidate = 120;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chunk: string }> },
) {
  const { chunk } = await params;
  const index = Number(chunk);
  if (!Number.isInteger(index) || index < 1) {
    return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  const [{ newsChunks }, entries] = await Promise.all([
    getSitemapIndexMeta(),
    getSitemapNewsChunk(index),
  ]);
  if (index > newsChunks && !entries.length) {
    return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  return xmlResponse(newsEntriesToUrlset(entries, "/noticias"));
}
