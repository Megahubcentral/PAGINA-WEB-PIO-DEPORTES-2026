export type InstagramPost = {
  id: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaProductType?: string;
  imageUrl: string;
  permalink: string;
  timestamp: string;
};

export type InstagramFeed = {
  posts: InstagramPost[];
  profileUrl: string;
  username: string;
  configured: boolean;
  updatedAt: string;
};

type InstagramGraphMedia = {
  id?: string;
  caption?: string;
  media_type?: InstagramPost["mediaType"];
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

type InstagramGraphResponse = {
  data?: InstagramGraphMedia[];
};

const profileUrl = "https://www.instagram.com/piodeportes/";
const username = "piodeportes";
const refreshSeconds = 600;

export async function getInstagramFeed(): Promise<InstagramFeed> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID || "me";
  const apiVersion = (process.env.INSTAGRAM_API_VERSION || "v25.0").replace(/^\//, "");
  const emptyFeed = {
    posts: [],
    profileUrl,
    username,
    configured: Boolean(accessToken),
    updatedAt: new Date().toISOString(),
  } satisfies InstagramFeed;

  if (!accessToken) return emptyFeed;

  try {
    const endpoint = new URL(`https://graph.instagram.com/${apiVersion}/${encodeURIComponent(userId)}/media`);
    endpoint.searchParams.set(
      "fields",
      "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp",
    );
    endpoint.searchParams.set("limit", "10");

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: refreshSeconds },
    });
    if (!response.ok) throw new Error(`Instagram respondió ${response.status}`);

    const payload = await response.json() as InstagramGraphResponse;
    const posts = (payload.data ?? [])
      .map((media): InstagramPost | undefined => {
        const imageUrl = media.media_type === "VIDEO"
          ? media.thumbnail_url ?? media.media_url
          : media.media_url ?? media.thumbnail_url;
        if (!media.id || !imageUrl || !media.permalink || !media.timestamp || !media.media_type) return undefined;
        return {
          id: media.id,
          caption: media.caption?.trim() ?? "",
          mediaType: media.media_type,
          mediaProductType: media.media_product_type,
          imageUrl,
          permalink: media.permalink,
          timestamp: media.timestamp,
        };
      })
      .filter((post): post is InstagramPost => Boolean(post))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      posts,
      profileUrl,
      username,
      configured: true,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return emptyFeed;
  }
}
