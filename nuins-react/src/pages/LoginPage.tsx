import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'top' | 'login'>('top')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!name.trim() || !password) return
    setError('')
    setLoading(true)
    try {
      await login(name.trim(), password)
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-nuins-blue tracking-widest mb-2">NUINS</h1>
          <p className="text-gray-500 text-sm">ブラザーズ王国 公式SNS</p>
        </div>

        {mode === 'top' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('login')}
              className="w-full py-3 bg-nuins-blue text-white rounded-lg font-bold text-lg hover:bg-opacity-90 transition"
            >
              LOGIN
            </button>
            <button
              onClick={() => setMode('login')}
              className="w-full py-3 border-2 border-nuins-blue text-nuins-blue rounded-lg font-bold text-lg hover:bg-nuins-blue hover:text-white transition"
            >
              ACCOUNT CREATE
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div className="space-y-4">
            <p className="text-center text-gray-600 font-medium">ログイン</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-nuins-blue"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-nuins-blue"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              onClick={handleLogin}
              disabled={!name.trim() || !password || loading}
              className="w-full py-3 bg-nuins-blue text-white rounded-lg font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'ログイン'}
            </button>
            <button
              onClick={() => { setMode('top'); setError('') }}
              className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition"
            >
              戻る
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
