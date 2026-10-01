import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/")({ component: RolexPlanSystem })

function RolexPlanSystem(){
  const ADMIN = "fscnajmul2026@gmail.com"
  const [logged,setLogged] = useState(false)
  const [isAdmin,setIsAdmin] = useState(false)
  const [page,setPage] = useState("register")
  const [menu,setMenu] = useState(false)
  const [showPass,setShowPass] = useState(false)
  const [myPlan,setMyPlan] = useState<any>(null) // null = no plan
  const [balance,setBalance] = useState(500)

  const [ads,setAds] = useState({
    top:"Top Small Ad - Adsterra",
    mid:"Middle Small Ad",
    bottom:"Bottom Small Ad",
    ten:"10s Video Ad - Disturb"
  })

  // Plans - Admin Edit করবে
  const [plans,setPlans] = useState([
    {id:1, name:"Basic Plan", price:500, dailyTask:5, dailyIncome:100, days:30, on:true},
    {id:2, name:"Silver Plan", price:1500, dailyTask:10, dailyIncome:350, days:30, on:true},
    {id:3, name:"Gold Plan", price:3000, dailyTask:20, dailyIncome:800, days:30, on:true},
    {id:4, name:"Platinum Plan", price:5000, dailyTask:50, dailyIncome:2000, days:30, on:true},
  ])

  // Tasks
  const [tasks,setTasks] = useState([
    {id:1, cat:"task1", title:"১. ফেসবুক সেল", price:150, on:true, order:1, plan:"Basic Plan"},
    {id:2, cat:"task1", title:"২. ইনস্টাগ্রাম সেল", price:180, on:true, order:2, plan:"Basic Plan"},
    {id:3, cat:"task1", title:"৩. টেলিগ্রাম সেল", price:120, on:true, order:3, plan:"Silver Plan"},
    {id:4, cat:"task1", title:"৪. হোয়াটসঅ্যাপ সেল", price:120, on:true, order:4, plan:"Silver Plan"},
    {id:5, cat:"task1", title:"৫. জিমেইল সেল", price:100, on:true, order:5, plan:"Gold Plan"},
    {id:6, cat:"task2", title:"Coins Sell", price:80, on:true, order:6, plan:"Basic Plan"},
    {id:7, cat:"task2", title:"Meta Buy", price:200, on:true, order:7, plan:"Gold Plan"},
    {id:9, cat:"task3", title:"Website Visit", price:10, on:true, order:9, plan:"Basic Plan"},
    {id:11, cat:"task4", title:"WhatsApp Bind ৳300", price:300, on:true, order:11, plan:"Platinum Plan"},
    {id:12, cat:"task4", title:"Number Rent ৳2000", price:2000, on:true, order:12, plan:"Platinum Plan"},
  ])

  // Inbox - Admin সব দেখবে, File Upload
  const [inbox,setInbox] = useState<any[]>([
    {id:1, user:"017XXXXXXXX", task:"Gmail Sell", file:"gmail.txt - test@gmail.com / 123456", proof:"Notepad File", price:100, time:"01-10-2026", status:"Pending"},
  ])

  const [active,setActive] = useState<any>(null)
  const [showAd,setShowAd] = useState(false)
  const [count,setCount] = useState(10)
  const [can,setCan] = useState(false)
  const [uploadFile,setUploadFile] = useState("")
  const [uploadText,setUploadText] = useState("")

  useEffect(()=>{
    if(showAd && count>0){ const t=setTimeout(()=>setCount(c=>c-1),1000); return()=>clearTimeout(t) }
    if(count===0) setCan(true)
  },[showAd,count])

  const openTask = (t:any)=>{
    if(!myPlan) return alert("❌ ভাই প্ল্যান কিনা ছাড়া Task Complete করতে পারবে না! আগে প্ল্যান কিনো")
    if(!t.on) return alert("Admin OFF করে রেখেছে")
    setActive(t); setCount(10); setCan(false); setShowAd(true)
  }

  const submitTask = ()=>{
    const newEntry = {
      id: Date.now(),
      user: "017XXXXXXXX",
      task: active.title,
      file: uploadFile || "File: "+uploadText.substring(0,50),
      proof: uploadText,
      price: active.price,
      time: new Date().toLocaleDateString(),
      status: "Pending"
    }
    setInbox([newEntry,...inbox])
    setShowAd(false); setUploadFile(""); setUploadText("")
    alert("✅ Admin Inbox এ জমা হয়েছে - File Upload Success ৳"+active.price)
  }

  if(!logged){
    return(
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-white min-h-screen p-6 pt-10">
          <h1 className="text-center font-black text-2xl">👑 ROLEX 2.0</h1>
          <p className="text-center text-[10px] mt-1">Admin: {ADMIN} দিলে Admin</p>
          <input id="em" placeholder="Gmail / Phone" className="w-full mt-8 border-2 border-green-500 rounded-full px-5 py-4 text-sm"/>
          <input placeholder="Password" type="password" className="w-full mt-3 border-2 border-gray-100 rounded-full px-5 py-4 text-sm"/>
          <button onClick={()=>{ const v=(document.getElementById("em") as any).value; if(v===ADMIN) setIsAdmin(true); setLogged(true); setPage("home")}} className="w-full mt-6 bg-[#0f8a5a] text-white py-4 rounded-full font-black">LOGIN</button>
        </div>
      </div>
    )
  }

  const Header = ()=>(
    <div className="bg-[#0f8a5a] text-white px-4 py-3 flex justify-between items-center relative">
      <button onClick={()=>setPage("home")} className="w-9 h-9 bg-white/20 rounded-xl flex justify-center items-center">☰</button>
      <p className="font-black">🪙 ROLEX 2.0 {myPlan?`[${myPlan.name}]`:"[No Plan]"}</p>
      <button onClick={()=>setMenu(!menu)} className="w-9 h-9 bg-white/20 rounded-xl flex justify-center items-center">⋮</button>
      {menu&&<div className="absolute top-14 right-4 bg-white text-black rounded-[16px] shadow-xl border w-52 z-50">
        <button onClick={()=>{setPage("home"); setMenu(false)}} className="w-full text-left px-4 py-3 text-sm border-b">🏠 Home</button>
        <button onClick={()=>{setPage("plans"); setMenu(false)}} className="w-full text-left px-4 py-3 text-sm border-b">👑 Plans - প্ল্যান কিনুন</button>
        <button onClick={()=>{setPage("missions"); setMenu(false)}} className="w-full text-left px-4 py-3 text-sm border-b">📋 Missions</button>
        <button onClick={()=>{setPage("profile"); setMenu(false)}} className="w-full text-left px-4 py-3 text-sm border-b">👤 Profile</button>
        <button onClick={()=>{setPage("help"); setMenu(false)}} className="w-full text-left px-4 py-3 text-sm border-b">🎧 Help</button>
        {isAdmin&&<><button onClick={()=>{setPage("admin"); setMenu(false)}} className="w-full text-left px-4 py-3 text-sm bg-black text-yellow-400 font-black">👑 ADMIN PANEL</button><button onClick={()=>{setPage("inbox"); setMenu(false)}} className="w-full text-left px-4 py-3 text-sm bg-green-600 text-white font-black">📥 INBOX - File জমা</button></>}
        <button onClick={()=>setLogged(false)} className="w-full text-left px-4 py-3 text-sm text-red-600">Logout</button>
      </div>}
    </div>
  )

  const Bottom = ()=>(
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t rounded-t-[24px] flex justify-around py-2 z-40">
      <button onClick={()=>setPage("home")} className="flex flex-col items-center"><span>🏠</span><span className="text-[9px]">Home</span></button>
      <button onClick={()=>setPage("plans")} className="flex flex-col items-center"><span>👑</span><span className="text-[9px]">Plan</span></button>
      <button onClick={()=>setPage("missions")} className="w-12 h-12 bg-[#0f8a5a] rounded-full text-white -mt-5 border-4 border-[#e8f5e9] flex justify-center items-center">⊞</button>
      <button onClick={()=>setPage("inbox")} className="flex flex-col items-center"><span>📥</span><span className="text-[9px]">Inbox</span></button>
      <button onClick={()=>setPage("profile")} className="flex flex-col items-center"><span>{isAdmin?"👑":"👤"}</span><span className="text-[9px]">{isAdmin?"ADMIN":"Profile"}</span></button>
    </div>
  )

  const Ad = ({t,c}:{t:string,c?:string})=><div className={`mx-4 mt-3 ${c||"bg-yellow-400"} rounded-full px-4 py-2 text-center text-[10px] font-bold`}>{t}</div>

  // PLANS PAGE
  if(page==="plans"){
    return(
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-[#e8f5e9] pb-24">
          <Header/><Ad t={ads.top}/>
          <div className="px-4 mt-4"><button onClick={()=>setPage("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full text-xs">← Home</button><h2 className="font-black mt-3">👑 Plan System - প্ল্যান কিনা ছাড়া Task হবে না</h2><p className="text-[11px] text-red-600 font-bold mt-1">⚠ প্ল্যান না কিনলে কেউ Task Complete করতে পারবে না</p></div>
          <div className="px-4 mt-4 space-y-3">
            {plans.filter(p=>p.on).map(p=>(
              <div key={p.id} className={`rounded-[20px] p-5 border-2 ${myPlan?.id===p.id?"border-green-600 bg-green-50":"bg-white border-gray-100"}`}>
                <div className="flex justify-between"><p className="font-black">{p.name}</p><p className="bg-[#0f8a5a] text-white px-3 py-1 rounded-full text-xs">৳{p.price}</p></div>
                <p className="text-xs mt-2">Daily Task: {p.dailyTask} টা | Daily Income: ৳{p.dailyIncome} | {p.days} দিন</p>
                {myPlan?.id===p.id?<p className="mt-3 bg-green-600 text-white py-2 rounded-full text-center text-xs font-bold">✅ Active - এখন Task করতে পারবে</p>:<button onClick={()=>{ if(balance<p.price) return alert("Balance কম"); setBalance(b=>b-p.price); setMyPlan(p); alert("Plan কিনা হলো - এখন Task করতে পারবে")}} className="w-full mt-3 bg-black text-white py-3 rounded-full text-xs font-bold">Buy Plan ৳{p.price} - Balance ৳{balance}</button>}
              </div>
            ))}
          </div>
          <Ad t={ads.bottom} c="bg-white border"/><Bottom/>
        </div>
      </div>
    )
  }

  if(page==="home"){
    return(
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-[#e8f5e9] pb-24">
          <Header/><Ad t={ads.top}/>
          <div className="mx-4 mt-3 bg-white rounded-[16px] p-4 border flex justify-between"><div><p className="text-[10px]">Balance</p><p className="font-black">৳{balance}</p></div><div className="text-right"><p className="text-[10px]">My Plan</p><p className="font-black text-xs">{myPlan?myPlan.name:"No Plan ❌"}</p></div></div>
          {!myPlan&&<div className="mx-4 mt-3 bg-red-100 border border-red-300 rounded-[16px] p-3 text-center"><p className="text-xs font-bold text-red-700">❌ প্ল্যান কিনা ছাড়া Task Complete হবে না</p><button onClick={()=>setPage("plans")} className="mt-2 bg-red-600 text-white px-5 py-2 rounded-full text-xs font-bold">👑 প্ল্যান কিনুন এখনই</button></div>}
          <div className="px-4 mt-4 grid grid-cols-2 gap-3">
            <button onClick={()=>setPage("plans")} className="bg-black text-yellow-400 rounded-full p-3 flex gap-2 items-center border"><div className="w-8 h-8 bg-yellow-400 rounded-full flex justify-center items-center text-black">👑</div><div className="text-left"><p className="text-[8px]">VIP</p><p className="font-black text-xs">Buy Plan</p></div></button>
            <button onClick={()=>setPage("missions")} className="bg-white rounded-full p-3 flex gap-2 items-center border"><div className="w-8 h-8 bg-green-100 rounded-full flex justify-center items-center">☰</div><div className="text-left"><p className="text-[8px]">TASKS</p><p className="font-black text-xs">Missions</p></div></button>
          </div>
          <Ad t={ads.mid} c="bg-white border"/>
          <div className="px-4 mt-4 grid grid-cols-4 gap-2">
            <button onClick={()=>setPage("missions")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-[#0f8a5a] rounded-xl flex justify-center items-center text-white">☰</div><p className="text-[10px] font-bold mt-1">Mission</p></button>
            <button onClick={()=>setPage("plans")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-yellow-100 rounded-xl flex justify-center items-center">👑</div><p className="text-[10px] font-bold mt-1">VIP Plan</p></button>
            <button onClick={()=>setPage("inbox")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-blue-100 rounded-xl flex justify-center items-center">📥</div><p className="text-[10px] font-bold mt-1">Inbox</p></button>
            <button onClick={()=>setPage("help")} className="bg-white rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-green-50 rounded-xl flex justify-center items-center">🎧</div><p className="text-[10px] font-bold mt-1">Support</p></button>
            {isAdmin&&<><button onClick={()=>setPage("admin")} className="bg-yellow-400 rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-black rounded-xl flex justify-center items-center text-yellow-400">👑</div><p className="text-[10px] font-black mt-1">ADMIN</p></button><button onClick={()=>setPage("inbox")} className="bg-green-600 rounded-[18px] p-3 border flex flex-col items-center"><div className="w-10 h-10 bg-white rounded-xl flex justify-center items-center">📁</div><p className="text-[10px] font-black mt-1 text-white">INBOX</p></button></>}
          </div>
          <Ad t={ads.bottom} c="bg-white border"/><Bottom/>
        </div>
      </div>
    )
  }

  if(page==="missions"){
    return(
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-[#e8f5e9] pb-24">
          <Header/><Ad t={ads.top}/>
          <div className="px-4 mt-4"><button onClick={()=>setPage("home")} className="bg-[#0f8a5a] text-white px-4 py-2 rounded-full text-xs">← Home</button></div>
          <div className="px-4 mt-4 grid grid-cols-2 gap-3">
            <button onClick={()=>setPage("task1")} className="bg-white rounded-[20px] p-4 border text-left"><p className="font-black">টাস্ক ওয়ান</p><p className="text-[10px]">FB, Insta, Gmail</p></button>
            <button onClick={()=>setPage("task2")} className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-[20px] p-4 text-white text-left"><p className="font-black">টাস্ক টু</p><p className="text-[10px]">RR Coin</p></button>
            <button onClick={()=>setPage("task3")} className="bg-white rounded-[20px] p-4 border text-left"><p className="font-black">টাস্ক থ্রি</p><p className="text-[10px]">Visit Tasks</p></button>
            <button onClick={()=>setPage("task4")} className="bg-white rounded-[20px] p-4 border text-left"><p className="font-black">টাস্ক ফোর</p><p className="text-[10px]">Bind Rent</p></button>
          </div>
          <Bottom/>
        </div>
      </div>
    )
  }

  if(page.startsWith("task")){
    const list = tasks.filter(t=>t.cat===page).sort((a,b)=>a.order-b.order)
    return(
      <div className="min-h-screen bg-[#e8f5e9] flex justify-center">
        <div className="w-full max-w-[420px] bg-white min-h-screen pb-24">
          <Header/><Ad t={ads.top}/>
          <div className="px-4 mt-4"><button onClick={()=>setPage("missions")} className="bg-black text-white px-4 py-2 rounded-full text-xs">← Back</button><h2 className="font-black mt-3">{page.toUpperCase()}</h2>{!myPlan&&<p className="text-xs text-red-600 font-bold">❌ Plan লাগবে</p>}</div>
          <div className="px-4 mt-4 space-y-3">
            {list.map(t=>(
              <div key={t.id} className="bg-white rounded-[16px] p-4 border">
                <div className="flex justify-between"><span className="text-[8px] bg-green-600 text-white px-2 py-1 rounded-full">{t.plan}</span><span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">৳{t.price}</span></div>
                <p className="font-bold text-sm mt-2">{t.title}</p>
                <button onClick={()=>openTask(t)} className={`w-full mt-3 py-3 rounded-full text-xs font-bold ${!myPlan?"bg-gray-400 text-white":"bg-[#0f8a5a] text-white"}`}>{!myPlan?"🔒 Plan কিনো আগে":"START - 10s Ad"}</button>
              </div>
            ))}
          </div>
          <Bottom/>
          {showAd&&<div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50"><div className="bg-white rounded-[20px] p-5 w-full max-w-sm">
            <p className="font-black text-sm">📢 {ads.ten}</p><p className="text-center font-black text-3xl mt-3">{count>0?count+"s":"✅"}</p><div className="w-full bg-gray-200 h-2 rounded-full mt-2"><div className="bg-[#0f8a5a] h-2 rounded-full" style={{width:(10-count)*10+"%"}}></div></div>
            {can&&<><p className="font-bold text-xs mt-4">📁 File Upload + Text জমা দাও Admin Inbox এ</p>
            <input type="file" onChange={e=>setUploadFile(e.target.files?.[0]?.name||"file.txt")} className="w-full border rounded-xl p-2 mt-2 text-xs"/>
            <textarea value={uploadText} onChange={e=>setUploadText(e.target.value)} placeholder="Notepad / Cookie / Gmail / Proof লিখো - সব Inbox এ জমা হবে" className="w-full border rounded-xl p-3 mt-2 text-xs h-24"></textarea>
            <button onClick={submitTask} className="w-full mt-3 bg-[#0f8a5a] text-white py-3 rounded-full font-bold">Submit - Inbox এ জমা ৳{active?.price}</button></>}
            <button onClick={()=>setShowAd(false)} className="w-full mt-2 text-xs">Close</button>
          </div></div>}
        </div>
      </div>
    )
  }

  // INBOX - Admin সব File পাবে
  if(page==="inbox"){
    return(
      <div className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-[520px] p-4 pb-20">
          <button onClick={()=>setPage("home")} className="bg-[#0f8a5a] text-white px-5 py-2 rounded-full">← Home</button>
          <h1 className="font-black text-xl mt-4">📥 INBOX - সব File Upload জমা হবে এখানে</h1>
          <p className="text-xs mt-1">User যে File / Notepad / Cookie / Proof জমা দেবে সব এখানে আসবে</p>
          <div className="mt-4 space-y-3">
            {inbox.map(i=>(
              <div key={i.id} className="border-2 rounded-[16px] p-4 bg-[#f9f9f9]">
                <div className="flex justify-between"><span className="font-bold text-sm">{i.task}</span><span className={`text-[10px] px-2 py-1 rounded-full ${i.status==="Pending"?"bg-yellow-400":"bg-green-500 text-white"}`}>{i.status}</span></div>
                <p className="text-xs mt-2">👤 {i.user} | ৳{i.price} | {i.time}</p>
                <div className="bg-white border rounded-xl p-3 mt-2"><p className="text-xs font-bold">📁 File:</p><p className="text-xs mt-1 break-all">{i.file}</p><p className="text-xs font-bold mt-2">📝 Proof/Text:</p><p className="text-xs mt-1 break-all">{i.proof}</p></div>
                {isAdmin&&<div className="flex gap-2 mt-3"><button onClick={()=>setInbox(inbox.map(x=>x.id===i.id?{...x,status:"Approved"}:x))} className="flex-1 bg-green-600 text-white py-2 rounded-full text-xs font-bold">✅ Approve</button><button onClick={()=>setInbox(inbox.filter(x=>x.id!==i.id))} className="flex-1 bg-red-500 text-white py-2 rounded-full text-xs font-bold">❌ Delete</button><button onClick={()=>alert(i.file)} className="flex-1 bg-black text-white py-2 rounded-full text-xs">📥 Download File</button></div>}
              </div>
            ))}
          </div>
          {isAdmin&&<div className="mt-6 bg-black text-white rounded-[20px] p-4"><p className="font-bold">Admin File Upload System</p><p className="text-[10px] opacity-70 mt-1">তুমি এখানে File Upload করে User কে দিতে পারবে, সব Inbox এ Save হবে</p><input type="file" className="w-full mt-3 bg-white text-black rounded-xl p-3 text-xs"/><textarea placeholder="Admin Note লিখো" className="w-full mt-2 rounded-xl p-3 text-black text-xs h-20"></textarea><button className="w-full mt-2 bg-yellow-400 text-black py-3 rounded-full font-black text-xs">Upload File to Inbox</button></div>}
        </div>
      </div>
    )
  }

  if(page==="admin"){
    return(
      <div className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-[520px] p-4 pb-20">
          <button onClick={()=>setPage("home")} className="bg-[#0f8a5a] text-white px-5 py-2 rounded-full">← Home</button>
          <h1 className="font-black text-xl mt-4">👑 ADMIN PANEL</h1>

          <div className="bg-black text-white rounded-[20px] p-4 mt-4">
            <p className="font-bold">📢 Ad Control</p>
            <input value={ads.top} onChange={e=>setAds({...ads,top:e.target.value})} className="w-full p-3 rounded-xl text-black text-xs mt-
