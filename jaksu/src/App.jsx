import { useState } from "react";
import { useLocalStorage } from "./storage";
import Calendar from "./Calendar";
import Jaksu from "./Jaksu";
import "./App.css";
import Hyvinvointi from "./Hyvinvointi";

const NAME = "Maija";

const MOODS = [
  { id: "iloinen", label: "Iloinen", emoji: "😊" },
  { id: "neutraali", label: "Neutraali", emoji: "😐" },
  { id: "vasynyt", label: "Väsynyt", emoji: "😴" },
  { id: "kuormittunut", label: "Kuormittunut", emoji: "😣" },
];

const TIPS = {
  default: "Pienet teot ovat suuria askelia eteenpäin!",
  iloinen: "Kiva kuulla! Käytä energia viisaasti ja muista tauot.",
  neutraali: "Tavallinen päivä on ihan hyvä päivä. Yksi asia kerrallaan.",
  vasynyt: "Lepo kuuluu jaksamiseen. Pieni tauko voi auttaa.",
  kuormittunut: "Otetaan päivä yksi asia kerrallaan. Se riittää.",
};

const TABS = ["Koti", "Kalenteri", "Hyvinvointi", "Vinkit"];

// Paikallinen päivämäärä muodossa YYYY-MM-DD
const todayKey = () => new Date().toLocaleDateString("sv-SE");

export default function App() {
  const date = todayKey();
  const [tab, setTab] = useState("Koti");
  const [moodLog, setMoodLog] = useLocalStorage("jaksu.moods", {});
  const [tasks, setTasks] = useLocalStorage("jaksu.tasks", []);
  const [selected, setSelected] = useState(moodLog[date] ?? null);
  const [title, setTitle] = useState("");

  const isSaved = selected !== null && moodLog[date] === selected;
  const todays = tasks.filter((t) => t.date === date);

  const saveMood = () => {
    if (selected) setMoodLog({ ...moodLog, [date]: selected });
  };

  const addTask = (e) => {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    setTasks([...tasks, { id: Date.now(), title: text, date, done: false }]);
    setTitle("");
  };

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="app">
      <header className="top">
        <h1>Jaksu</h1>
        <p>{tab}</p>
      </header>

      {tab === "Koti" && (
        <>
          <section className="card hero">
            <div className="hero-top">
              <div className="bubble hello">
                <h2>Hei {NAME}!</h2>
                <p>Miltä sinusta tuntuu tänään?</p>
              </div>
              <div className="bubble tip" aria-live="polite">
                {TIPS[selected] ?? TIPS.default}
              </div>
            </div>

            <Jaksu mood={selected} />

            <div className="moods" role="radiogroup" aria-label="Päivän mieliala">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={selected === m.id}
                  className={"mood m-" + m.id + (selected === m.id ? " on" : "")}
                  onClick={() => setSelected(m.id)}
                >
                  <span aria-hidden="true">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
            <button className="primary" onClick={saveMood} disabled={!selected || isSaved}>
              {isSaved ? "Tallennettu" : "Tallenna fillis"}
            </button>
          </section>

          <section className="card">
            <h2>Tänään</h2>
            {todays.length === 0 && (
              <p className="empty">Ei tehtäviä tälle päivälle. Lisää ensimmäinen alta.</p>
            )}
            <ul className="tasks">
              {todays.map((t) => (
                <li key={t.id}>
                  <label className={t.done ? "done" : ""}>
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                    <span>
                      {t.title}
                      {t.course && <small> {t.course}</small>}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <form className="add" onSubmit={addTask}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Uusi tehtävä"
                aria-label="Uusi tehtävä"
              />
              <button type="submit">Lisää tehtävä</button>
            </form>
          </section>
        </>
      )}

            {tab === "Kalenteri" && <Calendar tasks={tasks} setTasks={setTasks} moodLog={moodLog} today={date} />}

      {tab === "Hyvinvointi" && <Hyvinvointi date={date} />}

      {tab === "Vinkit" && (
        <section className="card">
          <h2>{tab}</h2>
          <p className="empty">Tämä näkymä tulee myöhemmin.</p>
        </section>
      )}

      <nav className="tabs" aria-label="Päävalikko">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} aria-current={t === tab ? "page" : undefined}>
            {t}
          </button>
        ))}
      </nav>
    </div>
  );
}