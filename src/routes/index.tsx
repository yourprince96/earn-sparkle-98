import { useState, useEffect } from "react"

export default function App() {
  const ADMIN = "fscnajmul2026@gmail.com"
  const [logged, setLogged] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [page, setPage] = useState("home")
  const [menu, setMenu] = useState(false)
  const [email, setEmail] = useState("")
  const [myPlan, setMyPlan] = useState<any>(null)
  const [balance] = useState(500)
  const [inbox, setInbox] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [showAd, setShowAd] = useState(false)
  const [count, setCount] = useState(10)
  const [can, setCan] = useState(false)
  const [proof, setProof] = useState("")

  const plans = [
    { id: 1, name: "Basic Plan", price: 500 },
    { id: 2, name: "Silver Plan", price: 1500 },
    { id: 3, name: "Gold Plan", price: 3000 },
    { id: 4, name: "Platinum Plan", price: 5000 },
  ]

  const tasks = [
    { id: 1, cat: "task1", title: "১. ফেসবুক সেল", price: 150, plan: "Basic" },
    { id: 2, cat: "task1", title: "২. ইনস্টাগ্রাম সেল", price: 180, plan: "Basic" },
    { id: 3, cat: "task1", title: "৩. জিমেইল সেল", price: 100, plan: "Gold" },
    { id: 4, cat: "task2", title: "Coins Sell", price: 80, plan: "Basic" },
    { id: 5, cat: "task3", title: "Website Visit", price: 10, plan: "Basic" },
    { id: 6, cat: "task4", title: "WhatsApp Bind ৳300", price: 300, plan: "Platinum" },
  ]

  useEffect(() => {
    if (showAd && count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
    if (count === 0) setCan(true)
  }, [showAd, count])

  if (!logged) {
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center p-4">
        <div className="w-full max-w-[420px] bg-white rounded-[24px] p-6 mt-10 h-fit">
          <h1 className="text-center font-black text-2xl">👑 ROLEX 2.0</h1>
          <p className="text-center text-[10px] mt-1">Admin: fscnajmul2026@gmail.com</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Gmail লিখো" className="w-full mt-6 border-2 border-green-500 rounded-full px-5 py-4 text-sm outline-none" />
          <button onClick={() => { if (email === ADMIN) setIsAdmin(true); setLogged(true) }} className="w-full mt-4 bg-[#0f8a5a] text-white py-4 rounded-full font-black">LOGIN - Error Free</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
      <div className="w-full max-w-[420px] bg-[#e8f5e9] min-h-screen pb-20">
        <div className="bg-[#0f8a5a] text-white p-4 flex justify-between items-center">
          <p className="font-black">ROLEX 2.0 {myPlan? myPlan.name : "No Plan"}</p>
          <button onClick={() => setMenu(!menu)} className="text-xl">⋮</button>
        </div>

        {menu && (
          <div className="bg-white border m-4 rounded-xl p-2">
            <button onClick={() => { setPage("home"); setMenu(false) }} className="w-full text-left p-3 border-b">🏠 Home</button>
            <button onClick={() => { setPage("plans"); setMenu(false) }} className="w-full text-left p-3 border-b">👑 Plans</button>
            <button onClick={() => { setPage("tasks"); setMenu(false) }} className="w-full text-left p-3 border-b">📋 Tasks - 4 টা</button>
            <button onClick={() => { setPage("inbox"); setMenu(false) }} className="w-full text-left p-3">📥 Inbox ({inbox.length})</button>
            {isAdmin && <p className="p-3 bg-black text-yellow-400 rounded-xl mt-2 text-center font-black">👑 ADMIN</p>}
          </div>
        )}

        <div className="mx-4 mt-3 bg-yellow-400 rounded-full py-2 text-center text-[10px] font-bold">🔝 Top Ad | Middle Ad | Bottom Ad Always</div>

        {page === "home" && (
          <div className="p-4">
            <div className="bg-white rounded-xl p-4 border flex justify-between">
              <div><p className="text-[10px]">Balance</p><p className="font-black">৳{balance}</p></div>
              <div><p className="text-[10px]">Plan</p><p className="font-black text-xs">{myPlan? myPlan.name : "No Plan ❌"}</p></div>
            </div>
            {!myPlan && <div className="bg-red-100 border border-red-300 rounded-xl p-3 mt-3 text-center"><p className="text-xs font-bold text-red-700">❌ প্ল্যান ছাড়া Task হবে না</p><button onClick={() => setPage("plans")} className="mt-2 bg-red-600 text-white px-5 py-2 rounded-full text-xs">Plan কিনুন</button></div>}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => setPage("plans")} className="bg-black text-yellow-400 p-4 rounded-xl font-black">👑 Buy Plan</button>
              <button onClick={() => setPage("tasks")} className="bg-white border p-4 rounded-xl font-black">📋 Tasks</button>
              <button onClick={() => setPage("inbox")} className="bg-green-600 text-white p-4 rounded-xl font-black">📥 Inbox File</button>
              <button onClick={() => setPage("help")} className="bg-white border p-4 rounded-xl font-black">🎧 Help</button>
            </div>
          </div>
        )}

        {page === "plans" && (
          <div className="p-4 space-y-3">
            <button onClick={() => setPage("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full text-xs">← Home</button>
            {plans.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 border">
                <div className="flex justify-between"><p className="font-black">{p.name}</p><p className="bg-black text-white px-3 py-1 rounded-full text-xs">৳{p.price}</p></div>
                <button onClick={() => setMyPlan(p)} className="w-full mt-3 bg-black text-white py-3 rounded-full text-xs">{myPlan?.id === p.id? "✅ Active" : "Buy Plan"}</button>
              </div>
            ))}
          </div>
        )}

        {page === "tasks" && (
          <div className="p-4 space-y-3">
            <button onClick={() => setPage("home")} className="bg-black text-white px-4 py-2 rounded-full text-xs">← Home</button>
            <p className="font-black">4 টা Task - Plan ছাড়া হবে না</p>
            {tasks.map(t => (
              <div key={t.id} className="bg-white rounded-xl p-4 border">
                <p className="font-bold text-sm">{t.title} - {t.plan} - ৳{t.price}</p>
                <button onClick={() => { if (!myPlan) { alert("Plan কিনো আগে"); setPage("plans"); return } setActive(t); setCount(10); setCan(false); setShowAd(true) }} className="w-full mt-3 bg-[#0f8a5a] text-white py-3 rounded-full text-xs">{!myPlan? "🔒 Plan লাগবে" : "START - 10s Ad"}</button>
              </div>
            ))}
          </div>
        )}

        {page === "inbox" && (
          <div className="p-4">
            <button onClick={() => setPage("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full text-xs">← Home</button>
            <h2 className="font-black mt-3">📥 Inbox - File জমা</h2>
            {inbox.length === 0 && <p className="text-xs mt-3 text-gray-500">কোনো File নেই</p>}
            {inbox.map(i => (
              <div key={i.id} className="bg-white rounded-xl p-4 border mt-3">
                <p className="font-bold text-sm">{i.task} - ৳{i.price}</p>
                <p className="text-xs mt-2 bg-gray-100 p-2 rounded">{i.proof}</p>
              </div>
            ))}
          </div>
        )}

        {showAd && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-[20px] p-5 w-full max-w-sm text-center">
              <p className="font-black">📢 10s Ad - না দেখলে টাকা পাবে না</p>
              <p className="text-3xl font-black mt-3">{count > 0? count + "s" : "✅ Done"}</p>
              {can && (
                <>
                  <textarea value={proof} onChange={(e) => setProof(e.target.value)} placeholder="File / Notepad / Cookie লিখো" className="w-full border rounded-xl p-3 mt-4 text-xs h-24"></textarea>
                  <button onClick={() => { setInbox([{ id: Date.now(), task: active.title, price: active.price, proof },...inbox]); setShowAd(false); setProof(""); alert("Inbox এ জমা ৳" + active.price) }} className="w-full mt-3 bg-[#0f8a5a] text-white py-3 rounded-full font-bold">Submit Inbox</button>
                </>
              )}
              <button onClick={() => setShowAd(false)} className="w-full mt-2 text-xs">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
     }
