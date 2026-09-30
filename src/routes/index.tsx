import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: App })

function App(){
  const ADMIN="fscnajmul2026@gmail.com"
  const [email,setEmail]=useState("")
  const [user,setUser]=useState<any>(null)
  const [page,setPage]=useState("home")
  const [cat,setCat]=useState("fb_cookies")

  const [ads,setAds]=useState({top:"Top Ad Always - Adsterra",middle:"Middle Ad Always - 728x90 Banner",task:"10s Video Ad Must Watch"})
  const [numbers,setNumbers]=useState({bkash:"017XXXXXXXX",usdt:"USDT TRC20 Binance"})
  const [plans,setPlans]=useState([
    {id:1,name:"Starter",price:500,active:true},
    {id:2,name:"Pro",price:1500,active:true},
    {id:3,name:"VIP",price:5000,active:true},
  ])
  const [tasks,setTasks]=useState([
    {id:1,cat:"fb_cookies",title:"Facebook Cookies Sell",reward:180,active:true,fields:"c_user,xs Cookie,Link"},
    {id:2,cat:"ig_cookies",title:"Instagram Cookies Sell",reward:200,active:true,fields:"sessionid Cookie,Username"},
    {id:3,cat:"social_visit",title:"Telegram Channel Join",reward:15,active:true,fields:"Telegram Link,Screenshot"},
    {id:4,cat:"social_visit",title:"Facebook Like + Follow",reward:20,active:true,fields:"FB Page Link,Screenshot"},
    {id:5,cat:"social_visit",title:"Instagram Video View + Like",reward:25,active:true,fields:"Insta Video Link,Screenshot"},
    {id:6,cat:"visa",title:"Visa Card Service",reward:500,active:true,fields:"Card Number,Expiry,CVV"},
    {id:7,cat:"gmail",title:"Gmail Sell",reward:120,active:true,fields:"Gmail,Password,Recovery"},
    {id:8,cat:"coin",title:"USDT Coin Sell",reward:100,active:true,fields:"Amount,Hash,Address"},
  ])
  const [subs,setSubs]=useState<any[]>([])
  const [deps,setDeps]=useState<any[]>([])
  const [features,setFeatures]=useState<any>({fb_cookies:true,ig_cookies:true,social_visit:true,visa:true,gmail:true,coin:true,facebook:true})

  const [dM,setDM]=useState("bkash")
  const [dA,setDA]=useState("")
  const [dT,setDT]=useState("")
  const [count,setCount]=useState(10)
  const [adOpen,setAdOpen]=useState(false)
  const [canDo,setCanDo]=useState(false)
  const [active,setActive]=useState<any>(null)
  const [form,setForm]=useState<any>({})

  useEffect(()=>{
    try{
      const u=localStorage.getItem("fresh_user")
      if(u) setUser(JSON.parse(u))
      const d=JSON.parse(localStorage.getItem("fresh_data")||"{}")
      if(d.ads) setAds(d.ads)
      if(d.tasks) setTasks(d.tasks)
      if(d.deps) setDeps(d.deps)
      if(d.subs) setSubs(d.subs)
      if(d.features) setFeatures(d.features)
      if(d.numbers) setNumbers(d.numbers)
      if(d.plans) setPlans(d.plans)
    }catch{}
  },[])

  const save=(extra:any={})=>{
    localStorage.setItem("fresh_data",JSON.stringify({ads,tasks,deps,subs,features,numbers,plans,...extra}))
  }

  useEffect(()=>{
    if(adOpen && count>0){
      const t=setTimeout(()=>setCount(c=>c-1),1000)
      return()=>clearTimeout(t)
    }
    if(count===0) setCanDo(true)
  },[adOpen,count])

  const login=()=>{
    if(!email) return alert("Email দাও")
    let all=JSON.parse(localStorage.getItem("fresh_all")||"[]")
    let f=all.find((x:any)=>x.email===email)
    let u=f || {email,accId:"#BIZ"+Math.floor(10000+Math.random()*90000),balance:0,plan:null}
    if(!f){all=[...all,u]; localStorage.setItem("fresh_all",JSON.stringify(all))}
    localStorage.setItem("fresh_user",JSON.stringify(u))
    setUser(u)
  }

  const isAdmin=user?.email===ADMIN
  const filtered=tasks.filter(t=>t.cat===cat && t.active && features[t.cat])

  if(!user){
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[32px] p-8">
          <h1 className="text-3xl font-black">Business Pro Max</h1>
          <p className="text-xs mt-2">Visa + FB Cookies + IG Cookies + Social Visit</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-6 border-2 border-black rounded-full p-4 text-sm"/>
          <button onClick={login} className="w-full mt-4 bg-black text-white py-4 rounded-full font-black">LOGIN</button>
          <p className="text-[10px] text-center mt-3">{ADMIN}</p>
        </div>
      </div>
    )
  }

  if(page==="admin" && isAdmin){
    return (
      <div className="min-h-screen bg-white p-4 pb-32">
        <button onClick={()=>setPage("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← Back</button>
        <h1 className="text-xl font-black mt-4">ADMIN - Full Control</h1>
        <p className="text-xs text-green-600 font-bold">{ADMIN}</p>

        <div className="bg-black text-white rounded-[24px] p-5 mt-4">
          <h3 className="font-black">📢 Ad Control - Always</h3>
          <p className="text-[10px] mt-3 opacity-60">Top Ad Always</p>
          <textarea value={ads.top} onChange={e=>{const n={...ads,top:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-14"/>
          <p className="text-[10px] mt-3 opacity-60">Middle Ad Always</p>
          <textarea value={ads.middle} onChange={e=>{const n={...ads,middle:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-20"/>
          <p className="text-[10px] mt-3 opacity-60">Task Ad 10s</p>
          <textarea value={ads.task} onChange={e=>{const n={...ads,task:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-1 text-xs h-14"/>
        </div>

        <div className="bg-white border-2 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">🎛️ Control - FB Cookies, IG Cookies, Social Visit, Visa</h3>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Object.keys(features).map(k=>(
              <div key={k} className="bg-gray-50 border p-3 rounded-xl flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase">{k}</span>
                <button onClick={()=>{const nf={...features,[k]:!features[k]}; setFeatures(nf); save({features:nf})}} className={`px-3 py-1 rounded-full text-[10px] ${features[k]?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{features[k]?"ON":"OFF"}</button>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            {tasks.map(t=>(
              <div key={t.id} className="bg-gray-50 border p-3 rounded-xl text-xs">
                <p className="font-bold">[{t.cat}] {t.title} - ৳{t.reward}</p>
                <p className="text-[10px]">Fields: {t.fields}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <button onClick={()=>{const r=prompt("New Reward",String(t.reward)); if(r){const nt=tasks.map(x=>x.id===t.id?{...x,reward:Number(r)}:x); setTasks(nt); save({tasks:nt})}}} className="bg-black text-white px-2 py-1 rounded-full">Price</button>
                  <button onClick={()=>{const f=prompt("Fields",t.fields); if(f){const nt=tasks.map(x=>x.id===t.id?{...x,fields:f}:x); setTasks(nt); save({tasks:nt})}}} className="bg-blue-600 text-white px-2 py-1 rounded-full">Field</button>
                  <button onClick={()=>{const nt=tasks.map(x=>x.id===t.id?{...x,active:!x.active}:x); setTasks(nt); save({tasks:nt})}} className={`px-2 py-1 rounded-full ${t.active?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{t.active?"ON":"OFF"}</button>
                  <button onClick={()=>{const nt=tasks.filter(x=>x.id!==t.id); setTasks(nt); save({tasks:nt})}} className="text-red-500">Del</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>{const cat=prompt("Category: fb_cookies/ig_cookies/social_visit/visa"); const title=prompt("Title"); const reward=prompt("Reward"); const fields=prompt("Fields"); if(cat&&title){const nt=[...tasks,{id:Date.now(),cat,title,reward:Number(reward||0),active:true,fields}]; setTasks(nt); save({tasks:nt})}}} className="w-full mt-4 bg-black text-white py-3 rounded-full text-xs font-black">+ New Task Add</button>
        </div>

        <div className="bg-green-50 border-2 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">📥 Receive Inbox</h3>
          {subs.map((s:any)=>(
            <div key={s.id} className="bg-white border p-3 rounded-xl mt-2 text-xs">
              <p className="font-bold">[{s.cat}] {s.title} - {s.email} ৳{s.reward}</p>
              <div className="bg-gray-50 p-2 rounded mt-1">{Object.keys(s.data).map(k=><p key={k}><b>{k}:</b> {s.data[k]}</p>)}</div>
              <button onClick={()=>{const nd=subs.map((x:any)=>x.id===s.id?{...x,status:"approved"}:x); setSubs(nd); save({subs:nd}); let all=JSON.parse(localStorage.getItem("fresh_all")||"[]"); all=all.map((u:any)=>u.email===s.email?{...u,balance:u.balance+s.reward}:u); localStorage.setItem("fresh_all",JSON.stringify(all))}} className="bg-green-600 text-white px-3 py-1 rounded-full mt-2">Approve ৳{s.reward}</button>
            </div>
          ))}
        </div>

        <div className="bg-black text-white rounded-[24px] p-5 mt-4">
          <h3 className="font-black">💳 Deposit Numbers</h3>
          <input value={numbers.bkash} onChange={e=>{const n={...numbers,bkash:e.target.value}; setNumbers(n); save({numbers:n})}} className="w-full bg-white/10 border rounded-full p-2 mt-2 text-xs"/>
          <input value={numbers.usdt} onChange={e=>{const n={...numbers,usdt:e.target.value}; setNumbers(n); save({numbers:n})}} className="w-full bg-white/10 border rounded-full p-2 mt-2 text-xs"/>
        </div>

        <div className="bg-yellow-50 border-2 rounded-[24px] p-5 mt-4">
          <h3 className="font-black">💰 Deposits</h3>
          {deps.filter((d:any)=>d.status==="pending").map((d:any)=>(
            <div key={d.id} className="bg-white p-3 rounded-xl mt-2 text-xs">
              <p>{d.email} ৳{d.amount} Trx:{d.trx}</p>
              <button onClick={()=>{const nd=deps.map((x:any)=>x.id===d.id?{...x,status:"approved"}:x); setDeps(nd); save({deps:nd}); let all=JSON.parse(localStorage.getItem("fresh_all")||"[]"); all=all.map((u:any)=>u.email===d.email?{...u,balance:u.balance+d.amount}:u); localStorage.setItem("fresh_all",JSON.stringify(all))}} className="bg-black text-white px-3 py-1 rounded-full mt-1">Accept</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-28">
      <div className="bg-yellow-300 text-black text-center py-2.5 px-3 text-[11px] font-black sticky top-0 z-30">🔝 {ads.top}</div>
      <div className="bg-black text-white px-6 pt-6 pb-10 rounded-b-[40px]">
        <div className="flex justify-between">
          <h1 className="font-black text-xl">Business Pro Max</h1>
          {isAdmin&&<button onClick={()=>setPage("admin")} className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-full">ADMIN CONTROL</button>}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-[20px] p-4"><p className="text-[9px] opacity-60">BALANCE</p><p className="font-black text-xl">৳{user.balance}</p></div>
          <div className="bg-white text-black rounded-[20px] p-4"><p className="text-[9px] opacity-60">PLAN</p><p className="font-black text-xs">{user.plan?user.plan.name:"No Plan"}</p></div>
        </div>
      </div>

      <div className="px-5 -mt-6 grid grid-cols-2 gap-3">
        <button onClick={()=>setPage("deposit")} className="bg-white rounded-[20px] p-5 shadow-sm flex items-center gap-3"><div className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center">+</div><div><p className="font-black text-sm">Deposit</p></div></button>
        <button className="bg-white rounded-[20px] p-5 shadow-sm flex items-center gap-3"><div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">↓</div><div><p className="font-black text-sm">Withdraw</p></div></button>
      </div>

      <div className="mx-5 mt-4 bg-black text-yellow-300 rounded-[20px] p-4 text-center border-2 border-yellow-400">
        <p className="text-[9px] opacity-60">MIDDLE AD ALWAYS</p>
        <p className="font-black text-sm mt-1">{ads.middle}</p>
      </div>

      <p className="px-6 mt-6 text-[10px] font-black">NEW TASKS - FB Cookies + IG Cookies + Social Visit + Visa</p>
      <div className="px-5 mt-2 grid grid-cols-4 gap-2">
        {[
          {k:"fb_cookies",l:"FB Cookies"},
          {k:"ig_cookies",l:"IG Cookies"},
          {k:"social_visit",l:"Social Visit"},
          {k:"visa",l:"Visa"},
          {k:"gmail",l:"Gmail"},
          {k:"coin",l:"Coin"},
        ].map(it=>(
          <button key={it.k} onClick={()=>{setPage("tasks"); setCat(it.k)}} className={`bg-white rounded-[18px] py-4 flex flex-col items-center gap-1 shadow-sm border ${features[it.k]?"":"opacity-30"}`}>
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-[9px] font-black">{it.k[0].toUpperCase()}</div>
            <p className="text-[8px] font-bold text-center">{it.l}</p>
          </button>
        ))}
      </div>

      {page==="tasks"&&(
        <div className="fixed inset-0 bg-[#f5f5f5] z-40 overflow-auto pb-20">
          <div className="bg-black text-white p-4 flex justify-between"><button onClick={()=>setPage("home")} className="bg-white/20 px-3 py-1 rounded-full text-xs">← Back</button><b className="uppercase text-sm">{cat}</b><span className="w-10"></span></div>
          <div className="bg-yellow-300 text-center py-2 text-[11px] font-bold">{ads.top}</div>
          <div className="bg-black text-yellow-300 m-4 rounded-[20px] p-4 text-center"><p className="font-bold text-sm">{ads.middle}</p></div>
          <div className="p-4 space-y-3">
            {filtered.map(t=>(
              <div key={t.id} className="bg-white rounded-[20px] p-4 shadow-sm border">
                <div className="flex justify-between"><span className="text-[9px] bg-black text-white px-2 py-1 rounded-full">{t.cat}</span><span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">৳{t.reward}</span></div>
                <p className="font-bold text-sm mt-2">{t.title}</p>
                <p className="text-[10px] text-gray-400">Need: {t.fields}</p>
                <button onClick={()=>{setActive(t); setForm({}); setCount(10); setCanDo(false); setAdOpen(true)}} className="w-full mt-3 bg-black text-white py-3 rounded-full text-xs font-bold">START - 10s Ad</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {page==="deposit"&&(
        <div className="fixed inset-0 bg-white z-50 p-6">
          <button onClick={()=>setPage("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← Back</button>
          <h1 className="text-xl font-black mt-5">Deposit</h1>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>setDM("bkash")} className={`px-4 py-2 rounded-full text-xs border-2 ${dM==="bkash"?"bg-black text-white":"bg-white"}`}>Bkash</button>
            <button onClick={()=>setDM("usdt")} className={`px-4 py-2 rounded-full text-xs border-2 ${dM==="usdt"?"bg-yellow-400":"bg-white"}`}>USDT</button>
          </div>
          <div className="bg-black text-white rounded-[20px] p-5 mt-4 text-center"><p className="font-black break-all">{numbers[dM as keyof typeof numbers]}</p></div>
          <input value={dA} onChange={e=>setDA(e.target.value)} placeholder="Amount" className="w-full border-2 border-black rounded-full p-3 mt-4 text-sm"/>
          <input value={dT} onChange={e=>setDT(e.target.value)} placeholder="TrxID" className="w-full border-2 border-black rounded-full p-3 mt-2 text-sm"/>
          <button onClick={()=>{if(!dA||!dT) return alert("Amount+TrxID দাও"); const req={id:Date.now(),email:user.email,method:dM,amount:Number(dA),trx:dT,toNumber:numbers[dM as keyof typeof numbers],status:"pending"}; const nd=[...deps,req]; setDeps(nd); save({deps:nd}); alert("Request Sent"); setPage("home")}} className="w-full mt-4 bg-black text-white py-3 rounded-full font-black">Submit</button>
        </div>
      )}

      {adOpen&&active&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-6">
            <h2 className="font-black text-sm">{ads.task} - {count}s</h2>
            <div className="bg-yellow-50 border-2 border-dashed rounded-[20px] p-4 mt-3">
              <p className="text-xs">{ads.task}</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-2"><div className="bg-black h-2 rounded-full" style={{width:`${(10-count)*10}%`}}></div></div>
            </div>
            <p className="text-2xl font-black mt-3 text-center">{count>0?count:"✅"}</p>
            {canDo&&(
              <div className="mt-4">
                <p className="text-xs font-black">📥 Receive - {active.title}</p>
                {active.fields.split(",").map((f:string)=>(
                  <input key={f} value={form[f]||""} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} className="w-full border-2 rounded-full p-3 mt-2 text-xs"/>
                ))}
                <button onClick={()=>{
                  const sub={id:Date.now(),email:user.email,cat:active.cat,title:active.title,reward:active.reward,data:form,status:"pending"}
                  const nd=[...subs,sub]
                  setSubs(nd)
                  save({subs:nd})
                  alert("Submitted ৳"+active.reward)
                  setAdOpen(false)
                }} className="w-full mt-4 bg-black text-white py-3 rounded-full font-black">Submit ৳{active.reward}</button>
              </div>
            )}
            {!canDo&&<button disabled className="w-full mt-4 bg-gray-200 py-3 rounded-full">Wait {count}s</button>}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-[28px] flex justify-around py-3">
        <button onClick={()=>setPage("home")} className="flex flex-col items-center"><span>🏠</span><span className="text-[9px] font-black">Home</span></button>
        <button onClick={()=>{setPage("tasks"); setCat("fb_cookies")}} className="flex flex-col items-center opacity-60"><span>📋</span><span className="text-[9px]">Tasks</span></button>
        <button onClick={()=>setPage("deposit")} className="flex flex-col items-center opacity-60"><span>💰</span><span className="text-[9px]">Wallet</span></button>
        <button className="flex flex-col items-center opacity-60"><span>🎧</span><span className="text-[9px]">Support</span></button>
      </div>
    </div>
  )
     }
     
