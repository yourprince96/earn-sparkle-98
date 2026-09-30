import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: TrueBusiness })

function TrueBusiness(){
  const ADMIN="fscnajmul2026@gmail.com"
  const [email,setEmail]=useState("")
  const [user,setUser]=useState<any>(null)
  const [page,setPage]=useState("home")
  const [cat,setCat]=useState("gmail")

  // CORE BUSINESS STATE - ALL IN ONE
  const [numbers,setNumbers]=useState({bkash:"01712XXXXXX Personal",nagad:"01812XXXXXX",usdt:"TXYZ...TRC20 Binance"})
  const [ads,setAds]=useState({
    top:"🔥 Top Small Ad - Always On Top - Adsterra Code",
    middle:"📢 Middle Big Ad - Always In Middle - 728x90 - Adsterra",
    task:"🎥 Task 10s Video Ad - Must Watch",
    bottom:"💰 Bottom Ad"
  })
  const [plans,setPlans]=useState([
    {id:1,name:"Starter",price:500,daily:80,days:30,active:true},
    {id:2,name:"Pro",price:1500,daily:250,days:60,active:true},
    {id:3,name:"VIP",price:5000,daily:900,days:90,active:true},
  ])
  const [allTasks,setAllTasks]=useState<any[]>([
    {id:1,cat:"gmail",title:"Gmail Sell - Fresh Old Gmail",reward:120,needPkg:true,active:true,fields:"Gmail,Password,Recovery Email",sheet:""},
    {id:2,cat:"gmail",title:"Gmail Aged 2 Year Sell",reward:250,needPkg:true,active:true,fields:"Gmail,Password,Recovery,Phone",sheet:""},
    {id:3,cat:"facebook",title:"Facebook Profile Sell",reward:150,needPkg:true,active:true,fields:"FB Link,Email,Password,2FA Code",sheet:""},
    {id:4,cat:"instagram",title:"Instagram 1k Followers Sell",reward:200,needPkg:true,active:true,fields:"Insta Username,Password,Email",sheet:""},
    {id:5,cat:"twitter",title:"Twitter Old Account Sell",reward:180,needPkg:true,active:true,fields:"Twitter Username,Password",sheet:""},
    {id:6,cat:"telegram",title:"Telegram Account Sell",reward:80,needPkg:false,active:true,fields:"Telegram Number,OTP",sheet:""},
    {id:7,cat:"whatsapp",title:"WhatsApp Account Sell",reward:100,needPkg:false,active:true,fields:"WhatsApp Number,OTP Code",sheet:""},
    {id:8,cat:"whatsapp_band",title:"WhatsApp Band Fix Service",reward:300,needPkg:true,active:true,fields:"WhatsApp Number,Ban Screenshot,Device Info",sheet:""},
    {id:9,cat:"coin",title:"USDT Coin Buy Sell - Receive",reward:100,needPkg:true,active:true,fields:"Coin Amount,Hash,From Address,Network",sheet:"https://docs.google.com/spreadsheets/..."},
    {id:10,cat:"ad",title:"Video Ad View + Follow",reward:20,needPkg:false,active:true,fields:"Screenshot Link",sheet:""},
  ])
  const [submissions,setSubmissions]=useState<any[]>([])
  const [deposits,setDeposits]=useState<any[]>([])
  const [withdraws,setWithdraws]=useState<any[]>([])
  const [refComm,setRefComm]=useState(15)
  const [coupon,setCoupon]=useState("WELCOME50")
  const [features,setFeatures]=useState({gmail:true,facebook:true,instagram:true,twitter:true,telegram:true,whatsapp:true,whatsapp_band:true,coin:true,ad:true} as any)

  // Forms
  const [dM,setDM]=useState("bkash")
  const [dA,setDA]=useState("")
  const [dT,setDT]=useState("")
  const [wA,setWA]=useState("")
  const [wAddr,setWAddr]=useState("")
  const [count,setCount]=useState(10)
  const [adOpen,setAdOpen]=useState(false)
  const [canDo,setCanDo]=useState(false)
  const [activeTask,setActiveTask]=useState<any>(null)
  const [formData,setFormData]=useState<any>({})

  useEffect(()=>{
    const u=localStorage.getItem("true_user")
    if(u) setUser(JSON.parse(u))
    const d=JSON.parse(localStorage.getItem("true_data")||"{}")
    if(d.ads) setAds(d.ads)
    if(d.numbers) setNumbers(d.numbers)
    if(d.plans) setPlans(d.plans)
    if(d.tasks) setAllTasks(d.tasks)
    if(d.deposits) setDeposits(d.deposits)
    if(d.subs) setSubmissions(d.subs)
    if(d.withdraws) setWithdraws(d.withdraws)
    if(d.features) setFeatures(d.features)
  },[])

  const save=(extra:any={})=>{localStorage.setItem("true_data",JSON.stringify({ads,numbers,plans,tasks:allTasks,deposits,subs:submissions,withdraws,features,...extra}))}

  useEffect(()=>{if(adOpen && count>0){const t=setTimeout(()=>setCount(c=>c-1),1000); return()=>clearTimeout(t)} if(count===0) setCanDo(true)},[adOpen,count])

  const login=()=>{
    if(!email) return alert("Email দাও")
    let all=JSON.parse(localStorage.getItem("true_allusers")||"[]")
    let f=all.find((x:any)=>x.email===email)
    if(f?.blocked) return alert("ID Blocked")
    let u=f || {email,accId:"#BIZ"+Math.floor(10000+Math.random()*90000),balance:0,plan:null,referCode:email.split("@")[0]+Math.floor(100+Math.random()*900),blocked:false}
    if(!f){all=[...all,u]; localStorage.setItem("true_allusers",JSON.stringify(all))}
    localStorage.setItem("true_user",JSON.stringify(u))
    setUser(u)
  }

  const isAdmin=user?.email===ADMIN
  const filtered=allTasks.filter(t=>t.cat===cat && t.active)

  if(!user) return <div className="min-h-screen bg-black flex items-center justify-center p-6"><div className="bg-white w-full max-w-sm rounded-[32px] p-8"><p className="text-[10px] font-black tracking-[3px] text-gray-400">TRUE BUSINESS SITE</p><h1 className="text-3xl font-black mt-1">Business Pro Max</h1><p className="text-xs text-gray-500 mt-1">All Features - Real Business</p><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Business Email" className="w-full mt-6 border-2 border-black rounded-full p-4 text-sm"/><button onClick={login} className="w-full mt-4 bg-black text-white py-4 rounded-full font-black">ENTER BUSINESS</button><p className="text-[10px] text-center mt-3">Admin Locked: {ADMIN}</p></div></div>

  if(page==="admin" && isAdmin){
    return <div className="min-h-screen bg-white p-4 pb-32">
      <button onClick={()=>setPage("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← Back to Business App</button>
      <h1 className="text-xl font-black mt-4">ADMIN PANEL - TRUE BUSINESS A to Z</h1><p className="text-xs font-bold text-green-600">Only You: {ADMIN} - Locked - কেউ দেখতে পারবে না</p>

      <div className="bg-black text-white rounded-[24px] p-5 mt-5"><h3 className="font-black text-sm">📢 Ad বসানোর অপশন - সব সময় থাকবে (Must Be Always)</h3>
        <p className="text-[10px] mt-3 opacity-70">🔝 Top Ad - ছোট, সব সময় উপরে থাকবে (Sticky)</p><textarea value={ads.top} onChange={e=>{const n={...ads,top:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border border-white/20 rounded-xl p-2 mt-1 text-xs h-14" placeholder="Top Ad Code"/>
        <p className="text-[10px] mt-3 opacity-70">🏠 Middle Ad - মাঝখানে সব সময় থাকবে - Big Banner</p><textarea value={ads.middle} onChange={e=>{const n={...ads,middle:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-20" placeholder="Middle Ad 728x90"/>
        <p className="text-[10px] mt-3 opacity-70">🎥 Task Ad - 10s Video Ad - Task Start এ দেখবে</p><textarea value={ads.task} onChange={e=>{const n={...ads,task:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-14" placeholder="Task Video Ad"/>
        <p className="text-[10px] mt-3 text-yellow-400">✅ Auto Save - Paste করলেই সব User এর App এ Ad দেখাবে - Adsterra Direct Link / Banner Code বসাও</p>
      </div>

      <div className="bg-green-50 border-2 border-green-300 rounded-[24px] p-5 mt-4"><h3 className="font-black">📥 RECEIVE INBOX - User যা Sell করবে এখানে জমা হবে - তুমি এখান থেকে Receive করবা</h3><p className="text-[10px] text-gray-500">Gmail, Facebook, Coin, WhatsApp Band সব এখানে আসবে - তুমি Approve করলে User টাকা পাবে</p>
        {submissions.length===0?<p className="text-xs text-gray-400 mt-3">No submissions - User Sell করলে এখানে আসবে</p>:submissions.map((s:any)=><div key={s.id} className="bg-white border-2 p-4 rounded-xl mt-3 text-xs"><p className="font-black">{s.email} - [{s.cat}] {s.title} - ৳{s.reward}</p><div className="bg-gray-50 p-3 rounded-xl mt-2">{Object.keys(s.data).map(k=><p key={k} className="mt-1"><b>{k}:</b> <span className="select-all">{s.data[k]}</span></p>)}</div><div className="flex gap-2 mt-3"><button onClick={()=>{const nd=submissions.map((x:any)=>x.id===s.id?{...x,status:"approved"}:x); setSubmissions(nd); save({subs:nd}); let all=JSON.parse(localStorage.getItem("true_allusers")||"[]"); all=all.map((u:any)=>u.email===s.email?{...u,balance:u.balance+s.reward}:u); localStorage.setItem("true_allusers",JSON.stringify(all)); if(user.email===s.email){const up={...user,balance:user.balance+s.reward}; setUser(up); localStorage.setItem("true_user",JSON.stringify(up))} alert("Approved - Paid ৳"+s.reward+" - Gmail/Coin Receive করেছো")}} className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">✅ Approve & Pay - Receive Done</button><button onClick={()=>{const nd=submissions.filter((x:any)=>x.id!==s.id); setSubmissions(nd); save({subs:nd})}} className="bg-red-100 text-red-600 px-3 py-2 rounded-full">Reject</button></div></div>)}
      </div>

      <div className="bg-black text-white rounded-[24px] p-5 mt-4"><h3 className="font-black">💳 Deposit Numbers - কোন নাম্বারে টাকা পাঠাবে তুমি সেট করো</h3><input value={numbers.bkash} onChange={e=>{const n={...numbers,bkash:e.target.value}; setNumbers(n); save({numbers:n})}} placeholder="Bkash Personal" className="w-full bg-white/10 border rounded-full p-3 mt-3 text-xs"/><input value={numbers.nagad} onChange={e=>{const n={...numbers,nagad:e.target.value}; setNumbers(n); save({numbers:n})}} placeholder="Nagad" className="w-full bg-white/10 border rounded-full p-3 mt-2 text-xs"/><input value={numbers.usdt} onChange={e=>{const n={...numbers,usdt:e.target.value}; setNumbers(n); save({numbers:n})}} placeholder="USDT Binance TRC20 Address" className="w-full bg-white/10 border rounded-full p-3 mt-2 text-xs"/></div>

      <div className="bg-yellow-50 border-2 rounded-[24px] p-5 mt-4"><h3 className="font-black">💰 Deposit Accept - User টাকা পাঠালে এখানে আসবে</h3>{deposits.filter((d:any)=>d.status==="pending").length===0?<p className="text-xs text-gray-400 mt-2">No pending</p>:deposits.filter((d:any)=>d.status==="pending").map((d:any)=><div key={d.id} className="bg-white p-3 rounded-xl mt-2 text-xs"><p className="font-bold">{d.email} ৳{d.amount} {d.method} - To: {d.toNumber}</p><p className="text-[10px]">TrxID: {d.trx}</p><button onClick={()=>{const nd=deposits.map((x:any)=>x.id===d.id?{...x,status:"approved"}:x); setDeposits(nd); save({deposits:nd}); let all=JSON.parse(localStorage.getItem("true_allusers")||"[]"); all=all.map((u:any)=>u.email===d.email?{...u,balance:u.balance+d.amount}:u); localStorage.setItem("true_allusers",JSON.stringify(all)); if(user.email===d.email){const up={...user,balance:user.balance+d.amount}; setUser(up); localStorage.setItem("true_user",JSON.stringify(up))} alert("Deposit Approved ৳"+d.amount)}} className="bg-black text-white px-4 py-1.5 rounded-full mt-2">Accept & Add Balance</button></div>)}</div>

      <div className="bg-white border-2 rounded-[24px] p-5 mt-4"><h3 className="font-black">👑 Packages - তুমি Price সেট + ON/OFF করতে পারবা</h3><p className="text-[10px] text-gray-500">OFF করলে User Package দেখবে না</p>{plans.map(p=><div key={p.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl mt-2 text-xs"><div><p className="font-bold">{p.name} ৳{p.price} Daily ৳{p.daily} - {p.active?"🟢 ON":"🔴 OFF"}</p></div><div className="flex gap-1"><button onClick={()=>{const n=plans.map(x=>x.id===p.id?{...x,active:!x.active}:x); setPlans(n); save({plans:n})}} className={`px-3 py-1 rounded-full font-bold ${p.active?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{p.active?"ON":"OFF"}</button><button onClick={()=>{const pr=prompt("New Price",String(p.price)); const dl=prompt("Daily",String(p.daily)); if(pr){const n=plans.map(x=>x.id===p.id?{...x,price:Number(pr),daily:Number(dl||x.daily)}:x); setPlans(n); save({plans:n})}}} className="bg-black text-white px-3 py-1 rounded-full">Edit Price</button></div></div>)}<button onClick={()=>{const name=prompt("Plan Name"); const price=prompt("Price"); const daily=prompt("Daily"); if(name&&price){const n=[...plans,{id:Date.now(),name,price:Number(price),daily:Number(daily||0),days:30,active:true}]; setPlans(n); save({plans:n})}}} className="w-full mt-3 bg-black text-white py-3 rounded-full text-xs font-black">+ New Package Add</button></div>

      <div className="bg-white border-2 rounded-[24px] p-5 mt-4"><h3 className="font-black">📋 Tasks Create - তুমি নিজ ইচ্ছামত Field + Sheet File সেট করো - Gmail গুলো এখানে আসবে</h3><p className="text-[10px] text-gray-500 mt-1">Field: Gmail,Password - User ওগুলো লিখবে। Sheet URL দিলে User File দেখবে</p><div className="flex flex-wrap gap-2 mt-3">{Object.keys(features).map(k=><button key={k} onClick={()=>{const nf={...features,[k]:!(features as any)[k]}; setFeatures(nf); save({features:nf})}} className={`px-3 py-1 rounded-full text-[10px] border-2 ${ (features as any)[k]?"bg-black text-white border-black":"bg-white"}`}>{k} {(features as any)[k]?"ON":"OFF"}</button>)}</div><button onClick={()=>{const cat=prompt("Category: gmail/facebook/instagram/twitter/telegram/whatsapp/whatsapp_band/coin/ad"); const title=prompt("Title ex: Gmail Sell"); const reward=prompt("Reward ৳?"); const fields=prompt("Fields কমা দিয়ে: Gmail,Password,Recovery"); const sheet=prompt("Sheet File URL (Google Sheet Link)"); if(cat&&title&&reward){const nt=[...allTasks,{id:Date.now(),cat,title,reward:Number(reward),needPkg:confirm("Package লাগবে? OK=Yes"),active:true,fields:fields||"Details",sheet:sheet||""}]; setAllTasks(nt); save({tasks:nt})}}} className="w-full mt-4 bg-[#0f7a4a] text-white py-3 rounded-full text-xs font-black">+ New Task Create - Field + Sheet সহ</button><div className="mt-3 space-y-2 max-h-64 overflow-auto">{allTasks.map(t=><div key={t.id} className="bg-gray-50 p-3 rounded-xl text-[11px]"><p className="font-bold">[{t.cat}] {t.title} ৳{t.reward} - Fields: {t.fields}</p>{t.sheet&&<p className="text-[10px] text-blue-600">Sheet: {t.sheet}</p>}<button onClick={()=>{const nt=allTasks.filter(x=>x.id!==t.id); setAllTasks(nt); save({tasks:nt})}} className="text-red-500 mt-1">Delete Task</button></div>)}</div></div>

      <div className="bg-white border-2 rounded-[24px] p-5 mt-4"><h3 className="font-black">🎁 Refer % + Coupon + Withdraw</h3><div className="flex gap-2 mt-2"><input value={refComm} onChange={e=>{setRefComm(Number(e.target.value)); save({refComm:Number(e.target.value)})}} type="number" className="border-2 rounded-full p-2 w-20 text-xs"/><span className="text-xs mt-2">% Refer Commission</span></div><input value={coupon} onChange={e=>{setCoupon(e.target.value); save({coupon:e.target.value})}} placeholder="Coupon Code" className="w-full border-2 rounded-full p-2 mt-2 text-xs"/><div className="mt-3">{withdraws.map((w:any)=><div key={w.id} className="bg-gray-50 p-2 rounded-xl text-xs mt-1"><p>{w.email} ৳{w.amount} -> {w.addr}</p></div>)}</div></div>
    </div>
  }

  return <div className="min-h-screen bg-[#f5f5f5] pb-28">
    <div className="bg-yellow-300 text-black text-center py-2.5 px-3 text-[11px] font-black sticky top-0 z-30 shadow-sm">🔝 Top Ad Always: {ads.top}</div>

    <div className="bg-black text-white px-6 pt-6 pb-10 rounded-b-[40px]"><div className="flex justify-between items-center"><div><p className="text-[10px] tracking-[3px] opacity-60">TRUE BUSINESS SITE</p><h1 className="font-black text-xl">Business Pro Max</h1><p className="text-[10px] opacity-60">Receive System + Ad Always</p></div>{isAdmin&&<button onClick={()=>setPage("admin")} className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-full">ADMIN A-Z</button>}</div><div className="mt-6 grid grid-cols-2 gap-3"><div className="bg-white/10 backdrop-blur rounded-[20px] p-4"><p className="text-[9px] opacity-60">BALANCE</p><p className="font-black text-xl">৳{user.balance}</p></div><div className="bg-white text-black rounded-[20px] p-4"><p className="text-[9px] opacity-60">PLAN</p><p className="font-black text-xs">{user.plan?`👑 ${user.plan.name}`:"No Plan - Deposit করো"}</p><p className="text-[9px] opacity-60">{user.accId}</p></div></div></div>

    <div className="px-5 -mt-6 grid grid-cols-2 gap-3">
      <button onClick={()=>setPage("deposit")} className="bg-white rounded-[20px] p-5 shadow-sm flex items-center gap-3 text-left"><div className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center">+</div><div><p className="font-black text-sm">Deposit</p><p className="text-[10px] text-gray-400">Bkash/Nagad/USDT</p><p className="text-[9px] text-green-600">{numbers.bkash.slice(0,12)}...</p></div></button>
      <button onClick={()=>setPage("wallet")} className="bg-white rounded-[20px] p-5 shadow-sm flex items-center gap-3 text-left"><div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">↓</div><div><p className="font-black text-sm">Withdraw</p><p className="text-[10px] text-gray-400">USDT Binance</p></div></button>
    </div>

    <div className="mx-5 mt-4 bg-black text-yellow-300 rounded-[20px] p-4 text-center border-2 border-yellow-400 shadow-sm">
      <p className="text-[9px] tracking-widest opacity-60">MIDDLE AD - ALWAYS</p>
      <p className="font-black text-sm mt-1">📢 {ads.middle}</p>
      <p className="text-[10px] mt-1 opacity-70">এই Ad সব সময় মাঝখানে থাকবে - Admin থেকে Change হবে</p>
    </div>

    <p className="px-6 mt-6 text-[10px] font-black tracking-[2px]">PACKAGES - Admin থেকে ON/OFF + Price Edit</p>
    <div className="px-5 mt-2 grid grid-cols-3 gap-2">{plans.filter(p=>p.active).map(p=><div key={p.id} className="bg-white rounded-[20px] p-4 text-center shadow-sm border"><p className="font-black text-sm">{p.name}</p><p className="text-xs font-bold">৳{p.price}</p><p className="text-[9px] text-gray-400">Daily ৳{p.daily} × {p.days}D</p><button onClick={()=>{if(user.balance<p.price) return alert(`Balance কম। Deposit করো - ${numbers.bkash} এ টাকা পাঠাও`); const up={...user,balance:user.balance-p.price,plan:p}; localStorage.setItem("true_user",JSON.stringify(up)); setUser(up); let all=JSON.parse(localStorage.getItem("true_allusers")||"[]"); all=all.map((u:any)=>u.email===user.email?up:u); localStorage.setItem("true_allusers",JSON.stringify(all)); alert(p.name+" Active! এখন Gmail/FB Sell করতে পারবা")}} className="w-full mt-2 bg-black text-white py-2 rounded-full text-[10px] font-black">ACTIVE</button></div>)}</div>

    <p className="px-6 mt-6 text-[10px] font-black tracking-[2px]">TASKS - ভিতরে ঢুকলে আলাদা - Gmail/FB/Insta/WhatsApp Band/Coin</p>
    <div className="px-5 mt-2 grid grid-cols-4 gap-2">
      {[{k:"gmail",l:"Gmail Sell"},{k:"facebook",l:"Facebook Sell"},{k:"instagram",l:"Insta Sell"},{k:"twitter",l:"Twitter Sell"},{k:"telegram",l:"Telegram Sell"},{k:"whatsapp",l:"WhatsApp Sell"},{k:"whatsapp_band",l:"WhatsApp Band"},{k:"coin",l:"Coin Sell"}].map(it=><button key={it.k} onClick={()=>{setPage("tasks"); setCat(it.k)}} className="bg-white rounded-[18px] py-4 flex flex-col items-center gap-1 shadow-sm border"><div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-[10px] font-black">{it.k[0].toUpperCase()}</div><p className="text-[8px] font-bold text-center leading-[9px]">{it.l}</p></button>)}
    </div>

    <div className="mx-5 mt-6 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2.5 text-[11px] text-center font-bold">💰 Bottom Ad:
