import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: TaskAndPro })

function TaskAndPro(){
  const ADMIN_EMAIL = "fscnajmul2026@gmail.com"
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [user,setUser]=useState<any>(null)
  const [tab,setTab]=useState("home")
  const [open,setOpen]=useState("")

  // Data - Admin Control করবে
  const [tasks,setTasks]=useState([{id:1,title:"YouTube Subscribe 1 min",reward:25,status:"pending"},{id:2,title:"Facebook Like",reward:15,status:"pending"}])
  const [ads,setAds]=useState("🔥 Special Offer - 100% Bonus on Deposit Today!")
  const [notice,setNotice]=useState("Task & Pro তে স্বাগতম - ক্লেম করে সব সুবিধা নিন")

  useEffect(()=>{
    const u = localStorage.getItem("taskpro_user")
    if(u) setUser(JSON.parse(u))
    const t = localStorage.getItem("taskpro_tasks")
    if(t) setTasks(JSON.parse(t))
    const a = localStorage.getItem("taskpro_ads")
    if(a) setAds(a)
  },[])

  const login=()=>{
    if(!email ||!pass) return alert("Email Password দাও")
    const u={email,accId:"#100"+Math.floor(100000+Math.random()*900000),balance:0}
    localStorage.setItem("taskpro_user",JSON.stringify(u))
    setUser(u)
  }

  const isAdmin = user?.email === ADMIN_EMAIL

  // LOGIN PAGE
  if(!user){
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-sm rounded-[28px] p-6 shadow-xl">
          <div className="w-12 h-12 bg-[#0f7a4a] rounded-2xl flex items-center justify-center text-white font-black">T</div>
          <h1 className="text-2xl font-black mt-3 text-[#0f7a4a]">Task & Pro</h1>
          <p className="text-xs text-gray-400">Rolex 2.0 Style - Najmul Task</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-5 border rounded-xl p-3 text-sm outline-none" />
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 border rounded-xl p-3 text-sm outline-none" />
          <button onClick={login} className="w-full mt-5 bg-[#0f7a4a] text-white py-3 rounded-full font-bold">LOGIN</button>
        </div>
      </div>
    )
  }

  // ADMIN PANEL - ONLY FOR YOU, NO ONE ELSE CAN SEE
  if(tab==="admin" && isAdmin){
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4">
        <button onClick={()=>setTab("home")} className="bg-black text-white px-4 py-2 rounded-full text-sm">← Back to App</button>
        <h1 className="text-xl font-black mt-4">ADMIN - Task & Pro</h1>
        <p className="text-xs text-green-600">{user.email} - Only You</p>

        <div className="bg-white p-4 rounded-2xl mt-4 shadow">
          <h3 className="font-bold text-sm">📢 Ad Control - সব পেজে এই Ad দেখাবে</h3>
          <textarea value={ads} onChange={e=>setAds(e.target.value)} className="w-full border p-3 rounded-xl mt-2 text-xs h-20"></textarea>
          <button onClick={()=>{localStorage.setItem("taskpro_ads",ads); alert("Ad Saved")}} className="bg-[#0f7a4a] text-white px-4 py-2 rounded-full text-xs mt-2">Save Ad</button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl mt-3">
          <h3 className="font-bold text-sm">💸 Withdraw Live - কে টাকা তুলছে</h3>
          <div className="bg-white p-3 rounded-xl mt-2 text-xs flex justify-between items-center">ID: #1003269 - ৳800 - 01712XXXXX <button className="bg-green-600 text-white px-3 py-1 rounded-full">Approve</button></div>
        </div>

        <div className="bg-green-50 border p-4 rounded-2xl mt-3">
          <h3 className="font-bold text-sm">💰 Deposit Approve</h3>
          <div className="bg-white p-3 rounded-xl mt-2 text-xs flex justify-between">ID: #1007754 - ৳500 <button className="bg-black text-white px-3 py-1 rounded-full">Approve</button></div>
        </div>

        <div className="bg-white p-4 rounded-2xl mt-3 shadow">
          <h3 className="font-bold text-sm">✅ Task যাচাই - Pending থেকে Approve</h3>
          {tasks.map((t,i)=><div key={t.id} className="flex justify-between items-center mt-2 text-xs bg-gray-50 p-3 rounded-xl"><span>{t.title} - {t.status}</span><button onClick={()=>{const n=[...tasks]; n[i].status="approved"; setTasks(n); localStorage.setItem("taskpro_tasks",JSON.stringify(n))}} className="bg-blue-600 text-white px-3 py-1 rounded-full">{t.status==="pending"?"Approve":"Done"}</button></div>)}
        </div>

        <div className="bg-white p-4 rounded-2xl mt-3 shadow">
          <h3 className="font-bold text-sm">➕ নতুন Task Add</h3>
          <div className="flex gap-2 mt-2">
            <input id="taskName" placeholder="Task নাম" className="flex-1 border p-2 rounded-xl text-xs" />
            <input id="taskReward" placeholder="৳" type="number" className="w-16 border p-2 rounded-xl text-xs" />
            <button onClick={()=>{const name=(document.getElementById("taskName") as HTMLInputElement).value; const rew=(document.getElementById("taskReward") as HTMLInputElement).value; if(!name) return; const nt=[...tasks,{id:Date.now(),title:name,reward:Number(rew)||10,status:"pending"}]; setTasks(nt); localStorage.setItem("taskpro_tasks",JSON.stringify(nt))}} className="bg-[#0f7a4a] text-white px-4 rounded-full text-xs">Add</button>
          </div>
        </div>
      </div>
    )
  }

  // ALL FEATURE PAGES - ভিতরে Ad দেখাবে Admin যেটা সেট করবে
  if(open){
    return (
      <div className="min-h-screen bg-[#e8f5e9] pb-10">
        <div className="bg-[#0f7a4a] text-white p-4 flex justify-between items-center"><button onClick={()=>setOpen("")} className="bg-white/20 px-3 py-1 rounded-full text-xs">← Back</button><b className="text-sm">{open}</b><span className="w-8"></span></div>
        <div className="bg-yellow-100 border border-yellow-300 mx-4 mt-4 p-3 rounded-xl text-xs text-center font-bold">📢 AD: {ads}</div>
        <div className="bg-white m-4 rounded-2xl p-5 shadow">
          <h2 className="font-black text-[#0f7a4a]">{open}</h2>
          {open==="Mission" && <div className="mt-4">{tasks.map(t=><div key={t.id} className="flex justify-between py-3 border-b text-sm"><span>{t.title}</span><span className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">৳{t.reward} - {t.status}</span></div>)}</div>}
          {open==="VIP Plan" && <div className="mt-4 space-y-2"><div className="bg-[#e8f5e9] p-4 rounded-xl flex justify-between"><span>VIP 1 - ৳500 - Daily ৳50</span><button className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">Buy</button></div><div className="bg-[#e8f5e9] p-4 rounded-xl flex justify-between"><span>VIP 2 - ৳1000 - Daily ৳120</span><button className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">Buy</button></div></div>}
          {open!=="Mission" && open!=="VIP Plan" && <p className="text-sm text-gray-500 mt-3">{open} এর সব কিছু Admin থেকে কন্ট্রোল হবে। Ad উপরে দেখো - ওটা Admin সেট করেছে।</p>}
        </div>
      </div>
    )
  }

  // BOTTOM TABS
  if(tab!=="home"){
    return (
      <div className="min-h-screen bg-[#e8f5e9] pb-24">
        <div className="bg-[#0f7a4a] text-white p-4 rounded-b-[24px] flex justify-between"><h2 className="font-bold capitalize">{tab}</h2><button onClick={()=>setTab("home")} className="bg-white/20 px-3 py-1 rounded-full text-xs">Home</button></div>
        <div className="bg-yellow-100 border mx-4 mt-4 p-3 rounded-xl text-xs text-center">📢 AD: {ads}</div>
        <div className="bg-white m-4 p-5 rounded-2xl shadow"><p className="font-bold">{tab}</p><p className="text-xs mt-2 text-gray-500">ID: {user.accId} | Balance ৳{user.balance}</p>{tab==="profile"&&<button onClick={()=>{localStorage.removeItem("taskpro_user"); setUser(null)}} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full text-xs">Logout</button>}</div>
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl flex justify-around py-3 shadow"><button onClick={()=>setTab("home")}>🏠 Home</button><button onClick={()=>setTab("missions")}>📚</button><button onClick={()=>setTab("finance")}>📄</button><button onClick={()=>setTab("profile")}>👤</button></div>
      </div>
    )
  }

  // HOME - YOUR SCREENSHOT STYLE
  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-24">
      <div className="bg-[#0f7a4a] text-white px-4 pt-3 pb-6 rounded-b-[28px]">
        <div className="flex justify-between items-center"><span className="font-black tracking-wide">Task & Pro</span>{isAdmin && <button onClick={()=>setTab("admin")} className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1.5 rounded-full animate-pulse">ADMIN PANEL</button>}</div>
        <div className="flex justify-between mt-5 text-xs"><div><p className="opacity-70 text-[10px]">REFERRAL INCOME</p><p className="font-bold text-base">৳{user.balance}.00</p></div><div className="text-right"><p className="opacity-70 text-[10px]">ACCOUNT ID</p><p className="font-bold text-base">{user.accId}</p></div></div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <button onClick={()=>setOpen("Deposit")} className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm text-left"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">+</div><div><p className="text-[10px] text-gray-500">ADD FUND</p><p className="font-bold text-sm">Deposit</p></div></button>
        <button onClick={()=>setOpen("Withdraw")} className="bg-[#fff0f3] rounded-full p-4 flex items-center gap-3 shadow-sm text-left"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">↓</div><div><p className="text-[10px] text-gray-500">CASH OUT</p><p className="font-bold text-sm text-red-500">Withdraw</p></div></button>
        <div className="bg-[#fff8e1] rounded-full p-4 flex items-center gap-3"><div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">↻</div><div><p className="text-[10px] text-gray-500">PENDING</p><p className="font-bold text-sm">৳0.00</p></div></div>
        <div className="bg-[#e8f5e9] rounded-full p-4 flex items-center gap-3 border border-green-200"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">💲</div><div><p className="text-[10px] text-gray-500">APPROVED</p><p className="font-bold text-sm">৳0.00</p></div></div>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-full px-4 py-3 flex items-center gap-2 text-xs shadow-sm"><span>📢</span><span className="truncate">{notice}</span></div>
      <div className="mx-4 mt-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 text-[11px] text-center">AD: {ads}</div>

      <p className="px-6 mt-5 font-black text-[#0f7a4a] text-[11px] tracking-widest">SERVICES & FEATURES</p>
      <div className="px-4 mt-2 grid grid-cols-4 gap-3">
        {["Mission","VIP Plan","Membership","My Team","Lucky Spin","Vault","Lottery","Salary","Support","App","AI Support"].map(n=><button key={n} onClick={()=>setOpen(n)} className="bg-white rounded-[18px] py-4 flex flex-col items-center gap-2 shadow-sm"><div className="w-11 h-11 bg-[#e8f5e9] rounded-xl flex items-center justify-center font-bold text-[#0f7a4a]">{n[0]}</div><p className="text-[9px] font-medium text-center px-1">{n}</p></button>)}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[22px] flex justify-around items-center py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button onClick={()=>setTab("home")} className="flex flex-col items-center text-[#0f7a4a]"><span>🏠</span><span className="text-[9px] font-bold">Home</span></button>
        <button onClick={()=>setTab("missions")} className="flex flex-col items-center text-gray-400"><span>📚</span><span className="text-[9px]">Missions</span></button>
        <button className="w-12 h-12 bg-[#0f7a4a] rounded-full text-white flex items-center justify-center -mt-6 border-4 border-[#e8f5e9]">⊞</button>
        <button onClick={()=>setTab("finance")} className="flex flex-col items-center text-gray-400"><span>📄</span><span className="text-[9px]">Finance</span></button>
        <button onClick={()=>setTab("profile")} className="flex flex-col items-center text-gray-400"><span>👤</span><span className="text-[9px]">Profile</span></button>
      </div>
    </div>
  )
    }
