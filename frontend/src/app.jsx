import React,{useState,useEffect,useContext,createContext}from"react";
import{createRoot}from"react-dom/client";
import{BrowserRouter,useNavigate,useLocation,Routes,Route,Link,Navigate}from"react-router-dom";
import"./App.css";

/* ---------- Backend connection ---------- */
// Change the port here, or set VITE_API_URL in frontend/.env
const API=import.meta.env.VITE_API_URL||"http://localhost:8080/api";
async function call(path,body){
 let r;
 try{r=await fetch(API+path,body!==undefined?{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:undefined)}
 catch{throw new Error("Cannot reach the server. Is the backend running?")}
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.message||"Something went wrong");
 return j;
}
const getUser=()=>{try{return JSON.parse(localStorage.getItem("user"))}catch{return null}};

// Icons by activity name. Names, points and CO2 come from the backend (/api/config)
const ICONS={"Walking/Cycling":"🚲","Using Public Transport":"🚌","Recycling Waste":"♻️","Avoiding Single-use Plastic":"🥤","Saving Electricity":"⚡","Planting a Tree":"🌳"};
const B=[["Green Starter",50,"🌱"],["Eco Explorer",100,"🧭"],["Eco Champion",250,"🏆"],["Planet Protector",500,"🌍"]];

/* ---------- Shared dashboard data (loaded from backend) ---------- */
const Ctx=createContext({d:null,reload:()=>{}});
const useDash=()=>useContext(Ctx);
function DashProvider({children}){
 const[d,setD]=useState(null);
 const reload=async()=>{
  const u=getUser();
  if(!u){setD(null);return}
  try{setD(await call(`/users/${u.id}/dashboard`))}
  catch(e){if(e.message==="No such user"){localStorage.removeItem("user");setD(null)}}
 };
 useEffect(()=>{reload()},[]);
 return <Ctx.Provider value={{d,reload}}>{children}</Ctx.Provider>
}
const Guard=({children})=>getUser()?children:<Navigate to="/login" replace/>;

function Side(){
 let n=useNavigate(),l=useLocation(),{reload}=useDash();
 return <aside>
  <div className="brand"><span>🌱</span><div><b>ECO-TRACKER</b><small>Live greener</small></div></div>
  {["dashboard","activities","progress","leaderboard","profile","content","help","contact"].map(x=>
   <button key={x} className={l.pathname.includes(x)?"on":""} onClick={()=>n("/"+x)}>
    {({dashboard:"🏠",activities:"🌿",progress:"📈",leaderboard:"🏆",profile:"👤",content:"📚",help:"❓",contact:"✉️"})[x]} {x[0].toUpperCase()+x.slice(1)}
   </button>)}
  <button className="logout" onClick={()=>{localStorage.removeItem("user");reload();n("/")}}>↪ Logout</button>
 </aside>
}
function Layout({children}){
 const{d}=useDash(),pts=d?.user?.totalPoints??0;
 return <div className="layout"><Side/><main>
  <header><div><b>Eco Tracker</b><span>Welcome back 🌍</span></div><div className="topscore">🌱 {pts} pts</div></header>{children}
 </main></div>
}
function Home(){
 const [count,setCount]=useState(0);
 return <div className="home">
  <nav><Link to="/" className="logo">🌱 ECO-TRACKER</Link><div><a href="#features">Features</a><a href="#about">About</a><Link to="/contact">Contact</Link><Link to="/login">Login</Link><Link className="btn" to="/signup">Get Started</Link></div></nav>
  <section className="hero"><div className="heroText"><span className="pill">🌍 MAKE EVERY ACTION COUNT</span><h1>Track your habits.<br/><em>Protect the planet.</em></h1><p>Complete sustainable activities, earn Eco Points, unlock badges and build a greener lifestyle—one small action at a time.</p><div className="actions"><Link className="btn big" to="/signup">Start Your Journey →</Link><Link className="ghost" to="/content">Learn More</Link></div><div className="trust"><span>♻️ 6 activities</span><span>🏆 4 badges</span><span>📊 Live progress</span></div></div>
  <div className="heroVisual"><div className="orb">🌱<strong>{count}</strong><small>Eco Points</small></div><div className="float f1">♻️ Recycle +10</div><div className="float f2">🌳 Plant a tree +25</div><button className="miniAction" onClick={()=>setCount(count+10)}>＋ Try earning points</button></div></section>
  <section id="features" className="features"><div><span>🌿</span><h3>Track Activities</h3><p>Record everyday eco-friendly actions in seconds.</p></div><div><span>🏆</span><h3>Earn Rewards</h3><p>Collect points and unlock meaningful badges.</p></div><div><span>📈</span><h3>See Your Progress</h3><p>Watch your environmental journey grow over time.</p></div></section>
  <section id="about" className="about"><span className="pill">ABOUT ECO-TRACKER</span><h2>Small actions can create a <em>big impact.</em></h2><p>Eco-Tracker helps students and communities turn sustainable choices into visible progress. Walk, recycle, save electricity, use public transport and more.</p></section>
  <footer>© 2026 Eco-Tracker · Contact: ecoact@gmail.com · 9082871533</footer>
 </div>
}

