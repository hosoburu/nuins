import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'ホーム', icon: '🏠' },
  { to: '/chat', label: 'チャット', icon: '💬' },
  { to: '/search', label: '検索', icon: '🔍' },
  { to: '/mypage', label: 'マイページ', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full h-[10vh] bg-nuins-blue text-white flex items-center z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.15)]">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-xs transition-opacity ${
              isActive ? 'opacity-100 font-bold' : 'opacity-70 hover:opacity-100'
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
