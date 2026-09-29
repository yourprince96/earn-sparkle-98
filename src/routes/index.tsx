import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: App })

function App(){
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("home") // home, missions, finance, profile
  const [feature, setFeature] = useState<string | null>(null) // which service open
  const [email, setEmail] = useState("fscnajmul2026@gmail.com")
  const ADMIN = "fscnajmul2026@gmail.com"

  const [tasks, setTasks] = useState([{id:1, title:"YouTube Subscribe - 1min watch", reward:25}, {id:2, title:"Facebook Page Like", reward:15}])

  useEffect(()=>{
    const u = localStorage.getItem("nt_user")
    if(u) setUser(JSON.parse(u))
    const t = localStorage.getItem("nt_tasks")
    if(t) setTasks(JSON.parse(t))
  },[])

  const login = () => {
    const accId = "#100" + Math.floor(100000 + Math.random()*900000)
    const u = {email, accId: email===ADMIN? "#1003269" : accId, balance:0}
    localStorage.setItem("nt_user", JSON.stringify(u))
    setUser(u)
  }

  if(!user){
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-black text-[#0f7a4a]">Najmul Task 2.0</h1>
        <div className="bg-white w-full max-w-sm rounded-[22px] p-5 shadow mt-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-3 rounded-xl text-sm" />
          <button onClick={login} className="w-full mt-4 bg-[#0f7a4a] text-white py-3 rounded-full font-bold">LOGIN</button>
          <p className="text-[10px] text-center mt-2 text-gray-400">Admin only: {ADMIN}</p>
        </div>
      </div>
    )
  }

  const isAdmin = user.email === ADMIN

  // SECURE ADMIN - কেউ লিংক দিয়েও ঢুকতে পারবে না
  if(activeTab==="admin"){
    if(!isAdmin){
      setActiveTab("home")
      return null
    }
    return (
      <div className="min-h-screen bg-[#f5f5f5] p-4">
        <button onClick={()=>setActiveTab("home")} className="bg-black text-white px-4 py-2 rounded-full text-sm">← Back</button>
        <h1 className="text-lg font-black mt-4">ADMIN PANEL 🔐 (Only You)</h1>
        <p className="text-xs text-green-700">{user.email}</p>

        <div className="bg-yellow-50 border p-4 rounded-2xl mt-4">
          <h3 className="font-bold text-sm">Withdraw Requests Live</h3>
          <div className="bg-white p-3 rounded-xl mt-2 text-xs">#1003269 - ৳800 - 01712XXXXX <button className="bg-green-600 text-white px-3 py-1 rounded-full ml-2">Approve</button></div>
        </div>
        <div className="bg-white p-4 rounded-2xl mt-3">
          <h3 className="font-bold text-sm">Task Add</h3>
          <div className="flex gap-2 mt-2">
            <input id="tt" placeholder="Task name" className="flex-1 border p-2 rounded-xl text-xs" />
            <input id="tr" placeholder="৳" type="number" className="w-16 border p-2 rounded-xl text-xs" />
            <button onClick={()=>{const t=(document.getElementById("tt") as HTMLInputElement).value; const r=(document.getElementById("tr") as HTMLInputElement).value; const nt=[...tasks,{id:Date.now(),title:t,reward:Number(r)}]; setTasks(nt); localStorage.setItem("nt_tasks", JSON.stringify(nt))}} className="bg-[#0f7a4a] text-white px-4 rounded-full text-xs">Add</button>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl mt-3 border">
          <h3 className="font-bold text-sm">Ad & Notice Control</h3>
          <textarea placeholder="Ad Code" className="w-full border p-2 rounded-xl mt-2 text-xs h-20"></textarea>
          <button className="bg-black text-white px-4 py-2 rounded-full text-xs mt-2">Save</button>
        </div>
      </div>
    )
  }

  // FEATURE PAGES - প্রত্যেকটা বাটনে ঢোকা যাবে
  if(feature){
    return (
      <div className="min-h-screen bg-[#e8f5e9] p-4">
        <button onClick={()=>setFeature(null)} className="bg-black text-white px-4 py-2 rounded-full text-sm">← Back</button>
        <div className="bg-white rounded-[20px] p-6 mt-4 shadow">
          <h1 className="text-xl font-black text-[#0f7a4a]">{feature}</h1>
          <p className="text-sm mt-2 text-gray-600">This is {feature} page. All content controlled from Admin Panel.</p>
          {feature==="VIP Plan" && <div className="mt-4"><div className="bg-[#e8f5e9] p-4 rounded-xl flex justify-between"><span>VIP 1 - ৳500</span><button className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">Buy</button></div></div>}
          {feature==="Mission" && <div className="mt-4">{tasks.map(t=><div key={t.id} className="flex justify-between py-2 border-b"><span>{t.title}</span><button className="bg-[#0f7a4a] text-white px-3 py-1 rounded-full text-xs">৳{t.reward}</button></div>)}</div>}
          {feature!=="Mission" && feature!=="VIP Plan" && <p className="mt-6 text-xs bg-gray-100 p-3 rounded-xl">Feature coming soon - Admin থেকে Control করতে পারবে</p>}
        </div>
      </div>
    )
  }

  // BOTTOM TABS PAGES
  if(activeTab!=="home"){
    return (
      <div className="min-h-screen bg-[#e8f5e9] pb-24">
        <div className="bg-[#0f7a4a] text-white p-4 rounded-b-[24px] flex justify-between">
          <h1 className="font-bold capitalize">{activeTab}</h1>
          <button onClick={()=>setActiveTab("home")} className="text-xs bg-white/20 px-3 py-1 rounded-full">Home</button>
        </div>
        <div className="bg-white m-4 rounded-[20px] p-6 shadow">
          <h2 className="font-bold">{activeTab==="missions"?"All Missions": activeTab==="finance"?"Finance History": "Profile - " + user.accId}</h2>
          {activeTab==="missions" && tasks.map(t=><div key={t.id} className="flex justify-between mt-3 text-sm"><span>{t.title}</span><span>৳{t.reward}</span></div>)}
          {activeTab==="finance" && <p className="text-sm mt-3 text-gray-500">Deposit: ৳0 | Withdraw: ৳0 | Pending: ৳0</p>}
          {activeTab==="profile" && <div className="mt-3 text-sm"><p>Email: {user.email}</p><p>ID: {user.accId}</p><p>Balance: ৳{user.balance}</p><button onClick={()=>{localStorage.removeItem("nt_user"); setUser(null)}} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full">Logout</button></div>}
        </div>
        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[22px] flex justify-around items-center py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <button onClick={()=>setActiveTab("home")} className="flex flex-col items-center text-gray-400"><span>🏠</span><span className="text-[9px]">Home</span></button>
          <button onClick={()=>setActiveTab("missions")} className={`flex flex-col items-center ${activeTab==="missions"?"text-[#0f7a4a]":"text-gray-400"}`}><span>📚</span><span className="text-[9px]">Missions</span></button>
          <button onClick={()=>setActiveTab("home")} className="w-12 h-12 bg-[#0f7a4a] rounded-full text-white flex items-center justify-center -mt-6 border-4 border-[#e8f5e9]">⊞</button>
          <button onClick={()=>setActiveTab("finance")} className={`flex flex-col items-center ${activeTab==="finance"?"text-[#0f7a4a]":"text-gray-400"}`}><span>📄</span><span className="text-[9px]">Finance</span></button>
          <button onClick={()=>setActiveTab("profile")} className={`flex flex-col items-center ${activeTab==="profile"?"text-[#0f7a4a]":"text-gray-400"}`}><span>👤</span><span className="text-[9px]">Profile</span></button>
        </div>
      </div>
    )
  }

  // MAIN HOME - Same as screenshot
  return (
    <div className="min-h-screen bg-[#e8f5e9] pb-28">
      <div className="bg-[#0f7a4a] text-white px-4 pt-2 pb-6 rounded-b-[28px]">
        <div className="flex justify-between items-center py-2">
          <span className="font-black">🪙 ROLEX 2.0</span>
          <div className="flex gap-2">
            {isAdmin && <button onClick={()=>setActiveTab("admin")} className="bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">ADMIN PANEL</button>}
          </div>
        </div>
        <div className="flex justify-between mt-4 px-2">
          <div><p className="text-[10px] opacity-70">REFERRAL INCOME</p><p className="font-bold">৳{user.balance}.00</p></div>
          <div className="text-right"><p className="text-[10px] opacity-70">ACCOUNT ID</p><p className="font-bold">{user.accId}</p></div>
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <button onClick={()=>setFeature("Deposit")} className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm text-left"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">+</div><div><p className="text-[10px]">ADD FUND</p><p className="font-bold text-sm">Deposit</p></div></button>
        <button onClick={()=>setFeature("Withdraw")} className="bg-[#fff0f3] rounded-full p-4 flex items-center gap-3 shadow-sm text-left border border-red-100"><div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify
