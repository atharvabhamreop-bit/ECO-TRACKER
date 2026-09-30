import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

async function call(path, body) {
  const r = await fetch(API + path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : undefined);
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.message || "Something went wrong");
  return d;
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [tab, setTab] = useState("dashboard");
  const save = (u) => {
    u ? localStorage.setItem("user", JSON.stringify(u)) : localStorage.removeItem("user");
    setUser(u);
  };
  if (!user) return <Auth onDone={save} />;
  return (
    <>
      <nav>
        <b>Eco Tracker</b>
        <button className={tab === "dashboard" ? "on" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className={tab === "board" ? "on" : ""} onClick={() => setTab("board")}>Leaderboard</button>
        <span className="grow" />
        <span>{user.name}</span>
        <button onClick={() => save(null)}>Log out</button>
      </nav>
      <main>{tab === "dashboard" ? <Dashboard user={user} /> : <Leaderboard me={user.id} />}</main>
    </>
  );
}

function Auth({ onDone }) {
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!/^\S+@\S+\.\S+$/.test(f.email) || f.password.length < 6 || (reg && !f.name.trim()))
      return setErr("Enter a valid email and a password of 6+ characters" + (reg ? ", plus your name" : ""));
    try { onDone(await call(reg ? "/register" : "/login", f)); } catch (x) { setErr(x.message); }
  }
  return (
    <form className="auth" onSubmit={submit}>
      <h1>{reg ? "Create your account" : "Log in"}</h1>
      {reg && <input placeholder="Name" value={f.name} onChange={set("name")} />}
      <input placeholder="Email" value={f.email} onChange={set("email")} />
      <input placeholder="Password" type="password" value={f.password} onChange={set("password")} />
      {err && <p className="err">{err}</p>}
      <button className="primary">{reg ? "Register" : "Log in"}</button>
      <a onClick={() => { setReg(!reg); setErr(""); }}>{reg ? "Already registered? Log in" : "New here? Create an account"}</a>
    </form>
  );
}

function Dashboard({ user }) {
  const [d, setD] = useState(null);
  const [cfg, setCfg] = useState(null);
  const load = () => call(`/users/${user.id}/dashboard`).then(setD);
  useEffect(() => { call("/config").then(setCfg); load(); }, []);
  const add = async (name) => { await call("/activities", { userId: user.id, activityName: name }); load(); };
  if (!d || !cfg) return <p>Loading…</p>;
  const pts = d.user.totalPoints;
  const next = Object.entries(cfg.badges).find(([, n]) => n > pts);
  const co2 = d.co2Total ?? 0;
  const TREE_KG_PER_YEAR = 21; // placeholder, replace with a cited value
  return (
    <>
      <section className="hero">
        <div className="big">{pts}<small> Eco Points</small></div>
        {next ? (
          <div>
            <div className="bar"><i style={{ width: `${Math.min(100, (pts / next[1]) * 100)}%` }} /></div>
            <p>{next[1] - pts} points to {next[0]}</p>
          </div>
        ) : <p>You've earned every badge.</p>}
      </section>

      {/* NEW: environmental impact */}
      <h2>Your impact</h2>
      <div className="stats">
        <div><b>{co2}</b>kg CO₂ saved (total)</div>
        <div><b>{d.co2Today ?? 0}</b>kg today</div>
        <div><b>{d.co2Week ?? 0}</b>kg last 7 days</div>
        <div><b>{d.co2Month ?? 0}</b>kg last 30 days</div>
      </div>
      <p>🌳 About the same as {(co2 / TREE_KG_PER_YEAR).toFixed(1)} trees absorbing CO₂ for a year</p>

      <h2>Log an activity</h2>
      <div className="tiles">
        {Object.entries(cfg.activities).map(([name, p]) => (
          <button key={name} onClick={() => add(name)}>
            <span>{name}</span>
            <b>+{p}</b>
            {cfg.co2 && <small>saves {cfg.co2[name]} kg CO₂</small>}
          </button>
        ))}
      </div>

      <h2>Progress</h2>
      <div className="stats">
        <div><b>{d.totalActivities}</b>activities</div>
        <div><b>{d.today}</b>points today</div>
        <div><b>{d.week}</b>last 7 days</div>
        <div><b>{d.month}</b>last 30 days</div>
      </div>

      <h2>Badges</h2>
      <div className="badges">
        {Object.entries(cfg.badges).map(([name, n]) => (
          <span key={name} className={d.badges.includes(name) ? "got" : ""}>{name} · {n}</span>
        ))}
      </div>

      <h2>Recent activity</h2>
      {d.recent.length === 0 && <p>Nothing logged yet. Tap an activity above to start.</p>}
      <ul>
        {d.recent.map((a) => (
          <li key={a.id}>
            <span>{a.activityName}</span>
            <span>{a.date}</span>
            <span>{a.co2Saved ?? 0} kg CO₂</span>
            <b>+{a.points}</b>
          </li>
        ))}
      </ul>
    </>
  );
}

function Leaderboard({ me }) {
  const [rows, setRows] = useState([]);
  useEffect(() => { call("/leaderboard").then(setRows); }, []);
  return (
    <>
      <h2>Leaderboard</h2>
      <ul>
        {rows.map((u, i) => (
          <li key={u.id} className={u.id === me ? "me" : ""}><span>{i + 1}</span><span>{u.name}</span><b>{u.totalPoints}</b></li>
        ))}
      </ul>
    </>
  );
}