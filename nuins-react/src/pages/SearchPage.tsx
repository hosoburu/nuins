import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import FriendCard from '../components/search/FriendCard'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import type { User } from '../types'

export default function SearchPage() {
  const { currentUser } = useAuth()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [requested, setRequested] = useState<Set<number>>(new Set())

  useEffect(() => {
    api.users.list(query.trim() || undefined)
      .then((all) => setUsers(all.filter((u) => u.id !== currentUser?.id)))
      .catch(console.error)
  }, [query, currentUser?.id])

  const handleRequest = (id: number) => {
    setRequested((prev) => new Set(prev).add(id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-[10vh] pb-[10vh] px-4">
        <div className="py-3">
          <h2 className="font-bold text-gray-700 mb-3">フレンド検索</h2>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名前で検索..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-nuins-blue mb-4"
          />
          <div className="flex flex-col gap-2">
            {users.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">ユーザーが見つかりません</p>
            )}
            {users.map((user) => (
              <FriendCard
                key={user.id}
                user={user}
                requested={requested.has(user.id)}
                onRequest={handleRequest}
              />
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
