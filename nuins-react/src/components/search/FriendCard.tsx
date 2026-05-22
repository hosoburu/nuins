import type { User } from '../../types'

type Props = {
  user: User
  requested: boolean
  onRequest: (id: number) => void
}

export default function FriendCard({ user, requested, onRequest }: Props) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-800">{user.name}</p>
        <p className="text-xs text-gray-400">Lv {user.level} / {user.rank} ランク</p>
        <p className="text-xs text-gray-500 truncate">{user.bio}</p>
      </div>
      <button
        onClick={() => onRequest(user.id)}
        disabled={requested}
        className={`px-3 py-1 rounded-full text-xs font-bold transition flex-shrink-0 ${
          requested
            ? 'bg-gray-200 text-gray-400 cursor-default'
            : 'bg-nuins-blue text-white hover:bg-opacity-90'
        }`}
      >
        {requested ? '申請済み' : '申請'}
      </button>
    </div>
  )
}
