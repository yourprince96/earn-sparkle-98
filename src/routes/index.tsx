import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: BestEarningApp })

function BestEarningApp(){
  const ADMIN_EMAIL = "fscnajmul2026@gmail.com" // এটা পরিবর্তন হবে না - LOCKED
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [user,setUser]=useState<any>(null)
  const [tab,setTab]=useState("home")
  const [activeTask,setActiveTask]=useState<any>(null)
  const [adOpen,setAdOpen]=useState(false)
  const [count,setCount]=useState(10)
  const [canDo,setCanDo]=useState(false)
  const [proof,setProof]=useState("")
  const [wMethod,setWMethod]=useState("bkash")
  const [wAmount,setWAmount]=useState("")
  const [wAddress,setWAddress]=useState("")
  const [tasks,setTasks]=useState([
    {id:1,type:"coin",title:"USDT Coin Buy-Sell Task - $2 Profit",reward:100,needPackage:true,timer:30},
    {id:2,type:"social",title:"Gmail Account Sell - Fresh Gmail",reward:150,needPackage:true,timer:60},
    {id:3,type:"social",title:"Instagram / TikTok Follow & Sell",reward:40,needPackage:false,timer:20},
    {id:4,type:"ad",title:"Video Ad দেখুন 1 মিনিট",reward:15,needPackage:false,timer:10},
    {id:5,type:"ad",title:"Website Follow + Visit Task",reward:20,needPackage:false,timer:15},
  ])
  const [vip,setVip]=useState([
    {id:1,name:"Basic",price:350,limit:5,day:30},
    {id:2,name:"Pro",price:850,limit:20,day:60},
    {id:3,name:"VIP",price:2200,limit:100,day:365},
  ])
  const [ads,setAds]=useState("Adsterra Video Ad - এখানে Ad বসবে")
  const [refComm,setRefComm]=useState(15)
  const [coupon,setCoupon]=useState("NAJMUL50")
  const [allUsers,setAllUsers]=useState<any[]>([])
  const [withdraws,setWithdraws]=useState<any[]>([])

  useEffect(()=>{
    const u=localStorage.getItem("best_app_user")
    if(u) setUser(JSON.parse(u))
    setAllUsers(JSON.parse(localStorage.getItem("best_app_allusers")||"[]"))
    const savedAds=localStorage.getItem("best_app_ads")
    if(savedAds) setAds(savedAds)
  },[])

  useEffect(()=>{
    if(adOpen && count>0){
      const t=setTimeout(()=>setCount(c=>c-1),1000)
      return ()=>clearTimeout(t)
    }
    if(count===0) setCanDo(true)
  },[adOpen,count])

  const login=()=>{
    if(!email||!pass) return alert("Email Password দাও")
    let all=JSON.parse(localStorage.getItem("best_app_allusers")||"[]")
    let found=all.find((x:any)=>x.email===email)
    let u
    if(found){
      if(found.blocked) return alert("ID Blocked - Admin Contact")
      if(!found.active) return alert("ID Inactive - Package কিনতে হবে")
      u=found
    }else{
      u={email,accId:"#10"+Math.floor(100000+Math.random()*900000),balance:50,package:null,referCode:email.split("@")[0]+Math.floor(10+Math.random()*90),active:true,blocked:false,address:"Dhaka, BD"}
      all=[...all,u]
      localStorage.setItem("best_app_allusers",JSON.stringify(all))
      setAllUsers(all)
    }
    localStorage.setItem("best_app_user",JSON.stringify(u))
    setUser(u)
  }

  const startTask=(t:any)=>{
    if(t.needPackage &&!user.package) return alert("⚠️ এই Task করার আগে Package কিনতে হবে! Home থেকে Package কেনো")
    setActiveTask(t)
    setAdOpen(true)
    setCount(10)
    setCanDo(false)
  }

  const buyVip=(p:any)=>{
    if(user.balance < p.price) return alert(`Balance কম - ৳${p.price} লাগবে, তোমার আছে ৳${user.balance}`)
    const updated={...user,balance:user.balance-p.price,package:p}
    localStorage.setItem("best_app_user",JSON.stringify(updated))
    setUser(updated)
    const all=allUsers.map((x:any)=>x.email===user.email?updated:x)
    localStorage.setItem("best_app_allusers",JSON.stringify(all))
    alert(`${p.name} Active! এখন Task করতে পারো`)
  }

  const submitTask=()=>{
    if(!proof) return alert("Proof File / Link Upload করো")
    alert(`✅ Proof জমা হয়েছে - Admin Approve করলে ৳${activeTask.reward} পাবা`)
    setAdOpen(false); setActiveTask(null); setProof("")
  }

  const doWithdraw=()=>{
    if(!wAmount ||!wAddress) return alert("Amount + Address দাও")
    if(Number(wAmount) > user.balance) return alert("Balance কম")
    const req={id:Date.now(),email:user.email,amount:wAmount,method:wMethod,addr:wAddress,status:"pending"}
    setWithdraws([...withdraws,req])
    alert("Withdraw Request গেছে - Admin Approve করবে")
  }

  const isAdmin=user?.email===ADMIN_EMAIL

  if(!user){
    return <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-black flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-7"><div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black">E</div><h1 className="text-3xl font-black mt-3">Best Earning</h1><p className="text-xs text-gray-400">Admin Locked: {ADMIN_EMAIL}</p><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-6 border-2 rounded-2xl p-4 text-sm"/><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 border-2 rounded-2xl p-4 text-sm"/><button onClick={login} className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-full font-black">LOGIN / REGISTER</button></div>
    </div>
  }

  if(tab==="admin" && isAdmin){
    return <div className="min-h-screen bg-[#f5f7f6] p-4 pb-20">
      <button onClick={()=>setTab("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← App এ ফেরত</button>
      <h1 className="font-black text-2xl mt-4">ADMIN PANEL - LOCKED</h1><p className="text-xs font-bold text-emerald-700">Only You: {ADMIN_EMAIL}</p>
      <div className="mt-5 space-y-4">
        <div className="bg-white p-5 rounded-3xl"><h3 className="font-black">📢 Ad Laganor Option - 10 Sec Ad</h3><textarea value={ads} onChange={e=>{setAds(e.target.value); localStorage.setItem("best_app_ads",e.target.value)}} className="w-full border-2 rounded-2xl p-3 mt-2 text-xs h-24"/><p className="text-[10px] text-gray-400">এখানে Adsterra Code বসালে User এর সামনে 10s দেখাবে</p></div>
        <div className="bg-white p-5 rounded-3xl"><h3 className="font-black">💰 Refer Commission + Coupon + VIP টাকা</h3><div className="flex gap-2 mt-2"><input type="number" value={refComm} onChange={e=>setRefComm(Number(e.target.value))} className="border-2 rounded-xl p-2 w-20"/><span className="text-xs mt-2">% Commission</span></div><input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Coupon Code" className="w-full border-2 rounded-xl p-3 mt-2 text-xs"/><div className="mt-3">{vip.map(p=><div key={p.id} className="flex justify-between text-xs bg-gray-50 p-2 rounded-xl mt-1"><span>{p.name} ৳{p.price}</span><button onClick={()=>{const pr=prompt("New Price",String(p.price)); if(pr) setVip(vip.map(x=>x.id===p.id?{...x,price:Number(pr)}:x))}} className="bg-black text-white px-2 py-1 rounded-full">Edit</button></div>)}</div></div>
        <div className="bg-white p-5 rounded-3xl"><h3 className="font-black">📋 3 ধরনের Task তৈরি + Balance নির্ধারণ</h3><button onClick={()=>{const title=prompt("Task Title?"); const type=prompt("type: coin/social/ad"); const reward=prompt("Reward ৳?"); if(title&&type&&reward) setTasks([...tasks,{id:Date.now(),type,title,reward:Number(reward),needPackage:confirm("Package লাগবে?"),timer:30}])}} className="bg-emerald-600 text-white px-4 py-2 rounded-full text-xs mt-2">+ Task Add</button>{tasks.map(t=><div key={t.id} className="text-xs bg-gray-50 p-2 rounded-xl mt-2 flex justify-between"><span>[{t.type}] {t.title} ৳{t.reward}</span><button onClick={()=>setTasks(tasks.filter(x=>x.id!==t.id))} className="text-red-500">Del</button></div>)}</div>
        <div className="bg-white p-5 rounded-3xl"><h3 className="font-black">👥 User Details Edit / Active / Block</h3>{allUsers.map((u:any)=><div key={u.accId} className="bg-gray-50 p-3 rounded-xl mt-2 text-xs"><p className="font-bold">{u.email} | {u.accId}</p><p>Bal: ৳{u.balance} | {u.package?.name||"No Package"} | {u.blocked?"BLOCKED":u.active?"ACTIVE":"INACTIVE"}</p><div className="flex gap-2 mt-1"><button onClick={()=>{const updated=allUsers.map((x:any)=>x.email===u.email?{...x,active:!x.active}:x); setAllUsers(updated); localStorage.setItem("best_app_allusers",JSON.stringify(updated))}} className="bg-blue-600 text-white px-2 py-1 rounded-full">Active/Inactive</button><button onClick={()=>{const updated=allUsers.map((x:any)=>x.email===u.email?{...x,blocked:!x.blocked}:x); setAllUsers(updated); localStorage.setItem("best_app_allusers",JSON.stringify(updated))}} className="bg-red-600 text-white px-2 py-1 rounded-full">Block</button></div></div>)}</div>
        <div className="bg-white p-5 rounded-3xl"><h3 className="font-black">💸 Withdraw Request - USDT Binance</h3>{withdraws.length===0?<p className="text-xs text-gray-400">No Request</p>:withdraws.map(w=><div key={w.id} className="bg-yellow-50 p-3 rounded-xl mt-2 text-xs"><p>{w.email} - ৳{w.amount} - {w.method}</p><p className="break-all text-[10px]">{w.addr}</p><button className="bg-green-600 text-white px-3 py-1 rounded-full mt-1">Approve</button></div>)}</div>
      </div>
    </div>
  }

  return <div className="min-h-screen bg-[#f5f7f6] pb-28">
    <div className="bg-emerald-600 text-white px-5 pt-5 pb-10 rounded-b-[36px]">
      <div className="flex justify-between"><span className="font-black">Best Earning</span>{isAdmin&&<button onClick={()=>setTab("admin")} className="bg-yellow-400 text-black text-[10px] font-black px-4 py-2 rounded-full">ADMIN PANEL</button>}</div>
      <div className="mt-5 bg-white/10 rounded-[24px] p-4 flex justify-between"><div><p className="text-[10px] opacity-70">BALANCE</p><p className="font-black text-2xl">৳{user.balance}</p></div><div className="text-right"><p className="text-[10px]">{user.accId}</p><p className="text-xs font-bold">{user.package?`👑 ${user.package.name}`:"No Package"}</p></div></div>
      <div className="mt-3 bg-yellow-100 text-black text-center py-2 rounded-full text-xs font-bold">📢 {ads} | Coupon: {coupon}</div>
    </div>

    {tab==="home"&&<div className="p-5"><h2 className="font-black text-emerald-700">VIP Package - Task এর আগে কিনতে হবে</h2><div className="mt-3 space-y-3">{vip.map(p=><div key={p.id} className="bg-white rounded-[24px] p-5 flex justify-between shadow-sm"><div><p className="font-black">{p.name}</p><p className="text-xs text-gray-500">৳{p.price} | Daily {p.limit} Tasks</p></div><button onClick={()=>buyVip(p)} className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold">BUY</button></div>)}</div></div>}

    {tab==="tasks"&&<div className="p-5"><h2 className="font-black">Tasks - 3 ধরনের</h2><div className="mt-3 space-y-3">{tasks.map(t=><div key={t.id} className="bg-white rounded-[20px] p-4"><div className="flex justify-between"><span className="text-[9px] bg-gray-100 px-2 py-1 rounded-full uppercase">{t.type}</span><span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs">৳{t.reward}</span></div><p className="font-bold text-sm mt-2">{t.title}</p><p className="text-[10px] text-gray-400">{t.needPackage?"🔒 Package লাগবে":"✅ Free"} | ⏱️ {t.timer}s</p><button onClick={()=>startTask(t)} className="w-full mt-3 bg-black text-white py-3 rounded-full text-xs font-bold">START - 10s Ad দেখতে হবে</button></div>)}</div></div>}

    {tab==="refer"&&<div className="p-5"><div className="bg-white rounded-[24px] p-6 text-center"><h2 className="font-black text-xl">Refer & Earn {refComm}%</h2><div className="bg-gray-50 rounded-2xl p-4 mt-4"><p className="text-xs">Your Code</p><p className="font-black text-lg">{user.referCode}</p><p className="text-[10px] break-all">earn-sparkle-98.lovable.app?ref={user.referCode}</p></div><button onClick={()=>navigator.clipboard.writeText(`https://earn-sparkle-98.lovable.app?ref=${user.referCode}`)} className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-full font-bold">COPY LINK</button></div></div>}

    {tab==="wallet"&&<div className="p-5"><div className="bg-white rounded-[24px] p-6"><h2 className="font-black">Wallet - Withdraw + Balance</h2><p className="text-3xl font-black mt-2">৳{user.balance}</p><div className="grid grid-cols-2 gap-2 mt-4"><button onClick={()=>setWMethod("bkash")} className={`p-3 rounded-2xl border-2 text-xs font-bold ${wMethod==="bkash"?"border-emerald-600 bg-green-50":"border-gray-100"}`}>Bkash/Nagad</button><button onClick={()=>setWMethod("usdt")} className={`p-3 rounded-2xl border-2 text-xs font-bold ${wMethod==="usdt"?"border-yellow-500 bg-yellow-50":"border-gray-100"}`}>USDT Binance</button></div><input value={wAmount} onChange={e=>setWAmount(e.target.value)} placeholder="Amount" className="w-full border-2 rounded-2xl p-4 mt-3 text-sm"/><input value={wAddress} onChange={e=>setWAddress(e.target.value)} placeholder={wMethod==="usdt"?"Binance USDT TRC20 Address":"Bkash Number"} className="w-full border-2 rounded-2xl p-4 mt-2 text-sm"/><button onClick={doWithdraw} className="w-full mt-3 bg-black text-white py-4 rounded-full font-bold">WITHDRAW REQUEST</button></div></div>}

    {tab==="support"&&<div className="p-5 space-y-3"><div className="bg-white rounded-[24px] p-5"><h2 className="font-black">🤖 AI Support</h2><div className="bg-gray-50 p-3 rounded-xl mt-2 text-xs">AI: হাই {user.email}, Package, Task, Withdraw নিয়ে যেকোনো প্রশ্ন করো</div></div><div className="bg-white rounded-[24px] p-5"><h2 className="font-black">🎧 Admin Support</h2><p className="text-xs mt-2">Email: {ADMIN_EMAIL}</p><button onClick={()=>window.open(`mailto:${ADMIN_EMAIL}`)} className="w-full mt-3 bg-emerald-600 text-white py-3 rounded-full font-bold">Contact Admin</button></div></div>}

    {adOpen&&activeTask&&<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-5 z-50"><div className="bg-white rounded-[28px] w-full max-w-sm p-6 text-center"><h2 className="font-black">📢 10 Second Ad - {count}s</h2><div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-2xl p-6 mt-4"><p className="text-xs font-bold">{ads}</p><div className="mt-3 w-full bg-gray-200 h-2 rounded-full overflow-hidden"><div className="bg-emerald-600 h-2" style={{width:`${(10-count)*10}%`}}></div></div></div><p className="text-4xl font-black mt-4">{count>0?count:"✅"}</p>{canDo?<><input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Proof Sheet File / Screenshot Link Upload" className="w-full border-2 rounded-2xl p-3 mt-4 text-xs"/><button onClick={submitTask} className="w-full mt-3 bg-emerald-600 text-white py-3 rounded-full font-bold">Submit - ৳{activeTask.reward}</button></>:<button disabled className="w-full mt-4 bg-gray-200 text-gray-400 py-3 rounded-full font-bold">Wait {count}s... Ad না দেখলে কাজ হবে না</button>}<button onClick={()=>{setAdOpen(false); setActiveTask(null)}} className="w-full mt-2 text-xs text-gray-400">Cancel</button></div></div>}

    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[28px] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex justify-around py-3">
      <button onClick={()=>setTab("home")} className={`flex flex-col items-center ${tab==="home"?"text-emerald-600":"text-gray-400"}`}><span>🏠</span><span className="text-[9px] font-bold">Home</span></button>
      <button onClick={()=>setTab("tasks")} className={`flex flex-col items-center ${tab==="tasks"?"text-emerald-600":"text-gray-400"}`}><span>📋</span><span className="text-[9px] font-bold">Tasks</span></button>
      <button onClick={()=>setTab("refer")} className={`flex flex-col items-center ${tab==="refer"?"text-emerald-600":"text-gray-400"}`}><span>👥</span><span className="text-[9px] font-bold">Refer</span></button>
      <button onClick={()=>setTab("wallet")} className={`flex flex-col items-center ${tab==="wallet"?"text-emerald-600":"text-gray-400"}`}><span>💰</span><span className="text-[9px] font-bold">Wallet</span></button>
      <button onClick={()=>setTab("support")} className={`flex flex-col items-center ${tab==="support"?"text-emerald-600":"text-gray-400"}`}><span>🎧</span><span className="text-[9px] font-bold">Support</span></button>
    </div>
  </div>
         }
