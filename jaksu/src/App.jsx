import { useState } from "react";
import { useLocalStorage } from "./storage";
import "./App.css";

const MOODS = [
  { id: "iloinen", label: "Iloinen", emoji: "😊" },
  { id: "neutraali", label: "Neutraali", emoji: "😐" },
  { id: "vasynyt", label: "Väsynyt", emoji: "😴" },
  { id: "kuormittunut", label: "Kuormittunut", emoji: "😣" },
];

const TABS = ["Koti", "Kalenteri", "Hyvinvointi", "Vinkit"];

// Paikallinen päivämäärä muodossa YYYY-MM-DD
const todayKey = () => new Date().toLocaleDateString("sv-SE");

export default function App() {
  const date = todayKey();
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
        <p>Koti</p>
      </header>

      <section className="card">
        <h2>Miltä sinusta tuntuu tänään?</h2>
        <div className="moods" role="radiogroup" aria-label="Päivän mieliala">
          {MOODS.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={selected === m.id}
              className={"mood" + (selected === m.id ? " on" : "")}
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
                {t.title}
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

      <nav className="tabs" aria-label="Päävalikko">
        {TABS.map((t, i) => (
          <button key={t} aria-current={i === 0 ? "page" : undefined}>
            {t}
          </button>
        ))}
      </nav>
    </div>
  );
}