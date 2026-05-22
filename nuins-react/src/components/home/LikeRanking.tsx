import type { LikeRanking as LikeRankingType } from '../../types'

type Props = {
  ranking: LikeRankingType
}

const RANKS = [
  { key: 'monthly', label: '月間いいねNo1' },
  { key: 'weekly', label: '週間いいねNo1' },
  { key: 'daily', label: '日別いいねNo1' },
] as const

export default function LikeRanking({ ranking }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {RANKS.map(({ key, label }) => {
        const user = ranking[key]
        return (
          <div key={key} className="flex flex-col items-center gap-1">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-nuins-blue"
            />
            <span className="text-xs text-center text-gray-600 font-medium">{label}</span>
            <span className="text-xs font-bold text-nuins-blue">{user.name}</span>
          </div>
        )
      })}
    </div>
  )
}
