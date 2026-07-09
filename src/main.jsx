
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Dumbbell, CalendarDays, Activity, TrendingUp, Flame, Save, CheckCircle2 } from "lucide-react";
import "./styles.css";

const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const trainingPlan = {
  Lunes: { title: "Pierna + Zona 2", type: "Fuerza + cardio", warmup: ["5 min Assault Bike o cinta inclinada", "10 Bodyweight Squats", "10 Walking Lunges por pierna", "10 Glute Bridges", "Movilidad de tobillo y cadera"], exercises: [["Front Squat","4","6","Torso alto, core fuerte."],["Romanian Deadlift","4","8","Bajada lenta, siente isquios."],["Bulgarian Split Squat","3","10/lado","Controla rodilla y equilibrio."],["Walking Lunges","3","12/lado","Pasos largos y controlados."],["Standing Calf Raise","4","15","Pausa arriba."],["Pallof Press","3","12/lado","No dejes que el cable te gire."],["Farmer Carry","4","30 m","Postura alta y estable."],["Caminata inclinada","1","25-30 min","Zona 2."]]},
  Martes: { title: "Pecho + Running calidad", type: "Push + carrera", warmup: ["5 min remo suave", "15 Band Pull Aparts", "15 Scapular Push Ups", "10 Push Ups", "Movilidad de hombro"], exercises: [["Barbell Bench Press","4","6","Escápulas atrás y pies firmes."],["Incline Dumbbell Press","3","10","Controla la bajada."],["Chest Press Machine","3","12","Rango cómodo."],["Seated DB Shoulder Press","3","10","No arquees espalda."],["Rope Triceps Pushdown","3","12","Codos pegados."],["Overhead Triceps Extension","3","12","Estira bien."],["Running calidad","1","30-40 min","10 min suave + 6x1 min rápido + enfriar."]]},
  Miércoles: { title: "Espalda + Cardio", type: "Pull + zona 2", warmup: ["5 min SkiErg suave", "15 Band Pull Aparts", "10 Cat-Cow", "10 Scapular Pull Ups"], exercises: [["Lat Pulldown","4","8","Pecho arriba, tira con dorsales."],["Barbell Row","4","8","Espalda neutra."],["Single Arm DB Row","3","10/lado","Controla rotación."],["Face Pull","3","15","Codos altos."],["EZ Bar Curl","3","10","Sin balanceo."],["Hammer Curl","3","12","Muñecas neutras."],["Dead Bug","3","12","Lumbar pegada al suelo."],["Remo Concept2","1","20-25 min","Zona 2."]]},
  Jueves: { title: "Hombro + Running suave", type: "Shoulders + easy run", warmup: ["5 min Assault Bike", "15 Band Pull Aparts", "15 External Rotations", "Movilidad de hombro"], exercises: [["Standing Barbell Overhead Press","4","6","Core fuerte."],["Dumbbell Lateral Raise","3","15","Ligero y controlado."],["Rear Delt Fly","3","15","No tires con trapecio."],["Cable Lateral Raise","3","12","Tensión constante."],["Face Pull","3","15","Control."],["Running suave","1","5-7 km","Zona 2-3 baja."]]},
  Viernes: { title: "Brazos + Hybrid Performance", type: "Hyrox style", warmup: ["5 min remo suave", "10 Air Squats", "10 Walking Lunges", "10 KB Deadlifts ligeros"], exercises: [["Kettlebell Swings","4","15","Explosivo desde glúteos."],["Box Step Ups","3","12/lado","Sube estable."],["Farmer Carry","4","40 m","Postura alta."],["Incline DB Curl","3","12","Estira abajo."],["Hammer Curl","3","12","Control total."],["Rope Pushdown","3","12","Aprieta abajo."],["Copenhagen Plank","3","lado","Progresivo."],["Hyrox Finisher","3","rondas","250m remo + 15 lunges + 10 burpees + 15 wall balls."]]},
  Sábado: { title: "Tirada larga", type: "Running", warmup: ["5 min caminata", "10 Leg Swings", "10 Walking Lunges", "10 Glute Bridges"], exercises: [["Tirada larga","1","10-12 km","Ritmo cómodo, zona 2-3."],["Enfriamiento","1","5-10 min","Caminar y estirar suave."]]},
  Domingo: { title: "Recuperación activa", type: "Recovery", warmup: ["Respiración 2 min", "Movilidad suave de cuello, espalda y cadera"], exercises: [["Paseo","1","45-60 min","Sin estrés."],["World's Greatest Stretch","2","5/lado","Cadera y espalda."],["Couch Stretch","2","45s/lado","Respira."],["90/90 Hip Stretch","2","45s/lado","Sin dolor."],["Foam Roller","1","5-10 min","Opcional."]]}
};

