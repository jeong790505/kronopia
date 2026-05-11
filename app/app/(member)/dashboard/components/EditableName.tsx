"use client"

import { useState, useTransition } from "react"

type ActionResult = { error?: string }
type Action = (formData: FormData) => Promise<ActionResult>

type Props = {
  initialName: string | null
  action: Action
}

export default function EditableName({ initialName, action }: Props) {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {initialName ?? "이름 없음"}
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditing(true)
            setError(null)
          }}
          aria-label="닉네임 편집"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          편집
        </button>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await action(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setEditing(false)
        setError(null)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          name="name"
          defaultValue={initialName ?? ""}
          maxLength={30}
          autoFocus
          disabled={pending}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "nickname-error" : undefined}
          className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={pending}
          className="text-xs px-2.5 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "저장 중..." : "저장"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setEditing(false)
            setError(null)
          }}
          className="text-xs px-2.5 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          취소
        </button>
      </div>
      {error && (
        <p id="nickname-error" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  )
}
