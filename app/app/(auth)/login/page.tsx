import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import GoogleSignInButton from "./GoogleSignInButton"
import NaverSignInButton from "./NaverSignInButton"
import LoginErrorBanner from "./LoginErrorBanner"

export default async function LoginPage() {
  const session = await auth()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md px-8 py-10">
        <Suspense fallback={null}>
          <LoginErrorBanner />
        </Suspense>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            kronopia
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            계속하려면 로그인하세요
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <GoogleSignInButton />
          <NaverSignInButton />
        </div>
      </div>
    </div>
  )
}
