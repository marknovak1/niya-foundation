import { useState } from "react";
import { UserCheck, Handshake, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function AudienceSection() {
  const audiences = [
    {
      icon: UserCheck,
      title: "Les repreneuses",
      desc: "Femmes sérieuses et finançables qui veulent reprendre une entreprise plutôt que créer de zéro.",
      list: [
        "Cadres et dirigeantes",
        "Femmes immigrantes avec capital et expérience",
        "Issues d'entreprises familiales",
        "Investisseuses souhaitant opérer",
      ],
      cta: "Rejoindre une cohorte →",
    },
    {
      icon: Handshake,
      title: "Les cédants",
      desc: "Entrepreneurs en fin de carrière qui veulent vendre à quelqu'un de préparé et qui protège leur héritage.",
      list: [
        "PME de 5 à 50 employés",
        "Valeur 250k$ à 2M$",
        "Tous secteurs — services, fabrication, distribution",
        "Horizon de vente 12 à 36 mois",
      ],
      cta: "Soumettre une entreprise →",
    },
    {
      icon: Landmark,
      title: "Les partenaires institutionnels",
      desc: "Gouvernements, institutions financières, cabinets et organismes alignés sur la productivité économique.",
      list: [
        "BDC, Desjardins, banques",
        "IRCC, MTESS, MIFI, DEC Québec",
        "Cabinets RCGT, MNP, Mallette",
        "Chambres de commerce et MRC",
      ],
      cta: "Devenir partenaire →",
    },
  ];

  return (
    <section id="pour-qui" className="bg-card py-[120px]">
      <div className="container-wide">
        <div className="mb-16">
          <span className="eyebrow mb-4 block">À qui s'adresse NIYA ?</span>
          <h2 className="text-primary text-[clamp(2rem,4vw,3.2rem)] font-semibold">
            Trois interlocuteurs.<br />Une plateforme
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {audiences.map((aud) => (
            <AudienceCard key={aud.title} {...aud} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceCard({
  icon: Icon,
  title,
  desc,
  list,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  list: string[];
  cta: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="p-9 lg:p-12 transition-colors duration-300 cursor-default"
      style={{
        background: hovered ? "hsl(var(--navy))" : "hsl(var(--grey-light))",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-[52px] h-[52px] rounded flex items-center justify-center mb-6 transition-colors duration-300"
        style={{
          background: hovered ? "rgba(201,149,42,0.2)" : "rgba(13,115,119,0.1)",
        }}
      >
        <Icon size={24} strokeWidth={1.5} style={{ color: hovered ? "hsl(var(--gold))" : "hsl(var(--navy))" }} className="transition-colors duration-300" />
      </div>
      <h3
        className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold mb-3 transition-colors duration-300"
        style={{ color: hovered ? "white" : "hsl(var(--navy))" }}
      >
        {title}
      </h3>
      <p
        className="text-[0.92rem] mb-6 transition-colors duration-300"
        style={{ color: hovered ? "rgba(255,255,255,0.65)" : "hsl(var(--grey))" }}
      >
        {desc}
      </p>
      <ul className="list-none mb-7">
        {list.map((item) => (
          <li
            key={item}
            className="py-2 text-[0.88rem] transition-colors duration-300"
            style={{
              color: hovered ? "rgba(255,255,255,0.7)" : "hsl(var(--grey))",
              borderBottom: hovered
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span className="text-secondary font-semibold mr-1">→</span> {item}
          </li>
        ))}
      </ul>
      <a
        href="#cta"
        className="inline-block px-5 py-2.5 text-[0.85rem] font-semibold tracking-wide no-underline transition-all duration-300"
        style={{
          border: hovered
            ? "1px solid rgba(201,149,42,0.4)"
            : "1px solid rgba(27,58,107,0.2)",
          color: hovered ? "hsl(var(--gold))" : "hsl(var(--navy))",
        }}
      >
        {cta}
      </a>
    </div>
  );
}
