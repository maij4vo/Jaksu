import { useEffect, useState } from "react";

const PHASES = [
  { label: "Sisään", secs: 4, scale: 1 },
  { label: "Pidätä", secs: 7, scale: 1 },
  { label: "Ulos", secs: 8, scale: 0.55 },
];
const CYCLE = 19; // 4 + 7 + 8 sekuntia
const TOTAL = 120; // harjoituksen pituus sekunteina

function phaseAt(elapsed) {
  let t = elapsed % CYCLE;
  for (const p of PHASES) {
    if (t < p.secs) return { ...p, left: p.secs - t };
    t -= p.secs;
  }
  return { ...PHASES[0], left: PHASES[0].secs };
}

export default function Breathing() {
  const [elapsed, setElapsed] = useState(null); // null = ei käynnissä

  useEffect(() => {
    if (elapsed === null || elapsed >= TOTAL) return;
    const id = setTimeout(() => setElapsed(elapsed + 1), 1000);
    return () => clearTimeout(id);
  }, [elapsed]);

  const running = elapsed !== null && elapsed < TOTAL;
  const done = elapsed !== null && elapsed >= TOTAL;
  const phase = running ? phaseAt(elapsed) : null;

  const scale = phase ? phase.scale : 0.7;
  const duration = phase ? (phase.label === "Pidätä" ? 0.2 : phase.secs) : 0.4;

  let label = "Valmis";
  let sub = "2 min";
  if (running) {
    label = phase.label;
    sub = `${phase.left} s`;
  }
  if (done) {
    label = "Hyvin tehty";
    sub = "Harjoitus päättyi";
  }

  return (
    <div className="breath">
      <div className="breath-stage">
        <div className="orb" style={{ transform: `scale(${scale})`, transitionDuration: `${duration}s` }} />
        <div className="breath-text">
          <b>{label}</b>
          <span>{sub}</span>
        </div>
      </div>
      <p className="legend">Sisään 4 s · Pidätä 7 s · Ulos 8 s</p>
      <button className="start" onClick={() => setElapsed(running ? null : 0)}>
        {running ? "Lopeta" : done ? "Aloita uudelleen" : "Aloita hengitysharjoitus (2 min)"}
      </button>
      <p className="legend">Hengitä rauhallisesti. Jos tulee huimausta tai olo epämukavaksi, lopeta ja hengitä tavallisesti.</p>
    </div>
  );
}