import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  const ADMIN_EMAIL = "fscnajmul2026@gmail.com"
  const [email, setEmail] = useState("")
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState("home")
  const [open, setOpen] = useState<string | null>(null)
  const [tasks, setTasks] = useState([
    { id: 1, title: "YouTube Subscribe", reward: 25 },
    { id: 2, title: "FB Page Like", reward: 15 },
  ])

  useEffect(() => {
    const saved = localStorage.getItem("najmul_user_v4")
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleLogin = () => {
    if (!email) return alert("Email দাও")
    const accId = "#100" + Math.floor(100000 + Math.random() * 900000)
    const newUser = {
      email: email,
      accId: email === ADMIN_EMAIL? "#1003269" : accId,
      balance: 0,
    }
    localStorage.setItem("najmul_user_v4", JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("najmul_user_v4")
    setUser(null)
    setTab("home")
    setOpen(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl">
          <div className="w-12 h-12 bg-[#0f7a4a] rounded-xl flex items-center justify-center text-white font-black">N</div>
          <h1 className="text-xl font-black mt-3 text-[#0f7a4a]">Najmul Task 2.0</h1>
          <p className="text-xs text-gray-500 mt-1">Login to continue</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="fscnajmul2026@gmail.com"
            className="w-full mt-5 border rounded-xl p-3 text-sm"
          />
          <button onClick={handleLogin} className="w-full mt-4 bg-[#0f7a4a] text-white py-3 rounded-full font-bold">
            LOGIN
          </button>
          <p className="text-[10px] text-center mt-3 text-gray-400">Admin: fscnajmul2026@gmail.com দিয়ে লগইন করলে Admin পাবে</p>
        </div>
      </div>
    )
  }

  const isAdmin = user.email === ADMIN_EMAIL

  if (tab === "admin" && isAdmin) {
    return (
      <div className="min-h-screen bg-white p-4">
        <button onClick={() => setTab("home")} className="bg-black text-white px-4 py-2 rounded-full text-sm">← Back</button>
        <h2 className="font-black text-lg mt-4">ADMIN PANEL - Only You</h2>
        <p className="text-xs text-green-600">{user.email}</p>
        <div className="mt-4 bg-yellow-50 p-4 rounded-2xl border">
          <h3 className="font-bold text-sm">Withdraw Live</h3>
          <div className="bg-white p-3 rounded-xl mt-2 text-xs flex justify-between">
            <span>#1003269 - ৳800 - 01712XXXX</span>
            <span className="bg-green-600 text-white px-2 py-1 rounded-full">Pending</span>
          </div>
        </div>
        <div className="mt-4 bg-white border p-4 rounded-2xl">
          <h3 className="font-bold text-sm">Add New Task</h3>
          <div className="flex gap-2 mt-2">
            <input id="t1" placeholder="Task name" className="flex-1 border p-2 rounded-xl text-xs" />
            <input id="t2" placeholder="৳" className="w-16 border p-2 rounded-xl text-xs" />
            <button
              onClick={() => {
                const el1 = document.getElementById("t1") as HTMLInputElement
                const el2 = document.getElementById("t2") as HTMLInputElement
                if (!el1.value) return
                setTasks([...tasks, { id: Date.now(), title: el1.value, reward: Number(el2.value) || 10 }])
                el1.value = ""
                el2.value = ""
              }}
              className="bg-[#0f7a4a] text-white px-4 rounded-full text-xs"
            >
              Add
            </button>
          </div>
        </div>
        <button onClick={logout} className="mt-6 w-full bg-red-500 text-white py-3 rounded-full">Logout</button>
      </div>
    )
  }

  if (tab === "admin" &&!isAdmin) {
    setTab("home")
  }

  if (open) {
    return (
      <div className="min-h-screen bg-[#e8f5e9] p-4">
        <button onClick={() => setOpen(null)} className="bg-black text-white px-4 py-2 rounded-full text-sm">← Back</button>
        <div className="bg-white rounded-2xl p-5 mt-4">
          <h2 className="font-black text-[#0f7a4a]">{open}</h2>
          <p className="text-sm text-gray-600 mt-2">{open} page content. Admin থেকে কন্ট্রোল হবে।</p>
          {open === "Mission" && tasks.map((t) => <div key={t.id} className="mt-3 flex justify-between text-sm border-b pb-2"><span>{t.title}</span><span>৳{t.reward}</span></div>)}
        </div>
      </div>
    )
  }

  if (tab!== "home") {
    return (
      <div className="min-h-screen bg-[#e8f5e9] pb-24">
        <div className="bg-[#0f7a4a] text-white p-4 rounded-b-3xl flex justify-between">
          <h2 className="font-bold capitalize">{tab}</h2>
          <button onClick={() => setTab("home")} className="bg-white/20 px-3 py-1 rounded-full text-xs">Home</button>
        </div>
        <div className="bg-white m-4 p-5 rounded-2xl">
          <p className="font-bold text-sm">{tab} Page</p>
          {tab === "missions" && tasks.map((t) => <div key={t.id} className="flex justify-between mt-3 text-sm"><span>{t.title}</span><span>৳{t.reward}</span></div>)}
          {tab === "finance" && <p className="text-xs mt-2 text-gray-500">Deposit ৳0, Withdraw ৳0, Pending ৳0</p>}
          {tab === "profile" && <div className="text-xs mt-2"><p>{user.email}</p><p>{user.accId}</p><p>Balance ৳{user.balance}</p><button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full">Logout</button></div>}
        </div>
        <BottomNav tab={tab} setTab={setTab} isAdmin={isAdmin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-28">
      <div className="bg-[#0f7a4a] text-white px-4 pt-3 pb-6 rounded-b-[28px]">
        <div className="flex justify-between items-center">
          <span className="font-black">ROLEX 2.0</span>
          {isAdmin && <button onClick={() => setTab("admin")} className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full">ADMIN</button>}
        </div>
        <div className="flex justify-between mt-4 text-xs">
          <div><p className="opacity-70 text-[10px]">REFERRAL INCOME</p><p className="font-bold text-sm">৳{user.balance}.00</p></div>
          <div className="text-right"><p className="opacity-70 text-[10px]">ACCOUNT ID</p><p className="font-bold text-sm">{user.accId}</p></div>
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => setOpen("Deposit")} className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm text-left w-full"><span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">+</span><div><p className="text-[10px] text-gray-500">ADD FUND</p><p className="text-sm font-bold">Deposit</p></div></button>
        <button onClick={() => setOpen("Withdraw")} className="bg-[#fff0f3] rounded-full p-4 flex items-center gap-3 shadow-sm text-left w-full"><span className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">↓</span><div><p className="text-[10px] text-gray-500">CASH OUT</p><p className="text-sm font-bold text-red-500">Withdraw</p></div></button>
      </div>

      <p className="px-6 mt-5 font-bold text-[#0f7a4a] text-xs">SERVICES & FEATURES</p>
      <div className="px-4 mt-2 grid grid-cols-4 gap-3">
        {["Mission", "VIP Plan", "Membership", "My Team", "Lucky Spin", "Vault", "Lottery", "Salary", "Support", "App", "AI Support"].map((n) => (
          <button key={n} onClick={() => setOpen(n)} className="bg-white rounded-2xl py-4 flex flex-col items-center gap-2 shadow-sm">
            <div className="w-11 h-11 bg-[#e8f5e9] rounded-xl flex items-center justify-center text-[#0f7a4a] font-bold">{n[0]}</div>
            <p className="text-[9px] font-medium text-center">{n}</p>
          </button>
        ))}
      </div>

      <BottomNav tab={tab} setTab={setTab} isAdmin={isAdmin} />
    </div>
  )
}

function BottomNav({ tab, setTab, isAdmin }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl flex justify-around items-center py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <button onClick={() => setTab("home")} className={`flex flex-col items-center ${tab === "home"? "text-[#0f7a4a]" : "text-gray-400"}`}><span>🏠</span><span className="text-[9px] font-bold">Home</span></button>
      <button onClick={() => setTab("missions")} className={`flex flex-col items-center ${tab === "missions"? "text-[#0f7a4a]" : "text-gray-400"}`}><span>📚</span><span className="text-[9px]">Missions</span></button>
      <button onClick={() => setTab("home")} className="w-12 h-12 bg-[#0f7a4a] rounded-full text-white flex items-center justify-center -mt-6 border-4 border-[#e8f5e9]">⊞</button>
      <button onClick={() => setTab("finance")} className={`flex flex-col items-center ${tab === "finance"? "text-[#0f7a4a]" : "text-gray-400"}`}><span>📄</span><span className="text-[9px]">Finance</span></button>
      <button onClick={() => setTab("profile")} className={`flex flex-col items-center ${tab === "profile"? "text-[#0f7a4a]" : "text-gray-400"}`}><span>👤</span><span className="text-[9px]">Profile</span></button>
    </div>
  )
}
