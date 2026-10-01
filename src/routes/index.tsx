import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  const ADMIN = "fscnajmul2026@gmail.com"
  const [logged, setLogged] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [page, setPage] = useState("register")
  const [menu, setMenu] = useState(false)
  const [email, setEmail] = useState("")
  const [myPlan, setMyPlan] = useState<any>(null)
  const [balance, setBalance] = useState(500)

  const [ads, setAds] = useState({
    top: "Top Small Ad",
    mid: "Middle Small Ad",
    bottom: "Bottom Small Ad",
    ten: "10s Video Ad - Disturb",
  })

  const [plans, setPlans] = useState([
    { id: 1, name: "Basic Plan", price: 500, on: true },
    { id: 2, name: "Silver Plan", price: 1500, on: true },
    { id: 3, name: "Gold Plan", price: 3000, on: true },
    { id: 4, name: "Platinum Plan", price: 5000, on: true },
  ])

  const [tasks, setTasks] = useState([
    { id: 1, cat: "task1", title: "১. ফেসবুক সেল", price: 150, on: true, order: 1, plan: "Basic Plan" },
    { id: 2, cat: "task1", title: "২. ইনস্টাগ্রাম সেল", price: 180, on: true, order: 2, plan: "Basic Plan" },
    { id: 3, cat: "task1", title: "৩. টেলিগ্রাম সেল", price: 120, on: true, order: 3, plan: "Silver Plan" },
    { id: 4, cat: "task1", title: "৪. হোয়াটসঅ্যাপ সেল", price: 120, on: true, order: 4, plan: "Silver Plan" },
    { id: 5, cat: "task1", title: "৫. জিমেইল সেল", price: 100, on: true, order: 5, plan: "Gold Plan" },
    { id: 6, cat: "task2", title: "Coins Sell", price: 80, on: true, order: 6, plan: "Basic Plan" },
    { id: 7, cat: "task2", title: "Meta Buy", price: 200, on: true, order: 7, plan: "Gold Plan" },
    { id: 8, cat: "task3", title: "Website Visit", price: 10, on: true, order: 8, plan: "Basic Plan" },
    { id: 9, cat: "task4", title: "WhatsApp Bind ৳300", price: 300, on: true, order: 9, plan: "Platinum Plan" },
  ])

  const [inbox, setInbox] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [showAd, setShowAd] = useState(false)
  const [count, setCount] = useState(10)
  const [can, setCan] = useState(false)
  const [uploadText, setUploadText] = useState("")

  useEffect(() => {
    if (showAd && count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
    if (count === 0) setCan(true)
  }, [showAd, count])

  const openTask = (t: any) => {
    if (!myPlan) {
      alert("❌ প্ল্যান কিনা ছাড়া Task করতে পারবে না! আগে Plan কিনো")
      setPage("plans")
      return
    }
    if (!t.on) {
      alert("Admin OFF করে রেখেছে")
      return
    }
    setActive(t)
    setCount(10)
    setCan(false)
    setShowAd(true)
  }

  const submitTask = () => {
    const newEntry = {
      id: Date.now(),
      task: active.title,
      price: active.price,
      proof: uploadText,
      status: "Pending",
      time: new Date().toLocaleDateString(),
    }
    setInbox([newEntry,...inbox])
    setShowAd(false)
    setUploadText("")
    alert("✅ Admin Inbox এ জমা হয়েছে ৳" + active.price)
  }

  if (!logged) {
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-white min-h-screen p-6 pt-10">
          <h1 className="text-center font-black text-2xl">👑 ROLEX 2.0</h1>
          <p className="text-center text-[10px] mt-1">Admin: {ADMIN} লিখলে Admin হবে</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Gmail / Phone" className="w-full mt-8 border-2 border-green-500 rounded-full px-5 py-4 text-sm outline-none" />
          <input placeholder="Password - 123456" type="password" className="w-full mt-3 border-2 border-gray-100 rounded-full px-5 py-4 text-sm outline-none" />
          <button onClick={() => { if (email === ADMIN) setIsAdmin(true); setLogged(true); setPage("home") }} className="w-full mt-6 bg-[#0f8a5a] text-white py-4 rounded-full font-black">LOGIN</button>
          {page === "register" && <button onClick={() => setPage("login")} className="w-full mt-3 text-xs text-green-600">Login এ যাও</button>}
        </div>
      </div>
    )
  }

  const Header = () => (
    <div className="bg-[#0f8a5a] text-white px-4 py-3 flex justify-between items-center relative">
      <button onClick={() => setPage("home")} className="w-9 h-9 bg-white/20 rounded-xl flex justify-center items-center">☰</button>
      <p className="font-black text-sm">🪙 ROLEX 2.0 {myPlan? "[" + myPlan.name + "]" : "[No Plan]"}</p>
      <button onClick={() => setMenu(!menu)} className="w-9 h-9 bg-white/20 rounded-xl flex justify-center items-center text-xl">⋮</button>
      {menu && (
        <div className="absolute top-14 right-4 bg-white text-black rounded-[16px] shadow-xl border w-52 z-50">
          <button onClick={() => { setPage("home"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">🏠 Home</button>
          <button onClick={() => { setPage("plans"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">👑 Plans</button>
          <button onClick={() => { setPage("missions"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">📋 Missions</button>
          <button onClick={() => { setPage("inbox"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm border-b">📥 Inbox ({inbox.length})</button>
          {isAdmin && <button onClick={() => { setPage("admin"); setMenu(false) }} className="w-full text-left px-4 py-3 text-sm bg-black text-yellow-400 font-black">👑 ADMIN</button>}
          <button onClick={() => setLogged(false)} className="w-full text-left px-4 py-3 text-sm text-red-600">Logout</button>
        </div>
      )}
    </div>
  )

  const Bottom = () => (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t rounded-t-[24px] flex justify-around py-2 z-40">
      <button onClick={() => setPage("home")} className="flex flex-col items-center"><span>🏠</span><span className="text-[9px]">Home</span></button>
      <button onClick={() => setPage("plans")} className="flex flex-col items-center"><span>👑</span><span className="text-[9px]">Plan</span></button>
      <button onClick={() => setPage("missions")} className="w-12 h-12 bg-[#0f8a5a] rounded-full text-white -mt-5 border-4 border-[#e8f5e9] flex justify-center items-center">⊞</button>
      <button onClick={() => setPage("inbox")} className="flex flex-col items-center"><span>📥</span><span className="text-[9px]">Inbox</span></button>
      <button onClick={() => setPage(isAdmin? "admin" : "profile")} className="flex flex-col items-center"><span>{isAdmin? "👑" : "👤"}</span><span className="text-[9px]">{isAdmin? "ADMIN" : "Profile"}</span></button>
    </div>
  )

  // PLANS
  if (page === "plans") {
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-[#e8f5e9] pb-24">
          <Header />
          <div className="px-4 mt-4"><button onClick={() => setPage("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full text-xs">← Home</button><h2 className="font-black mt-3">👑 Plan কিনা ছাড়া Task হবে না</h2></div>
          <div className="px-4 mt-4 space-y-3">
            {plans.map((p) => (
              <div key={p.id} className={`rounded-[20px] p-5 border-2 ${myPlan?.id === p.id? "border-green-600 bg-green-50" : "bg-white"}`}>
                <div className="flex justify-between"><p className="font-black">{p.name}</p><p className="bg-black text-white px-3 py-1 rounded-full text-xs">৳{p.price}</p></div>
                {myPlan?.id === p.id? <p className="mt-3 bg-green-600 text-white py-2 rounded-full text-center text-xs">✅ Active</p> : <button onClick={() => { if (balance < p.price) return alert("Balance কম"); setBalance((b) => b - p.price); setMyPlan(p) }} className="w-full mt-3 bg-black text-white py-3 rounded-full text-xs font-bold">Buy ৳{p.price} - Balance ৳{balance}</button>}
              </div>
            ))}
          </div>
          <Bottom />
        </div>
      </div>
    )
  }

  // HOME
  if (page === "home") {
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-[#e8f5e9] pb-24">
          <Header />
          <div className="mx-4 mt-3 bg-yellow-400 rounded-full px-4 py-2 text-center text-[10px] font-bold">🔝 Top Small Ad: {ads.top}</div>
          <div className="mx-4 mt-3 bg-white rounded-[16px] p-4 border flex justify-between"><div><p className="text-[10px]">Balance</p><p className="font-black">৳{balance}</p></div><div className="text-right"><p className="text-[10px]">My Plan</p><p className="font-black text-xs">{myPlan? myPlan.name : "No Plan ❌"}</p></div></div>
          {!myPlan && <div className="mx-4 mt-3 bg-red-100 border border-red-300 rounded-[16px] p-3 text-center"><p className="text-xs font-bold text-red-700">❌ প্ল্যান ছাড়া Task হবে না</p><button onClick={() => setPage("plans")} className="mt-2 bg-red-600 text-white px-5 py-2 rounded-full text-xs">👑 প্ল্যান কিনুন</button></div>}
          <div className="px-4 mt-4 grid grid-cols-2 gap-3">
            <button onClick={() => setPage("plans")} className="bg-black text-yellow-400 rounded-full p-3 flex gap-2 items-center"><div className="w-8 h-8 bg-yellow-400 rounded-full flex justify-center items-center text-black">👑</div><div className="text-left"><p className="text-[8px]">VIP</p><p className="font-black text-xs">Buy Plan</p></div></button>
            <button onClick={() => setPage("missions")} className="bg-white rounded-full p-3 flex gap-2 items-center border"><div className="w-8 h-8 bg-green-100 rounded-full flex justify-center items-center">☰</div><div className="text-left"><p className="text-[8px]">TASKS</p><p className="font-black text-xs">Missions</p></div></button>
          </div>
          <div className="mx-4 mt-3 bg-white border rounded-full px-4 py-2 text-center text-[10px]">↔ Middle Ad: {ads.mid}</div>
          <div className="px-4 mt-4 grid grid-cols-4 gap-2">
            <button onClick={() => setPage("missions")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-[#0f8a5a] rounded-xl flex justify-center items-center text-white">☰</div><p className="text-[10px] font-bold mt-1">Mission</p></button>
            <button onClick={() => setPage("plans")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-yellow-100 rounded-xl flex justify-center items-center">👑</div><p className="text-[10px] font-bold mt-1">VIP</p></button>
            <button onClick={() => setPage("inbox")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-blue-100 rounded-xl flex justify-center items-center">📥</div><p className="text-[10px] font-bold mt-1">Inbox</p></button>
            <button onClick={() => setPage("help")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-green-50 rounded-xl flex justify-center items-center">🎧</div><p className="text-[10px] font-bold mt-1">Help</p></button>
          </div>
          <div className="mx-4 mt-3 bg-white border rounded-full px-4 py-2 text-center text-[10px]">🔻 Bottom Ad: {ads.bottom}</div>
          <Bottom />
        </div>
      </div>
    )
  }

  // MISSIONS
  if (page === "missions") {
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-[#e8f5e9] pb-24">
          <Header />
          <div className="px-4 mt-4 grid grid-cols-2 gap-3">
            <button onClick={() => setPage("task1")} className="bg-white rounded-[20px] p-4 border text-left"><p className="font-black">টাস্ক ওয়ান</p><p className="text-[10px]">FB, Insta, Gmail</p></button>
            <button onClick={() => setPage("task2")} className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-[20px] p-4 text-white text-left"><p className="font-black">টাস্ক টু</p><p className="text-[10px]">RR Coin</p></button>
            <button onClick={() => setPage("task3")} className="bg-white rounded-[20px] p-4 border text-left"><p className="font-black">টাস্ক থ্রি</p><p className="text-[10px]">Visit</p></button>
            <button onClick={() => setPage("task4")} className="bg-white rounded-[20px] p-4 border text-left"><p className="font-black">টাস্ক ফোর</p><p className="text-[10px]">Bind Rent</p></button>
          </div>
          <Bottom />
        </div>
      </div>
    )
  }

  // TASKS
  if (page.startsWith("task")) {
    const list = tasks.filter((t) => t.cat === page)
    return (
      <div className
