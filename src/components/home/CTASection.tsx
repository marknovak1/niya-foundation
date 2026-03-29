import { UserCheck, Handshake, Landmark } from "lucide-react";

export function CTASection() {
  const cards = [
    {
      icon: UserCheck,
      title: "Je suis une repreneuse",
      desc: "Je veux rejoindre la prochaine cohorte de certification NIYA.",
      cta: "Soumettre ma candidature",
      email: "certification@niyafondation.ca",
      subject: "Candidature repreneuse NIYA",
    },
    {
      icon: Handshake,
      title: "Je veux vendre mon entreprise",
      desc: "Je cherche une repreneuse qualifiée et préparée pour assurer la continuité.",
      cta: "Soumettre mon entreprise",
      email: "partenariats@niyafondation.ca",
      subject: "Entreprise à transférer",
    },
    {
      icon: Landmark,
      title: "Je suis un partenaire institutionnel",
      desc: "Je veux explorer une collaboration avec NIYA (financement, partenariat, référencement).",
      cta: "Prendre contact",
      email: "partenariats@niyafondation.ca",
      subject: "Partenariat institutionnel NIYA",
    },
  ];

  return (
    <section
      id="cta"
      className="py-[100px] text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #141772 0%, #3a025b 100%)",
      }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-wide relative z-[1]">
        <h2 className="text-white text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-4">
          Faites partie de la solution.
        </h2>
        <p className="text-white/70 max-w-[520px] mx-auto mb-12 text-[1.05rem] leading-[1.75]">
          NIYA cherche des partenaires sérieux, des repreneuses déterminées, et des cédants qui
          veulent une sortie propre. Choisissez votre rôle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[860px] mx-auto">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/[0.08] border border-white/15 p-7 lg:p-9 text-center transition-colors duration-300 hover:bg-white/[0.14]"
            >
              <div className="w-[52px] h-[52px] rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <card.icon size={24} strokeWidth={1.5} className="text-accent" />
              </div>
              <h4 className="font-sans text-base font-semibold text-white mb-2.5">{card.title}</h4>
              <p className="text-[0.85rem] text-white/60 mb-5">{card.desc}</p>
              <a
                href={`mailto:${card.email}?subject=${encodeURIComponent(card.subject)}`}
                className="inline-block px-5 py-2.5 bg-accent text-accent-foreground font-bold text-[0.85rem] tracking-wide no-underline hover:bg-gold-light transition-colors"
              >
                {card.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
