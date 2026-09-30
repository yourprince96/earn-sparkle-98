import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: RolexFinal })

function RolexFinal(){
  const ADMIN="fscnajmul2026@gmail.com"
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [user,setUser]=useState<any>(null)
  const [tab,setTab]=useState("home")
  const [missionTab,setMissionTab]=useState("task1")
  const [ads,setAds]=useState({top:"Top Small Ad - Adsterra Always",bottom:"Bottom Small Ad - Adsterra",taskAd:"10s Video Ad - Must Watch Before Task Count"})
  const [tasks,setTasks]=useState([
    {id:1,cat:"task1",title:"Website Visit 1 Min",reward:10,active:true,fields:"Website Link,Screenshot Proof"},
    {id:2,cat:"task1",title:"Facebook Page Like",reward:15,active:true,fields:"FB Link,Like Screenshot"},
    {id:3,cat:"task1",title:"YouTube Comment + Share",reward:20,active:true,fields:"Video Link,Comment Screenshot,Share Proof"},
    {id:4,cat:"task2",title:"Facebook ID Sell - Cookie File জমা",reward:180,active:true,fields:"FB Profile Link,Email,Password,c_user,xs,Notepad File"},
    {id:5,cat:"task2",title:"Instagram ID Sell",reward:200,active:true,fields:"Insta Username,Password,sessionid,Cookies File"},
    {id:6,cat:"task2",title:"Telegram ID Sell",reward:120,active:true,fields:"Telegram Number,Session File,Proof"},
    {id:7,cat:"task2",title:"WhatsApp ID Sell",reward:200,active:true,fields:"WhatsApp Number,QR Code,Proof"},
    {id:8,cat:"task2",title:"Gmail Sell - Notepad জমা Admin এ",reward:100,active:true,fields:"Gmail,Password,Recovery Email,Notepad Upload"},
    {id:9,cat:"task3",title:"Nibha Coin Sell - Wallet জমা",reward:80,active:true,fields:"Nibha Amount,Wallet Address,Hash,Proof"},
    {id:10,cat:"task3",title:"NS Coin Sell",reward:90,active:true,fields:"NS Coin Amount,Address,Tx Proof"},
    {id:11,cat:"task3",title:"Top Follow Coin Sell",reward:70,active:true,fields:"Top Follow Amount,ID,Proof"},
    {id:12,cat:"task3",title:"Coinstra Coin Sell - Coin জমা Admin এ",reward:110,active:true,fields:"Coinstra Amount,Address,Hash"},
    {id:13,cat:"task4",title:"WhatsApp Bind Income - Bengali Site Bind",reward:300,active:true,fields:"WhatsApp Number,Bind Screenshot,Bengali Site Link,Proof"},
    {id:14,cat:"task4",title:"WhatsApp Unband Income",reward:250,active:true,fields:"Band Number,Unband Proof,Bind Screenshot"},
  ])
  const [subs,setSubs]=useState<any[]>([])
  const [withdraws,setWithdraws]=useState<any[]>([])
  const [features,setFeatures]=useState<any>({task1:true,task2:true,task3:true,task4:true})
  const [packages,setPackages]=useState([
    {id:1,name:"VIP 1",price:500,daily:60,active:true},
    {id:2,name:"VIP 2",price:1500,daily:200,active:true},
    {id:3,name:"VIP 3",price:5000,daily:750,active:true},
  ])
  const [count,setCount]=useState(10)
  const [adOpen,setAdOpen]=useState(false)
  const [canDo,setCanDo]=useState(false)
  const [active,setActive]=useState<any>(null)
  const [form,setForm]=useState<any>({})

  useEffect(()=>{
    try{
      const u=localStorage.getItem("rolex_user")
      if(u) setUser(JSON.parse(u))
      const d=JSON.parse(localStorage.getItem("rolex_data")||"{}")
      if(d.tasks) setTasks(d.tasks)
      if(d.subs) setSubs(d.subs)
      if(d.withdraws) setWithdraws(d.withdraws)
      if(d.ads) setAds(d.ads)
      if(d.features) setFeatures(d.features)
      if(d.packages) setPackages(d.packages)
    }catch{}
  },[])

  const save=(o:any)=>localStorage.setItem("rolex_data",JSON.stringify({tasks,subs,withdraws,ads,features,packages,...o}))

  useEffect(()=>{
    if(adOpen && count>0){
      const t=setTimeout(()=>setCount(c=>c-1),1000)
      return()=>clearTimeout(t)
    }
    if(count===0) setCanDo(true)
  },[adOpen,count])

  const signup=()=>{
    if(!email||!pass) return alert("Gmail + Password দাও ভাই")
    let all=JSON.parse(localStorage.getItem("rolex_all")||"[]")
    if(all.find((x:any)=>x.email===email)) return alert("Account আছে, Login করো")
    let u={email,pass,balance:0,refBal:0,accId:"#100"+Math.floor(1000+Math.random()*9000),refCode:"RX"+Math.random().toString(36).substring(2,7).toUpperCase(),pending:0,approved:0}
    all=[...all,u]
    localStorage.setItem("rolex_all",JSON.stringify(all))
    localStorage.setItem("rolex_user",JSON.stringify(u))
    setUser(u)
  }
  const login=()=>{
    let all=JSON.parse(localStorage.getItem("rolex_all")||"[]")
    let f=all.find((x:any)=>x.email===email && x.pass===pass)
    if(!f) return alert("Gmail/Password ভুল")
    localStorage.setItem("rolex_user",JSON.stringify(f))
    setUser(f)
  }

  const isAdmin=user?.email===ADMIN
  const filtered=tasks.filter(t=>t.cat===missionTab && t.active && features[t.cat])

  if(!user){
    return(
      <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[24px] p-8 shadow-lg">
          <h1 className="text-2xl font-black text-[#0f8a5a]">ROLEX 2.0</h1>
          <p className="text-xs text-gray-500">rolex-bd-site.com - Gmail + Password Login</p>
          <p className="text-[10px] mt-2 text-gray-400">Link থেকে কেউ Account করতে গেলে Gmail + Password</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Gmail" className="w-full mt-6 border-2 border-[#0f8a5a] rounded-full p-4 text-sm"/>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 border-2 border-[#0f8a5a] rounded-full p-4 text-sm"/>
          <button onClick={signup} className="w-full mt-4 bg-[#0f8a5a] text-white py-4 rounded-full font-black">SIGNUP</button>
          <button onClick={login} className="w-full mt-2 border-2 border-[#0f8a5a] py-4 rounded-full font-black">LOGIN</button>
          <p className="text-[10px] text-center mt-3">Admin: {ADMIN}</p>
        </div>
      </div>
    )
  }

  if(tab==="admin" && isAdmin){
    return(
      <div className="min-h-screen bg-white p-4 pb-32">
        <button onClick={()=>setTab("home")} className="bg-[#0f8a5a] text-white px-5 py-2 rounded-full text-sm">← Home Rolex 2.0</button>
        <h1 className="text-xl font-black mt-4">ADMIN PANEL - Proper Business Control</h1>
        <p className="text-xs text-green-600 font-bold">সব Task Edit + Ad + File/Notepad/Cookie/Coin + Withdraw Control</p>

        <div className="bg-[#0f8a5a] text-white rounded-[24px] p-5 mt-4">
          <h3 className="font-black">📢 Ad Control - উপরে ছোট Ad + নিচে ছোট Ad + সাইডে Ad + 10s Ad</h3>
          <p className="text-[10px] mt-2 opacity-80">Top Small Ad Always - উপরে ছোট করে Ad চলবে</p>
          <textarea value={ads.top} onChange={e=>{const n={...ads,top:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/20 border rounded-xl p-2 mt-1 text-xs h-14"/>
          <p className="text-[10px] mt-2 opacity-80">Bottom Small Ad Always - Balance এর পরে নিচে ছোট Ad</p>
          <textarea value={ads.bottom} onChange={e=>{const n={...ads,bottom:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/20 border rounded-xl p-2 mt-1 text-xs h-14"/>
          <p className="text-[10px] mt-2 opacity-80">10s Video Ad - Task এর আগে Must Watch - না দেখলে Count হবে না, টাকা পাবে না - Disturb থেকে Ad বসানো</p>
          <textarea value={ads.taskAd} onChange={e=>{const n={...ads,taskAd:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/20 border rounded-xl p-2 mt-1 text-xs h-20"/>
        </div>

        <div className="bg-white border-2 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">🎛️ 4 Task ON/OFF + Edit - Task1 Visit/Like/Comment/Share, Task2 ID Sell, Task3 Coin Sell, Task4 WA Bind</h3>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Object.keys(features).map(k=>(
              <div key={k} className="bg-gray-50 border p-3 rounded-xl flex justify-between">
                <span className="text-[11px] font-bold">{k.toUpperCase()} {k==="task1"?"Visit" : k==="task2"?"ID Sell" : k==="task3"?"Coin Sell" : "WA Bind"}</span>
                <button onClick={()=>{const nf={...features,[k]:!features[k]}; setFeatures(nf); save({features:nf})}} className={`px-3 py-1 rounded-full text-[10px] font-black ${features[k]?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{features[k]?"ON":"OFF"}</button>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 max-h-[600px] overflow-auto">
            {tasks.map(t=>(
              <div key={t.id} className="bg-gray-50 border p-3 rounded-xl text-xs">
                <p className="font-bold">[{t.cat.toUpperCase()}] {t.title} - ৳{t.reward}</p>
                <p className="text-[10px]">File Fields: {t.fields} - Notepad/Cookie জমা</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <button onClick={()=>{const r=prompt("Price Edit",String(t.reward)); if(r){const nt=tasks.map(x=>x.id===t.id?{...x,reward:Number(r)}:x); setTasks(nt); save({tasks:nt})}}} className="bg-black text-white px-2 py-1 rounded-full">Price Edit</button>
                  <button onClick={()=>{const f=prompt("Fields Edit - Notepad/Cookie/File",t.fields); if(f){const nt=tasks.map(x=>x.id===t.id?{...x,fields:f}:x); setTasks(nt); save({tasks:nt})}}} className="bg-blue-600 text-white px-2 py-1 rounded-full">File Edit</button>
                  <button onClick={()=>{const nt=tasks.map(x=>x.id===t.id?{...x,active:!x.active}:x); setTasks(nt); save({tasks:nt})}} className={`px-2 py-1 rounded-full ${t.active?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{t.active?"ON":"OFF"}</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>{const cat=prompt("Category task1/task2/task3/task4"); const title=prompt("Title"); const reward=prompt("Reward"); const fields=prompt("Fields Notepad/Cookie"); if(cat&&title){const nt=[...tasks,{id:Date.now(),cat,title,reward:Number(reward||0),active:true,fields}]; setTasks(nt); save({tasks:nt})}}} className="w-full mt-4 bg-[#0f8a5a] text-white py-3 rounded-full text-xs font-black">+ New Task Add</button>
        </div>

        <div className="bg-green-50 border-2 border-green-600 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">📥 File জমা Inbox - Gmail/Notepad/Cookie/Coin/WA Bind সব এখানে জমা হবে - Task Complete Control</h3>
          {subs.length===0?<p className="text-xs text-gray-400 mt-2">No File Yet</p>:subs.map((s:any)=>(
            <div key={s.id} className="bg-white border-2 p-3 rounded-xl mt-3 text-xs">
              <p className="font-black">[{s.cat}] {s.title} - {s.email} - ৳{s.reward}</p>
              <div className="bg-gray-50 p-3 rounded-xl mt-2 border break-all">{Object.keys(s.data).map(k=><p key={k}><b>{k}:</b> {s.data[k]}</p>)}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>{const nd=subs.filter((x:any)=>x.id!==s.id); setSubs(nd); save({subs:nd}); let all=JSON.parse(localStorage.getItem("rolex_all")||"[]"); all=all.map((u:any)=>u.email===s.email?{...u,balance:u.balance+s.reward,approved:u.approved+s.reward}:u); localStorage.setItem("rolex_all",JSON.stringify(all)); if(user.email===s.email){const uu={...user,balance:user.balance+s.reward}; setUser(uu); localStorage.setItem("rolex_user",JSON.stringify(uu))}}} className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">Approve + Pay - Task Complete Control</button>
                <button onClick={()=>{const nd=subs.filter((x:any)=>x.id!==s.id); setSubs(nd); save({subs:nd})}} className="bg-red-600 text-white px-3 py-2 rounded-full">Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black text-white rounded-[24px] p-5 mt-4">
          <h3 className="font-black">💰 Withdraw Control - কে Withdraw দিল দেখো + Control</h3>
          {withdraws.map((w:any)=>(
            <div key={w.id} className="bg-white/10 border p-3 rounded-xl mt-2 text-xs flex justify-between items-center">
              <div><p>{w.email} - ৳{w.amount} - {w.method}</p><p className="text-[10px] opacity-60">{w.status}</p></div>
              <button onClick={()=>{const nd=withdraws.map((x:any)=>x.id===w.id?{...x,status:"paid"}:x); setWithdraws(nd); save({withdraws:nd})}} className="bg-green-500 text-black px-3 py-1 rounded-full font-bold">Paid Control</button>
            </div>
          ))}
        </div>

        <div className="bg-white border-2 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">👑 VIP Package Control - নিজ ইচ্ছামতো সাজাও</h3>
          {packages.map(p=>(
            <div key={p.id} className="bg-gray-50 border p-3 rounded-xl mt-2 text-xs flex justify-between">
              <span>{p.name} - ৳{p.price} - Daily ৳{p.daily} - {p.active?"ON":"OFF"}</span>
              <div className="flex gap-1">
                <button onClick={()=>{const pr=prompt("Price",String(p.price)); if(pr){const np=packages.map(x=>x.id===p.id?{...x,price:Number(pr)}:x); setPackages(np); save({packages:np})}}} className="bg-black text-white px-2 py-1 rounded-full">Price</button>
                <button onClick={()=>{const np=packages.map(x=>x.id===p.id?{...x,active:!x.active}:x); setPackages(np); save({packages:np})}} className={`px-2 py-1 rounded-full ${p.active?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{p.active?"ON":"OFF"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-[#e8f5e9] pb-32">
      {/* Must Be Top Small Ad Always চলবে */}
      <div className="bg-yellow-400 text-black text-center py-1.5 px-3 text-[10px] font-black sticky top-0 z-30">🔝 {ads.top}</div>

      {/* Header Like Photo - Rolex 2.0 */}
      <div className="bg-[#0f8a5a] text-white px-4 pt-3 pb-10 rounded-b-[32px]">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">☰</div>
          <h1 className="font-black text-xl">🪙 ROLEX 2.0</h1>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0f8a5a] font-black text-xs">ROLE</div>
        </div>
        <div className="flex justify-between mt-5 px-1">
          <div><p className="text-[10px] tracking-widest opacity-70">REFERRAL INCOME</p><p className="font-black text-lg">৳{user.refBal||"0.00"}</p></div>
          <div className="text-right"><p className="text-[10px] tracking-widest opacity-70">ACCOUNT ID</p><p className="font-black text-lg">{user.accId}</p></div>
        </div>
      </div>

      {/* Deposit Withdraw Pending Approved - Like Photo */}
      <div className="px-4 -mt-7 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[24px] p-4 shadow-sm border flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">⊕</div><div><p className="text-[10px] opacity-60">ADD FUND</p><p className="font-black">Deposit</p></div></div>
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-red-100 flex items-center gap-3"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">↓</div><div><p className="text-[10px] opacity-60">CASH OUT</p><p className="font-black text-[#d32f2f]">Withdraw</p></div></div>
        <div className="bg-white rounded-[24px] p-4 shadow-sm border flex items-center gap-3"><div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">↻</div><div><p className="text-[10px] opacity-60">PENDING</p><p className="font-black">৳{user.pending||"0.00"}</p></div></div>
        <div className="bg-white rounded-[24px] p-4 shadow-sm border flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">$</div><div><p className="text-[10px] opacity-60">APPROVED</p><p className="font-black">৳{user.approved||"0.00"}</p></div></div>
      </div>

      {/* Balance + Bottom Small Ad Always + Side Small Ad */}
      <div className="mx-4 mt-4 bg-white rounded-[20px] p-4 shadow border flex justify-between items-center">
        <div><p className="text-[10px] opacity-60">MY BALANCE - ব্যালেন্স দেখাবে</p><p className="font-black text-xl">৳{user.balance}</p></div>
        <div className="w-[90px] bg-yellow-400 rounded-xl p-2 text-center"><p className="text-[8px] font-black">SIDE AD</p><p className="text-[8px] leading-[9px]">ছোট Ad সাইডে চলবে</p></div>
      </div>
      <div className="mx-4 mt-3 bg-[#0f8a5a] text-yellow-300 rounded-[16px] p-3 text-center text-xs font-bold border">📢 Bottom Small Ad Always - নিচে ছোট Ad চলবে: {ads.bottom}</div>

      {/* Services & Features Like Photo */}
      {tab==="home"&&(
        <div className="px-4 mt-5">
          <p className="text-[#0f8a5a] font-black text-[13px] tracking-widest">SERVICES & FEATURES</p>
          <div className="grid grid-cols-4 gap-3 mt-3">
            <button onClick={()=>setTab("missions")} className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-[#0f8a5a] rounded-[16px] flex items-center justify-center text-white">☰</div><p className="text-[11px] font-bold">Mission</p><p className="text-[7px] opacity-60">4 Task</p></button>
            <button onClick={()=>setTab("vip")} className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">👑</div><p className="text-[11px] font-bold">VIP Plan</p></button>
            <button className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">💳</div><p className="text-[11px] font-bold">Membership</p></button>
            <button onClick={()=>setTab("refer")} className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">👥</div><p className="text-[11px] font-bold">My Team</p><p className="text-[7px] opacity-60">Refer Income</p></button>
            <button className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2 opacity-60"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">🎲</div><p className="text-[11px] font-bold">Lucky Spin</p></button>
            <button className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2 opacity-60"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">📦</div><p className="text-[11px] font-bold">Vault</p></button>
            <button className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2 opacity-60"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">🎟️</div><p className="text-[11px] font-bold">Lottery</p></button>
            <button className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2 opacity-60"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">💰</div><p className="text-[11px] font-bold">Salary</p></button>
            <button onClick={()=>setTab("support")} className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">🎧</div><p className="text-[11px] font-bold">Support</p><p className="text-[7px] opacity-60">Direct Contact</p></button>
            <button className="bg-white rounded-[20px] p-3 shadow-sm border flex flex-col items-center gap-2 opacity-60"><div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">⬇️</div><p className="text-[11px] font-bold">App</p></button>
            <button 
