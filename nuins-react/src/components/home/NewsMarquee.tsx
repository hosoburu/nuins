import type { NewsItem } from '../../types'

type Props = {
  items: NewsItem[]
}

export default function NewsMarquee({ items }: Props) {
  const text = items.map((n) => n.text).join('　　　')

  return (
    <div className="bg-black border-2 border-gray-500 overflow-hidden">
      <p className="text-green-400 text-sm py-1 whitespace-nowrap animate-marquee inline-block">
        {text}　　　{text}
      </p>
    </div>
  )
}
