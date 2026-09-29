import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/")({
  component: RolexHome,
})

function RolexHome() {
  const [balance] = useState(0.5)

  return (
    <div className="min-h-screen bg-[#f2f4f7] pb-24 font-sans">
      {/* Header - Rolex Style */}
      <div className="bg-gradient-to-r from-[#00b25e] to-[#0a8a4b] text-white px-4 pt-3 pb-6 rounded-b-[28px] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#00b25e] font-bold">R</div>
            <span className="font-bold text-lg tracking-wide">ROLEX 2.0</span>
          </div>
          <div className="flex gap-3 text-xl">
            <span>💬</span>
            <span>🔔</span>
            <span>🌐</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Referral Income</p>
              <p className="text-2xl font-bold">৳ {balance}</p>
              <p className="text-xs mt-1 opacity-80">📋 Account ID: 717322</p>
              <p className="text-xs opacity-70">UID: 717322</p>
            </div>
            <div className="w-20 h-20 bg-white rounded-full p-1">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=717322" alt="qr" className="w-full h-full rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <button className="bg-white text-[#00b25e] font-bold py-3 rounded-full flex items-center justify-center gap-2">
              ➕ ADD FUND
            </button>
            <button className="bg-[#0a6b38] border border-white/30 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2">
              💸 CASH OUT
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-xs opacity-80">Approved</p>
              <p className="font-bold">৳ 0</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-xs opacity-80">Pending</p>
              <p className="font-bold">৳ 0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid - Rolex Style */}
      <div className="px-4 -mt-3">
        <div className="bg-white rounded-[20px] shadow-sm p-4 grid grid-cols-4 gap-4">
          <MenuItem icon="🛍️" label="Order" />
          <MenuItem icon="👥" label="My Team" />
          <MenuItem icon="📋" label="All History" />
          <MenuItem icon="📢" label="Notice" />
          <MenuItem icon="💰" label="Referral" />
          <MenuItem icon="🏆" label="Leaderboard" />
          <MenuItem icon="✉️" label="Inbox" />
          <MenuItem icon="👤" label="Profile" />
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white flex justify-between items-center">
          <div>
            <p className="font-bold">Daily Check-In Bonus</p>
            <p className="text-sm opacity-90">Get ৳ 10 Daily</p>
          </div>
          <button className="bg-white text-green-600 px-4 py-2 rounded-full font-bold text-sm">Claim</button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-center text-[#00b25e]"><div className="text-xl">🏠</div><p className="text-[10px] font-bold">HOME</p></div>
        <div className="text-center text-gray-400"><div className="text-xl">🎁</div><p className="text-[10px]">REWARDS</p></div>
        <div className="text-center text-gray-400"><div className="text-xl">💼</div><p className="text-[10px]">TASKS</p></div>
        <div className="text-center text-gray-400"><div className="text-xl">👤</div><p className="text-[10px]">ME</p></div>
      </div>
    </div>
  )
}

function MenuItem({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 bg-[#f0faf4] rounded-2xl flex items-center justify-center text-xl">{icon}</div>
      <p className="text-[11px] font-medium text-gray-700">{label}</p>
    </div>
  )
}