/* ---------- Login / Signup: now verified by the backend ---------- */
function Auth({signup=false}){
 const n=useNavigate(),{reload}=useDash(),[f,setF]=useState({}),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
 const submit=async e=>{
  e.preventDefault();setErr("");setBusy(true);
  try{
   const u=await call(signup?"/register":"/login",signup?{name:(f.name||"").trim(),email:f.email,password:f.password}:{email:f.email,password:f.password});
   // password is never stored in the browser
   localStorage.setItem("user",JSON.stringify({id:u.id,name:u.name,email:f.email}));
   await reload();n("/dashboard");
  }catch(x){setErr(x.message)}
  setBusy(false);
 };
 return <div className="auth"><form onSubmit={submit}>
  <Link to="/" className="back">← Home</Link><div className="authLogo">🌱</div><h2>{signup?"Create your account":"Welcome back!"}</h2><p>{signup?"Start your greener journey today.":"Continue your eco journey."}</p>
  {signup&&<input required placeholder="Full name" onChange={e=>setF({...f,name:e.target.value})}/>}
  <input required type="email" placeholder="Email" onChange={e=>setF({...f,email:e.target.value})}/><input required type="password" placeholder="Password" onChange={e=>setF({...f,password:e.target.value})}/>
  {err&&<p style={{color:"#c0392b",margin:"8px 0"}}>{err}</p>}
  <button className="btn" disabled={busy}>{busy?"Please wait…":signup?"Sign Up":"Login"}</button>
  <Link to={signup?"/login":"/signup"}>{signup?"Already have an account? Login":"New here? Create an account"}</Link>
 </form></div>
}

function Dashboard(){
 const{d}=useDash(),u=getUser()||{};
 if(!d)return <Layout><p>Loading…</p></Layout>;
 const pts=d.user.totalPoints,co2=d.co2Total??0;
 return <Layout><div className="pageTitle"><div><span className="eyebrow">YOUR ECO JOURNEY</span><h1>Hello, {u.name||"Eco Friend"} 👋</h1><p>Keep making small changes for a healthier planet.</p></div><Link className="btn" to="/activities">＋ Add Activity</Link></div>
 <div className="stats">{[["🌱","Eco Points",pts],["🌿","Activities",d.totalActivities],["🏆","Badges",B.filter(b=>pts>=b[1]).length],["🌍","CO₂ Saved",co2+" kg"]].map(x=><div className="stat" key={x[1]}><span>{x[0]}</span><small>{x[1]}</small><b>{x[2]}</b></div>)}</div>
 <div className="twoCol"><div className="panel"><div className="panelHead"><h2>Recent activities</h2><Link to="/activities">View all</Link></div>{d.recent.length?<div>{d.recent.slice(0,5).map(x=><div className="activityRow" key={x.id}><span>🌿</span><div><b>{x.activityName}</b><small>{x.date}</small></div><strong>+{x.points}</strong></div>)}</div>:<div className="empty">No activities yet. Start your journey today! 🌱</div>}</div>
 <div className="panel impact"><span className="bigLeaf">🌍</span><h2>Your impact</h2><p>Every sustainable choice adds up.</p><div className="impactLine"><b>{co2} kg</b><span>CO₂ saved · {pts} points</span></div><Link className="btn" to="/progress">View Progress</Link></div></div></Layout>
}

function Activities(){
 const{reload}=useDash(),u=getUser(),[cfg,setCfg]=useState(null),[busy,setBusy]=useState(false),[err,setErr]=useState(""),[ok,setOk]=useState("");
 useEffect(()=>{call("/config").then(setCfg).catch(e=>setErr(e.message))},[]);
 const add=async name=>{
  if(busy)return;setBusy(true);setErr("");
  try{
   await call("/activities",{userId:u.id,activityName:name});
   await reload();setOk(name);setTimeout(()=>setOk(""),1500);
  }catch(e){setErr(e.message)}
  setBusy(false);
 };
 return <Layout><div className="pageTitle"><div><span className="eyebrow">GO GREEN</span><h1>Eco Activities</h1><p>Choose an action and earn points.</p></div></div>
 {err&&<p style={{color:"#c0392b"}}>{err}</p>}
 {!cfg&&!err&&<p>Loading…</p>}
 <div className="grid">{cfg&&Object.entries(cfg.activities).map(([name,pts])=><div className="card" key={name}><span className="emoji">{ICONS[name]||"🌿"}</span><h3>{name}</h3><b>+{pts} points · {cfg.co2?.[name]??0} kg CO₂</b><button disabled={busy} onClick={()=>add(name)}>{ok===name?"Added ✓":"Complete Activity ✓"}</button></div>)}</div></Layout>
}

