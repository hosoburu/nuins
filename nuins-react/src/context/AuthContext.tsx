import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, getToken } from '../lib/api'
import type { User } from '../types'

type AuthContextType = {
  isLoggedIn: boolean
  currentUser: User | null
  isInitializing: boolean
  login: (name: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // 起動時: localStorage にトークンがあればセッションを復元する
  useEffect(() => {
    if (!getToken()) {
      setIsInitializing(false)
      return
    }
    api.auth.me()
      .then(setCurrentUser)
      .catch(() => null) // トークン期限切れ等は無視してログアウト状態にする
      .finally(() => setIsInitializing(false))
  }, [])

  const login = async (name: string, password: string) => {
    const user = await api.auth.login(name, password)
    setCurrentUser(user)
  }

  const logout = async () => {
    await api.auth.logout()
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: currentUser !== null,
        currentUser,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
