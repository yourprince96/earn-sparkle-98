import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: App })

function App(){
  const [user, setUser] = useState<any>(null)
  const [page, setPage] = useState("home")
  const [email, setEmail] = useState("")
  const ADMIN = "fscnajmul2026@gmail.com"

  const [tasks, setTasks] = useState([{id:1, title:"YouTube Subscribe - 1min watch", reward:25}, {id:2, title:"Facebook Page Like", reward:15}])
  const [deposits, setDeposits] = useState([{user:"#1003269", amount:500, status:"pending"}])
  const [withdraws, setWithdraws] = useState([{user:"#1003269", amount:800, number:"01712XXXXX", status:"pending"}])
  const [notice, setNotice] = useState("ক্লেম করে Rolex 2.0-এর সকল সুবিধা উপভোগ করুন এবং সর্বশেষ আপডেট পান")
  const [packages, setPackages] = useState([{name:"VIP 1", price:500, income:50}, {name:"VIP 2", price:1000, income:120}])

  useEffect(()=>{
    const u = localStorage.getItem("nt_user")
    if(u) setUser(JSON.parse(u))
    const t = localStorage.getItem("nt_tasks")
    if(t) setTasks(JSON.parse(t))
  },[])

  const login = () => {
    if(!email) return alert("Email দাও")
    const accId = "#100" + Math.floor(100000 + Math.random()*900000)
    const u = {email, accId: email===ADMIN? "#1003269" : accId, balance:0}
    localStorage.setItem("nt_user", JSON.stringify(u))
    setUser(u)
  }

  if(!user){
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-[#0f7a4a] rounded-2xl flex items-center justify-center text-white font-black text-xl mb-3">N</div>
        <h1 className="text-2xl font-black text-[#0f7a4a]">Najmul Task 2.0</h1>
        <p className="text-xs text-gray-500 mb-6">Rolex 2.0 Style - All Features</p>
        <div className="bg-white w-full max-w-sm rounded-[22px] p-5 shadow">
          <p className="font-bold text-sm">Login / Sign Up</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email লিখো" className="w-full mt-4 border p-3 rounded-xl text-sm" />
          <input type="password" placeholder="Password" className="w-full mt-2 border p-3 rounded-xl text-sm" defaultValue="123456" />
          <button onClick={login} className="w-full mt-4 bg-[#0f7a4a] text-white py-3 rounded-full font-bold text-sm">LOGIN</button>
          <p className="text-[10px] text-center mt-2 text-gray-400">Admin Email: fscnajmul2026@gmail.com</p>
        </div>
      </div>
    )
  }

  const isAdmin = user.email === ADMIN

  if(page==="admin" && isAdmin){
    return (
      <div className="min-h-screen bg-[#f5f5f5] p-4 pb-20">
        <button onClick={()=>setPage("home")} className="bg-black text-white px-4 py-2 rounded-full text-sm">← Back to App</button>
        <h1 className="text-lg font-black mt-4">ADMIN PANEL 🔐</h1>
        <p className="text-xs text-green-700">Full Control - {user.email}</p>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl mt-4">
          <h3 className="font-bold text-sm">1. Withdraw Live - কে উইড্র দিচ্ছে</h3>
          {withdraws.map((w,i)=><div key={i} className="bg-white mt-2 p-3 rounded-xl flex justify-between text-xs"><span>{w.user} - ৳{w.amount} - {w.number}</span><button onClick={()=>{const n=[...withdraws]; n[i].status="paid"; setWithdraws(n)}} className="bg-green-600 text-white px-3 py-1 rounded-full">{w.status}</button></div>)}
        </div>

        <div className="bg-green-50 border p-4 rounded-2xl mt-3">
          <h3 className="font-bold text-sm">2. Deposit Control</h3>
          {deposits.map((d,i)=><div key={i} className="bg-white mt-2 p-3 rounded-xl flex justify-between text-xs"><span>{d.user} - ৳{d.amount}</span><button className="bg-black text-white px-3 py-1 rounded-full">Approve</button></div>)}
        </div>

        <div className="bg-white p-4 rounded-2xl mt-3 shadow-sm">
          <h3 className="font-bold text-sm">3. Task Add (নতুন টাস্ক দেওয়া)</h3>
          <div className="flex gap-2 mt-2">
            <input id="tt" placeholder="Task name" className="flex-1 border p-2 rounded-xl text-xs" />
            <input id="tr" placeholder="৳" type="number" className="w-16 border p-2 rounded-xl text-xs" />
            <button onClick={()=>{const title=(document.getElementById("tt") as HTMLInputElement).value; const rew=(document.getElementById("tr") as HTMLInputElement).value; if(!title) return; const nt=[...tasks,{id:Date.now(),title,reward:Number(rew)}]; setTasks(nt); localStorage.setItem("nt_tasks", JSON.stringify(nt))}} className="bg-[#0f7a4a] text-white px-4 rounded-full text-xs">Add</button>
          </div>
          {tasks.map(t=><div key={t.id} className="text-xs mt-2 flex justify-between bg-gray-50 p-2 rounded"><span>{t.title}</span><span>৳{t.reward}</span></div>)}
        </div>

        <div className="bg-white p-4 rounded-2xl mt-3 shadow-sm">
          <h3 className="font-bold text-sm">4. VIP Package Control</h3>
          <div className="flex gap-2 mt-2">
            <input id="pn" placeholder="VIP Name" className="flex-1 border p-2 rounded-xl text-xs" />
            <input id="pp" placeholder="Price" className="w-16 border p-2 rounded-xl text-xs" />
            <button onClick={()=>{const n=(document.getElementById("pn") as HTMLInputElement).value; const p=(document.getElementById("pp") as HTMLInputElement).value; setPackages([...packages,{name:n, price:Number(p), income:Number(p)/10}])}} className="bg-blue-600 text-white px-4 rounded-full text-xs">Add</button>
          </div>
          {packages.map((p,i)=><div key={i} className="text-xs mt-2 bg-gray-50 p-2 rounded">{p.name} - ৳{p.price} - Daily ৳{p.income}</div>)}
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl mt-3 border">
          <h3 className="font-bold text-sm">5. Ad & Notice Control</h3>
          <input value={notice} onChange={e=>setNotice(e.target.value)} className="w-full border p-2 rounded-xl mt-2 text-xs" />
          <textarea placeholder="Ad Code Paste Here" className="w-full border p-2 rounded-xl mt-2 text-xs h-20"></textarea>
          <button className="bg-black text-white px-4 py-2 rounded-full text-xs mt-2">Save All</button>
        </div>
      </div>
    )
  }

  // MAIN INTERFACE - SAME AS YOUR SCREENSHOT
  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-28">
      <div className="bg-[#0f7a4a] text-white px-4 pt-2 pb-6 rounded-b-[28px]">
        <div className="flex justify-between items-center py-2">
          <span className="font-black flex items-center gap-2"><span className="bg-white text-[#0f7a4a] w-7 h-7 rounded-full flex items-center justify-center text-sm">≡</span> <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center">🪙</span> ROLEX 2.0</span>
          <div className="flex gap-2">
            {isAdmin && <button onClick={()=>setPage("admin")} className="bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full">ADMIN</button>}
            <button onClick={()=>{localStorage.removeItem("nt_user"); setUser(null)}} className="text-xs">⋮</button>
          </div>
        </div>
        <div className="flex justify-between mt-4 px-2">
          <div><p className="text-[10px] opacity-70">REFERRAL INCOME</p><p className="font-bold">৳{user.balance}.00</p></div>
          <div className="text-right"><p className="text-[10px] opacity-70">ACCOUNT ID</p><p className="font-bold">{user.accId}</p></div>
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">+</div><div><p className="text-[10px] text-gray-500">ADD FUND</p><p className="font-bold text-sm">Deposit</p></div></div>
        <div className="bg-[#fff0f3] rounded-full p-4 flex items-center gap-3 shadow-sm border border-red-100"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">↓</div><div><p className="text-[10px] text-gray-500">CASH OUT</p><p className="font-bold text-sm text-red-500">Withdraw</p></div></div>
        <div className="bg-[#fff8e1] rounded-full p-4 flex items-center gap-3 shadow-sm"><div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">↻</div><div><p className="text-[10px] text-gray-500">PENDING</p><p className="font-bold text-sm">৳0.00</p></div></div>
        <div className="bg-[#e8f5e9] rounded-full p-4 flex items-center gap-3 shadow-sm border border-green-200"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">💲</div><div><p className="text-[10px] text-gray-500">APPROVED</p><p className="font-bold text-sm">৳0.00</p></div></div>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-full px-4 py-3 flex items-center gap-2 text-xs shadow-sm"><span>📢</span><span className="truncate">{notice}</span></div>

      <p className="px-6 mt-5 font-bold text-[#0f7a4a] text-xs">SERVICES & FEATURES</p>
      <div className="px-4 mt-2 grid grid-cols-4 gap-3">
        {[
          ["Mission","≡"],["VIP Plan","♛"],["Membership","💳"],["My Team","👥"],
          ["Lucky Spin","🎲"],["Vault","📷"],["Lottery","🎟️"],["Salary","💰"],
          ["Support","🎧"],["App","⬇️"],["AI Support","🤖"]
        ].map(([name,icon])=><button key={name} onClick={()=>{if(name==="Mission") setPage("mission")}} className="bg-white rounded-[18px] py-4 flex flex-col items-center gap-2 shadow-sm"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${name==="Mission"?"bg-[#0f7a4a] text-white":"bg-[#e8f5e9] text-[#0f7a4a]"}`}>{icon}</div><p className="text-[10px] font-medium">{name}</p></button>)}
      </div>

      <div className="mx-4 mt-5 bg-white rounded-[20px] p-4 shadow-sm">
        <p className="font-bold text-sm">Today's Tasks</p>
        {tasks.map(t=><div key={t.id} className="flex justify-between items-center mt-3 text-sm border-b pb-2 last:border-0"><span>{t.title}</span><button className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">৳{t.reward}</button></div>)}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[22px] flex justify-around items-center py-3 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button className="flex flex-col items-center text-[#0f7a4a]"><span>🏠</span><span className="text-[9px] font-bold">Home</span></button>
        <button className="flex flex-col items-center text-gray-400"><span>📚</span><span className="text-[9px]">Missions</span></button>
        <button className="w-12 h-12 bg-[#0f7a4a] rounded-full text-white flex items-center justify-center -mt-6 border-4 border-[#e8f5e9]">⊞</button>
        <button className="flex flex-col items-center text-gray-400"><span>📄</span><span className="text-[9px]">Finance</span></button>
        <button className="flex flex-col items-center text-gray-400"><span>👤</span><span className="text-[9px]">Profile</span></button>
      </div>
    </div>
  )
}
