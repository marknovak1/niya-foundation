export function ImpactSection() {
  return (
    <section id="impact" className="bg-card py-[120px]">
      <div className="container-wide">
        <div className="mb-16">
          <span className="eyebrow mb-4 block">Impact projeté</span>
          <h2 className="text-primary text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5">
            Des chiffres réels<br />Des projections défendables
          </h2>
          <p className="max-w-[560px] text-muted-foreground text-[1.05rem] leading-[1.75]">
            Toutes les projections NIYA sont basées sur des données publiques vérifiables et des
            hypothèses conservatrices, auditées annuellement par un organisme indépendant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {[
            {
              num: "175–280",
              suffix: "M$",
              title: "Impact économique Phase 1",
              desc: "Contribution salariale cumulée + valeur d'entreprises reprises générée sur les 3 premières années d'opération.",
            },
            {
              num: "1 700",
              suffix: "+",
              title: "Femmes accompagnées en 3 ans",
              desc: "1 265 placements en emplois qualifiés + 120 certifications de repreneuses + accompagnement transversal leadership.",
            },
            {
              num: "500–650",
              suffix: "M$",
              title: "Impact cumulé à l'horizon 2030",
              desc: "Projection conservative sur 5 ans — Phase 1 et Phase 2 combinées, incluant la contribution salariale, les reprises et les emplois maintenus.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-10 lg:p-[52px] bg-grey-light border-b-[3px] border-transparent hover:border-accent transition-colors duration-300"
            >
              <div className="font-serif text-[3.5rem] font-bold text-primary leading-none mb-2">
                {card.num}
                <span className="text-secondary">{card.suffix}</span>
              </div>
              <h4 className="font-sans text-[0.9rem] font-semibold text-primary mb-2.5">
                {card.title}
              </h4>
              <p className="text-[0.88rem] text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-10 py-3 px-5 text-muted-foreground text-[0.8rem] italic"
          style={{ borderLeft: "3px solid hsl(var(--teal))" }}
        >
          ⚠ Ces projections sont basées sur des données publiques et des hypothèses conservatrices validées. Auditées annuellement par un organisme indépendant.
        </div>
      </div>
    </section>
  );
}
