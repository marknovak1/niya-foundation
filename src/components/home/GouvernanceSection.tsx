import teamVictoria from "@/assets/team-victoria.jpg";
import teamAminata from "@/assets/team-aminata.jpg";
import teamMark from "@/assets/team-mark.jpg";
import teamKaoutar from "@/assets/team-kaoutar.jpg";
import teamDalila from "@/assets/team-dalila.jpg";
import teamNadine from "@/assets/team-nadine.jpg";
import teamAurelia from "@/assets/team-aurelia.jpg";

const team = [
  {
    name: "Victoria Allen",
    role: "Fondatrice & Directrice exécutive",
    description: "Direction générale, vision stratégique, représentation externe.",
    email: "direction@niyafondation.ca",
    image: teamVictoria,
  },
  {
    name: "Aminata Diabi",
    role: "Présidente du CA",
    description: "Supervision de la gouvernance, présidence des réunions du conseil, signature des documents officiels, représentation institutionnelle.",
    email: "ca@niyafondation.ca",
    image: teamAminata,
  },
  {
    name: "Mark Novak",
    role: "Vice-Président",
    description: "Appui à la présidente, supervision des risques, contribution aux décisions stratégiques majeures.",
    image: teamMark,
  },
  {
    name: "Kaoutar Razzouk",
    role: "Secrétaire du CA",
    description: "Rédaction des procès-verbaux, gestion des documents officiels, convocations aux réunions du CA.",
    image: teamKaoutar,
  },
  {
    name: "Dalila Chennafi",
    role: "Membre du CA",
    description: "Participation aux réunions trimestrielles, contribution aux décisions de gouvernance.",
    image: teamDalila,
  },
  {
    name: "Nadine Darakji",
    role: "Membre du CA",
    description: "Participation aux réunions trimestrielles, contribution à l'orientation financière et aux relations avec les institutions.",
    email: "finance@niyafondation.ca",
    image: teamNadine,
  },
  {
    name: "Aurelia Barros",
    role: "Gestionnaire de projet",
    description: "Coordination opérationnelle, suivi du plan d'action, appui à la direction générale.",
    image: teamAurelia,
  },
];

export function GouvernanceSection() {
  return (
    <section id="gouvernance" className="bg-background py-[120px]">
      <div className="container-wide">
        <div className="text-center mb-16">
          <span className="eyebrow mb-4 block">Notre gouvernance</span>
          <h2 className="text-primary text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5">
            L'humain derrière NIYA
          </h2>
          <p className="mx-auto max-w-[520px] text-muted-foreground text-[1.05rem] leading-[1.75]">
            Une gouvernance solide portée par des professionnels engagés dans la réussite économique
            des femmes au Canada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="group bg-card border border-border p-6 text-center transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
            >
              <div className="w-28 h-28 rounded-full mx-auto mb-5 overflow-hidden border-2 border-accent/30">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-1">{member.name}</h3>
              <p className="text-sm font-medium text-secondary mb-2">{member.role}</p>
              {member.description && (
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{member.description}</p>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="text-xs text-secondary hover:text-teal-mid transition-colors no-underline"
                >
                  {member.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
