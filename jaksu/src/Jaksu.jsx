// Jaksu-maskotti. Ilme muuttuu valitun mielialan mukaan.
export default function Jaksu({ mood }) {
  const sleepy = mood === "vasynyt";
  const stressed = mood === "kuormittunut";
  const neutral = mood === "neutraali";
  const happy = mood === "iloinen";

  const line = { stroke: "#16281f", strokeWidth: 3.5, strokeLinecap: "round", fill: "none" };

  let mouth = "M70 106 Q80 114 90 106";
  if (happy) mouth = "M66 104 Q80 120 94 104";
  if (neutral) mouth = "M71 108 L89 108";
  if (sleepy) mouth = "M73 108 Q80 112 87 108";
  if (stressed) mouth = "M67 111 Q73.5 105 80 111 T93 111";

  return (
    <svg className="jaksu" viewBox="0 0 160 160" role="img" aria-label="Jaksu-maskotti">
      <defs>
        <linearGradient id="jaksu-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8cc4a2" />
          <stop offset="1" stopColor="#3f7d5c" />
        </linearGradient>
        <linearGradient id="jaksu-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="80" cy="148" rx="44" ry="7" fill="#1d3a2c" opacity="0.12" />
      <rect x="20" y="22" width="120" height="116" rx="38" fill="url(#jaksu-body)" />
      <rect x="28" y="28" width="104" height="46" rx="30" fill="url(#jaksu-shine)" />

      {/* lehtimerkki */}
      <circle cx="80" cy="26" r="9" fill="#f4faf6" />
      <path d="M76 29 C76 22 82 21 85 22 C85 27 81 30 76 29 Z" fill="#3f7d5c" />

      {/* silmät */}
      {sleepy ? (
        <>
          <path d="M55 90 Q62 96 69 90" {...line} />
          <path d="M91 90 Q98 96 105 90" {...line} />
        </>
      ) : (
        <>
          <ellipse cx="62" cy="88" rx="6" ry="8" fill="#16281f" />
          <ellipse cx="98" cy="88" rx="6" ry="8" fill="#16281f" />
          <circle cx="64" cy="85" r="2" fill="#fff" />
          <circle cx="100" cy="85" r="2" fill="#fff" />
        </>
      )}

      {/* huolestuneet kulmat */}
      {stressed && (
        <>
          <path d="M53 78 L70 73" {...line} />
          <path d="M90 73 L107 78" {...line} />
        </>
      )}

      {/* posket ja suu */}
      <ellipse cx="47" cy="104" rx="8" ry="5" fill="#f4a3b0" opacity="0.75" />
      <ellipse cx="113" cy="104" rx="8" ry="5" fill="#f4a3b0" opacity="0.75" />
      <path d={mouth} {...line} />

      {sleepy && (
        <text x="120" y="52" fontSize="18" fontWeight="800" fill="#ffffff" opacity="0.9">
          z
        </text>
      )}
    </svg>
  );
}