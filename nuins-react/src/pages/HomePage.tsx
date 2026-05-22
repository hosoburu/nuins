import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import NewsMarquee from '../components/home/NewsMarquee'
import LikeRanking from '../components/home/LikeRanking'
import Timeline from '../components/home/Timeline'
import { MOCK_NEWS, MOCK_POSTS, LIKE_RANKING } from '../data/mockData'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-[10vh] pb-[10vh] px-4">
        <div className="mt-3 mb-4">
          <NewsMarquee items={MOCK_NEWS} />
        </div>

        <div className="flex gap-4">
          <aside className="w-20 flex-shrink-0">
            <LikeRanking ranking={LIKE_RANKING} />
          </aside>
          <section className="flex-1 min-w-0">
            <Timeline posts={MOCK_POSTS} />
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
