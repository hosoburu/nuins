import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'top' | 'register'>('top')
  const [name, setName] = useState('')

  const handleLogin = () => {
    login()
    navigate('/')
  }

  const handleRegister = () => {
    if (!name.trim()) return
    login(name.trim())
    navigate('/')
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
              onClick={handleLogin}
              className="w-full py-3 bg-nuins-blue text-white rounded-lg font-bold text-lg hover:bg-opacity-90 transition"
            >
              LOGIN
            </button>
            <button
              onClick={() => setMode('register')}
              className="w-full py-3 border-2 border-nuins-blue text-nuins-blue rounded-lg font-bold text-lg hover:bg-nuins-blue hover:text-white transition"
            >
              ACCOUNT CREATE
            </button>
          </div>
        )}

        {mode === 'register' && (
          <div className="space-y-4">
            <p className="text-center text-gray-600 font-medium">アカウント作成</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力してください"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-nuins-blue"
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
            />
            <button
              onClick={handleRegister}
              disabled={!name.trim()}
              className="w-full py-3 bg-nuins-blue text-white rounded-lg font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              作成してログイン
            </button>
            <button
              onClick={() => setMode('top')}
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
