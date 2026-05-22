import type { User, Post, ChatRoom, NewsItem, LikeRanking } from '../types'

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'ホソ',
    avatar: '/img/hoso.jpg',
    level: 100,
    rank: 'S',
    points: 9800,
    bio: 'ブラザーズ王国の剣士。常に最前線で戦う。',
    followCount: 42,
    followerCount: 120,
    title: '最強の戦士',
    snsLinks: [{ label: 'Twitter', url: '#' }],
  },
  {
    id: 2,
    name: 'ブル',
    avatar: '/img/buru.jpg',
    level: 87,
    rank: 'A',
    points: 7500,
    bio: '武器・防具の専門家。ブル武具店を経営中。',
    followCount: 30,
    followerCount: 85,
    title: '武器職人',
    snsLinks: [],
  },
  {
    id: 3,
    name: 'イル',
    avatar: '/img/iru.jpg',
    level: 75,
    rank: 'A',
    points: 6200,
    bio: 'イル薬局のオーナー。常備薬はお任せ！',
    followCount: 25,
    followerCount: 60,
    title: '薬のプロ',
    snsLinks: [],
  },
  {
    id: 4,
    name: 'ひよこ',
    avatar: '/img/hiyoko.jpg',
    level: 50,
    rank: 'B',
    points: 3000,
    bio: '新入り。これから頑張ります！',
    followCount: 10,
    followerCount: 20,
  },
]

export const CURRENT_USER = MOCK_USERS[0]

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    user: MOCK_USERS[1],
    content: '武器新入荷！ドラゴンソードが入りました。興味ある方はブル武具店まで。',
    image: '/img/hiyoko_daisyuugou.jpg',
    likeCount: 24,
    createdAt: '2026-05-22 20:00',
    isOshi: true,
  },
  {
    id: 2,
    user: MOCK_USERS[2],
    content: '新しい回復薬を開発しました。HP+200の強力アイテムです！',
    likeCount: 18,
    createdAt: '2026-05-22 18:30',
    isOshi: false,
  },
  {
    id: 3,
    user: MOCK_USERS[3],
    content: 'はじめまして！よろしくお願いします。',
    image: '/img/obake_pantentyo.jpg',
    likeCount: 10,
    createdAt: '2026-05-22 15:00',
    isOshi: true,
  },
  {
    id: 4,
    user: MOCK_USERS[0],
    content: '今日も王国の平和を守ります。みなさん一緒に戦いましょう！',
    likeCount: 35,
    createdAt: '2026-05-22 12:00',
    isOshi: false,
  },
]

export const MOCK_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 1,
    partner: MOCK_USERS[1],
    lastMessage: '新しい剣、気に入ってもらえましたか？',
    updatedAt: '2026-05-22 20:10',
    messages: [
      { id: 1, senderId: 2, content: 'こんにちは！', createdAt: '2026-05-22 19:00' },
      { id: 2, senderId: 1, content: 'こんにちは、ブルさん！', createdAt: '2026-05-22 19:05' },
      { id: 3, senderId: 2, content: '新しい剣、気に入ってもらえましたか？', createdAt: '2026-05-22 20:10' },
    ],
  },
  {
    id: 2,
    partner: MOCK_USERS[2],
    lastMessage: '常備薬の在庫が補充されました！',
    updatedAt: '2026-05-22 17:30',
    messages: [
      { id: 1, senderId: 3, content: 'ホソさん、お元気ですか？', createdAt: '2026-05-22 17:00' },
      { id: 2, senderId: 1, content: '元気ですよ！', createdAt: '2026-05-22 17:15' },
      { id: 3, senderId: 3, content: '常備薬の在庫が補充されました！', createdAt: '2026-05-22 17:30' },
    ],
  },
]

export const MOCK_NEWS: NewsItem[] = [
  { id: 1, text: 'nuinsがリリースされました。' },
  { id: 2, text: 'ブラザーズ王国ではリモートワークを推奨しています。' },
  { id: 3, text: '武器・防具のことならブルへお越しください。' },
  { id: 4, text: '常備薬はイル薬局で取り扱いしています。' },
  { id: 5, text: '新機能「推しタイムライン」が追加されました！' },
]

export const LIKE_RANKING: LikeRanking = {
  monthly: MOCK_USERS[0],
  weekly: MOCK_USERS[1],
  daily: MOCK_USERS[2],
}
