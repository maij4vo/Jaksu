import { useLocalStorage } from "./storage";
import Breathing from "./Breathing";

const CHECKS = [
  { id: "water", label: "Vettä juotu riittävästi", icon: "💧" },
  { id: "outside", label: "Lounas ja raitis ilma nautittu", icon: "🌿" },
  { id: "screen", label: "Näyttötauko pidetty", icon: "👀" },
];

const TIPS = [
  { title: "Viiden minuutin sääntö", text: "Sovi itsesi kanssa tekeväsi tehtävää vain 5 minuuttia. Alku on usein vaikein osa, ja vauhti kantaa yleensä pidemmälle ilman pakottamista." },
  { title: "Pilko pienemmäksi", text: "Jos tehtävä tuntuu liian isolta, kirjoita siitä kolme pientä askelta ja aloita ensimmäisestä." },
  { title: "Tauko kuuluu työhön", text: "Lyhyt tauko ei ole hukkaa. Nouse ylös, venyttele tai katso ikkunasta ulos, niin jaksat jatkaa." },
  { title: "Yksi asia kerrallaan", text: "Valitse tälle päivälle yksi tärkein asia. Muut voivat odottaa, kun se on tehty." },
];

const SUPPORT = [
  {
    title: "Opiskeluterveydenhuolto",
    text: "Yleis-, suun- ja mielenterveyspalvelut. Yliopisto-opiskelijoille YTHS, muille oman hyvinvointialueen opiskeluterveydenhuolto.",
    href: "https://www.yths.fi",
  },
  {
    title: "Opintopsykologi",
    text: "Ohjausta jaksamiseen ja motivaatioon. Katso oman oppilaitoksesi opiskelijapalvelut.",
  },
  {
    title: "Sekasin-chat",
    text: "Anonyymi chat 12–29-vuotiaille. Auki arkisin klo 9–24 ja viikonloppuisin klo 15–24.",
    href: "https://sekasin247.fi",
  },
  {
    title: "MIELI ry:n kriisipuhelin 09 2525 0111",
    text: "Auki ympäri vuorokauden. Voit soittaa nimettömästi.",
    href: "tel:0925250111",
  },
];

export default function Hyvinvointi({ date }) {
  const [checks, setChecks] = useLocalStorage("jaksu.checks", {});
  const today = checks[date] ?? {};
  const doneCount = CHECKS.filter((c) => today[c.id]).length;
  const tip = TIPS[Number(date.slice(8, 10)) % TIPS.length];

  const toggle = (id) => setChecks({ ...checks, [date]: { ...today, [id]: !today[id] } });

  return (
    <>
      <section className="card calm">
        <span className="pill">🌿 Oma hetkesi</span>
        <h2>Hyvinvointi ja palautuminen</h2>
        <p>Hetki lepoa ja itsestä huolehtimista opintojen keskellä. Hengähdä rauhassa.</p>
      </section>

      <section className="card">
        <h2>Hengitysharjoitus</h2>
        <Breathing />
      </section>

      <section className="card">
        <h2>
          Pika-check arkeen <small className="count">{doneCount}/{CHECKS.length}</small>
        </h2>
        <div className="checks">
          {CHECKS.map((c) => (
            <button
              key={c.id}
              role="checkbox"
              aria-checked={!!today[c.id]}
              className="check"
              onClick={() => toggle(c.id)}
            >
              <span aria-hidden="true">{c.icon}</span>
              {c.label}
              <span className="tick" aria-hidden="true">{today[c.id] ? "✓" : ""}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card tipcard">
        <h2>{tip.title}</h2>
        <p>{tip.text}</p>
      </section>

      <section className="card">
        <h2>Tuki ja apu</h2>
        <p className="empty">Jos kuormitus tuntuu liian isolta, apua on tarjolla. Et ole yksin.</p>
        <ul className="support">
          {SUPPORT.map((s) => {
            const body = (
              <>
                <b>{s.title}</b>
                <span>{s.text}</span>
              </>
            );
            return (
              <li key={s.title}>
                {s.href ? (
                  <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {body}
                  </a>
                ) : (
                  <div className="nolink">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
        <p className="legend">Hätätilanteessa soita 112.</p>
      </section>
    </>
  );
}