import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { upsertProfile, getProfile } from "@/lib/supabase/profile"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user, account }) {
      if (user.email) {
        try {
          await upsertProfile({
            email: user.email,
            name: user.name,
            avatar_url: user.image,
            provider: account?.provider ?? "google",
          })
        } catch (err) {
          console.error("[auth] signIn upsertProfile 실패 — 로그인은 계속 진행:", err)
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        // 첫 로그인 시 profileId 조회
        if (user.email) {
          try {
            const profile = await getProfile(user.email)
            token.profileId = profile?.id ?? null
          } catch (err) {
            console.error("[auth] jwt getProfile 실패:", err)
            token.profileId = null
          }
        }
      }
      // 이후 호출에서는 token.profileId를 그대로 유지
      return token
    },
    session({ session, token }) {
      if (session.user) {
        if (token.name !== undefined) session.user.name = token.name as string | null
        if (token.email) session.user.email = token.email as string
        if (token.picture !== undefined) session.user.image = token.picture as string | null
        if (token.profileId) session.user.profileId = token.profileId as string
      }
      return session
    },
  },
})
