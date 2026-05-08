import { auth } from "@/lib/auth"
import { getProfile } from "@/lib/supabase/profile"
import { redirect } from "next/navigation"
import { fetchRecentPosts } from "@/lib/blog"
import ProfileCard from "./components/ProfileCard"
import BlogFeed from "./components/BlogFeed"
import PlaceholderCard from "./components/PlaceholderCard"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  let profile = null
  if (session.user?.email) {
    try {
      profile = await getProfile(session.user.email)
    } catch (err) {
      console.error("[dashboard] getProfile 실패 — session 값으로 대체:", err)
    }
  }

  const name = profile?.name ?? session.user?.name ?? null
  const email = profile?.email ?? session.user?.email ?? null
  const avatarUrl = profile?.avatar_url ?? session.user?.image ?? null
  const provider = profile?.provider ?? "unknown"
  const createdAt = profile?.created_at ?? null

  const posts = await fetchRecentPosts(5)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <ProfileCard
              name={name}
              email={email}
              avatarUrl={avatarUrl}
              provider={provider}
              createdAt={createdAt}
            />
          </div>
          <div className="col-span-full">
            <BlogFeed posts={posts} />
          </div>
          <div className="col-span-full">
            <PlaceholderCard
              title="자료방"
              description="유료·회원 전용 자료가 들어갈 자리입니다."
              comingSoon
            />
          </div>
          <PlaceholderCard
            title="주문"
            description="진행 중인 주문과 견적이 표시됩니다."
            comingSoon
          />
          <PlaceholderCard
            title="메시지"
            description="구매·의뢰 관련 대화가 모입니다."
            comingSoon
          />
        </div>
      </div>
    </div>
  )
}
