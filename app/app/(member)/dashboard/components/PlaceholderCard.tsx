type Props = {
  title: string
  description: string
  comingSoon?: boolean
}

export default function PlaceholderCard({ title, description, comingSoon = false }: Props) {
  return (
    <div
      role="region"
      aria-label={title}
      className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col gap-2 min-h-[140px]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
        {comingSoon && (
          <span className="text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-full px-2 py-0.5">
            곧 오픈
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}
