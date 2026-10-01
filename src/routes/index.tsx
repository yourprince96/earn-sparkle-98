import { useState, useEffect } from "react"

export default function App() {
  const [logged, setLogged] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [page, setPage] = useState("home")
  const [email, setEmail] = useState("")
  const [myPlan, setMyPlan] = useState<any>(null)
  const [inbox, setInbox] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [showAd, setShowAd] = useState(false)
  const [count, setCount] = useState(10)
  const [proof, setProof] = useState("")
  const [menu, setMenu] = useState(false)

  // Logo - ROLEX 2.0
  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex justify-center items-center font-black text-black">R</div>
      <span className="font-black tracking-widest">ROLEX 2.0</span>
    </div>
  )

  // ====== তোমার Pic অনুসারে Task List ======
  // Task One - তোমার ১ম Pic মতো
  const taskOne = [
    { id: 1, icon: "f", color: "bg-blue-600", title: "১. ফেসবুক সেল", sub: "বিজনেস পেজ এবং অ্যাড সেটআপ।", price: 150 },
    { id: 2, icon: "IG", color: "bg-gradient-to-br from-purple-500 to-orange-400", title: "২. ইনস্টাগ্রাম সেল", sub: "গ্রোথ এবং কন্টেন্ট স্ট্রেটেজি।", price: 180 },
    { id: 3, icon: "✈", color: "bg-blue-400", title: "৩. টেলিগ্রাম সেল", sub: "চ্যানেল এবং গ্রুপ ম্যানেজমেন্ট।", price: 120 },
    { id: 4, icon: "WA", color: "bg-green-500", title: "৪. হোয়াটসঅ্যাপ সেল", sub: "কাস্টমার সাপোর্ট এবং ব্রডকাস্টিং।", price: 120 },
    { id: 5, icon: "M", color: "bg-red-500", title: "৫. জিমেইল সেল", sub: "ইমেল মার্কেটিং এবং আউটরিচ।", price: 100, extra: "Notepad/Cookie File জমা" },
  ]

  // Task Two - তোমার ২য় Pic মতো - RR Coin Universe
  const taskTwo = [
    { id: 6, title: "Coins Sell", color: "from-purple-600 to-purple-400", icon: "🪙", sub: "100% safe & trusted buyer in Bangladesh" },
    { id: 7, title: "Meta Buy", color: "from-cyan-600 to-blue-600", icon: "🛒", sub: "Aged Accounts & Instant Delivery" },
    { id: 8, title: "Wallet", icon: "💳" },
    { id: 9, title: "Deposit", icon: "💸" },
    { id: 10, title: "History", icon: "🕐" },
    { id: 11, title: "Payment", icon: "⚙" },
  ]

  // Task Three - তুমি যা বলছো
  const taskThree = [
    { id: 12, title: "Website Visit 1 Min", price: 10, sub: "Website Visit" },
    { id: 13, title: "Facebook Visit Like", price: 15, sub: "Facebook" },
    { id: 14, title: "Gmail Visit", price: 10, sub: "Gmail" },
    { id: 15, title: "WhatsApp Channel Visit", price: 20, sub: "WhatsApp" },
    { id: 16, title: "Telegram Group Join", price: 15, sub: "Telegram" },
    { id: 17, title: "TikTok Video Visit", price: 20, sub: "TikTok" },
  ]

  // Task Four - Bind + Rent
  const taskFour = [
    { id: 18, title: "WhatsApp Bind করে ইনকাম", price: 300, sub: "প্রতিদিন ৳300" },
    { id: 19, title: "Telegram Bind Income", price: 250, sub: "প্রতিদিন ৳250" },
    { id: 20, title: "নাম্বার ভাড়া দিয়ে ইনকাম", price: 2000, sub: "মাসে ৳2000" },
  ]

  useEffect(() => {
    if (showAd && count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [showAd, count])

  const ADMIN = "fscnajmul2026@gmail.com"

  if (!logged) {
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center p-4">
        <div className="w-full max-w-[420px] bg-white rounded-[24px] p-6 mt-8 h-fit">
          <div className="flex justify-center"><Logo /></div>
          <h1 className="text-center font-black text-[28px] mt-4 text-[#0f3d2e]">জয়েন করুন</h1>
          <p className="text-center text-[12px] text-gray-500">রোলেক্স ২.০ এর সাথে ইনকাম শুরু হোক আজই</p>
          <div className="mt-6 border-2 border-gray-100 rounded-full px-4 py-3 flex gap-2"><span>🎁</span><input defaultValue="RX8E57YT" className="w-full outline-none text-sm font-bold" /></div>
          <div className="mt-3 border-2 border-gray-100 rounded-full px-4 py-3 flex gap-2"><span>✍</span><input placeholder="আপনার নাম লিখুন" className="w-full outline-none text-sm" /></div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Phone / Gmail - Admin হতে fscnajmul2026@gmail.com" className="w-full mt-3 border-2 border-green-500 rounded-full px-5 py-4 text-sm outline-none" />
          <button onClick={() => { if (email === ADMIN) setIsAdmin(true); setLogged(true) }} className="w-full mt-6 bg-gradient-to-r from-[#0f3d2e] to-[#1dbf73] text-white py-4 rounded-full font-black">REGISTER NOW / LOGIN →</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
      <div className="w-full max-w-[420px] bg-[#e8f5e9] min-h-screen pb-24">
        {/* Top Header - তোমার Pic মতো */}
        <div className="bg-[#0f8a5a] text-white px-4 py-3 flex justify-between items-center relative rounded-b-[28px]">
          <button onClick={() => setPage("home")} className="w-9 h-9 bg-white/20 rounded-xl flex justify-center items-center">☰</button>
          <div className="flex items-center gap-2 font-black"><div className="w-6 h-6 bg-yellow-400 rounded-full flex justify-center items-center text-black text-xs">R</div> ROLEX 2.0</div>
          <button onClick={() => setMenu(!menu)} className="w-9 h-9 bg-white/20 rounded-xl flex justify-center items-center">⋮</button>
          {menu && (
            <div className="absolute top-14 right-4 bg-white text-black rounded-[16px] shadow-xl border w-52 z-50">
              <button onClick={() => { setPage("home"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">🏠 Home</button>
              <button onClick={() => { setPage("task1"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">📋 Task One - Pic 1 মতো</button>
              <button onClick={() => { setPage("task2"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">🪙 Task Two - Pic 2 মতো</button>
              <button onClick={() => { setPage("task3"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">🌐 Task Three - Visit</button>
              <button onClick={() => { setPage("task4"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">📱 Task Four - Bind Rent</button>
              <button onClick={() => { setPage("plans"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">👑 Plans</button>
              <button onClick={() => { setPage("help"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">🎧 Help Center</button>
              <button onClick={() => { setPage("referral"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">🔗 Referral</button>
              <button onClick={() => { setPage("profile"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">👤 Profile</button>
              {isAdmin && <button onClick={() => { setPage("inbox"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm bg-black text-yellow-400 font-black">📥 INBOX - File জমা</button>}
            </div>
          )}
        </div>

        {/* Top Small Ad */}
        <div className="mx-4 mt-3 bg-yellow-400 rounded-full py-2 text-center text-[10px] font-bold">🔝 Top Small Ad</div>

        {/* Home */}
        {page === "home" && (
          <>
            <div className="bg-[#0f8a5a] text-white px-5 py-4 flex justify-between mx-4 mt-3 rounded-[20px]">
              <div><p className="text-[9px] opacity-70">REFERRAL INCOME</p><p className="font-black">৳0.00</p></div>
              <div className="text-right"><p className="text-[9px] opacity-70">ACCOUNT ID</p><p className="font-black">#1003269</p></div>
            </div>

            <div className="px-4 mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white rounded-full p-3 flex gap-2 items-center border"><div className="w-8 h-8 bg-green-100 rounded-full flex justify-center items-center">+</div><div><p className="text-[8px]">ADD FUND</p><p className="font-black text-xs">Deposit</p></div></div>
              <div className="bg-[#fff0f0] rounded-full p-3 flex gap-2 items-center border"><div className="w-8 h-8 bg-red-500 rounded-full flex justify-center items-center text-white">↓</div><div><p className="text-[8px]">CASH OUT</p><p className="font-black text-xs text-red-600">Withdraw</p></div></div>
            </div>

            <div className="mx-4 mt-3 bg-white border rounded-full py-2 text-center text-[10px]">↔ Middle Small Ad</div>

            <div className="px-4 mt-4">
              <p className="text-[11px] font-black text-[#0f8a5a]">SERVICES & FEATURES</p>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <button onClick={() => setPage("task1")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-[#0f8a5a] rounded-xl flex justify-center items-center text-white">☰</div><p className="text-[10px] font-bold mt-1">Mission</p></button>
                <button onClick={() => setPage("plans")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-green-50 rounded-xl flex justify-center items-center">👑</div><p className="text-[10px] font-bold mt-1">VIP Plan</p></button>
                <button onClick={() => setPage("referral")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-green-50 rounded-xl flex justify-center items-center">👥</div><p className="text-[10px] font-bold mt-1">My Team</p></button>
                <button onClick={() => setPage("task1")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-green-50 rounded-xl flex justify-center items-center">📋</div><p className="text-[10px] font-bold mt-1">Task 1</p></button>
                <button onClick={() => setPage("task2")} className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-white/20 rounded-xl flex justify-center items-center text-white">🪙</div><p className="text-[10px] font-bold mt-1 text-white">Task 2</p></button>
                <button onClick={() => setPage("task3")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-green-50 rounded-xl flex justify-center items-center">🌐</div><p className="text-[10px] font-bold mt-1">Task 3</p></button>
                <button onClick={() => setPage("task4")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-green-50 rounded-xl flex justify-center items-center">📱</div><p className="text-[10px] font-bold mt-1">Task 4</p></button>
                <button onClick={() => setPage("help")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-green-50 rounded-xl flex justify-center items-center">🎧</div><p className="text-[10px] font-bold mt-1">Support</p></button>
              </div>
            </div>
            <div className="mx-4 mt-4 bg-white border rounded-full py-2 text-center text-[10px]">🔻 Bottom Small Ad</div>
          </>
        )}

        {/* Task One - তোমার ১ম Pic Same to Same */}
        {page === "task1" && (
          <div className="bg-[#fefce8] min-h-screen">
            <div className="p-4 flex gap-2"><button onClick={() => setPage("home")} className="bg-black text-white px-4 py-2 rounded-full text-xs">← Back</button><p className="font-black">টাস্ক ওয়ান - Pic 1 মতো</p></div>
            <div className="mx-4 bg-white rounded-[20px] p-5 border shadow">
              <h2 className="font-black text-xl text-blue-800 text-center">টাস্ক ওয়ান</h2>
              <p className="text-center text-xs text-gray-500">Logo সহকারে Pic অনুসারে</p>
              <div className="mt-6 space-y-5">
                {taskOne.map(t => (
                  <div key={t.id} className="flex gap-3">
                    <div className={`w-10 h-10 ${t.color} rounded-full flex justify-center items-center text-white font-bold text-xs shrink-0`}>{t.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{t.title} ✓</p>
                      <p className="text-xs text-gray-500">{t.sub}</p>
                      {t.extra && <p className="text-[10px] text-red-500 mt-1">{t.extra}</p>}
                      <button onClick={() => { if (!myPlan) { alert("Plan কিনো আগে"); setPage("plans"); return } setActive(t); setCount(10); setShowAd(true) }} className="mt-2 bg-[#0f8a5a] text-white px-4 py-2 rounded-full text-xs">Sell Now ৳{t.price}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Task Two - তোমার ২য় Pic Same to Same - RR Coin Universe */}
        {page === "task2" && (
          <div className="bg-[#0a0e27] min-h-screen text-white p-4">
            <button onClick={() => setPage("home")} className="bg-white/10 px-4 py-2 rounded-full text-xs">← Back</button>
            <div className="bg-[#121636] rounded-[20px] p-4 border border-white/10 text-center mt-4">
              <p className="text-[10px] bg-cyan-500/20 text-cyan-300 inline px-3 py-1 rounded-full">🛡 100% safe & trusted buyer in Bangladesh</p>
              <div className="flex justify-center mt-3"><Logo /></div>
              <p className="font-black text-xl mt-2">RR COIN UNIVERSE</p>
              <p className="text-xs opacity-60 mt-1">Sell coins or buy Meta accounts with instant payouts</p>
            </div>
            <div className="mt-4 bg-gradient-to-r from-purple-600 to-purple-400 rounded-[20px] p-4 flex justify-between items-center">
              <div className="flex gap-3 items-center"><div className="w-10 h-10 bg-white/20 rounded-xl flex justify-center items-center">🪙</div><p className="font-black">Coins Sell</p></div>
              <button onClick={() => { setActive(taskTwo[0]); setCount(10); setShowAd(true) }} className="bg-white text-black px-3 py-1 rounded-full text-xs">Sell ৳80</button>
            </div>
            <div className="mt-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-[20px] p-4 flex justify-between items-center">
              <div className="flex gap-3 items-center"><div className="w-10 h-10 bg-white/20 rounded-xl flex justify-center items-center">🛒</div><div><p className="font-black">Meta Buy</p><p className="text-[10px] opacity-80">Aged Accounts & Instant Delivery</p></div></div>
              <button onClick={() => { setActive(taskTwo[1]); setCount(10); setShowAd(true) }} className="bg-white text-black px-3 py-1 rounded-full text-xs">Buy</button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {taskTwo.slice(2).map(t => (
                <div key={t.title} className="bg-[#121636] rounded-[16px] p-3 border border-white/10 text-center"><p>{t.icon}</p><p className="text-[10px] mt-1">{t.title}</p></div>
              ))}
            </div>
          </div>
        )}

        {/* Task Three */}
        {page === "task3" && (
          <div className="p-4 space-y-3">
            <button onClick={() => setPage("home")} className="bg-black text-white px-4 py-2 rounded-full text-xs">← Back</button>
            <h2 className="font-black">টাস্ক থ্রি - Website, FB, Gmail, WhatsApp, Telegram, TikTok Visit</h2>
            {taskThree.map(t => (
              <div key={t.id} className="bg-white rounded-[16px] p-4 border flex justify-between items-center">
                <div><p className="font-bold text-sm">{t.title}</p><p className="text-[10px] text-gray-500">{t.sub}</p></div>
                <button onClick={() => { setActive(t); setCount(10); setShowAd(true) }} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full text-xs">Start ৳{t.price}</button>
              </div>
            ))}
          </div>
        )}

        {/* Task Four */}
        {page === "task4" && (
          <div className="p-4 space-y-3">
            <button onClick={() => setPage("home")} className="bg-black text-white px-4 py-2 rounded-full text-xs">← Back</button>
            <h2 className="font-black">টাস্ক ফোর - Bind + Number Rent</h2>
            {taskFour.map(t => (
              <div key={t.id} className="bg-white rounded-[16px] p-4 border">
                <p className="font-bold">{t.title}</p><p className="text-xs text-gray-500">{t.sub}</p>
                <button onClick={() => { setActive(t); setCount(10); setShowAd(true) }} className="w-full mt-3 bg-[#0f8a5a] text-white py-3 rounded-full text-xs">Bind Now ৳{t.price}</button>
              </div>
            ))}
          </div>
        )}

        {page === "plans" && (
          <div className="p-4 space-y-3">
            <button onClick={() => setPage("home")} className="bg-black text-white px-4 py-2 rounded-full text-xs">← Home</button>
            <h2 className="font-black">👑 Plans - Plan ছাড়া Task হবে না</h2>
            {[{ name: "Basic", price: 500 }, { name: "Gold", price: 3000 }, { name: "Platinum", price: 5000 }].map(p => (
              <div key={p.name} className="bg-white rounded-xl p-4 border flex justify-between items-center">
                <p className="font-black">{p.name} - ৳{p.price}</p>
                <button onClick={() => setMyPlan(p)} className="bg-black text-white px-4 py-2 rounded-full text-xs">{myPlan?.name === p.name? "✅ Active" : "Buy"}</button>
              </div>
            ))}
          </div>
        )}

        {page === "inbox" && (
          <div className="p-4">
            <button onClick={() => setPage("home")} className="bg-black text-white px-4 py-2 rounded-full text-xs">← Home</button>
            <h2 className="font-black mt-3">📥 Inbox - সব File জমা</h2>
            {inbox.map(i => (
              <div key={i.id} className="bg-white rounded-xl p-4 border mt-3"><p className="font-bold text-sm">{i.task} - ৳{i.price}</p><p className="text-xs mt-1 bg-gray-100 p-2 rounded">{i.proof}</p></div>
            ))}
          </div>
        )}

        {(page === "help" || page === "referral" || page === "profile") && (
          <div className="p-4">
            <button onClick={() => setPage("home")} className="bg-black text-white px-4 py-2 rounded-full text-xs">← Home</button>
            <div className="bg-white rounded-xl p-6 border mt-4 text-center">
              <Logo />
              <p className="font-black mt-3">{page === "help"? "Help Center - WhatsApp / Telegram" : page === "referral"? "Referral - RX8E57YT" : "Profile - Balance + Photo"}</p>
              {page === "help" && <><div className="bg-green-500 text-white p-3 rounded-xl mt-3">💬 WhatsApp Help</div><div className="bg-blue-500 text-white p-3 rounded-xl mt-2">✈ Telegram Help</div></>}
            </div>
          </div>
        )}

        {/* 10s Ad */}
        {showAd && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-[20px] p-5 w-full max-w-sm text-center">
              <p className="font-black text-sm">📢 10s Ad - না দেখলে টাকা পাবে না</p>
              <p className="text-3xl font-black mt-3">{count > 0? count + "s" : "✅ Done"}</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-2"><div className="bg-[#0f8a5a] h-2 rounded-full" style={{ width: (10 - count) * 10 + "%" }}></div></div>
              {count === 0 && (
                <>
                  <textarea value={proof} onChange={e => setProof(e.target.value)} placeholder="File / Notepad / Cookie / Proof - Inbox এ জমা হবে" className="w-full border rounded-xl p-3 mt-4 text-xs h-24"></textarea>
                  <button onClick={() => { setInbox([{ id: Date.now(), task: active.title, price: active.price, proof },...inbox]); setShowAd(false); setProof(""); setCount(10); alert("Inbox
