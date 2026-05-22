import type { User } from '../../types'

type Props = {
  user: User
  onClose: () => void
}

export default function ProfileModal({ user, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl w-full max-w-md p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-lg">プロフィール詳細</h3>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <Row label="自己紹介" value={user.bio} />
          <Row label="フォロー" value={`${user.followCount} 件`} />
          <Row label="フォロワー" value={`${user.followerCount} 件`} />
          {user.title && <Row label="称号" value={user.title} />}
          <Row label="ベストいいね投稿" value="ブラザーズ王国最強の戦士！" />
          <Row label="総いいね数" value={`${user.points.toLocaleString()} いいね`} />
          {user.snsLinks && user.snsLinks.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-gray-400 w-28 flex-shrink-0">SNS連携</span>
              <div className="flex gap-2 flex-wrap">
                {user.snsLinks.map((sns) => (
                  <a
                    key={sns.label}
                    href={sns.url}
                    className="text-nuins-blue underline"
                  >
                    {sns.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-400 w-28 flex-shrink-0">{label}</span>
      <span className="text-gray-700 flex-1">{value}</span>
    </div>
  )
}
