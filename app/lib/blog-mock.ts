export type PostSummary = {
  title: string
  date: string
  categories: string[]
  permalink: string
  summary: string
}

export const MOCK_RECENT_POSTS: PostSummary[] = [
  {
    title: "Hugo + Next.js 모노레포로 개인 사이트 셋업하기",
    date: "2026-05-01",
    categories: ["tech"],
    permalink: "https://example.com/posts/tech/hugo-nextjs-monorepo/",
    summary: "정적 블로그와 동적 앱을 한 저장소에서 관리하는 패턴 정리.",
  },
  {
    title: "NextAuth v5로 Google + Naver 로그인 붙이기",
    date: "2026-05-05",
    categories: ["tech", "tutorial"],
    permalink: "https://example.com/posts/tech/nextauth-v5-naver/",
    summary: "Naver는 v5 빌트인이라 한 줄이면 끝납니다.",
  },
  {
    title: "Next.js 16의 proxy.ts — middleware는 어디로 갔나",
    date: "2026-05-07",
    categories: ["essay"],
    permalink: "https://example.com/posts/essay/nextjs-16-proxy/",
    summary: "갑자기 바뀐 컨벤션 추적기.",
  },
]
