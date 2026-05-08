import { MOCK_RECENT_POSTS, type PostSummary } from "./blog-mock"

export type { PostSummary }

const REVALIDATE_SECONDS = 900

export async function fetchRecentPosts(limit = 5): Promise<PostSummary[]> {
  const url = process.env.BLOG_FEED_URL
  if (!url) {
    return MOCK_RECENT_POSTS.slice(0, limit)
  }
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
    if (!res.ok) {
      console.error(`[blog] fetchRecentPosts non-OK: ${res.status}`)
      return []
    }
    const raw = (await res.json()) as Partial<PostSummary>[]
    return raw.slice(0, limit).map((p) => ({
      title: p.title ?? "",
      date: p.date ?? "",
      categories: p.categories ?? [],
      permalink: p.permalink ?? "#",
      summary: p.summary ?? "",
    }))
  } catch (err) {
    console.error("[blog] fetchRecentPosts error:", err)
    return []
  }
}
