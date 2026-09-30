import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: EarningProMax })

function EarningProMax(){
  const ADMIN_EMAIL = "fscnajmul2026@gmail.com"
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [user,setUser]=useState<any>(null)
  const [tab,setTab]=useState("home") // home, tasks, refer, wallet, support, admin
  const [openTask,setOpenTask]=useState<any>(null)
  const [showAd,setShowAd]=useState(false)
  const [countdown,setCountdown]=useState(10)
  const [canStart,setCanStart]=useState(false)
  const [proofFile,setProofFile]=useState("")
  const [withdrawMethod,setWithdrawMethod]=useState("bkash")
  const [withdrawAmt,setWithdrawAmt]=useState("")
  const [withdrawAddr,setWithdrawAddr]=useState("")

  // Admin States
  const [adsCode,setAdsCode]=useState("🔥 Adsterra Social Bar - Ad দেখুন")
  const [referComm,setReferComm]=useState(15) // %
  const [vipPackages,setVipPackages]=useState([
    {id:1,name:"Starter",price:300, dailyLimit:5, validity:30},
    {id:2,name:"Pro",price:800, dailyLimit:15, validity:60},
    {id:3,name:"VIP",price:2000, dailyLimit:999, validity:365},
  ])
  const [tasks,setTasks]=useState([
    {id:1,type:"coin",title:"USDT Buy-Sell - 2$ Profit",reward:80,requiresPackage:true, status:"active"},
    {id:2,type:"social",title:"Gmail Account Sell - Fresh 2024",reward:150,requiresPackage:true, status:"active"},
    {id:3,type:"social",title:"Instagram Follow + Like",reward:25,requiresPackage:false, status:"active"},
    {id:4,type:"ad",title:"Ad দেখুন + Website Visit 1min",reward:10,requiresPackage:false, status:"active"},
    {id:5,type:"ad",title:"YouTube Subscribe + Watch",reward:30,requiresPackage:false, status:"active"},
  ])
  const [users,setUsers]=useState<any[]>([])
  const [withdrawReqs,setWithdrawReqs]=useState<any[]>([])
  const [coupon,setCoupon]=useState("WELCOME50")

  useEffect(()=>{
    const u=localStorage.getItem("earn_pro_max_user")
    const t=localStorage.getItem("earn_pro_max_tasks")
    const v=localStorage.getItem("earn_pro_max_vip")
    const a=localStorage.getItem("earn_pro_max_ads")
    if(u) setUser(JSON.parse(u))
    if(t) setTasks(JSON.parse(t))
    if(v) setVipPackages(JSON.parse(v))
    if(a) setAdsCode(a)
    const allUsers = JSON.parse(localStorage.getItem("earn_pro_max_allusers")||"[]")
    setUsers(allUsers)
  },[])

  useEffect(()=>{
    if(showAd && countdown>0){
      const timer=setTimeout(()=>setCountdown(c=>c-1),1000)
      return ()=>clearTimeout(timer)
    }
    if(countdown===0) setCanStart(true)
  },[showAd,countdown])

  const saveTasks = (nt:any[])=>{ setTasks(nt); localStorage.setItem("earn_pro_max_tasks",JSON.stringify(nt)) }

  const login=()=>{
    if(!email ||!pass) return alert("Email Pass দাও")
    const isAdminLogin = email===ADMIN_EMAIL
    const existing = users.find((x:any)=>x.email===email)
    let u
    if(existing){
      u=existing
    }else{
      u={email, accId:"#10"+Math.floor(100000+Math.random()*900000), balance:0, package:null, referCode:email.split("@")[0]+Math.floor(100+Math.random()*900), referredBy:"", isActive:true, isBlocked:false, joinedAt:new Date().toLocaleDateString()}
      const newAll=[...users,u]
      setUsers(newAll)
      localStorage.setItem("earn_pro_max_allusers",JSON.stringify(newAll))
    }
    if(u.isBlocked) return alert("ID Blocked - Admin এর সাথে যোগাযোগ করো")
    if(!u.isActive) return alert("ID Inactive - Package কেনো")
    localStorage.setItem("earn_pro_max_user",JSON.stringify(u))
    setUser(u)
  }

  const startTaskFlow=(t:any)=>{
    if(t.requiresPackage &&!user.package) return alert("এই Task করার আগে Package কিনতে হবে!")
    setOpenTask(t)
    setShowAd(true)
    setCountdown(10)
    setCanStart(false)
  }

  const submitProof=()=>{
    if(!proofFile) return alert("File / Proof Link দাও")
    alert(`Proof জমা হয়েছে: ${proofFile} - Admin Approve করলে ৳${openTask.reward} পাবা`)
    setShowAd(false)
    setOpenTask(null)
    setProofFile("")
  }

  const buyPackage=(pkg:any)=>{
    if(user.balance < pkg.price) return alert(`Balance কম - ৳${pkg.price} লাগবে`)
    const updated={...user, balance:user.balance-pkg.price, package:pkg}
    localStorage.setItem("earn_pro_max_user",JSON.stringify(updated))
    setUser(updated)
    const all = users.map((x:any)=>x.email===user.email?updated:x)
    localStorage.setItem("earn_pro_max_allusers",JSON.stringify(all))
    alert(`${pkg.name} Active! এখন Task করতে পারবা`)
  }

  const requestWithdraw=()=>{
    if(!withdrawAmt ||!withdrawAddr) return alert("Amount + Address দাও")
    if(Number(withdrawAmt) > user.balance) return alert("Balance কম")
    const req={id:Date.now(), user:user.email, amount:withdrawAmt, method:withdrawMethod, address:withdrawAddr, status:"pending"}
    setWithdrawReqs([...withdrawReqs,req])
    alert("Withdraw Request পাঠানো হয়েছে - Admin Approve করবে")
  }

  const isAdmin = user?.email===ADMIN_EMAIL

  if(!user){
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f7a4a] to-[#0a3d26] flex items-center justify-center p-5">
        <div className="bg-white w-full max-w-sm rounded-[32px] p-7 shadow-2xl">
          <div className="w-14 h-14 bg-[#0f7a4a] rounded-2xl flex items-center justify-center text-white font-black text-xl">E</div>
          <h1 className="text-3xl font-black mt-4">Earning Pro Max</h1>
          <p className="text-xs text-gray-400">Best Design - Admin: Najmul</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-6 border-2 border-gray-100 rounded-2xl p-4 text-sm focus:border-[#0f7a4a] outline-none" />
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full mt-3 border-2 border-gray-100 rounded-2xl p-4 text-sm focus:border-[#0f7a4a] outline-none" />
          <button onClick={login} className="w-full mt-6 bg-[#0f7a4a] text-white py-4 rounded-full font-black">LOGIN / CREATE ACCOUNT</button>
          <p className="text-[10px] text-center mt-3 text-gray-400">Admin Only: {ADMIN_EMAIL}</p>
        </div>
      </div>
    )
  }

  // ADMIN PANEL - Only you can see
  if(tab==="admin" && isAdmin){
    return (
      <div className="min-h-screen bg-[#f6f7f9] p-4 pb-24">
        <button onClick={()=>setTab("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← Back to App</button>
        <h1 className="font-black text-2xl mt-4">ADMIN PANEL</h1><p className="text-xs text-green-700 font-bold">Only: {ADMIN_EMAIL} - কেউ দেখতে পারবে না</p>

        <div className="grid gap-4 mt-5">
          <div className="bg-white p-5 rounded-3xl shadow-sm">
            <h3 className="font-black">📢 Ad Code (Adsterra) - 10 Sec Ad</h3>
            <textarea value={adsCode} onChange={e=>{setAdsCode(e.target.value); localStorage.setItem("earn_pro_max_ads",e.target.value)}} className="w-full border-2 rounded-2xl p-3 mt-2 text-xs h-20" placeholder="Adsterra Social Bar Code paste করো" />
          </div>

          <div className="bg-white p-5 rounded-3xl">
            <h3 className="font-black">💰 Refer Commission + Coupon</h3>
            <div className="flex gap-2 mt-2"><input type="number" value={referComm} onChange={e=>setReferComm(Number(e.target.value))} className="border-2 rounded-xl p-2 w-20" /><span className="text-sm mt-2">% Refer Commission</span></div>
            <input value={coupon} onChange={e=>setCoupon(e.target.value)} className="border-2 rounded-xl p-3 w-full mt-3 text-sm" placeholder="Coupon Code" />
          </div>

          <div className="bg-white p-5 rounded-3xl">
            <h3 className="font-black">📋 3 ধরনের Task তৈরি - Balance সেট</h3>
            <button onClick={()=>{const title=prompt("Task Title?"); const type=prompt("Type: coin/social/ad"); const reward=prompt("Reward ৳?"); if(title&&type&&reward) saveTasks([...tasks,{id:Date.now(),type,title,reward:Number(reward),requiresPackage:confirm("Package লাগবে?"),status:"active"}])}} className="bg-[#0f7a4a] text-white px-4 py-2 rounded-full text-xs mt-2">+ New Task Add করো</button>
            <div className="mt-3 space-y-2">{tasks.map(t=><div key={t.id} className="flex justify-between text-xs bg-gray-50 p-3 rounded-xl"><span>[{t.type}] {t.title} - ৳{t.reward}</span><button onClick={()=>saveTasks(tasks.filter(x=>x.id!==t.id))} className="text-red-500">Delete</button></div>)}</div>
          </div>

          <div className="bg-white p-5 rounded-3xl">
            <h3 className="font-black">👑 VIP Package - টাকা নির্ধারণ</h3>
            {vipPackages.map(p=><div key={p.id} className="bg-gray-50 p-3 rounded-xl mt-2 text-xs flex justify-between"><span>{p.name} - ৳{p.price} - Daily {p.dailyLimit}</span><button onClick={()=>{const price=prompt("New Price", String(p.price)); if(price) {const np=vipPackages.map(x=>x.id===p.id?{...x,price:Number(price)}:x); setVipPackages(np); localStorage.setItem("earn_pro_max_vip",JSON.stringify(np))}}} className="bg-black text-white px-2 py-1 rounded-full">Edit</button></div>)}
          </div>

          <div className="bg-white p-5 rounded-3xl">
            <h3 className="font-black">💸 Withdraw Request - USDT + Bkash</h3>
            {withdrawReqs.length===0 && <p className="text-xs text-gray-400 mt-2">No request</p>}
            {withdrawReqs.map(r=><div key={r.id} className="bg-yellow-50 p-3 rounded-xl mt-2 text-xs"><p>{r.user} - ৳{r.amount} via {r.method}</p><p className="text-[10px] break-all">Addr: {r.address}</p><button className="bg-green-600 text-white px-3 py-1 rounded-full mt-1">Approve</button></div>)}
          </div>

          <div className="bg-white p-5 rounded-3xl">
            <h3 className="font-black">👥 User Details - Edit / Block / Active</h3>
            {users.map(u=><div key={u.accId} className="bg-gray-50 p-3 rounded-xl mt-2 text-xs"><p className="font-bold">{u.email} - {u.accId}</p><p>Bal: ৳{u.balance} | Package: {u.package?.name||"None"} | {u.isBlocked?"BLOCKED":u.isActive?"ACTIVE":"INACTIVE"}</p><div className="flex gap-2 mt-1"><button onClick={()=>{const all=users.map(x=>x.email===u.email?{...x,isActive:!x.isActive}:x); setUsers(all); localStorage.setItem("earn_pro_max_allusers",JSON.stringify(all))}} className="bg-blue-600 text-white px-2 py-1 rounded-full">Active/Inactive</button><button onClick={()=>{const all=users.map(x=>x.email===u.email?{...x,isBlocked:!x.isBlocked}:x); setUsers(all); localStorage.setItem("earn_pro_max_allusers",JSON.stringify(all))}} className="bg-red-600 text-white px-2 py-1 rounded-full">Block/Unblock</button></div></div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] pb-28">
      {/* Top Bar */}
      <div className="bg-[#0f7a4a] text-white px-5 pt-4 pb-8 rounded-b-[32px]">
        <div className="flex justify-between items-center"><span className="font-black text-lg">Earning Pro</span>{isAdmin && <button onClick={()=>setTab("admin")} className="bg-yellow-400 text-black text-[10px] font-black px-4 py-2 rounded-full">ADMIN PANEL</button>}</div>
        <div className="mt-4 bg-white/10 backdrop-blur rounded-3xl p-4 flex justify-between"><div><p className="text-[10px] opacity-70">BALANCE</p><p className="font-black text-2xl">৳{user.balance}</p></div><div className="text-right"><p className="text-[10px] opacity-70">{user.accId}</p><p className="text-xs font-bold">{user.package?`👑 ${user.package.name}`:"No Package"}</p></div></div>
        <div className="mt-3 bg-yellow-100 text-black text-[11px] text-center py-2 rounded-full font-bold">📢 {adsCode}</div>
      </div>

      {/* Content */}
      {tab==="home" && (
        <div className="p-5">
          <h2 className="font-black text-[#0f7a4a]">VIP PACKAGES - Task এর আগে কিনতে হবে</h2>
          <div className="grid grid-cols-1 gap-3 mt-3">
            {vipPackages.map(pkg=>(
              <div key={pkg.id} className="bg-white rounded-[24px] p-5 flex justify-between items-center shadow-sm border-2 border-transparent hover:border-[#0f7a4a]">
                <div><p className="font-black">{pkg.name}</p><p className="text-xs text-gray-500">৳{pkg.price} | Daily {pkg.dailyLimit} Tasks | {pkg.validity} Days</p></div>
                <button onClick={()=>buyPackage(pkg)} className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold">BUY</button>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white rounded-[24px] p-5"><h3 className="font-black">🔥 আজকের অফার</h3><p className="text-xs mt-2">Coupon: <b className="bg-yellow-200 px-2 py-1 rounded-full">{coupon}</b> ব্যবহার করো 50% ছাড়!</p></div>
        </div>
      )}

      {tab==="tasks" && (
        <div className="p-5">
          <h2 className="font-black">All Tasks - 3 Category</h2>
          <div className="flex gap-2 mt-3"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px]">COIN</span><span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-[10px]">SOCIAL</span><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px]">AD VIEW</span></div>
          <div className="mt-4 space-y-3">
            {tasks.map(t=>(
              <div key={t.id} className="bg-white rounded-[20px] p-4 shadow-sm">
                <div className="flex justify-between"><span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full uppercase">{t.type}</span><span className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">৳{t.reward}</span></div>
                <p className="font-bold mt-2 text-sm">{t.title}</p><p className="text-[10px] text-gray-400">{t.requiresPackage?"🔒 Package লাগবে":"✅ Free"}</p>
                <button onClick={()=>startTaskFlow(t)} className="w-full mt-3 bg-black text-white py-3 rounded-full text-xs font-bold">START TASK - 10s Ad দেখতে হবে</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="refer" && (
        <div className="p-5">
          <div className="bg-white rounded-[24px] p-6 text-center">
            <h2 className="font-black text-xl">Refer & Earn {referComm}%</h2>
            <p className="text-xs text-gray-500 mt-2">প্রতি Refer এ {referComm}% Commission</p>
            <div className="bg-[#f6f7f9] rounded-2xl p-4 mt-4"><p className="text-xs">Your Refer Code</p><p className="font-black text-lg mt-1">{user.referCode}</p><p className="text-[10px] mt-1 break-all">Link: earn-sparkle-98.lovable.app?ref={user.referCode}</p></div>
            <button onClick={()=>navigator.clipboard.writeText(`https://earn-sparkle-98.lovable.app?ref=${user.referCode}`)} className="w-full mt-4 bg-[#0f7a4a] text-white py-3 rounded-full font-bold">COPY LINK</button>
          </div>
        </div>
      )}

      {tab==="wallet" && (
        <div className="p-5">
          <div className="bg-white rounded-[24px] p-6">
            <h2 className="font-black">Wallet - Balance & Withdraw</h2>
            <p className="text-3xl font-black mt-3">৳{user.balance}</p>
            <div className="mt-5">
              <p className="text-xs font-bold">Withdraw Method</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={()=>setWithdrawMethod("bkash")} className={`p-3 rounded-2xl border-2 text-xs font-bold ${withdrawMethod==="bkash"?"border-[#0f7a4a] bg-green-50":"border-gray-100"}`}>Bkash / Nagad</button>
                <button onClick={()=>setWithdrawMethod("usdt")} className={`p-3 rounded-2xl border-2 text-xs font-bold ${withdrawMethod==="usdt"?"border-yellow-500 bg-yellow-50":"border-gray-100"}`}>USDT - Binance</button>
              </div>
              <input value={withdrawAmt} onChange={e=>setWithdrawAmt(e.target.value)} placeholder="Amount ৳" className="w-full border-2 rounded-2xl p-4 mt-3 text-sm" />
              <input value={withdrawAddr} onChange={e=>setWithdrawAddr(e.target.value)} placeholder={withdrawMethod==="usdt"?"Binance USDT Address (TRC20)" : "Bkash/Nagad Number"} className="w-full border-2 rounded-2xl p-4 mt-2 text-sm" />
              <button onClick={requestWithdraw} className="w-full mt-3 bg-black text-white py-4 rounded-full font-bold">WITHDRAW REQUEST</button>
              <p className="text-[10px] text-center mt-2 text-gray-400">USDT তে Binance এর মাধ্যমে Withdraw হবে</p>
            </div>
          </div>
        </div>
      )}

      {tab==="support" && (
        <div className="p-5">
          <div className="bg-white rounded-[24px] p-5"><h2 className="font-black">🤖 AI Support</h2><div className="bg-gray-50 rounded-2xl p-4 mt-3 text-xs"><p>AI: হ্যালো {user.email}! কোন সমস্যা? Task, Withdraw, Package নিয়ে প্রশ্ন করো।</p></div><input placeholder="প্রশ্ন লিখো..." className="w-full border-2 rounded-2xl p-3 mt-3 text-xs" /></div>
          <div className="bg-white rounded-[24px] p-5 mt-3"><h2 className="font-black">🎧 Admin Support</h2><p className="text-xs mt-2">Direct Contact: {ADMIN_EMAIL}</p><button onClick={()=>window.open(`mailto:${ADMIN_EMAIL}`)} className="w-full mt-3 bg-[#0f7a4a] text-white py-3 rounded-full text-xs font-bold">Contact Admin</button></div>
        </div>
      )}

      {/* 10 Sec Ad Modal */}
      {showAd && openTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-[28px] w-full max-w-sm p-6 text-center">
            <h2 className="font-black">📢 Ad - {countdown}s</h2>
            <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-2xl p-8 mt-4">
              <p className="text-xs font-bold">{adsCode}</p>
              <p className="text-[10px] mt-2">এখানে তোমার Adsterra Ad দেখাবে</p>
              <div className="mt-3 w-full bg-gray-200 h-2 rounded-full overflow-hidden"><div className="bg-[#0f7a4a] h-2" style={{width:`${(10-countdown)*10}%`}}></div></div>
            </div>
            <p className="text-3xl font-black mt-4">{countdown>0?countdown:"✅"}</p>
            <p className="text-xs text-gray-500">{countdown>0?`${countdown} সেকেন্ড Ad দেখো, তারপর Task শুরু হবে`:"Ad দেখা শেষ!"}</p>
            {canStart? (
              <div className="mt-4">
                <input value={proofFile} onChange={e=>setProofFile(e.target.value)} placeholder="Proof File / Screenshot Link Upload করো" className="w-full border-2 rounded-2xl p-3 text-xs" />
                <button onClick={submitProof} className="w-full mt-3 bg-[#0f7a4a] text-white py-3 rounded-full font-bold">Submit Proof - ৳{openTask.reward}</button>
                <button onClick={()=>{setShowAd(false); setOpenTask(null)}} className="w-full mt-2 text-xs text-gray-400">Cancel</button>
              </div>
            ): <button disabled className="w-full mt-4 bg-gray-200 text-gray-400 py-3 rounded-full font-bold">Wait {countdown}s...</button>}
          </div>
        </div>
      )}

      {/* Bottom 5 Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[28px] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex justify-around items-center py-3 px-2">
        <button onClick={()=>setTab("home")} className={`flex flex-col items-center ${tab==="home"?"text-[#0f7a4a]":"text-gray-400"}`}><span className="text-xl">🏠</span><span className="text-[9px] font-bold mt-1">Home</span></button>
        <button onClick={()=>setTab("tasks")} className={`flex flex-col items-center ${tab==="tasks"?"text-[#0f7a4a]":"text-gray-400"}`}><span className="text-xl">📋</span><span className="text-[9px] font-bold mt-1">Tasks</span></button>
        <button onClick={()=>setTab("refer")} className={`flex flex-col items-center ${tab==="refer"?"text-[#0f7a4a]":"text-gray-400"}`}><span className="text-xl">👥</span><span className="text-[9px] font-bold mt-1">Refer</span></button>
        <button onClick={()=>setTab("wallet")} className={`flex flex-col items-center ${tab==="wallet"?"text-[#0f7a4a]":"text-gr
