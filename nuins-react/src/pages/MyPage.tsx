import { useState } from 'react'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import ProfileModal from '../components/mypage/ProfileModal'
import { useAuth } from '../context/AuthContext'

export default function MyPage() {
  const { currentUser, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const user = currentUser
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-[10vh] pb-[10vh] px-4">
        <div className="py-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-nuins-blue"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                {user.title && (
                  <span className="text-xs bg-nuins-blue text-white px-2 py-0.5 rounded-full">
                    {user.title}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-around mb-4 border-y border-gray-100 py-3">
              <Stat label="Lv" value={String(user.level)} />
              <Stat label="ランク" value={user.rank} />
              <Stat label="ポイント" value={user.points.toLocaleString()} />
            </div>

            <div className="flex justify-around mb-4">
              <Stat label="フォロー" value={String(user.followCount)} />
              <Stat label="フォロワー" value={String(user.followerCount)} />
            </div>

            <p className="text-sm text-gray-500 mb-4">{user.bio}</p>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-2 border border-nuins-blue text-nuins-blue rounded-lg text-sm font-bold hover:bg-nuins-blue hover:text-white transition"
            >
              詳細
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full py-2 border border-gray-300 text-gray-400 rounded-lg text-sm hover:border-red-400 hover:text-red-400 transition"
          >
            ログアウト
          </button>
        </div>
      </main>

      {showModal && (
        <ProfileModal user={user} onClose={() => setShowModal(false)} />
      )}

      <BottomNav />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-nuins-blue">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}