const STORAGE_KEY = "laura-hybrid-coach-react-v1";
function loadData(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify({ lifts:{}, notes:{}, runs:[], completed:{} }));}
function saveData(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data));}
function todayName(){ return days[new Date().getDay()];}

function App() {
  const [view, setView] = useState("today");
  const [selectedDay, setSelectedDay] = useState(trainingPlan[todayName()] ? todayName() : "Lunes");
  const [data, setData] = useState(loadData);
  function updateData(next){ setData(next); saveData(next); }
  const plan = trainingPlan[selectedDay];
  const totalKm = data.runs.reduce((sum,r)=>sum+Number(r.km||0),0);
  const totalMin = data.runs.reduce((sum,r)=>sum+Number(r.minutes||0),0);
  const avgPace = totalKm ? (totalMin/totalKm).toFixed(2) : "-";
  const completedCount = Object.values(data.completed).filter(Boolean).length;
  const bestLifts = useMemo(()=>{ const best={}; Object.entries(data.lifts).forEach(([exercise,sets])=>{Object.values(sets).forEach(v=>{const n=Number(v); if(n) best[exercise]=Math.max(best[exercise]||0,n);});}); return Object.entries(best).sort((a,b)=>b[1]-a[1]);}, [data]);

  function setLift(exercise,setNumber,value){ const next = structuredClone(data); next.lifts[exercise]=next.lifts[exercise]||{}; next.lifts[exercise][setNumber]=value; updateData(next);}
  function setNote(exercise,value){ const next=structuredClone(data); next.notes[exercise]=value; updateData(next);}
  function markTodayDone(){ const key = new Date().toISOString().slice(0,10); const next=structuredClone(data); next.completed[key]=true; updateData(next);}
  function addRun(e){ e.preventDefault(); const form=new FormData(e.currentTarget); const next=structuredClone(data); next.runs.unshift({date:form.get("date"),type:form.get("type"),km:form.get("km"),minutes:form.get("minutes"),hr:form.get("hr"),feel:form.get("feel")}); updateData(next); e.currentTarget.reset();}

  return <div className="app">
    <header className="top"><div><p className="kicker">Laura Hybrid Coach</p><h1>{selectedDay}: {plan.title}</h1><p className="muted">{plan.type}</p></div><button onClick={markTodayDone}><CheckCircle2 size={18}/> Hecho</button></header>
    <nav className="nav">
      <button className={view==="today"?"active":""} onClick={()=>setView("today")}><Dumbbell size={18}/> Hoy</button>
      <button className={view==="calendar"?"active":""} onClick={()=>setView("calendar")}><CalendarDays size={18}/> Calendario</button>
      <button className={view==="running"?"active":""} onClick={()=>setView("running")}><Activity size={18}/> Running</button>
      <button className={view==="progress"?"active":""} onClick={()=>setView("progress")}><TrendingUp size={18}/> Progreso</button>
      <button className={view==="hyrox"?"active":""} onClick={()=>setView("hyrox")}><Flame size={18}/> Hyrox</button>
    </nav>

    {view==="today" && <main>
      <section className="card hero"><p className="muted">{new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}</p><h2>{plan.title}</h2><p>{plan.exercises.length} bloques · fuerza + running + progresión</p></section>
      <section className="card"><h2>Calentamiento</h2><ul>{plan.warmup.map(w=><li key={w}>{w}</li>)}</ul></section>
      <section className="exercise-list">{plan.exercises.map(([name,sets,reps,cue])=><article className="exercise" key={name}><div className="exercise-img">{name.split(" ").slice(0,2).join(" ")}</div><div className="exercise-body"><h3>{name}</h3><p className="muted">{sets} series × {reps} · {cue}</p><div className="sets">{[1,2,3,4].map(s=><label key={s}>S{s}<input type="number" step="0.5" placeholder="kg" value={data.lifts[name]?.[s]||""} onChange={e=>setLift(name,s,e.target.value)} /></label>)}</div><textarea placeholder="Notas: RIR, técnica, dolor, energía..." value={data.notes[name]||""} onChange={e=>setNote(name,e.target.value)} /></div></article>)}</section>
    </main>}

    {view==="calendar" && <main className="card"><h2>Calendario semanal</h2><div className="calendar">{Object.keys(trainingPlan).map(day=><button key={day} className="day-card" onClick={()=>{setSelectedDay(day); setView("today");}}><strong>{day}</strong><span>{trainingPlan[day].title}</span></button>)}</div></main>}

    {view==="running" && <main>
      <section className="card"><h2>Añadir carrera</h2><form className="run-form" onSubmit={addRun}><label>Fecha<input name="date" type="date" required /></label><label>Tipo<select name="type"><option>Rodaje suave</option><option>Series/Fartlek</option><option>Tirada larga</option><option>Zona 2</option><option>Hyrox/Cardio</option></select></label><label>Distancia km<input name="km" type="number" step="0.01" required /></label><label>Tiempo min<input name="minutes" type="number" step="1" required /></label><label>FC media<input name="hr" type="number" /></label><label>Sensación 1-10<input name="feel" type="number" min="1" max="10" /></label><button type="submit"><Save size={18}/> Guardar running</button></form></section>
      <section className="card"><h2>Historial running</h2>{data.runs.length===0?<p className="muted">Aún no has guardado carreras.</p>:<div className="table">{data.runs.map((r,i)=><div className="row" key={i}><span>{r.date}</span><span>{r.type}</span><span>{r.km} km</span><span>{r.km?(Number(r.minutes)/Number(r.km)).toFixed(2):"-"} min/km</span></div>)}</div>}</section>
    </main>}

    {view==="progress" && <main><section className="stats"><div><strong>{completedCount}</strong><span>sesiones</span></div><div><strong>{totalKm.toFixed(1)}</strong><span>km</span></div><div><strong>{avgPace}</strong><span>ritmo</span></div><div><strong>{bestLifts.length}</strong><span>ejercicios</span></div></section><section className="card"><h2>Mejores pesos</h2>{bestLifts.length===0?<p className="muted">Aún no hay pesos registrados.</p>:<div className="table">{bestLifts.map(([name,kg])=><div className="row" key={name}><span>{name}</span><strong>{kg} kg</strong></div>)}</div>}</section></main>}

    {view==="hyrox" && <main>{[["Hyrox Beginner","4 rondas: 500m remo, 20 lunges, 15 burpees, 20 wall balls, 20 KB swings."],["Hyrox Strength","Front Squat 5x5, RDL 4x8, Lunges 3x20 + 3 rondas SkiErg/Wall Balls/Step Ups."],["Zona 2 híbrida","10 min SkiErg + 10 min remo + 10 min Assault Bike + 10 min caminata inclinada."]].map(([title,desc])=><section className="card" key={title}><h2>{title}</h2><p>{desc}</p></section>)}</main>}
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
