import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

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
    jwt({ token, user }) {
      if (user) {
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        if (token.name !== undefined) session.user.name = token.name as string | null
        if (token.email) session.user.email = token.email as string
        if (token.picture !== undefined) session.user.image = token.picture as string | null
      }
      return session
    },
  },
})
