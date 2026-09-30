import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: FinalBusiness })

function FinalBusiness(){
  const ADMIN="fscnajmul2026@gmail.com"
  const [email,setEmail]=useState("")
  const [user,setUser]=useState<any>(null)
  const [page,setPage]=useState("home")
  const [taskCat,setTaskCat]=useState("gmail")

  const [numbers,setNumbers]=useState({bkash:"017XXXXXXXX",nagad:"018XXXXXXXX",usdt:"TXYZ...123 TRC20"})
  const [plans,setPlans]=useState([
    {id:1,name:"Starter",price:500,daily:80},
    {id:2,name:"Pro",price:1500,daily:250},
    {id:3,name:"VIP",price:5000,daily:900},
  ])
  // সব টাস্ক - এডমিন থেকে A to Z সেট হবে
  const [allTasks,setAllTasks]=useState<any[]>([
    {id:1,cat:"gmail",title:"Fresh Gmail Sell - 2024 Old",reward:120,needPkg:true,active:true},
    {id:2,cat:"gmail",title:"Aged Gmail Sell - 2 Year Old",reward:250,needPkg:true,active:true},
    {id:3,cat:"instagram",title:"Instagram Account Sell - 1k Followers",reward:200,needPkg:true,active:true},
    {id:4,cat:"instagram",title:"Instagram Follow + Like Task",reward:30,needPkg:false,active:true},
    {id:5,cat:"twitter",title:"Twitter Sell - Old Account",reward:180,needPkg:true,active:true},
    {id:6,cat:"facebook",title:"Facebook Profile Sell",reward:150,needPkg:true,active:true},
    {id:7,cat:"facebook",title:"Facebook Page Sell - 5k Likes",reward:400,needPkg:true,active:true},
    {id:8,cat:"telegram",title:"Telegram Account Sell",reward:80,needPkg:false,active:true},
    {id:9,cat:"whatsapp",title:"WhatsApp Account Sell",reward:100,needPkg:false,active:true},
    {id:10,cat:"whatsapp_band",title:"WhatsApp Band Fix Service",reward:300,needPkg:true,active:true},
    {id:11,cat:"coin",title:"USDT Buy Sell - Coin Task",reward:100,needPkg:true,active:true},
  ])
  const [features,setFeatures]=useState({gmail:true,instagram:true,twitter:true,facebook:true,telegram:true,whatsapp:true,whatsapp_band:true,coin:true})
  const [deposits,setDeposits]=useState<any[]>([])
  const [ads,setAds]=useState("Adsterra Ad - 10s দেখতে হবে")
  const [dM,setDM]=useState("bkash")
  const [dA,setDA]=useState("")
  const [dT,setDT]=useState("")
  const [count,setCount]=useState(10)
  const [adOpen,setAdOpen]=useState(false)
  const [canDo,setCanDo]=useState(false)
  const [activeTask,setActiveTask]=useState<any>(null)

  useEffect(()=>{
    const u=localStorage.getItem("final_user")
    if(u) setUser(JSON.parse(u))
    const n=localStorage.getItem("final_numbers"); if(n) setNumbers(JSON.parse(n))
    const dep=localStorage.getItem("final_deps"); if(dep) setDeposits(JSON.parse(dep))
    const t=localStorage.getItem("final_tasks"); if(t) setAllTasks(JSON.parse(t))
    const f=localStorage.getItem("final_features"); if(f) setFeatures(JSON.parse(f))
  },[])
  useEffect(()=>{
    if(adOpen && count>0){const tt=setTimeout(()=>setCount(c=>c-1),1000); return()=>clearTimeout(tt)}
    if(count===0) setCanDo(true)
  },[adOpen,count])

  const login=()=>{
    if(!email) return alert("Email দাও")
    let all=JSON.parse(localStorage.getItem("final_allusers")||"[]")
    let f=all.find((x:any)=>x.email===email)
    let u=f || {email,accId:"#BIZ"+Math.floor(10000+Math.random()*90000),balance:0,plan:null}
    if(!f){all=[...all,u]; localStorage.setItem("final_allusers",JSON.stringify(all))}
    localStorage.setItem("final_user",JSON.stringify(u))
    setUser(u)
  }

  const isAdmin=user?.email===ADMIN
  const filteredTasks=allTasks.filter(t=>t.cat===taskCat && t.active && (features as any)[t.cat])

  if(!user) return <div className="min-h-screen bg-black flex items-center justify-center p-6"><div className="bg-white w-full max-w-sm rounded-[32px] p-8"><p className="text-[10px] font-black tracking-widest text-gray-400">PROPER BUSINESS SITE</p><h1 className="text-3xl font-black mt-1">Business Pro</h1><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-6 border-2 border-black rounded-full p-4 text-sm"/><button onClick={login} className="w-full mt-4 bg-black text-white py-4 rounded-full font-black">LOGIN</button><p className="text-[10px] text-center mt-3">Admin: {ADMIN}</p></div></div>

  if(page==="admin" && isAdmin){
    return <div className="min-h-screen bg-white p-4 pb-24"><button onClick={()=>setPage("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← Home</button><h1 className="text-xl font-black mt-4">ADMIN - A to Z Control</h1><p className="text-xs text-green-600 font-bold">{ADMIN}</p>
      <div className="bg-black text-white rounded-[24px] p-5 mt-4"><h3 className="font-black text-sm">💳 Deposit Numbers</h3><input value={numbers.bkash} onChange={e=>{const n={...numbers,bkash:e.target.value}; setNumbers(n); localStorage.setItem("final_numbers",JSON.stringify(n))}} placeholder="Bkash" className="w-full bg-white/10 border rounded-full p-2 mt-2 text-xs"/><input value={numbers.nagad} onChange={e=>{const n={...numbers,nagad:e.target.value}; setNumbers(n); localStorage.setItem("final_numbers",JSON.stringify(n))}} placeholder="Nagad" className="w-full bg-white/10 border rounded-full p-2 mt-2 text-xs"/><input value={numbers.usdt} onChange={e=>{const n={...numbers,usdt:e.target.value}; setNumbers(n); localStorage.setItem("final_numbers",JSON.stringify(n))}} placeholder="USDT" className="w-full bg-white/10 border rounded-full p-2 mt-2 text-xs"/></div>
      <div className="bg-yellow-50 border-2 rounded-[24px] p-5 mt-3"><h3 className="font-black text-sm">💰 Deposit Accept</h3>{deposits.filter((d:any)=>d.status==="pending").map((d:any)=><div key={d.id} className="bg-white p-3 rounded-xl mt-2 text-xs"><p>{d.email} ৳{d.amount} {d.method} Trx:{d.trx}</p><button onClick={()=>{const nd=deposits.map((x:any)=>x.id===d.id?{...x,status:"approved"}:x); setDeposits(nd); localStorage.setItem("final_deps",JSON.stringify(nd)); let all=JSON.parse(localStorage.getItem("final_allusers")||"[]"); all=all.map((u:any)=>u.email===d.email?{...u,balance:u.balance+d.amount}:u); localStorage.setItem("final_allusers",JSON.stringify(all)); if(user.email===d.email){const up={...user,balance:user.balance+d.amount}; setUser(up); localStorage.setItem("final_user",JSON.stringify(up))}}} className="bg-black text-white px-3 py-1 rounded-full mt-1">Accept</button></div>)}</div>
      <div className="bg-white border rounded-[24px] p-5 mt-3"><h3 className="font-black text-sm">📋 Tasks - আলাদা আলাদা - Gmail/FB/Insta etc A to Z</h3><div className="flex flex-wrap gap-2 mt-2">{Object.keys(features).map(k=><button key={k} onClick={()=>{const nf={...features,[k]:!(features as any)[k]}; setFeatures(nf); localStorage.setItem("final_features",JSON.stringify(nf))}} className={`px-3 py-1 rounded-full text-[10px] border ${(features as any)[k]?"bg-black text-white":"bg-gray-100"}`}>{k} {(features as any)[k]?"ON":"OFF"}</button>)}</div><button onClick={()=>{const cat=prompt("Category: gmail/instagram/twitter/facebook/telegram/whatsapp/whatsapp_band/coin"); const title=prompt("Task Title"); const reward=prompt("Reward ৳?"); if(cat&&title&&reward){const nt=[...allTasks,{id:Date.now(),cat,title,reward:Number(reward),needPkg:confirm("Package লাগবে?"),active:true}]; setAllTasks(nt); localStorage.setItem("final_tasks",JSON.stringify(nt))}}} className="w-full mt-3 bg-[#0f7a4a] text-white py-2 rounded-full text-xs font-bold">+ New Task Add</button><div className="mt-3 space-y-2">{allTasks.map(t=><div key={t.id} className="flex justify-between text-[11px] bg-gray-50 p-2 rounded-xl"><span>[{t.cat}] {t.title} ৳{t.reward}</span><button onClick={()=>{const nt=allTasks.filter(x=>x.id!==t.id); setAllTasks(nt); localStorage.setItem("final_tasks",JSON.stringify(nt))}} className="text-red-500">Del</button></div>)}</div></div>
    </div>
  }

  return <div className="min-h-screen bg-[#f5f5f5] pb-28">
    <div className="bg-black text-white px-6 pt-6 pb-10 rounded-b-[40px]"><div className="flex justify-between"><div><p className="text-[10px] tracking-widest opacity-60">PROPER BUSINESS</p><h1 className="font-black text-xl">Business Pro Max</h1></div>{isAdmin&&<button onClick={()=>setPage("admin")} className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-full">ADMIN A-Z</button>}</div><div className="mt-6 bg-white/10 rounded-[20px] p-4 flex justify-between"><div><p className="text-[9px] opacity-60">BALANCE</p><p className="font-black text-xl">৳{user.balance}</p></div><div className="text-right"><p className="text-[9px] opacity-60">{user.accId}</p><p className="text-[10px]">{user.plan?`👑 ${user.plan.name}`:"No Plan - Deposit করো"}</p></div></div></div>

    <div className="px-5 -mt-6 grid grid-cols-2 gap-3"><button onClick={()=>setPage("deposit")} className="bg-white rounded-[20px] p-5 shadow-sm flex items-center gap-3 text-left"><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">+</div><div><p className="font-black text-sm">Deposit</p><p className="text-[10px] text-gray-400">{numbers.bkash.slice(0,13)}...</p></div></button><button className="bg-white rounded-[20px] p-5 shadow-sm flex items-center gap-3 text-left"><div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">↓</div><div><p className="font-black text-sm">Withdraw</p><p className="text-[10px] text-gray-400">USDT Binance</p></div></button></div>

    <div className="mx-5 mt-4 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 text-[11px] text-center font-bold">📢 {ads}</div>

    <p className="px-6 mt-6 text-[10px] font-black tracking-widest">INVESTMENT PLANS</p>
    <div className="px-5 mt-2 grid grid-cols-3 gap-2">{plans.map(p=><div key={p.id} className="bg-white rounded-[18px] p-4 text-center"><p className="font-black text-sm">{p.name}</p><p className="text-xs">৳{p.price}</p><p className="text-[9px] text-gray-400">Daily ৳{p.daily}</p><button onClick={()=>{if(user.balance<p.price) return alert("Balance কম - Deposit করো"); const up={...user,balance:user.balance-p.price,plan:p}; localStorage.setItem("final_user",JSON.stringify(up)); setUser(up)}} className="w-full mt-2 bg-black text-white py-1.5 rounded-full text-[10px]">ACTIVE</button></div>)}</div>

    <p className="px-6 mt-6 text-[10px] font-black tracking-widest">TASKS - ভিতরে ঢুকলে আলাদা আলাদা</p>
    <div className="px-5 mt-2 grid grid-cols-4 gap-2">
      {[{k:"gmail",l:"Gmail Sell"},{k:"instagram",l:"Insta Sell"},{k:"twitter",l:"Twitter Sell"},{k:"facebook",l:"Facebook Sell"},{k:"telegram",l:"Telegram Sell"},{k:"whatsapp",l:"WhatsApp Sell"},{k:"whatsapp_band",l:"WhatsApp Band"},{k:"coin",l:"Coin Sell"}].map(it=><button key={it.k} disabled={!(features as any)[it.k]} onClick={()=>{setPage("tasks"); setTaskCat(it.k)}} className={`bg-white rounded-[16px] py-4 flex flex-col items-center gap-1 shadow-sm ${(features as any)[it.k]?"":"opacity-30"}`}><div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-xs font-black">{it.k[0].toUpperCase()}</div><p className="text-[8px] font-bold text-center leading-[10px]">{it.l}</p></button>)}
    </div>

    {page==="tasks" && (
      <div className="fixed inset-0 bg-[#f5f5f5] z-40 overflow-auto pb-20"><div className="bg-black text-white p-4 flex justify-between"><button onClick={()=>setPage("home")} className="bg-white/20 px-3 py-1 rounded-full text-xs">← Back</button><b className="uppercase">{taskCat} Tasks</b><span className="w-10"></span></div><div className="bg-yellow-100 m-4 p-3 rounded-xl text-xs text-center">📢 {ads} - 10s দেখতে হবে</div>
        <div className="px-4 flex gap-2 overflow-auto pb-2">{Object.keys(features).map(k=><button key={k} onClick={()=>setTaskCat(k)} className={`px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap ${taskCat===k?"bg-black text-white":"bg-white border"}`}>{k}</button>)}</div>
        <div className="p-4 space-y-3">{filteredTasks.length===0?<p className="text-xs text-center text-gray-400 mt-10">No Task in {taskCat} - Admin থেকে Add করো</p>:filteredTasks.map(t=><div key={t.id} className="bg-white rounded-[18px] p-4 shadow-sm"><div className="flex justify-between"><span className="text-[9px] bg-black text-white px-2 py-1 rounded-full">{t.cat}</span><span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">৳{t.reward}</span></div><p className="font-bold text-sm mt-2">{t.title}</p><p className="text-[10px] text-gray-400">{t.needPkg?"🔒 Plan লাগবে":"✅ Free"}</p><button onClick={()=>{if(t.needPkg &&!user.plan) return alert("Plan Active করো"); setActiveTask(t); setAdOpen(true); setCount(10); setCanDo(false)}} className="w-full mt-3 bg-black text-white py-3 rounded-full text-xs font-bold">START TASK - 10s Ad</button></div>)}</div>
      </div>
    )}

    {page==="deposit" && (
      <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto"><button onClick={()=>setPage("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← Back</button><h1 className="text-xl font-black mt-4">Deposit - Number Admin সেট করেছে</h1><div className="flex gap-2 mt-4"><button onClick={()=>setDM("bkash")} className={`px-4 py-2 rounded-full text-xs border-2 ${dM==="bkash"?"bg-black text-white":"bg-white"}`}>Bkash</button><button onClick={()=>setDM("nagad")} className={`px-4 py-2 rounded-full text-xs border-2 ${dM==="nagad"?"bg-black text-white":"bg-white"}`}>Nagad</button><button onClick={()=>setDM("usdt")} className={`px-4 py-2 rounded-full text-xs border-2 ${dM==="usdt"?"bg-yellow-400":"bg-white"}`}>USDT Binance</button></div><div className="bg-black text-white rounded-[20px] p-5 mt-4 text-center"><p className="text-[10px] opacity-60">SEND TO</p><p className="font-black text-lg mt-1">{numbers[dM as keyof typeof numbers]}</p><button onClick={()=>navigator.clipboard.writeText(numbers[dM as keyof typeof numbers])} className="bg-white text-black px-3 py-1 rounded-full text-[10px] mt-2">Copy</button></div><input value={dA} onChange={e=>setDA(e.target.value)} placeholder="Amount" className="w-full border-2 border-black rounded-full p-3 mt-4 text-sm"/><input value={dT} onChange={e=>setDT(e.target.value)} placeholder="TrxID / Hash" className="w-full border-2 border-black rounded-full p-3 mt-2 text-sm"/><button onClick={()=>{if(!dA||!dT) return alert("Amount+TrxID দাও"); const req={id:Date.now(),email:user.email,method:dM,amount:Number(dA),trx:dT,toNumber:numbers[dM as keyof typeof numbers],status:"pending"}; const nd=[...deposits,req]; setDeposits(nd); localStorage.setItem("final_deps",JSON.stringify(nd)); alert("Request Sent - Admin Accept করবে"); setPage("home")}} className="w-full mt-4 bg-black text-white py-3 rounded-full font-black">Submit</button></div>
    )}

    {adOpen && activeTask && <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-5 z-[60]"><div className="bg-white rounded-[28px] w-full max-w-sm p-6 text-center"><h2 className="font-black">10s Ad {count}s</h2><div className="bg-yellow-50 border-2 border-dashed rounded-2xl p-5 mt-3"><p className="text-xs">{ads}</p><div className="w-full bg-gray-200 h-2 rounded-full mt-2"><div className="bg-black h-2 rounded-full" style={{width:`${(10-count)*10}%`}}></div></div></div><p className="text-3xl font-black mt-3">{count>0?count:"✅"}</p>{canDo?<button onClick={()=>{alert(`Task Done ৳${activeTask.reward} - Proof জমা হয়েছে`); setAdOpen(false)}} className="w-full mt-3 bg-black text-white py-3 rounded-full font-bold">Submit Proof - ৳{activeTask.reward}</button>:<button disabled className="w-full mt-3 bg-gray-200 py-3 rounded-full">Wait {count}s - Ad দেখো</button>}</div></div>}

    <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-[26px] flex justify-around py-3"><button onClick={()=>setPage("home")} className="flex flex-col items-center"><span>🏠</span><span className="text-[9px] font-black">Home</span></button><button onClick={()=>setPage("tasks")} className="flex flex-col items-center opacity-60"><span>📋</span><span className="text-[9px]">Tasks</span></button><button onClick={()=>setPage("deposit")} className="flex flex-col items-center opacity-60"><span>💰</span><span className="text-[9px]">Wallet</span></button><button className="flex flex-col items-center opacity-60"><span>🎧</span><span className="text-[9px]">Support</span></button></div>
  </div>
}
