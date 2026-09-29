import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: TaskProFinal })

function TaskProFinal(){
  const ADMIN = "fscnajmul2026@gmail.com"
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [user,setUser]=useState<any>(null)
  const [tab,setTab]=useState("home")
  const [open,setOpen]=useState("")
  const [tasks,setTasks]=useState([
    {id:1,title:"YouTube Subscribe 1min",reward:25,status:"pending",proof:""},
    {id:2,title:"Facebook Page Like",reward:15,status:"pending",proof:""},
    {id:3,title:"TikTok Follow",reward:20,status:"pending",proof:""}
  ])
  const [ads,setAds]=useState("🔥 Today Bonus 100% - Admin Controlled Ad")

  useEffect(()=>{
    const s=localStorage.getItem("taskpro_final")
    if(s) setUser(JSON.parse(s))
  },[])

  const login=()=>{
    if(!email ||!pass) return alert("Email & Password দাও")
    const u={email,accId:"#100"+Math.floor(100000+Math.random()*900000),bal:0}
    localStorage.setItem("taskpro_final",JSON.stringify(u))
    setUser(u)
  }

  const isAdmin = user?.email===ADMIN

  if(!user){
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-sm rounded-[28px] p-6 shadow-xl">
          <div className="w-12 h-12 bg-[#0f7a4a] rounded-2xl flex items-center justify-center text-white font-black">T</div>
          <h1 className="text-2xl font-black mt-3 text-[#0f7a4a]">Task & Pro</h1>
          <p className="text-xs text-gray-400 mt-1">Login to continue</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-5 border rounded-xl p-3 text-sm outline-none" />
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 border rounded-xl p-3 text-sm outline-none" />
          <button onClick={login} className="w-full mt-5 bg-[#0f7a4a] text-white py-3 rounded-full font-bold">LOGIN</button>
        </div>
      </div>
    )
  }

  if(tab==="admin" && isAdmin){
    return (
      <div className="min-h-screen bg-white p-4 pb-20">
        <button onClick={()=>setTab("home")} className="bg-black text-white px-4 py-2 rounded-full text-sm">← Back</button>
        <h2 className="font-black text-xl mt-4">ADMIN PANEL - Task & Pro</h2>
        <p className="text-xs text-green-600">{user.email} (Only You)</p>

        <div className="mt-4 bg-white border p-4 rounded-2xl">
          <h3 className="font-bold text-sm">📢 Ad Control - সব পেজে দেখাবে</h3>
          <textarea value={ads} onChange={e=>setAds(e.target.value)} className="w-full border rounded-xl p-3 mt-2 text-xs h-20"></textarea>
          <button onClick={()=>alert("Ad Saved - সব জায়গায় দেখাবে")} className="bg-[#0f7a4a] text-white px-4 py-2 rounded-full text-xs mt-2">Save Ad</button>
        </div>

        <div className="mt-3 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl">
          <h3 className="font-bold text-sm">💸 Withdraw Live</h3>
          <div className="bg-white p-3 rounded-xl mt-2 text-xs flex justify-between"><span>#1003269 - ৳800</span><button className="bg-green-600 text-white px-3 py-1 rounded-full">Approve</button></div>
        </div>

        <div className="mt-3 bg-green-50 border p-4 rounded-2xl">
          <h3 className="font-bold text-sm">💰 Deposit Approve</h3>
          <div className="bg-white p-3 rounded-xl mt-2 text-xs flex justify-between"><span>#1007754 - ৳500</span><button className="bg-black text-white px-3 py-1 rounded-full">Approve</button></div>
        </div>

        <div className="mt-3 bg-white border p-4 rounded-2xl">
          <h3 className="font-bold text-sm">✅ Task Proof Check - Pending থেকে Approve</h3>
          {tasks.filter(t=>t.status==="submitted").length===0 && <p className="text-xs text-gray-400 mt-2">কোন Pending Task নেই</p>}
          {tasks.filter(t=>t.status==="submitted").map(t=>(
            <div key={t.id} className="bg-gray-50 p-3 rounded-xl mt-2 text-xs">
              <p className="font-bold">{t.title}</p><p className="text-blue-600 break-all">Proof: {t.proof}</p>
              <button onClick={()=>setTasks(tasks.map(x=>x.id===t.id?{...x,status:"approved"}:x))} className="bg-blue-600 text-white px-4 py-1 rounded-full mt-2">Approve - ৳{t.reward}</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if(open){
    return (
      <div className="min-h-screen bg-[#e8f5e9] pb-10">
        <div className="bg-[#0f7a4a] text-white p-4 flex justify-between items-center"><button onClick={()=>setOpen("")} className="bg-white/20 px-3 py-1 rounded-full text-xs">← Back</button><b className="text-sm">{open}</b><div className="w-8"></div></div>
        <div className="bg-yellow-100 border border-yellow-300 mx-4 mt-4 p-3 rounded-xl text-xs text-center font-bold">📢 AD: {ads}</div>
        <div className="bg-white m-4 rounded-2xl p-5 shadow-sm">
          {open==="Mission" && (
            <div>
              <h2 className="font-black text-[#0f7a4a]">All Tasks - Proof Paste করো</h2>
              <div className="mt-4 space-y-3">
                {tasks.map(t=>(
                  <div key={t.id} className="border rounded-2xl p-4">
                    <div className="flex justify-between"><p className="font-bold text-sm">{t.title}</p><span className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">৳{t.reward}</span></div>
                    <p className="text-[10px] mt-1">Status: <b className={t.status==="approved"?"text-green-600":"text-orange-500"}>{t.status}</b></p>
                    {t.status==="pending" && <>
                      <input id={`proof-${t.id}`} placeholder="Proof link / screenshot link paste করো" className="w-full border rounded-xl p-2.5 mt-3 text-xs" />
                      <button onClick={()=>{const el=document.getElementById(`proof-${t.id}`) as HTMLInputElement; if(!el.value) return alert("Proof দাও"); setTasks(tasks.map(x=>x.id===t.id?{...x,status:"submitted",proof:el.value}:x)); alert("Submitted! Admin দেখবে")}} className="w-full mt-2 bg-black text-white py-2.5 rounded-full text-xs font-bold">Submit Proof</button>
                    </>}
                    {t.status==="submitted" && <p className="text-xs text-orange-500 mt-3 font-bold">⏳ Pending - Admin Approve করবে</p>}
                    {t.status==="approved" && <p className="text-xs text-green-600 mt-3 font-bold">✅ Approved - Balance এ Add হয়েছে</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {open!=="Mission" && <><h2 className="font-black text-[#0f7a4a]">{open}</h2><p className="text-sm text-gray-500 mt-3">{open} পেজ - সব কিছু Admin থেকে কন্ট্রোল হবে। উপরে Ad টা Admin সেট করেছে।</p></>}
        </div>
      </div>
    )
  }

  if(tab!=="home"){
    return (
      <div className="min-h-screen bg-[#e8f5e9] pb-24">
        <div className="bg-[#0f7a4a] text-white p-4 rounded-b-[24px] flex justify-between"><h2 className="font-bold capitalize">{tab}</h2><button onClick={()=>setTab("home")} className="bg-white/20 px-3 py-1 rounded-full text-xs">Home</button></div>
        <div className="bg-yellow-100 border mx-4 mt-4 p-3 rounded-xl text-xs text-center">📢 AD: {ads}</div>
        <div className="bg-white m-4 p-5 rounded-2xl"><p className="font-bold">{tab} Page</p><p className="text-xs mt-2">ID: {user.accId} | Balance: ৳{user.bal}</p>{tab==="profile"&&<><p className="text-xs mt-2">{user.email}</p><button onClick={()=>{localStorage.removeItem("taskpro_final"); setUser(null)}} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full text-xs">Logout</button></>}</div>
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl flex justify-around py-3 shadow"><button onClick={()=>setTab("home")}>🏠 Home</button><button onClick={()=>setTab("missions")}>📚 Missions</button><button onClick={()=>setTab("finance")}>📄 Finance</button><button onClick={()=>setTab("profile")}>👤 Profile</button></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-24">
      <div className="bg-[#0f7a4a] text-white px-4 pt-3 pb-6 rounded-b-[28px]">
        <div className="flex justify-between items-center"><span className="font-black">Task & Pro</span>{isAdmin && <button onClick={()=>setTab("admin")} className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1.5 rounded-full animate-pulse">ADMIN PANEL</button>}</div>
        <div className="flex justify-between mt-5 text-xs"><div><p className="opacity-70 text-[10px]">REFERRAL INCOME</p><p className="font-bold text-base">৳{user.bal}.00</p></div><div className="text-right"><p className="opacity-70 text-[10px]">ACCOUNT ID</p><p className="font-bold text-base">{user.accId}</p></div></div>
      </div>
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <button onClick={()=>setOpen("Deposit")} className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm text-left"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">+</div><div><p className="text-[10px] text-gray-500">ADD FUND</p><p className="font-bold text-sm">Deposit</p></div></button>
        <button onClick={()=>setOpen("Withdraw")} className="bg-[#fff0f3] rounded-full p-4 flex items-center gap-3 shadow-sm text-left"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">↓</div><div><p className="text-[10px] text-gray-500">CASH OUT</p><p className="font-bold text-sm text-red-500">Withdraw</p></div></button>
        <div className="bg-[#fff8e1] rounded-full p-4 flex items-center gap-3"><div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">↻</div><div><p className="text-[10px] text-gray-500">PENDING</p><p className="font-bold text-sm">৳0.00</p></div></div>
        <div className="bg-[#e8f5e9] rounded-full p-4 flex items-center gap-3 border border-green-200"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">💲</div><div><p className="text-[10px] text-gray-500">APPROVED</p><p className="font-bold text-sm">৳0.00</p></div></div>
      </div>
      <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2.5 text-[11px] text-center font-bold">📢 {ads}</div>
      <p className="px-6 mt-5 font-black text-[#0f7a4a] text-[11px] tracking-widest">SERVICES & FEATURES</p>
      <div className="px-4 mt-2 grid grid-cols-4 gap-3">
        {["Mission","VIP Plan","Membership","My Team","Lucky Spin","Vault","Lottery","Salary","Support","App","AI Support"].map(n=>(
          <button key={n} onClick={()=>setOpen(n)} className="bg-white rounded-[18px] py-4 flex flex-col items-center gap-2 shadow-sm active:scale-95"><div className="w-11 h-11 bg-[#e8f5e9] rounded-xl flex items-center justify-center font-bold text-[#0f7a4a]">{n[0]}</div><p className="text-[9px] font-medium text-center px-1">{n}</p></button>
        ))}
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
