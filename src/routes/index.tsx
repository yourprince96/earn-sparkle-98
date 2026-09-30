import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
export const Route = createFileRoute("/")({ component: FinalWithControl })

function FinalWithControl(){
  const ADMIN="fscnajmul2026@gmail.com"
  const [email,setEmail]=useState("")
  const [user,setUser]=useState<any>(null)
  const [page,setPage]=useState("home")
  const [cat,setCat]=useState("gmail")

  const [numbers,setNumbers]=useState({bkash:"01712XXXXXX Personal",nagad:"01812XXXXXX",usdt:"TXYZ...TRC20 Binance"})
  const [ads,setAds]=useState({top:"Top Ad Always",middle:"Middle Ad Always - 728x90",task:"10s Video Ad",bottom:"Bottom Ad"})
  const [plans,setPlans]=useState([
    {id:1,name:"Starter",price:500,daily:80,active:true},
    {id:2,name:"Pro",price:1500,daily:250,active:true},
    {id:3,name:"VIP",price:5000,daily:900,active:true},
  ])
  const [allTasks,setAllTasks]=useState<any[]>([
    {id:1,cat:"gmail",title:"Gmail Sell",reward:120,needPkg:true,active:true,fields:"Gmail,Password,Recovery"},
    {id:2,cat:"fb_cookies",title:"Facebook Cookies Sell - FB Cookies",reward:180,needPkg:true,active:true,fields:"FB Cookies c_user,xs,User Agent,Link"},
    {id:3,cat:"ig_cookies",title:"Instagram Cookies Sell - IG Cookies",reward:200,needPkg:true,active:true,fields:"IG Cookies sessionid,Username,Password"},
    {id:4,cat:"facebook",title:"Facebook Profile Sell",reward:150,needPkg:true,active:true,fields:"FB Link,Email,Password"},
    {id:5,cat:"social_visit",title:"Social Visit - Telegram Join",reward:15,needPkg:false,active:true,fields:"Telegram Link,Join Screenshot"},
    {id:6,cat:"social_visit",title:"Social Visit - FB Like + Follow",reward:20,needPkg:false,active:true,fields:"FB Page Link,Like Screenshot"},
    {id:7,cat:"social_visit",title:"Social Visit - Instagram Video View + Like",reward:25,needPkg:false,active:true,fields:"Insta Video Link,View + Like Screenshot"},
    {id:8,cat:"social_visit",title:"Social Visit - YouTube View + Subscribe",reward:30,needPkg:false,active:true,fields:"YouTube Link,Subscribe Screenshot"},
    {id:9,cat:"visa",title:"Visa Card Sell / Visa Service",reward:500,needPkg:true,active:true,fields:"Card Number,Expiry,CVV / Visa Details"},
    {id:10,cat:"coin",title:"USDT Coin Sell",reward:100,needPkg:true,active:true,fields:"Amount,Hash,From Address"},
    {id:11,cat:"whatsapp_band",title:"WhatsApp Band Fix",reward:300,needPkg:true,active:true,fields:"WhatsApp Number,Ban Screenshot"},
  ])
  const [submissions,setSubmissions]=useState<any[]>([])
  const [deposits,setDeposits]=useState<any[]>([])
  const [features,setFeatures]=useState({gmail:true,fb_cookies:true,ig_cookies:true,facebook:true,social_visit:true,visa:true,coin:true,whatsapp_band:true,instagram:true,twitter:true,telegram:true,whatsapp:true} as any)

  const [dM,setDM]=useState("bkash")
  const [dA,setDA]=useState("")
  const [dT,setDT]=useState("")
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
    if(d.features) setFeatures(d.features)
  },[])

  const save=(extra:any={})=>{localStorage.setItem("true_data",JSON.stringify({ads,numbers,plans,tasks:allTasks,deposits,subs:submissions,features,...extra}))}
  useEffect(()=>{if(adOpen && count>0){const t=setTimeout(()=>setCount(c=>c-1),1000); return()=>clearTimeout(t)} if(count===0) setCanDo(true)},[adOpen,count])

  const login=()=>{
    if(!email) return alert("Email দাও")
    let all=JSON.parse(localStorage.getItem("true_allusers")||"[]")
    let f=all.find((x:any)=>x.email===email)
    let u=f || {email,accId:"#BIZ"+Math.floor(10000+Math.random()*90000),balance:0,plan:null}
    if(!f){all=[...all,u]; localStorage.setItem("true_allusers",JSON.stringify(all))}
    localStorage.setItem("true_user",JSON.stringify(u))
    setUser(u)
  }

  const isAdmin=user?.email===ADMIN
  const filtered=allTasks.filter(t=>t.cat===cat && t.active && (features as any)[t.cat])

  if(!user) return <div className="min-h-screen bg-black flex items-center justify-center p-6"><div className="bg-white w-full max-w-sm rounded-[32px] p-8"><h1 className="text-3xl font-black">Business Pro Max</h1><p className="text-xs">Admin Control + New Tasks</p><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mt-6 border-2 border-black rounded-full p-4 text-sm"/><button onClick={login} className="w-full mt-4 bg-black text-white py-4 rounded-full font-black">LOGIN</button></div></div>

  if(page==="admin" && isAdmin){
    return <div className="min-h-screen bg-white p-4 pb-32">
      <button onClick={()=>setPage("home")} className="bg-black text-white px-5 py-2 rounded-full text-sm">← Back</button>
      <h1 className="text-xl font-black mt-4">ADMIN - Full Control Including New Tasks</h1><p className="text-xs text-green-600 font-bold">{ADMIN}</p>

      <div className="bg-black text-white rounded-[24px] p-5 mt-4"><h3 className="font-black">📢 Ad Control - Top + Middle Always</h3><textarea value={ads.top} onChange={e=>{const n={...ads,top:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-2 text-xs h-14" placeholder="Top Ad Always"/><textarea value={ads.middle} onChange={e=>{const n={...ads,middle:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-2 text-xs h-20" placeholder="Middle Ad Always"/><textarea value={ads.task} onChange={e=>{const n={...ads,task:e.target.value}; setAds(n); save({ads:n})}} className="w-full bg-white/10 border rounded-xl p-2 mt-2 text-xs h-14" placeholder="Task 10s Ad"/></div>

      <div className="bg-green-50 border-2 border-green-300 rounded-[24px] p-5 mt-4"><h3 className="font-black">📥 Receive Inbox - FB Cookies, IG Cookies, Social Visit, Visa সব এখানে আসবে</h3>{submissions.length===0?<p className="text