function Progress(){
 const{d}=useDash();
 if(!d)return <Layout><p>Loading…</p></Layout>;
 const pts=d.user.totalPoints;
 return <Layout><span className="eyebrow">YOUR ACHIEVEMENTS</span><h1>Progress</h1><div className="panel progressBox"><div><h2>{pts} Eco Points</h2><p>Next badge: {B.find(b=>pts<b[1])?.[0]||"Planet Protector"}</p></div><strong>{Math.min((pts/500)*100,100).toFixed(0)}%</strong><div className="bar"><i style={{width:Math.min(pts/5,100)+"%"}}/></div></div><div className="grid">{B.map(b=><div className={"card badge "+(pts>=b[1]?"unlock":"")} key={b[0]}><span className="emoji">{b[2]}</span><h3>{b[0]}</h3><p>{b[1]} points</p><b>{pts>=b[1]?"✓ Unlocked":"🔒 Locked"}</b></div>)}</div></Layout>
}

function Leaderboard(){
 const me=getUser()||{},[rows,setRows]=useState(null),[err,setErr]=useState("");
 useEffect(()=>{call("/leaderboard").then(setRows).catch(e=>setErr(e.message))},[]);
 return <Layout><span className="eyebrow">COMMUNITY</span><h1>Leaderboard</h1>
 {err&&<p style={{color:"#c0392b"}}>{err}</p>}
 {!rows&&!err&&<p>Loading…</p>}
 {rows&&!rows.length&&<p>No one on the board yet.</p>}
 {rows&&<div className="panel leaderboard">{rows.map((x,i)=><div className={x.id===me.id?"you":""} key={x.id}><span>{["🥇","🥈","🥉"][i]||"🌱"}</span><b>{x.name}{x.id===me.id?" (you)":""}</b><strong>{x.totalPoints} pts</strong></div>)}</div>}</Layout>
}

function Profile(){
 const u=getUser()||{},{d}=useDash();
 return <Layout><span className="eyebrow">ACCOUNT</span><h1>Profile</h1><div className="panel profile"><div className="avatar">👤</div><h2>{u.name||"Eco User"}</h2><p>{u.email||"No email"}</p><span className="tag">🌱 Eco Member</span>{d&&<p>{d.user.totalPoints} points · {d.co2Total??0} kg CO₂ saved · {d.totalActivities} activities</p>}</div></Layout>
}

function Content(){return <Layout><span className="eyebrow">LEARN & ACT</span><h1>Eco Content</h1><div className="contentGrid">{[["♻️","Why Recycling Matters","Recycling reduces waste, saves resources and helps keep useful materials in circulation."],["⚡","Save Electricity","Switch off unused lights and devices, use efficient appliances and make natural light your first choice."],["🚌","Choose Greener Travel","Walking, cycling and public transport can reduce unnecessary fuel use and support cleaner cities."],["🌳","Protect Green Spaces","Plant and care for trees, avoid littering and encourage others to protect local biodiversity."]].map(x=><div className="contentCard" key={x[1]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div></Layout>}
function Help(){return <Layout><span className="eyebrow">SUPPORT</span><h1>Help Center</h1><div className="faq">{[["How do I earn points?","Open Eco Activities, choose an activity and press Complete Activity."],["Where can I see my badges?","Open Progress to see unlocked and locked badges."],["Can I see my recent activities?","Yes. Your latest activities appear on the Dashboard."],["Need more help?","Contact our team using the details on the Contact page."]].map(x=><details key={x[0]}><summary>{x[0]}</summary><p>{x[1]}</p></details>)}</div></Layout>}
function Contact(){return <Layout><span className="eyebrow">WE ARE HERE TO HELP</span><h1>Contact Us</h1><div className="contactGrid"><div className="panel contactCard"><span className="contactIcon">✉️</span><h2>Eco-Tracker Support</h2><p>Have a question, suggestion or feedback? Get in touch with us.</p><a href="mailto:ecoact@gmail.com">📧 ecoact@gmail.com</a><a href="tel:9082871533">📞 9082871533</a></div><form className="panel contactForm" onSubmit={e=>{e.preventDefault();alert("Thank you! Your message is ready to be sent to ecoact@gmail.com.")}}><input required placeholder="Your name"/><input required type="email" placeholder="Your email"/><textarea required placeholder="Write your message..."></textarea><button className="btn">Send Message →</button></form></div></Layout>}

function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Auth/>}/><Route path="/signup" element={<Auth signup/>}/><Route path="/dashboard" element={<Guard><Dashboard/></Guard>}/><Route path="/activities" element={<Guard><Activities/></Guard>}/><Route path="/progress" element={<Guard><Progress/></Guard>}/><Route path="/leaderboard" element={<Guard><Leaderboard/></Guard>}/><Route path="/profile" element={<Guard><Profile/></Guard>}/><Route path="/content" element={<Content/>}/><Route path="/help" element={<Help/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes>}
createRoot(document.getElementById("root")).render(<BrowserRouter><DashProvider><App/></DashProvider></BrowserRouter>);
