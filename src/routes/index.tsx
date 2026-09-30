import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: App })

function App(){
  const ADMIN = "fscnajmul2026@gmail.com"
  const [email,setEmail] = useState("")
  const [pass,setPass] = useState("")
  const [user,setUser] = useState<any>(null)
  const [tab,setTab] = useState("home")
  const [cat,setCat] = useState("task1")
  const [ads,setAds] = useState({top:"Top Ad Always", bottom:"Bottom Ad Always", taskAd:"10s Ad"})
  const [subs,setSubs] = useState<any[]>([])
  const [count,setCount] = useState(10)
  const [open,setOpen] = useState(false)
  const [can,setCan] = useState(false)
  const [active,setActive] = useState<any>(null)
  const [form,setForm] = useState<any>({})

  const allTasks = [
    {id:1,cat:"task1",title:"Website Visit 1 Min",reward:10,fields:"Link,Screenshot"},
    {id:2,cat:"task1",title:"Like Comment Share",reward:15,fields:"Post Link,Proof"},
    {id:3,cat:"task2",title:"Facebook ID Sell",reward:150,fields:"Email,Password,Notepad File"},
    {id:4,cat:"task2",title:"Instagram ID Sell",reward:180,fields:"Username,Password,Cookies File"},
    {id:5,cat:"task2",title:"Telegram ID Sell",reward:120,fields:"Number,Session File"},
    {id:6,cat:"task2",title:"WhatsApp ID Sell",reward:200,fields:"Number,QR Proof"},
    {id:7,cat:"task2",title:"Gmail Sell Notepad",reward:100,fields:"Gmail,Password,Recovery,Notepad"},
    {id:8,cat:"task3",title:"Nibha Coin Sell",reward:80,fields:"Amount,Wallet,Hash"},
    {id:9,cat:"task3",title:"NS Coin Sell",reward:90,fields:"Amount,Address,Proof"},
    {id:10,cat:"task3",title:"Top Follow Coin Sell",reward:70,fields:"Amount,ID"},
    {id:11,cat:"task3",title:"Coinstra Coin Sell",reward:110,fields:"Amount,Address"},
    {id:12,cat:"task4",title:"WhatsApp Bind Income Bengali Site",reward:300,fields:"WA Number,Bind Screenshot,Site Link"},
  ]

  useEffect(()=>{
    const u = localStorage.getItem("u")
    if(u) setUser(JSON.parse(u))
    const s = localStorage.getItem("subs")
    if(s) setSubs(JSON.parse(s))
  },[])

  useEffect(()=>{
    if(open && count>0){
      const t = setTimeout(()=>setCount(count-1),1000)
      return ()=>clearTimeout(t)
    }
    if(count===0) setCan(true)
  },[open,count])

  const signup = ()=>{
    if(!email||!pass) return alert("Gmail + Password দাও")
    let all = JSON.parse(localStorage.getItem("all")||"[]")
    let u = {email,pass,balance:0,accId:"#100"+Math.floor(1000+Math.random()*9000),refCode:"RX"+Math.floor(1000+Math.random()*9000)}
    all.push(u)
    localStorage.setItem("all",JSON.stringify(all))
    localStorage.setItem("u",JSON.stringify(u))
    setUser(u)
  }
  const login = ()=>{
    let all = JSON.parse(localStorage.getItem("all")||"[]")
    let f = all.find((x:any)=>x.email===email && x.pass===pass)
    if(!f) return alert("Account নাই")
    localStorage.setItem("u",JSON.stringify(f))
    setUser(f)
  }

  const isAdmin = user?.email===ADMIN
  const filtered = allTasks.filter(t=>t.cat===cat)

  if(!user){
    return(
      <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[24px] p-8">
          <h1 className="text-2xl font-black text-[#0f8a5a]">ROLEX 2.0</h1>
          <p className="text-xs">Gmail + Password Login</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Gmail" className="w-full mt-6 border-2 border-[#0f8a5a] rounded-full p-4 text-sm"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 border-2 border-[#0f8a5a] rounded-full p-4 text-sm"/>
          <button onClick={signup} className="w-full mt-4 bg-[#0f8a5a] text-white py-4 rounded-full font-black">SIGNUP</button>
          <button onClick={login} className="w-full mt-2 border-2 border-[#0f8a5a] py-4 rounded-full font-black">LOGIN</button>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-[#e8f5e9] pb-28">
      <div className="bg-yellow-400 text-black text-center py-1.5 text-[10px] font-bold sticky top-0 z-20">{ads.top}</div>

      <div className="bg-[#0f8a5a] text-white px-4 pt-3 pb-10 rounded-b-[32px]">
        <div className="flex justify-between items-center">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">☰</div>
          <h1 className="font-black text-xl">ROLEX 2.0</h1>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0f8a5a] font-black text-xs">R</div>
        </div>
        <div className="flex justify-between mt-5">
          <div><p className="text-[10px] opacity-70">REFERRAL INCOME</p><p className="font-black text-lg">৳0.00</p></div>
          <div className="text-right"><p className="text-[10px] opacity-70">ACCOUNT ID</p><p className="font-black text-lg">{user.accId}</p></div>
        </div>
      </div>

      <div className="px-4 -mt-7 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[24px] p-4 border flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">+</div><div><p className="text-[10px] opacity-60">ADD FUND</p><p className="font-black">Deposit</p></div></div>
        <div className="bg-white rounded-[24px] p-4 border flex items-center gap-3"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">↓</div><div><p className="text-[10px] opacity-60">CASH OUT</p><p className="font-black text-red-600">Withdraw</p></div></div>
        <div className="bg-white rounded-[24px] p-4 border flex items-center gap-3"><div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">◷</div><div><p className="text-[10px] opacity-60">PENDING</p><p className="font-black">৳0.00</p></div></div>
        <div className="bg-white rounded-[24px] p-4 border flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">$</div><div><p className="text-[10px] opacity-60">APPROVED</p><p className="font-black">৳0.00</p></div></div>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-[20px] p-3 border flex justify-between items-center">
        <div><p className="text-[10px] opacity-60">BALANCE</p><p className="font-black text-xl">৳{user.balance}</p></div>
        <div className="bg-yellow-400 rounded-xl px-3 py-2 text-center"><p className="text-[8px] font-black">SIDE AD</p><p className="text-[8px]">{ads.bottom}</p></div>
      </div>

      <div className="mx-4 mt-3 bg-[#0f8a5a] text-white rounded-[16px] p-3 text-center text-xs">Bottom Ad Always: {ads.bottom}</div>

      {tab==="home"&&(
        <div className="px-4 mt-5">
          <p className="text-[#0f8a5a] font-black text-[12px]">SERVICES & FEATURES</p>
          <div className="grid grid-cols-4 gap-3 mt-3">
            <button onClick={()=>setTab("task")} className="bg-white rounded-[20px] p-3 border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-[#0f8a5a] rounded-[16px] flex items-center justify-center text-white">☰</div><p className="text-[10px] font-bold">Mission</p></button>
            <button className="bg-white rounded-[20px] p-3 border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">👑</div><p className="text-[10px] font-bold">VIP Plan</p></button>
            <button className="bg-white rounded-[20px] p-3 border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">💳</div><p className="text-[10px] font-bold">Membership</p></button>
            <button onClick={()=>setTab("refer")} className="bg-white rounded-[20px] p-3 border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">👥</div><p className="text-[10px] font-bold">My Team</p></button>
            <button onClick={()=>setTab("support")} className="bg-white rounded-[20px] p-3 border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">🎧</div><p className="text-[10px] font-bold">Support</p></button>
            <button onClick={()=>setTab("withdraw")} className="bg-white rounded-[20px] p-3 border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">💸</div><p className="text-[10px] font-bold">Withdraw</p></button>
            <button className="bg-white rounded-[20px] p-3 border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">🤖</div><p className="text-[10px] font-bold">AI Support</p></button>
            <button className="bg-white rounded-[20px] p-3 border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">📱</div><p className="text-[10px] font-bold">App</p></button>
          </div>
          <div className="mt-6 bg-white rounded-[20px] p-4 border"><p className="text-[#0f8a5a] font-black text-xs">INVITE FRIENDS & EARN</p><p className="text-[11px] mt-2">Invite Code: {user.refCode}</p></div>
        </div>
      )}

      {tab==="task"&&(
        <div className="px-4 mt-4">
          <button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-5 py-2 rounded-full text-sm">Back Home</button>
          <div className="flex gap-2 overflow-auto mt-4 pb-2">
            <button onClick={()=>setCat("task1")} className={`px-4 py-2 rounded-full text-xs font-bold border ${cat==="task1"?"bg-[#0f8a5a] text-white":"bg-white"}`}>Task1 Visit Like Share</button>
            <button onClick={()=>setCat("task2")} className={`px-4 py-2 rounded-full text-xs font-bold border ${cat==="task2"?"bg-[#0f8a5a] text-white":"bg-white"}`}>Task2 ID Sell FB Insta Gmail</button>
            <button onClick={()=>setCat("task3")} className={`px-4 py-2 rounded-full text-xs font-bold border ${cat==="task3"?"bg-[#0f8a5a] text-white":"bg-white"}`}>Task3 Coin Sell</button>
            <button onClick={()=>setCat("task4")} className={`px-4 py-2 rounded-full text-xs font-bold border ${cat==="task4"?"bg-[#0f8a5a] text-white":"bg-white"}`}>Task4 WA Bind</button>
          </div>
          <div className="mt-4 space-y-3">
            {filtered.map(t=>(
              <div key={t.id} className="bg-white rounded-[20px] p-4 border">
                <div className="flex justify-between"><span className="text-[9px] bg-[#0f8a5a] text-white px-2 py-1 rounded-full">{t.cat}</span><span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">৳{t.reward}</span></div>
                <p className="font-bold text-sm mt-2">{t.title}</p>
                <p className="text-[10px] text-gray-400">File: {t.fields}</p>
                <button onClick={()=>{setActive(t); setForm({}); setCount(10); setCan(false); setOpen(true)}} className="w-full mt-3 bg-[#0f8a5a] text-white py-3 rounded-full text-xs font-bold">START 10s Ad</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="refer"&&<div className="px-4 mt-4"><button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-5 py-2 rounded-full">Back</button><div className="bg-white rounded-[20px] p-6 border mt-4 text-center"><p className="font-black">Refer Income - সবাই Income</p><p className="text-2xl mt-4 font-black">{user.refCode}</p><p className="text-xs mt-2">rolex-bd-site.com/ref/{user.refCode}</p></div></div>}
      {tab==="withdraw"&&<div className="px-4 mt-4"><button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-5 py-2 rounded-full">Back</button><div className="bg-white rounded-[20px] p-6 border mt-4"><p className="font-black">Withdraw - Balance + Pending</p><p className="text-2xl mt-2">৳{user.balance}</p><p className="text-xs mt-4">Pending: ৳0.00 Approved: ৳0.00</p></div></div>}
      {tab==="support"&&<div className="px-4 mt-4"><button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-5 py-2 rounded-full">Back</button><div className="bg-white rounded-[20px] p-6 border mt-4"><p className="font-black">Support Direct + AI</p><button className="w-full mt-4 bg-[#0f8a5a] text-white py-3 rounded-full">Telegram Direct</button><button className="w-full mt-2 border-2 border-[#0f8a5a] py-3 rounded-full">AI Chat</button></div></div>}

      {isAdmin&&tab==="home"&&<div className="px-4 mt-6"><div className="bg-black text-white rounded-[20px] p-4"><p className="font-black text-sm">ADMIN PANEL</p><p className="text-xs mt-2">File Inbox: {subs.length} টা Gmail/Notepad/Cookie জমা</p>{subs.map((s:any)=><div key={s.id} className="bg-white/10 p-2 rounded-xl mt-2 text-xs"><p>{s.title} - {s.email}</p><p className="text-[10px] break-all">{JSON.stringify(s.data).slice(0,100)}</p><button onClick={()=>{let all=JSON.parse(localStorage.getItem("all")||"[]"); all=all.map((u:any)=>u.email===s.email?{...u,balance:u.balance+s.reward}:u); localStorage.setItem("all",JSON.stringify(all)); setSubs(subs.filter((x:any)=>x.id!==s.id)); localStorage.setItem("subs",JSON.stringify(subs.filter((x:any)=>x.id!==s.id))); if(user.email===s.email) setUser({...user,balance:user.balance+s.reward})}} className="bg-green-500 text-black px-3 py-1 rounded-full mt-1">Approve ৳{s.reward}</button></div>)}</div></div>}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-[24px] flex justify-around py-3 z-30">
        <button onClick={()=>setTab("home")} className={`flex flex-col items-center ${tab==="home"?"text-[#0f8a5a]":"opacity-40"}`}><span>🏠</span><span className="text-[9px] font-black">Home</span></button>
        <button onClick={()=>setTab("task")} className={`flex flex-col items-center ${tab==="task"?"text-[#0f8a5a]":"opacity-40"}`}><span>📋</span><span className="text-[9px] font-black">Tasks</span></button>
        <button className="w-12 h-12 bg-[#0f8a5a] rounded-full flex items-center justify-center text-white -mt-5">⊞</button>
        <button onClick={()=>setTab("withdraw")} className={`flex flex-col items-center ${tab==="withdraw"?"text-[#0f8a5a]":"opacity-40"}`}><span>💸</span><span className="text-[9px]">Finance</span></button>
        <button className="flex flex-col items-center opacity-40"><span>👤</span><span className="text-[9px]">Profile</span></button>
      </div>

      {open&&active&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[24px] w-full max-w-sm p-6">
            <h2 className="font-bold text-sm">{ads.taskAd} - {count}s</h2>
            <div className="bg-yellow-50 border-2 border-dashed rounded-[16px] p-4 mt-3">
              <p className="text-xs">{ads.taskAd}</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-2"><div className="bg-[#0f8a5a] h-2 rounded-full" style={{width:(10-count)*10+"%"}}></div></div>
              <p className="text-[10px] mt-1">না দেখলে Count হবে না</p>
            </div>
            <p className="text-2xl font-black text-center mt-3">{count>0?count:"Done"}</p>
            {can&&(
              <div className="mt-4">
                <p className="text-xs font-bold">File জমা: {active.title}</p>
                {active.fields.split(",").map((f:string)=>(
                  <textarea key={f} value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f+" - Notepad/Cookie File"} className="w-full border-2 rounded-[12px] p-3 mt-2 text-xs"/>
                ))}
                <button onClick={()=>{
                  const sub = {id:Date.now(),email:user.email,title:active.title,reward:active.reward,cat:active.cat,data:form}
                  const nd = [...subs,sub]
                  setSubs(nd)
                  localStorage.setItem("subs",JSON.stringify(nd))
                  alert("Admin এ জমা হয়েছে ৳"+active.reward)
                  setOpen(false)
                }} className="w-full mt-4 bg-[#0f8a5a] text-white py-3 rounded-full font-bold">Submit Admin এ জমা ৳{active.reward}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
