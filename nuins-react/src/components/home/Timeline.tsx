import { useState } from 'react'
import type { Post } from '../../types'

type Props = {
  posts: Post[]
}

export default function Timeline({ posts }: Props) {
  const [oshiOnly, setOshiOnly] = useState(false)
  const [liked, setLiked] = useState<Set<number>>(new Set())

  const displayed = oshiOnly ? posts.filter((p) => p.isOshi) : posts

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOshiOnly(!oshiOnly)}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
            oshiOnly
              ? 'bg-nuins-blue text-white border-nuins-blue'
              : 'bg-white text-nuins-blue border-nuins-blue'
          }`}
        >
          ⭐ 推しタイムライン
        </button>
        {oshiOnly && (
          <button
            onClick={() => setOshiOnly(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            すべて表示
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[55vh] pr-1">
        {displayed.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">投稿がありません</p>
        )}
        {displayed.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-bold text-sm text-gray-800">{post.user.name}</span>
              <span className="text-xs text-gray-400 ml-auto">{post.createdAt}</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt=""
                className="w-full rounded-lg object-cover max-h-48 mb-2"
              />
            )}
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleLike(post.id)}
                className="text-sm transition"
              >
                {liked.has(post.id) ? '❤️' : '🤍'}
              </button>
              <span className="text-xs text-gray-500">
                {post.likeCount + (liked.has(post.id) ? 1 : 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
