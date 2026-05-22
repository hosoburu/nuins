import type { User, Post, ChatRoom, Message, NewsItem, LikeRanking } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const TOKEN_KEY = 'nuins_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'ネットワークエラー' }))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  auth: {
    login: async (name: string, password: string): Promise<User> => {
      const data = await request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
      })
      setToken(data.token)
      return data.user
    },
    logout: async (): Promise<void> => {
      await request('/auth/logout', { method: 'POST' }).catch(() => null)
      clearToken()
    },
    me: (): Promise<User> => request<User>('/auth/me'),
  },

  users: {
    list: (q?: string): Promise<User[]> =>
      request<User[]>(q ? `/users?q=${encodeURIComponent(q)}` : '/users'),
    get: (id: number): Promise<User> => request<User>(`/users/${id}`),
  },

  posts: {
    list: (): Promise<Post[]> => request<Post[]>('/posts'),
    create: (content: string, image?: string): Promise<Post> =>
      request<Post>('/posts', { method: 'POST', body: JSON.stringify({ content, image }) }),
    like: (id: number): Promise<{ liked: boolean; likeCount: number }> =>
      request(`/posts/${id}/like`, { method: 'POST' }),
  },

  chats: {
    list: (): Promise<Omit<ChatRoom, 'messages'>[]> =>
      request<Omit<ChatRoom, 'messages'>[]>('/chats'),
    get: (id: number): Promise<ChatRoom> => request<ChatRoom>(`/chats/${id}`),
    sendMessage: (id: number, content: string): Promise<Message> =>
      request<Message>(`/chats/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  },

  news: {
    list: (): Promise<NewsItem[]> => request<NewsItem[]>('/news'),
  },

  rankings: {
    likes: (): Promise<LikeRanking> => request<LikeRanking>('/rankings/likes'),
  },
}
