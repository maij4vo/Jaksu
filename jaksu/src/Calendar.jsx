import { useState } from "react";

const DAYS = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];

const MOODS = [
  { id: "iloinen", label: "Iloinen", emoji: "😊" },
  { id: "neutraali", label: "Neutraali", emoji: "😐" },
  { id: "vasynyt", label: "Väsynyt", emoji: "😴" },
  { id: "kuormittunut", label: "Kuormittunut", emoji: "😣" },
];

// Päivämäärät käsitellään YYYY-MM-DD-merkkijonoina (paikallinen aika)
const toKey = (d) => d.toLocaleDateString("sv-SE");
const fromKey = (k) => new Date(k + "T12:00:00");
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const firstOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1, 12);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1, 12);

const formatMinutes = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};

export default function Calendar({ tasks, setTasks, moodLog, today }) {
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(firstOfMonth(fromKey(today)));
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [minutes, setMinutes] = useState(60);
  const [date, setDate] = useState(today);

  const moodOf = (key) => MOODS.find((m) => m.id === moodLog[key]);

  // Kuukauden ruudukko: alkaa maanantaista, täyttää viikot loppuun asti
  const offset = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7;
  const gridStart = addDays(month, -offset);
  const cells = Array.from({ length: cellCount }, (_, i) => addDays(gridStart, i));

  // Tekemättömien tehtävien määrä ja arvioitu työmäärä päivittäin
  const openByDay = {};
  const minutesByDay = {};
  for (const t of tasks) {
    if (t.done) continue;
    openByDay[t.date] = (openByDay[t.date] || 0) + 1;
    minutesByDay[t.date] = (minutesByDay[t.date] || 0) + (t.minutes || 0);
  }

  const dayTasks = tasks.filter((t) => t.date === selected);
  const remaining = dayTasks
    .filter((t) => !t.done)
    .reduce((sum, t) => sum + (t.minutes || 0), 0);
  const selectedMood = moodOf(selected);

  const pickDay = (key) => {
    setSelected(key);
    setDate(key);
    setMonth(firstOfMonth(fromKey(key)));
  };

  const addTask = (e) => {
    e.preventDefault();
    const text = title.trim();
    if (!text || !date) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: text,
        course: course.trim(),
        date,
        minutes: Number(minutes) || 0,
        done: false,
      },
    ]);
    setSelected(date);
    setMonth(firstOfMonth(fromKey(date)));
    setTitle("");
  };

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  return (
    <>
      <section className="card">
        <div className="weekbar">
          <button className="nav-btn" onClick={() => setMonth(addMonths(month, -1))} aria-label="Edellinen kuukausi">
            ‹
          </button>
          <h2>{month.toLocaleDateString("fi-FI", { month: "long", year: "numeric" })}</h2>
          <button className="nav-btn" onClick={() => setMonth(addMonths(month, 1))} aria-label="Seuraava kuukausi">
            ›
          </button>
        </div>

        <div className="month">
          {DAYS.map((d) => (
            <div key={d} className="dow">
              {d}
            </div>
          ))}
          {cells.map((d) => {
            const key = toKey(d);
            const open = openByDay[key] || 0;
            const mood = moodOf(key);
                        const mins = minutesByDay[key] || 0;
            const level = !open ? 0 : mins > 240 ? 3 : mins > 120 ? 2 : 1;
            const cls = [
              "cell",
              d.getMonth() === month.getMonth() ? "" : "out",
              key === selected ? "on" : "",
              key === today ? "today" : "",
                            key === today ? "today" : "",
              level ? `load-${level}` : "",
            ]
              .filter(Boolean)
              .join(" ");
            const label = `${fromKey(key).toLocaleDateString("fi-FI", { day: "numeric", month: "long" })}: ${
              mood ? mood.label : "ei fiilistä"
            }, ${open} tekemätöntä`;
            return (
              <button key={key} className={cls} onClick={() => pickDay(key)} aria-pressed={key === selected} aria-label={label}>
                <b>{d.getDate()}</b>
                {mood ? (
                  <span className={`face m-${mood.id}`} aria-hidden="true">
                    {mood.emoji}
                  </span>
                ) : (
                  <span className={"face " + (key <= today ? "empty" : "none")} aria-hidden="true" />
                )}
                <span className="dots" aria-hidden="true">
                  {Array.from({ length: Math.min(open, 3) }, (_, j) => (
                    <i key={j} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

         <p className="legend">Kasvot näyttävät päivän fiiliksen ja pisteet tekemättömät tehtävät. Mitä tummempi punainen tausta, sitä enemmän työtä päivälle.</p>
         <button className="link-btn" onClick={() => pickDay(today)}>
          Siirry tähän päivään
        </button>
      </section>

      <section className="card">
        <h2>{fromKey(selected).toLocaleDateString("fi-FI", { weekday: "long", day: "numeric", month: "numeric" })}</h2>
        {selectedMood && (
          <p className="load">
            Fiilis: {selectedMood.emoji} {selectedMood.label}
          </p>
        )}
        <p className="load">Tekemättä: {formatMinutes(remaining)}</p>
        {dayTasks.length === 0 && <p className="empty">Ei deadlineja tälle päivälle.</p>}
        <ul className="tasks">
          {dayTasks.map((t) => (
            <li key={t.id}>
              <label className={t.done ? "done" : ""}>
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                <span>
                  {t.title}
                  {(t.course || t.minutes) && (
                    <small>
                      {" "}
                      {[t.course, t.minutes ? formatMinutes(t.minutes) : ""].filter(Boolean).join(", ")}
                    </small>
                  )}
                </span>
              </label>
              <button className="del" onClick={() => removeTask(t.id)} aria-label={`Poista ${t.title}`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Uusi deadline</h2>
        <form className="deadline-form" onSubmit={addTask}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mitä pitää tehdä?" aria-label="Tehtävän nimi" />
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Kurssi (valinnainen)" aria-label="Kurssi" />
          <div className="row">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Deadline" />
            <input type="number" min="5" step="5" value={minutes} onChange={(e) => setMinutes(e.target.value)} aria-label="Arvioitu kesto minuutteina" />
          </div>
          <button type="submit">Lisää deadline</button>
        </form>
      </section>
    </>
  );
}