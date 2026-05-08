import Image from "next/image"
import SignOutButton from "../SignOutButton"

type Props = {
  name: string | null
  email: string | null
  avatarUrl: string | null
  provider: string
  createdAt: string | null
}

const PROVIDER_BADGE: Record<string, { label: string; bg: string }> = {
  google: { label: "Google", bg: "bg-[#4285F4]" },
  naver: { label: "Naver", bg: "bg-[#03C75A]" },
}

export default function ProfileCard({ name, email, avatarUrl, provider, createdAt }: Props) {
  const initial = name?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? "?"
  const badge = PROVIDER_BADGE[provider] ?? { label: provider, bg: "bg-gray-500" }
  const joinDate = createdAt ? createdAt.slice(0, 10) : null

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name ?? "사용자 아바타"}
          width={72}
          height={72}
          className="rounded-full ring-2 ring-gray-100"
        />
      ) : (
        <div className="w-[72px] h-[72px] flex items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600 ring-2 ring-gray-100">
          {initial}
        </div>
      )}
      <div className="flex-1 flex flex-col items-center sm:items-start gap-1.5">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <h2 className="text-lg font-semibold text-gray-900">
            {name ?? "이름 없음"}
          </h2>
          <span
            className={`text-xs font-medium text-white rounded-full px-2 py-0.5 ${badge.bg}`}
          >
            {badge.label}
          </span>
        </div>
        <p className="text-sm text-gray-500">{email}</p>
        {joinDate && (
          <p className="text-xs text-gray-400">가입: {joinDate}</p>
        )}
      </div>
      <div className="self-center">
        <SignOutButton />
      </div>
    </div>
  )
}
