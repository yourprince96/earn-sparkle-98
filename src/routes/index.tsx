import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/")({ component: RolexApp })

type User = { email: string; id: string }

function RolexApp() {
  const [user, setUser] = useState<User | null>(null)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [page, setPage] = useState("home")
  const [showAddFund, setShowAddFund] = useState(false)
  const [showCashOut, setShowCashOut] = useState(false)

  const ADMIN_EMAIL = "fscnajmul2026@gmail.com"
  const isAdmin = user?.email === ADMIN_EMAIL

  useEffect(() => {
    const saved = localStorage.getItem("rolex_user")
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleAuth = () => {
    if (!email ||!pass) return alert("Email Password দাও")
    const u = { email: email, id: "717322" }
    localStorage.setItem("rolex_user", JSON.stringify(u))
    setUser(u)
  }
  const logout = () => {
    localStorage.removeItem("rolex_user")
    setUser(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00b25e] to-[#0a4a2a] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[28px] p-7 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#00b25e] rounded-full flex items-center justify-center text-white font-bold">R</div>
            <h1 className="font-black text-xl">ROLEX 2.0</h1>
          </div>
          <h2 className="text-2xl font-bold">{authMode === "login"? "Welcome Back" : "Create Account"}</h2>
          <p className="text-sm text-gray-500 mt-1">Login করে ভিতরে ঢুকো</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-6 border p-3.5 rounded-xl" />
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 border p-3.5 rounded-xl" />
          <button onClick={handleAuth} className="w-full mt-6 bg-[#00b25e] text-white py-3.5 rounded-full font-bold">{authMode === "login"? "SIGN IN" : "SIGN UP"}</button>
          <p className="text-center text-sm mt-4">{authMode === "login"? "Account নেই? " : "Account আছে? "}<button onClick={()=>setAuthMode(authMode==="login"?"signup":"login")} className="text-[#00b25e] font-bold">{authMode==="login"?"Sign Up":"Sign In"}</button></p>
        </div>
      </div>
    )
  }

  if (page === "admin") {
    if (!isAdmin) return <div className="p-10">Access Denied!</div>
    return (
      <div className="min-h-screen bg-[#f2f4f7] p-4">
        <button onClick={()=>setPage("home")} className="bg-black text-white px-4 py-2 rounded-full mb-4">← Back</button>
        <h1 className="text-2xl font-black">ADMIN PANEL 🔐 {user.email}</h1>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white p-4 rounded-2xl"><p className="text-xs">Total Users</p><p className="text-2xl font-bold">128</p></div>
          <div className="bg-white p-4 rounded-2xl"><p className="text-xs">Pending Cashout</p><p className="text-2xl font-bold">5</p></div>
        </div>
        <div className="bg-white rounded-2xl mt-4 p-4">
          <h3 className="font-bold">Add Fund Requests (তুমি Approve করবে)</h3>
          <div className="mt-3 p-3 bg-yellow-50 rounded-xl flex justify-between"><span>User: 717323 - 500৳</span><button className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">Approve</button></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f2f4f7] pb-24">
      <div className="bg-gradient-to-r from-[#00b25e] to-[#0a8a4b] text-white px-4 pt-3 pb-8 rounded-b-[28px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#00b25e] font-bold">R</div><span className="font-bold">ROLEX 2.0</span></div>
          <div className="flex gap-2 items-center">
            {isAdmin && <button onClick={()=>setPage("admin")} className="bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full">ADMIN PANEL</button>}
            <button onClick={logout} className="text-xs bg-white/20 px-3 py-1 rounded-full">Logout</button>
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-sm">Logged in: {user.email}</p>
          <p className="text-2xl font-bold">৳ 0.5</p>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button onClick={()=>setShowAddFund(true)} className="bg-white text-[#00b25e] font-bold py-3 rounded-full">➕ ADD FUND</button>
            <button onClick={()=>setShowCashOut(true)} className="bg-[#0a6b38] text-white font-bold py-3 rounded-full">💸 CASH OUT</button>
          </div>
        </div>
      </div>
      <div className="px-4 -mt-4"><div className="bg-white rounded-[20px] p-4 grid grid-cols-4 gap-4">
        <button className="text-center"><div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">🛍️</div><p className="text-[11px]">Order</p></button>
        <button className="text-center"><div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">👥</div><p className="text-[11px]">Team</p></button>
        <button className="text-center"><div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">📋</div><p className="text-[11px]">History</p></button>
        <button className="text-center"><div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">💰</div><p className="text-[11px]">Referral</p></button>
      </div></div>
      {showAddFund && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-2xl p-6 w-full max-w-sm"><h2 className="font-bold">Add Fund</h2><div className="mt-4 bg-gray-100 p-3 rounded-xl text-center">017XXXXXXXX - 500৳ Send</div><button onClick={()=>{alert("Request Sent to Admin!"); setShowAddFund(false)}} className="w-full mt-4 bg-[#00b25e] text-white py-3 rounded-full font-bold">I have Paid</button><button onClick={()=>setShowAddFund(false)} className="w-full mt-2 text-gray-500">Close</button></div></div>)}
      {showCashOut && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-2xl p-6 w-full max-w-sm"><h2 className="font-bold">Cash Out</h2><input placeholder="bKash Number" className="w-full mt-4 border p-3 rounded-xl" /><button onClick={()=>{alert("Sent to Admin"); setShowCashOut(false)}} className="w-full mt-4 bg-black text-white py-3 rounded-full font-bold">Submit</button><button onClick={()=>setShowCashOut(false)} className="w-full mt-2 text-gray-500">Close</button></div></div>)}
    </div>
  )
}
