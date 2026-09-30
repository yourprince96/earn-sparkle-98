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
  const [subs,setSubs] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [count,setCount] = useState(10)
  const [can,setCan] = useState(false)
  const [active,setActive] = useState<any>(null)
  const [form,setForm] = useState<any>({})

  const tasks = [
    {id:1,cat:"task1",title:"Website Visit",reward:10,fields:"Link,Screenshot"},
    {id:2,cat:"task1",title:"Like Comment Share",reward:15,fields:"Link,Proof"},
    {id:3,cat:"task2",title:"Facebook ID Sell",reward:150,fields:"Email,Password,Notepad"},
    {id:4,cat:"task2",title:"Instagram ID Sell",reward:180,fields:"Username,Password,Cookies"},
    {id:5,cat:"task2",title:"Gmail Sell",reward:100,fields:"Gmail,Password,Notepad File"},
    {id:6,cat:"task3",title:"Nibha Coin Sell",reward:80,fields:"Amount,Wallet,Hash"},
    {id:7,cat:"task3",title:"NS Coin / Top Follow / Coinstra",reward:90,fields:"Amount,Address,Proof"},
    {id:8,cat:"task4",title:"WhatsApp Bind Bengali Site",reward:300,fields:"WA Number,Bind Screenshot,Link"},
  ]

  useEffect(()=>{
    const u = localStorage.getItem("rolex_u")
    if(u) setUser(JSON.parse(u))
    const s = localStorage.getItem("rolex_subs")
    if(s) setSubs(JSON.parse(s))
  },[])

  useEffect(()=>{
    if(open && count>0){
      const t = setTimeout(()=>setCount(c=>c-1),1000)
      return ()=>clearTimeout(t)
    }
    if(count===0) setCan(true)
  },[open,count])

  const signup = ()=>{
    if(!email||!pass) return alert("Gmail Password দাও")
    let all = JSON.parse(localStorage.getItem("rolex_all")||"[]")
    let u = {email,pass,balance:500,accId:"#100"+Math.floor(Math.random()*9000),refCode:"RX"+Math.floor(Math.random()*9000)}
    all.push(u)
    localStorage.setItem("rolex_all",JSON.stringify(all))
    localStorage.setItem("rolex_u",JSON.stringify(u))
    setUser(u)
  }

  const login = ()=>{
    if(!email||!pass) return alert("Gmail Password দাও")
    let all = JSON.parse(localStorage.getItem("rolex_all")||"[]")
    let f = all.find((x:any)=>x.email===email && x.pass===pass)
    if(!f && email===ADMIN){
      let u = {email,pass,balance:10000,accId:"#1003269",refCode:"ADMIN"}
      all.push(u)
      localStorage.setItem("rolex_all",JSON.stringify(all))
      localStorage.setItem("rolex_u",JSON.stringify(u))
      setUser(u)
      return
    }
    if(!f) return alert("Account নাই, Signup করো")
    localStorage.setItem("rolex_u",JSON.stringify(f))
    setUser(f)
  }

  const isAdmin = user?.email===ADMIN
  const filtered = tasks.filter(t=>t.cat===cat)

  if(!user){
    return(
      <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-6">
        <div className="bg-white rounded-[24px] p-8 w-full max-w-sm">
          <h1 className="text-2xl font-black text-[#0f8a5a]">ROLEX 2.0</h1>
          <p className="text-xs">Admin: {ADMIN}</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Gmail" className="w-full mt-6 border-2 rounded-full p-4 text-sm"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 border-2 rounded-full p-4 text-sm"/>
          <button onClick={signup} className="w-full mt-4 bg-[#0f8a5a] text-white py-4 rounded-full font-black">SIGNUP</button>
          <button onClick={login} className="w-full mt-2 border-2 py-4 rounded-full font-black">LOGIN</button>
        </div>
      </div>
    )
  }

  if(tab==="admin"){
    return(
      <div className="min-h-screen bg-white p-4">
        <button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-5 py-2 rounded-full">← Home</button>
        <h1 className="font-black text-xl mt-4">ADMIN PANEL - Ready</h1>
        <p className="text-xs text-green-600">File জমা - Gmail/Notepad/Cookie/Coin সব এখানে</p>
        {subs.length===0?<p className="text-xs mt-4 text-gray-400">No File</p>:subs.map((s:any)=>(
          <div key={s.id} className="bg-gray-50 border p-3 rounded-xl mt-3 text-xs">
            <p className="font-bold">{s.title} - {s.email} - ৳{s.reward}</p>
            <p className="break-all text-[11px] mt-1">{JSON.stringify(s.data).slice(0,200)}</p>
            <button onClick={()=>{
              let all=JSON.parse(localStorage.getItem("rolex_all")||"[]")
              all=all.map((u:any)=>u.email===s.email?{...u,balance:u.balance+s.reward}:u)
              localStorage.setItem("rolex_all",JSON.stringify(all))
              const nd=subs.filter((x:any)=>x.id!==s.id)
              setSubs(nd)
              localStorage.setItem("rolex_subs",JSON.stringify(nd))
            }} className="bg-green-600 text-white px-4 py-2 rounded-full mt-2">Approve ৳{s.reward}</button>
          </div>
        ))}
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-[#e8f5e9] pb-24">
      <div className="bg-yellow-400 text-center py-1.5 text-[10px] font-bold">Top Small Ad Always</div>

      <div className="bg-[#0f8a5a] text-white px-4 pt-4 pb-10 rounded-b-[32px]">
        <div className="flex justify-between">
          <h1 className="font-black text-xl">ROLEX 2.0</h1>
          <p className="text-xs bg-white/20 px-3 py-1 rounded-full">{user.accId}</p>
        </div>
        <div className="flex justify-between mt-4">
          <div><p className="text-[10px] opacity-70">BALANCE</p><p className="font-black text-lg">৳{user.balance}</p></div>
          <div><p className="text-[10px] opacity-70">REF CODE</p><p className="font-black">{user.refCode}</p></div>
        </div>
      </div>

      <div className="px-4 -mt-6 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[20px] p-4 border"><p className="text-[10px]">ADD FUND</p><p className="font-black">Deposit</p></div>
        <div className="bg-white rounded-[20px] p-4 border"><p className="text-[10px]">CASH OUT</p><p className="font-black">Withdraw</p></div>
      </div>

      <div className="mx-4 mt-3 bg-white rounded-[16px] p-3 text-center text-xs border">Bottom Small Ad Always - {user.balance} ৳ Balance</div>

      {tab==="home"&&(
        <div className="px-4 mt-5">
          <p className="text-[#0f8a5a] font-black text-xs">SERVICES & FEATURES</p>
          <div className="grid grid-cols-4 gap-3 mt-3">
            <button onClick={()=>setTab("task")} className="bg-white rounded-[16px] p-3 border"><p className="text-xl">☰</p><p className="text-[10px] font-bold">Mission</p></button>
            <button onClick={()=>setTab("refer")} className="bg-white rounded-[16px] p-3 border"><p className="text-xl">👥</p><p className="text-[10px] font-bold">My Team</p></button>
            <button onClick={()=>setTab("support")} className="bg-white rounded-[16px] p-3 border"><p className="text-xl">🎧</p><p className="text-[10px] font-bold">Support</p></button>
            <button onClick={()=>setTab("withdraw")} className="bg-white rounded-[16px] p-3 border"><p className="text-xl">💸</p><p className="text-[10px] font-bold">Withdraw</p></button>
            <button className="bg-white rounded-[16px] p-3 border"><p className="text-xl">🤖</p><p className="text-[10px] font-bold">AI</p></button>
            {isAdmin&&<button onClick={()=>setTab("admin")} className="bg-yellow-400 rounded-[16px] p-3 border"><p className="text-xl">👑</p><p className="text-[10px] font-black">ADMIN</p></button>}
          </div>
          {isAdmin&&<button onClick={()=>setTab("admin")} className="w-full mt-4 bg-black text-yellow-400 py-3 rounded-full font-black">ADMIN PANEL ঢুকো</button>}
        </div>
      )}

      {tab==="task"&&(
        <div className="px-4 mt-4">
          <button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full text-sm">← Home</button>
          <div className="flex gap-2 overflow-auto mt-3">
            <button onClick={()=>setCat("task1")} className={`px-3 py-2 rounded-full text-xs border ${cat==="task1"?"bg-[#0f8a5a] text-white":"bg-white"}`}>Task1 Visit Like</button>
            <button onClick={()=>setCat("task2")} className={`px-3 py-2 rounded-full text-xs border ${cat==="task2"?"bg-[#0f8a5a] text-white":"bg-white"}`}>Task2 ID Sell Gmail</button>
            <button onClick={()=>setCat("task3")} className={`px-3 py-2 rounded-full text-xs border ${cat==="task3"?"bg-[#0f8a5a] text-white":"bg-white"}`}>Task3 Coin Sell</button>
            <button onClick={()=>setCat("task4")} className={`px-3 py-2 rounded-full text-xs border ${cat==="task4"?"bg-[#0f8a5a] text-white":"bg-white"}`}>Task4 WA Bind</button>
          </div>
          <div className="mt-4 space-y-3">
            {filtered.map(t=>(
              <div key={t.id} className="bg-white rounded-[16px] p-4 border">
                <div className="flex justify-between"><span className="text-[9px] bg-[#0f8a5a] text-white px-2 py-1 rounded-full">{t.cat}</span><span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">৳{t.reward}</span></div>
                <p className="font-bold text-sm mt-2">{t.title}</p>
                <p className="text-[10px] text-gray-400">{t.fields}</p>
                <button onClick={()=>{setActive(t); setCount(10); setCan(false); setOpen(true); setForm({})}} className="w-full mt-3 bg-[#0f8a5a] text-white py-2 rounded-full text-xs">START 10s Ad</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="refer"&&<div className="px-4 mt-4"><button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full">← Back</button><div className="bg-white rounded-[20px] p-6 border mt-4 text-center"><p className="font-black">Refer Income - সবাই Income</p><p className="text-2xl mt-2">{user.refCode}</p></div></div>}
      {tab==="withdraw"&&<div className="px-4 mt-4"><button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full">← Back</button><div className="bg-white rounded-[20px] p-6 border mt-4"><p className="font-black">Withdraw - Balance + Pending</p><p className="text-xl mt-2">৳{user.balance}</p></div></div>}
      {tab==="support"&&<div className="px-4 mt-4"><button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full">← Back</button><div className="bg-white rounded-[20px] p-6 border mt-4"><p className="font-black">Support Direct + AI</p></div></div>}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-[24px] flex justify-around py-3">
        <button onClick={()=>setTab("home")} className="flex flex-col items-center"><span>🏠</span><span className="text-[9px]">Home</span></button>
        <button onClick={()=>setTab("task")} className="flex flex-col items-center"><span>📋</span><span className="text-[9px]">Tasks</span></button>
        <button onClick={()=>setTab("home")} className="w-10 h-10 bg-[#0f8a5a] rounded-full text-white -mt-4 flex items-center justify-center">⊞</button>
        <button onClick={()=>setTab("withdraw")} className="flex flex-col items-center"><span>💸</span><span className="text-[9px]">Finance</span></button>
        <button onClick={()=>{if(isAdmin) setTab("admin"); else setTab("home")}} className="flex flex-col items-center"><span>👑</span><span className="text-[9px]">{isAdmin?"ADMIN":"Profile"}</span></button>
      </div>

      {open&&active&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[20px] w-full max-w-sm p-5">
            <p className="font-bold text-sm">10s Ad - {count}s</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2"><div className="bg-[#0f8a5a] h-2 rounded-full" style={{width:(10-count)*10+"%"}}></div></div>
            <p className="text-center text-xl mt-2 font-black">{count>0?count:"Done"}</p>
            {can&&(
              <div className="mt-3">
                <p className="text-xs font-bold">{active.title} - File জমা</p>
                {active.fields.split(",").map((f:string)=><textarea key={f} value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f+" Paste করো - Notepad/Cookie"} className="w-full border rounded-xl p-2 mt-2 text-xs"/>)}
                <button onClick={()=>{
                  const nd=[...subs,{id:Date.now(),email:user.email,title:active.title,reward:active.reward,cat:active.cat,data:form}]
                  setSubs(nd)
                  localStorage.setItem("rolex_subs",JSON.stringify(nd))
                  alert("Admin এ জমা হয়েছে")
                  setOpen(false)
                }} className="w-full mt-3 bg-[#0f8a5a] text-white py-3 rounded-full font-bold">Submit Admin এ জমা ৳{active.reward}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
    }
