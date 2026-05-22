import type { Message } from '../../types'

type Props = {
  message: Message
  isMine: boolean
}

export default function ChatBubble({ message, isMine }: Props) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
          isMine
            ? 'bg-nuins-blue text-white rounded-br-sm'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
        }`}
      >
        <p>{message.content}</p>
        <p className={`text-[10px] mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
          {message.createdAt.split(' ')[1]}
        </p>
      </div>
    </div>
  )
}
