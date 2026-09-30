import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: BusinessPro })

function BusinessPro(){
  const ADMIN="fscnajmul2026@gmail.com"
  const [auth,setAuth]=useState({email:"",pass:""})
  const [user,setUser]=useState<any>(null)
  const [tab,setTab]=useState("home")
  const [taskTab,setTaskTab]=useState("task1")

  // TON ROLEX 2.0 Style Data
  const [ads,setAds]=useState({top:"Top Small Ad Always - Adsterra Code",bottom:"Bottom Small Ad Always - Adsterra",side:"Side Small Ad Always",taskAd:"10s Video Ad - Must Watch Before Task"})
  const [numbers,setNumbers]=useState({bkash:"017XXXXXXXX",usdt:"USDT TRC20"})
  const [packages,setPackages]=useState([
    {id:1,name:"VIP 1",price:500,daily:50,active:true},
    {id:2,name:"VIP 2",price:1500,daily:180,active:true},
    {id:3,name:"VIP 3",price:5000,daily:700,active:true},
  ])
  const [tasks,setTasks]=useState<any[]>([
    // Task 1 - Visit Like Comment Share
    {id:1,cat:"task1",title:"Website Visit 1 Min",reward:10,active:true,fields:"Website Link,Screenshot Proof"},
    {id:2,cat:"task1",title:"Facebook Like + Comment",reward:15,active:true,fields:"Post Link,Like Screenshot"},
    {id:3,cat:"task1",title:"YouTube Video Share",reward:20,active:true,fields:"Video Link,Share Screenshot"},
    // Task 2 - ID Sell
    {id:4,cat:"task2",title:"Facebook ID Sell",reward:150,active:true,fields:"FB Link,Email,Password,Notepad File"},
    {id:5,cat:"task2",title:"Instagram ID Sell",reward:180,active:true,fields:"Insta Username,Password,Cookies File"},
    {id:6,cat:"task2",title:"Telegram ID Sell",reward:120,active:true,fields:"Telegram Number,Session File"},
    {id:7,cat:"task2",title:"WhatsApp ID Sell",reward:200,active:true,fields:"WhatsApp Number,QR Screenshot"},
    {id:8,cat:"task2",title:"Gmail Sell - Notepad জমা",reward:100,active:true,fields:"Gmail,Password,Recovery,Notepad Upload"},
    // Task 3 - Coin Sell
    {id:9,cat:"task3",title:"Nibha Coin Sell",reward:80,active:true,fields:"Nibha Amount,Wallet Address,Hash"},
    {id:10,cat:"task3",title:"NS Coin Sell",reward:90,active:true,fields:"NS Amount,Address,Proof"},
    {id:11,cat:"task3",title:"Top Follow Coin Sell",reward:70,active:true,fields:"Top Follow Amount,ID,Proof"},
    {id:12,cat:"task3",title:"Coinstra Coin Sell",reward:110,active:true,fields:"Coinstra Amount,Address,Tx Hash"},
    // Task 4 - WhatsApp Bind + Bengali Site
    {id:13,cat:"task4",title:"WhatsApp Bind Income - Bengali Site Bind",reward:300,active:true,fields:"WhatsApp Number,Bind Screenshot,Bengali Site Link"},
    {id:14,cat:"task4",title:"WhatsApp Band Fix Income",reward:250,active:true,fields:"Band Number,Unband Proof"},
  ])
  const [subs,setSubs]=useState<any[]>([]) // All File/Notepad/Cookie/Coin জমা হবে এখানে
  const [withdraws,setWithdraws]=useState<any[]>([])
  const [deps,setDeps]=useState<any[]>([])
  const [features,setFeatures]=useState<any>({task1:true,task2:true,task3:true,task4:true})

  const [dA,setDA]=useState("")
  const [dT,setDT]=useState("")
  const [wA,setWA]=useState("")
  const [wM,setWM]=useState("bkash")
  const [count,setCount]=useState(10)
  const [adOpen,setAdOpen]=useState(false)
  const [canDo,setCanDo]=useState(false)
  const [active,setActive]=useState<any>(null)
  const [form,setForm]=useState<any>({})

  useEffect(()=>{
    const u=localStorage.getItem("ton_user")
    if(u) setUser(JSON.parse(u))
    const d=JSON.parse(localStorage.getItem("ton_data")||"{}")
    if(d.ads) setAds(d.ads)
    if(d.tasks) setTasks(d.tasks)
    if(d.packages) setPackages(d.packages)
    if(d.subs) setSubs(d.subs)
    if(d.withdraws) setWithdraws(d.withdraws)
    if(d.deps) setDeps(d.deps)
    if(d.features) setFeatures(d.features)
    if(d.numbers) setNumbers(d.numbers)
  },[])

  const save=(obj:any)=>{
    localStorage.setItem("ton_data",JSON.stringify({ads,tasks,packages,subs,withdraws,deps,features,numbers,...obj}))
  }

  useEffect(()=>{
    if(adOpen && count>0){
      const t=setTimeout(()=>setCount(count-1),1000)
      return()=>clearTimeout(t)
    }
    if(count===0) setCanDo(true)
  },[adOpen,count])

  const signup=()=>{
    if(!auth.email ||!auth.pass) return alert("Gmail + Password দাও")
    let all=JSON.parse(localStorage.getItem("ton_all")||"[]")
    let f=all.find((x:any)=>x.email===auth.email)
    if(f) return alert("Already Account আছে, Login করো")
    let u={email:auth.email,pass:auth.pass,balance:0,plan:null,refCode:"REF"+Math.floor(1000+Math.random()*9000),referBy:"",totalRef:0}
    all=[...all,u]
    localStorage.setItem("ton_all",JSON.stringify(all))
    localStorage.setItem("ton_user",JSON.stringify(u))
    setUser(u)
  }

  const login=()=>{
    if(!auth.email ||!auth.pass) return alert("Gmail + Password দাও")
    let all=JSON.parse(localStorage.getItem("ton_all")||"[]")
    let f=all.find((x:any)=>x.email===auth.email && x.pass===auth.pass)
    if(!f) return alert("Gmail/Password ভুল")
    localStorage.setItem("ton_user",JSON.stringify(f))
    setUser(f)
  }

  const isAdmin=user?.email===ADMIN
  const filtered=tasks.filter(t=>t.cat===taskTab && t.active && features[t.cat])

  if(!user){
    return(
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[32px] p-8">
          <p className="text-[10px] tracking-[4px] text-gray-400">TON ROLEX 2.0 STYLE</p>
          <h1 className="text-3xl font-black mt-1">Business Pro</h1>
          <p className="text-xs text-gray-500 mt-2">Link থেকে Gmail + Password দিয়ে Signup/Login</p>
          <input value={auth.email} onChange={e=>setAuth({...auth,email:e.target.value})} placeholder="Gmail" className="w-full mt-6 border-2 border-black rounded-full p-4 text-sm"/>
          <input value={auth.pass} onChange={e=>setAuth({...auth,pass:e.target.value})} type="password" placeholder="Password" className="w-full mt-3 border-2 border-black rounded-full p-4 text-sm"/>
          <button onClick={signup} className="w-full mt-4 bg-black text-white py-4 rounded-full font-black">SIGNUP - Gmail + Password</button>
          <button onClick={login} className="w-full mt-2 bg-white border-2 border-black py-4 rounded-full font-black">LOGIN</button>
          <p className="text-[10px] text-center mt-4 text-gray-400">Admin: {ADMIN}</p>
        </div>
      </div>
    )
  }

  // ADMIN PANEL - সব Control
  if(tab==="admin" && isAdmin){
    return(
      <div className="min-h-screen bg-white p-4 pb-32">
        <button onClick={()=>setTab("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← Home - TON Style</button>
        <h1 className="text-xl font-black mt-4">ADMIN PANEL - Proper Business Control</h1>
        <p className="text-xs text-green-600 font-bold">সব Task + Ad + File + Withdraw Control এখানে</p>

        <div className="bg-black text-white rounded-[24px] p-5 mt-4">
          <h3 className="font-black">📢 Ad Control - Disturb থেকে Ad বসানো + 10s Ad</h3>
          <p className="text-[10px] mt-2 opacity-60">Top Small Ad Always Must Be</p>
          <textarea value={ads.top} onChange={e=>{const n={...ads,top:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-14"/>
          <p className="text-[10px] mt-2 opacity-60">Bottom Small Ad Always</p>
          <textarea value={ads.bottom} onChange={e=>{const n={...ads,bottom:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-14"/>
          <p className="text-[10px] mt-2 opacity-60">Side Small Ad</p>
          <textarea value={ads.side} onChange={e=>{const n={...ads,side:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-14"/>
          <p className="text-[10px] mt-2 opacity-60">10s Video Ad - Task এর আগে Must Watch - না দেখলে Count হবে না</p>
          <textarea value={ads.taskAd} onChange={e=>{const n={...ads,taskAd:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-20"/>
        </div>

        <div className="bg-white border-2 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">🎛️ Task ON/OFF + Edit System - 4 ধরনের Task</h3>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Object.keys(features).map(k=>(
              <div key={k} className="bg-gray-50 border p-3 rounded-xl flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase">{k} {k==="task1"?"(Visit/Like)" : k==="task2"?"(ID Sell)" : k==="task3"?"(Coin Sell)" : "(WA Bind)"}</span>
                <button onClick={()=>{const nf={...features,[k]:!features[k]}; setFeatures(nf); save({features:nf})}} className={`px-3 py-1 rounded-full text-[10px] font-black ${features[k]?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{features[k]?"ON":"OFF"}</button>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 max-h-[600px] overflow-auto">
            {tasks.map(t=>(
              <div key={t.id} className="bg-gray-50 border p-3 rounded-xl text-xs">
                <p className="font-bold">[{t.cat.toUpperCase()}] {t.title} - ৳{t.reward} {t.active?"🟢":"🔴"}</p>
                <p className="text-[10px]">Fields: {t.fields}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <button onClick={()=>{const r=prompt("New Reward",String(t.reward)); if(r){const nt=tasks.map(x=>x.id===t.id?{...x,reward:Number(r)}:x); setTasks(nt); save({tasks:nt})}}} className="bg-black text-white px-2 py-1 rounded-full">Price Edit</button>
                  <button onClick={()=>{const f=prompt("Fields - Notepad/File/Cookie/Proof",t.fields); if(f){const nt=tasks.map(x=>x.id===t.id?{...x,fields:f}:x); setTasks(nt); save({tasks:nt})}}} className="bg-blue-600 text-white px-2 py-1 rounded-full">File/Notepad Edit</button>
                  <button onClick={()=>{const tt=prompt("Title Edit",t.title); if(tt){const nt=tasks.map(x=>x.id===t.id?{...x,title:tt}:x); setTasks(nt); save({tasks:nt})}}} className="bg-yellow-500 text-black px-2 py-1 rounded-full">Title Edit</button>
                  <button onClick={()=>{const nt=tasks.map(x=>x.id===t.id?{...x,active:!x.active}:x); setTasks(nt); save({tasks:nt})}} className={`px-2 py-1 rounded-full font-bold ${t.active?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{t.active?"ON":"OFF"}</button>
                  <button onClick={()=>{const nt=tasks.filter(x=>x.id!==t.id); setTasks(nt); save({tasks:nt})}} className="bg-red-100 text-red-600 px-2 py-1 rounded-full">Del</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>{const cat=prompt("Category: task1=Visit/Like, task2=ID Sell, task3=Coin Sell, task4=WA Bind"); const title=prompt("Title ex: Gmail Sell Notepad, FB Sell, Nibha Coin"); const reward=prompt("Reward ৳"); const fields=prompt("Fields ex: Gmail,Password,Notepad File / Cookie File / Wallet Address"); if(cat&&title){const nt=[...tasks,{id:Date.now(),cat,title,reward:Number(reward||0),active:true,fields}]; setTasks(nt); save({tasks:nt})}}} className="w-full mt-4 bg-black text-white py-3 rounded-full text-xs font-black">+ New Task Add - Gmail/ID/Coin/WA Bind সব</button>
        </div>

        <div className="bg-green-50 border-2 border-green-500 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">📥 File জমা Inbox - Gmail/Notepad/Cookie/Coin/WA Bind সব এখানে জমা হবে</h3>
          <p className="text-[10px] text-gray-500">যে কেউ ID/Coin/Gmail বিক্রি করলে এখানে Notepad File সহ জমা হবে</p>
          {subs.length===0?<p className="text-xs text-gray-400 mt-2">No File জমা yet</p>:subs.map((s:any)=>(
            <div key={s.id} className="bg-white border-2 p-3 rounded-xl mt-3 text-xs">
              <p className="font-black">[{s.cat}] {s.title} - {s.email} - ৳{s.reward} - {s.status}</p>
              <div className="bg-gray-50 p-3 rounded-xl mt-2 border">
                {Object.keys(s.data).map(k=><p key={k} className="mt-1 break-all"><b>{k}:</b> {s.data[k]}</p>)}
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>{const nd=subs.map((x:any)=>x.id===s.id?{...x,status:"approved"}:x); setSubs(nd); save({subs:nd}); let all=JSON.parse(localStorage.getItem("ton_all")||"[]"); all=all.map((u:any)=>u.email===s.email?{...u,balance:u.balance+s.reward}:u); localStorage.setItem("ton_all",JSON.stringify(all))}} className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">Approve + Pay ৳{s.reward} - Task Complete Control</button>
                <button onClick={()=>{const nd=subs.filter((x:any)=>x.id!==s.id); setSubs(nd); save({subs:nd})}} className="bg-red-600 text-white px-3 py-2 rounded-full">Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black text-white rounded-[24px] p-5 mt-4">
          <h3 className="font-black">💰 Withdraw Control - কে Withdraw দিল দেখো + Control করো</h3>
          {withdraws.map((w:any)=>(
            <div key={w.id} className="bg-white/10 border p-3 rounded-xl mt-2 text-xs">
              <p className="font-bold">{w.email} - ৳{w.amount} - {w.method} - {w.number} - {w.status}</p>
              <button onClick={()=>{const nd=withdraws.map((x:any)=>x.id===w.id?{...x,status:"paid"}:x); setWithdraws(nd); save({withdraws:nd})}} className="bg-green-500 text-black px-3 py-1 rounded-full mt-1 font-bold">Paid - Control</button>
            </div>
          ))}
        </div>

        <div className="bg-white border-2 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">👑 VIP Package Control - নিজ ইচ্ছামতো সাজাও</h3>
          {packages.map(p=>(
            <div key={p.id} className="bg-gray-50 border p-3 rounded-xl mt-2 text-xs flex justify-between items-center">
              <div><p className="font-bold">{p.name} - ৳{p.price} - Daily ৳{p.daily} - {p.active?"🟢 ON":"🔴 OFF"}</p></div>
              <div className="flex gap-1">
                <button onClick={()=>{const pr=prompt("Price",String(p.price)); if(pr){const np=packages.map(x=>x.id===p.id?{...x,price:Number(pr)}:x); setPackages(np); save({packages:np})}}} className="bg-black text-white px-2 py-1 rounded-full">Price</button>
                <button onClick={()=>{const np=packages.map(x=>x.id===p.id?{...x,active:!x.active}:x); setPackages(np); save({packages:np})}} className={`px-2 py-1 rounded-full ${p.active?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{p.active?"ON":"OFF"}</button>
              </div>
            </div>
          ))}
          <button onClick={()=>{const name=prompt("Package Name VIP 4"); const price=prompt("Price"); const daily=prompt("Daily Income"); if(name){const np=[...packages,{id:Date.now(),name,price:Number(price),daily:Number(daily),active:true}]; setPackages(np); save({packages:np})}}} className="w-full mt-3 bg-black text-white py-2 rounded-full text-xs">+ New VIP Package Add</button>
        </div>

        <div className="bg-yellow-50 border-2 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">💳 Deposit Control - Bkash/USDT</h3>
          <input value={numbers.bkash} onChange={e=>{const n={...numbers,bkash:e.target.value}; setNumbers(n); save({numbers:n})}} placeholder="Bkash Number" className="w-full border-2 rounded-full p-2 mt-2 text-xs"/>
          <input value={numbers.usdt} onChange={e=>{const n={...numbers,usdt:e.target.value}; setNumbers(n); save({numbers:n})}} placeholder="USDT Address" className="w-full border-2 rounded-full p-2 mt-2 text-xs"/>
          {deps.map((d:any)=>(
            <div key={d.id} className="bg-white border p-3 rounded-xl mt-2 text-xs"><p>{d.email} ৳{d.amount} Trx:{d.trx}</p><button onClick={()=>{const nd=deps.filter((x:any)=>x.id!==d.id); setDeps(nd); save({deps:nd}); let all=JSON.parse(localStorage.getItem("ton_all")||"[]"); all=all.map((u:any)=>u.email===d.email?{...u,balance:u.balance+d.amount}:u); localStorage.setItem("ton_all",JSON.stringify(all))}} className="bg-black text-white px-3 py-1 rounded-full mt-1">Accept</button></div>
          ))}
        </div>
      </div>
    )
  }

  // MAIN UI - TON ROLEX 2.0 STYLE
  return(
    <div className="min-h-screen bg-[#0f0f0f] pb-28 text-white">
      {/* Top Small Ad Always Must Be */}
      <div className="bg-yellow-400 text-black text-center py-2 px-3 text-[11px] font-black sticky top-0 z-30">🔝 {ads.top}</div>

      {/* Balance + Side Ad Layout */}
      <div className="px-4 pt-4 flex gap-3">
        <div className="flex-1 bg-[#1a1a1a] rounded-[24px] p-5 border border-white/10">
          <p className="text-[10px] tracking-[3px] opacity-50">TON ROLEX 2.0 STYLE</p>
          <h1 className="font-black text-xl mt-1">Business Pro Max</h1>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white text-black rounded-[16px] p-3"><p className="text-[9px] opacity-60">BALANCE</p><p className="font-black text-lg">৳{user.balance}</p></div>
            <div className="bg-white/10 rounded-[16px] p-3"><p className="text-[9px] opacity-60">REF CODE</p><p className="font-black text-xs">{user.refCode}</p></div>
          </div>
        </div>
        <div className="w-[80px] bg-yellow-400 text-black rounded-[24px] p-3 flex flex-col items-center justify-center text-center">
          <p className="text-[8px] font-black">SIDE AD</p>
          <p className="text-[9px] font-bold mt-1 leading-[10px]">{ads.side}</p>
        </div>
      </div>

      {/* Bottom Small Ad Always After Balance */}
      <div className="mx-4 mt-3 bg-[#1a1a1a] border border-yellow-400/30 rounded-[16px] p-3 text-center">
        <p className="text-[9px] opacity-60 tracking-widest">BOTTOM AD ALWAYS</p>
        <p className="font-bold text-yellow-400 text-xs mt-1">📢 {ads.bottom}</p>
      </div>

      {/* Home Buttons - TON Style */}
      {tab==="home"&&(
        <>
          <div className="px-4 mt-5 grid grid-cols-2 gap-3">
            <button onClick={()=>setTab("tasks")} className="bg-white text-black rounded-[20px] p-5 flex items-center gap-3"><div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl">📋</div><div className="text-left"><p className="font-black text-sm">Tasks</p><p className="text-[10px] opacity-60">4 Type</p></div></button>
            <button onClick={()=>setTab("refer")} className="bg-[#1a1a1a] border border-white/10 rounded-[20px] p-5 flex items-center gap-3"><div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl">👥</div><div className="text-left"><p className="font-black text-sm">Refer</p><p className="text-[10px] opacity-60">Income</p></div></button>
            <button onClick={()=>setTab("withdraw")} className="bg-[#1a1a1a] border border-white/10 rounded-[20px] p-5 flex items-center gap-3"><div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">💸</div><div className="text-left"><p className="font-black text-sm">Withdraw</p><p className="text-[10px] opacity-60">Balance+Pending</p></div></button>
            <button onClick={()=>setTab("support")} className="bg-[#1a1a1a] border border-white/10 rounded-[20px] p-5 flex items-center gap-3"><div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">🎧</div><div className="text-left"><p className="font-black text-sm">Help/Support</p><p className="text-[10px] opacity-60">Direct+AI</p></div></button>
          </div>

          <div className="px-4 mt-6">
            <p className="text-[10px] font-black tracking-[2px] opacity-50">VIP PACKAGES - নিজ ইচ্ছামতো সাজানো</p>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {packages.filter(p=>p.active).map(p=>(
                <div key={p.id} className="bg-[#1a1a1a] border border-white/10 rounded-[20px
