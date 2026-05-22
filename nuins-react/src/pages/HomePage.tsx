import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import NewsMarquee from '../components/home/NewsMarquee'
import LikeRanking from '../components/home/LikeRanking'
import Timeline from '../components/home/Timeline'
import { api } from '../lib/api'
import type { Post, NewsItem, LikeRanking as LikeRankingType } from '../types'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [ranking, setRanking] = useState<LikeRankingType | null>(null)

  useEffect(() => {
    api.posts.list().then(setPosts).catch(console.error)
    api.news.list().then(setNews).catch(console.error)
    api.rankings.likes().then(setRanking).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-[10vh] pb-[10vh] px-4">
        <div className="mt-3 mb-4">
          <NewsMarquee items={news} />
        </div>

        <div className="flex gap-4">
          <aside className="w-20 flex-shrink-0">
            {ranking && <LikeRanking ranking={ranking} />}
          </aside>
          <section className="flex-1 min-w-0">
            <Timeline posts={posts} />
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
