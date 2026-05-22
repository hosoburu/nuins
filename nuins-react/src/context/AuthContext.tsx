import { createContext, useContext, useState, type ReactNode } from 'react'
import { CURRENT_USER } from '../data/mockData'
import type { User } from '../types'

type AuthContextType = {
  isLoggedIn: boolean
  currentUser: User | null
  login: (name?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const login = (name?: string) => {
    const user = name ? { ...CURRENT_USER, name } : CURRENT_USER
    setCurrentUser(user)
    setIsLoggedIn(true)
  }

  const logout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
