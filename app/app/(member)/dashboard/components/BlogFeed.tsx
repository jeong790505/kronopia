import { type PostSummary } from "@/lib/blog"

type Props = {
  posts: PostSummary[]
}

export default function BlogFeed({ posts }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">최근 블로그</h2>
      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">아직 글이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.permalink}>
              <a href={post.permalink} className="block group">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>{post.date}</span>
                  {post.categories.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{post.categories.join(", ")}</span>
                    </>
                  )}
                </div>
                {post.summary && (
                  <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">
                    {post.summary}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
