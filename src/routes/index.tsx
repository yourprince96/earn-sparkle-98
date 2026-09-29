import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: NajmulTask })

type User = { email: string; accId: string; balance: number }
type Task = { id: number; title: string; reward: number; link: string }

function NajmulTask() {
  const [user, setUser] = useState<User | null>(null)
  const [page, setPage] = useState("home")
  const [emailInput, setEmailInput] = useState("fscnajmul2026@gmail.com")
  const ADMIN = "fscnajmul2026@gmail.com"

  const [tasks, setTasks] = useState<Task[]>([{id:1,title:"YouTube Subscribe",reward:25,link:"https://youtube.com"},{id:2,title:"Follow Facebook Page",reward:15,link:""}])
  const [deposits, setDeposits] = useState([{id:"#1003269", amount:500, trx:"8G7F2H", status:"pending"}])
  const [withdraws, setWithdraws] = useState([{id:"#1003269", amount:300, number:"017XXXXXXXX", status:"pending"}])

  useEffect(()=>{
    const u = localStorage.getItem("najmul_final_user")
    if(u) setUser(JSON.parse(u))
    const t = localStorage.getItem("najmul_final_tasks")
    if(t) setTasks(JSON.parse(t))
  },[])

  const handleLogin = () => {
    const accId = "#100" + Math.floor(100000 + Math.random()*900000)
    const newUser = {email: emailInput, accId: emailInput===ADMIN? "#1003269" : accId, balance: 0.00}
    localStorage.setItem("najmul_final_user", JSON.stringify(newUser))
    setUser(newUser)
  }

  if(!user){
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-6">
        <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-xl">
          <h1 className="text-2xl font-black text-[#0f7a4a]">Najmul Task 2.0</h1>
          <p className="text-xs text-gray-500">Login to continue</p>
          <input value={emailInput} onChange={e=>setEmailInput(e.target.value)} placeholder="Email" className="w-full mt-5 border p-3 rounded-xl" />
          <input type="password" placeholder="Password" defaultValue="123456" className="w-full mt-3 border p-3 rounded-xl" />
          <button onClick={handleLogin} className="w-full mt-5 bg-[#0f7a4a] text-white py-3 rounded-full font-bold">SIGN IN / SIGN UP</button>
          <p className="text-[10px] text-center mt-3 text-gray-400">Admin: {ADMIN} দিয়ে লগইন করলে Admin Panel পাবে</p>
        </div>
      </div>
    )
  }

  const isAdmin = user.email === ADMIN

  if(page==="admin" && isAdmin){
    return (
      <div className="min-h-screen bg-white p-4 pb-20">
        <button onClick={()=>setPage("home")} className="bg-black text-white px-4 py-2 rounded-full">← Back</button>
        <h1 className="text-xl font-black mt-4">ADMIN PANEL - Full Control 🔐</h1>
        <p className="text-xs text-green-600">{user.email} | ID: {user.accId}</p>

        <div className="mt-4 bg-yellow-50 p-4 rounded-2xl border">
          <h3 className="font-bold">💸 LIVE Withdraw Requests (কে উইড্র দিচ্ছে)</h3>
          {withdraws.map((w,i)=><div key={i} className="bg-white p-3 rounded-xl mt-2 flex justify-between text-sm"><span>{w.id} - ৳{w.amount} - {w.number}</span><button onClick={()=>{const nw=[...withdraws]; nw[i].status="paid"; setWithdraws(nw)}} className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">{w.status==="pending"?"Approve":"Paid"}</button></div>)}
        </div>

        <div className="mt-4 bg-green-50 p-4 rounded-2xl border">
          <h3 className="font-bold">💰 Deposit Control</h3>
          {deposits.map((d,i)=><div key={i} className="bg-white p-3 rounded-xl mt-2 flex justify-between text-sm"><span>{d.id} - ৳{d.amount} - Trx: {d.trx}</span><button className="bg-black text-white px-3 py-1 rounded-full text-xs">Approve</button></div>)}
        </div>

        <div className="mt-4 bg-gray-50 p-4 rounded-2xl">
          <h3 className="font-bold">📋 Task Add / Control</h3>
          <div className="flex gap-2 mt-2">
            <input id="tTitle" placeholder="Task Name" className="border p-2 rounded flex-1 text-sm" />
            <input id="tReward" placeholder="৳" type="number" className="border p-2 rounded w-16 text-sm" />
            <button onClick={()=>{
              const title = (document.getElementById("tTitle") as HTMLInputElement).value
              const reward = (document.getElementById("tReward") as HTMLInputElement).value
              if(!title) return
              const newTasks = [...tasks, {id:Date.now(), title, reward:Number(reward), link:""}]
              setTasks(newTasks)
              localStorage.setItem("najmul_final_tasks", JSON.stringify(newTasks))
            }} className="bg-[#0f7a4a] text-white px-4 rounded-full text-sm">Add</button>
          </div>
          {tasks.map(t=><div key={t.id} className="mt-2 bg-white p-2 rounded text-sm flex justify-between"><span>{t.title}</span><span>৳{t.reward}</span></div>)}
        </div>

        <div className="mt-4 bg-blue-50 p-4 rounded-2xl">
          <h3 className="font-bold">📢 Ad & Notice Control</h3>
          <input placeholder="Marquee Notice Text" defaultValue="ক্লেম করে Najmul Task 2.0-এর সকল সুবিধা..." className="w-full border p-2 rounded mt-2 text-sm" />
          <textarea placeholder="Paste Ad Code Here (AdSense)" className="w-full border p-2 rounded mt-2 text-sm h-20"></textarea>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full mt-2 text-sm">Save Ad</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-24">
      <div className="bg-gradient-to-r from-[#0f7a4a] to-[#0a5a34] text-white px-4 py-3 rounded-b-[24px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0f7a4a] font-bold">N</div><span className="font-black">Najmul Task 2.0</span></div>
          <div className="flex gap-2">
            {isAdmin && <button onClick={()=>setPage("admin")} className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full">ADMIN</button>}
            <button onClick={()=>{localStorage.removeItem("najmul_final_user"); setUser(null)}} className="text-[10px] bg-white/20 px-3 py-1 rounded-full">Logout</button>
          </div>
        </div>
        <div className="bg-[#0d6a3f] mt-3 rounded-2xl p-4 flex justify-between">
          <div><p className="text-[10px] opacity-70">REFERRAL INCOME</p><p className="font-bold">৳{user.balance.toFixed(2)}</p></div>
          <div className="text-right"><p className="text-[10px] opacity-70">ACCOUNT ID</p><p className="font-bold">{user.accId}</p></div>
        </div>
      </div>

      <div className="px-4 mt-3 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-full p-3 flex items-center gap-3 shadow-sm"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">+</div><div><p className="text-[10px] text-gray-500">ADD FUND</p><p className="text-sm font-bold">Deposit</p></div></div>
        <div className="bg-[#fff0f3] rounded-full p-3 flex items-center gap-3 shadow-sm"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">↓</div><div><p className="text-[10px] text-gray-500">CASH OUT</p><p className="text-sm font-bold text-red-500">Withdraw</p></div></div>
        <div className="bg-[#fff8e1] rounded-full p-3 flex items-center gap-3 shadow-sm"><div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">⏳</div><div><p className="text-[10px]">PENDING</p><p className="text-sm font-bold">৳0.00</p></div></div>
        <div className="bg-[#e8f5e9] rounded-full p-3 flex items-center gap-3 shadow-sm border"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">💲</div><div><p className="text-[10px]">APPROVED</p><p className="text-sm font-bold">৳0.00</p></div></div>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-full p-3 flex gap-2 text-[11px]"><span>📢</span><marquee>ক্লেম করে Najmul Task 2.0-এর সকল সুবিধা উপভোগ করুন...</marquee></div>

      <p className="px-4 mt-5 font-bold text-[#0f7a4a] text-sm">SERVICES & FEATURES</p>
      <div className="px-4 mt-2 grid grid-cols-4 gap-3">
        {["Mission","VIP Plan","Membership","My Team","Lucky Spin","Vault","Lottery","Salary","Support","App","AI Support"].map((name)=><div key={name} className="bg-white rounded-[18px] p-3 flex flex-col items-center gap-1 shadow-sm"><div className="w-11 h-11 bg-[#e8f5e9] rounded-xl flex items-center justify-center text-[#0f7a4a] text-lg">{name==="Mission"?"📋":name==="VIP Plan"?"👑":"🎁"}</div><p className="text-[10px] text-center font-medium">{name}</p></div>)}
      </div>

      <div className="px-4 mt-4"><p className="font-bold text-sm">Your Tasks (Admin থেকে Add করা)</p><div className="mt-2 bg-white rounded-2xl p-3">{tasks.map(t=><div key={t.id} className="flex justify-between items-center py-2 border-b last:border-0"><span className="text-sm">{t.title}</span><button className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">৳{t.reward} Claim</button></div>)}</div></div>

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] flex justify-around py-2 border-t">
        <button className="flex flex-col items-center text-[#0f7a4a]"><span>🏠</span><span className="text-[10px] font-bold">Home</span></button>
        <button className="flex flex-col items-center text-gray-400"><span>📚</span><span className="text-[10px]">Missions</span></button>
        <button className="w-12 h-12 bg-[#0f7a4a] rounded-full text-white -mt-5 border-4 border-[#e8f5e9]">⊞</button>
        <button className="flex flex-col items-center text-gray-400"><span>📄</span><span className="text-[10px]">Finance</span></button>
        <button className="flex flex-col items-center text-gray-400"><span>👤</span><span className="text-[10px]">Profile</span></button>
      </div>
    </div>
  )
}
