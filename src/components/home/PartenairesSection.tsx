export function PartenairesSection() {
  const categories = [
    {
      title: "Institutions financières",
      desc: "Pipeline de repreneuses qualifiées et finançables — réduction du risque de défaut sur les prêts de reprise.",
      items: [
        "Banque de développement du Canada (BDC)",
        "Caisses Desjardins",
        "Banque Nationale, RBC, BMO, Scotia",
        "Investissement Québec",
      ],
    },
    {
      title: "Gouvernements et organismes publics",
      desc: "Alignement direct avec les priorités d'intégration économique, de relève des PME et de développement régional.",
      items: [
        "IRCC — Immigration, Réfugiés et Citoyenneté Canada",
        "MTESS — Ministère du Travail (Québec)",
        "MIFI — Ministère Immigration (Québec)",
        "DEC — Développement économique Canada",
        "Services Québec",
      ],
    },
    {
      title: "Cabinets comptables et conseillers",
      desc: "Accès à des acheteurs certifiés et préparés — mandats de due diligence, évaluation et structuration fiscale.",
      items: [
        "Raymond Chabot Grant Thornton",
        "MNP, Deloitte, BDO Canada",
        "Mallette, EY, KPMG",
        "Cabinets régionaux partenaires",
      ],
    },
    {
      title: "Courtiers en vente de PME",
      desc: "Des repreneuses certifiées réduisent les délais de vente et augmentent les taux de succès des transactions.",
      items: [
        "Transaxion / DVAL",
        "Courtiers régionaux actifs au Québec",
        "Chambres de commerce locales",
        "Organismes de transfert d'entreprise",
      ],
    },
  ];

  return (
    <section id="partenaires" className="bg-background py-[100px]">
      <div className="container-wide">
        <div className="text-center mb-14">
          <span className="eyebrow mb-4 block">Écosystème de partenaires</span>
          <h2 className="text-primary text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5">
            NIYA ne travaille pas seule
          </h2>
          <p className="mx-auto max-w-[520px] text-muted-foreground text-[1.05rem] leading-[1.75]">
            Nous construisons un écosystème de partenaires institutionnels dont les objectifs
            s'alignent directement avec notre mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-card p-9"
              style={{ borderTop: "3px solid hsl(var(--teal))" }}
            >
              <h4 className="font-sans text-[0.78rem] font-bold tracking-[2px] uppercase text-secondary mb-4">
                {cat.title}
              </h4>
              <p className="text-[0.92rem] text-muted-foreground mb-5">{cat.desc}</p>
              <ul className="list-none">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="text-[0.88rem] py-1.5 border-b border-grey-light text-muted-foreground"
                  >
                    <span className="text-accent font-bold mr-1">·</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
