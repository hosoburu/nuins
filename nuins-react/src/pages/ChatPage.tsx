import { useState } from 'react'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import ChatBubble from '../components/chat/ChatBubble'
import { MOCK_CHAT_ROOMS } from '../data/mockData'
import { CURRENT_USER } from '../data/mockData'
import type { ChatRoom, Message } from '../types'

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>(MOCK_CHAT_ROOMS)
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim() || !selectedRoom) return
    const newMsg: Message = {
      id: Date.now(),
      senderId: CURRENT_USER.id,
      content: input.trim(),
      createdAt: new Date().toLocaleString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    }
    const updatedRooms = rooms.map((r) =>
      r.id === selectedRoom.id
        ? { ...r, messages: [...r.messages, newMsg], lastMessage: newMsg.content }
        : r
    )
    setRooms(updatedRooms)
    setSelectedRoom(updatedRooms.find((r) => r.id === selectedRoom.id) ?? null)
    setInput('')
  }

  if (selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="fixed top-0 left-0 w-full h-[10vh] bg-nuins-blue text-white flex items-center px-4 z-50 gap-3">
          <button onClick={() => setSelectedRoom(null)} className="text-white text-xl">
            ←
          </button>
          <img
            src={selectedRoom.partner.avatar}
            alt={selectedRoom.partner.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-bold">{selectedRoom.partner.name}</span>
        </header>

        <main className="pt-[10vh] pb-[14vh] px-4 flex-1 overflow-y-auto">
          <div className="py-3">
            {selectedRoom.messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isMine={msg.senderId === CURRENT_USER.id}
              />
            ))}
          </div>
        </main>

        <div className="fixed bottom-[10vh] left-0 w-full bg-white border-t border-gray-200 px-4 py-2 flex gap-2 z-40">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-nuins-blue"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-4 py-2 bg-nuins-blue text-white rounded-full text-sm font-bold disabled:opacity-50"
          >
            送信
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-[10vh] pb-[10vh]">
        <div className="px-4 py-3">
          <h2 className="font-bold text-gray-700 mb-3">チャット</h2>
          {rooms.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">チャットがありません</p>
          )}
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="w-full flex items-center gap-3 bg-white rounded-xl p-3 mb-2 shadow-sm border border-gray-100 hover:border-nuins-blue transition text-left"
            >
              <img
                src={room.partner.avatar}
                alt={room.partner.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-gray-800">{room.partner.name}</span>
                  <span className="text-xs text-gray-400">{room.updatedAt.split(' ')[1]}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{room.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
