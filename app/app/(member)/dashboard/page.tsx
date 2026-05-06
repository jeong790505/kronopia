import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import SignOutButton from "./SignOutButton"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { name, email, image } = session.user ?? {}
  const initial = name?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? "?"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md px-8 py-10">
        <div className="flex flex-col items-center gap-4">
          {image ? (
            <Image
              src={image}
              alt={name ?? "사용자 아바타"}
              width={72}
              height={72}
              className="rounded-full ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-18 h-18 flex items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600 ring-2 ring-gray-100">
              {initial}
            </div>
          )}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{name ?? "이름 없음"}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  )
}
