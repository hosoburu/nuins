export type User = {
  id: number
  name: string
  avatar: string
  level: number
  rank: string
  points: number
  bio: string
  followCount: number
  followerCount: number
  title?: string
  snsLinks?: { label: string; url: string }[]
}

export type Post = {
  id: number
  user: User
  content: string
  image?: string
  likeCount: number
  createdAt: string
  isOshi?: boolean
}

export type Message = {
  id: number
  senderId: number
  content: string
  createdAt: string
}

export type ChatRoom = {
  id: number
  partner: User
  messages: Message[]
  lastMessage: string
  updatedAt: string
}

export type NewsItem = {
  id: number
  text: string
}

export type LikeRanking = {
  daily: User
  weekly: User
  monthly: User
}
