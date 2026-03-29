export function CertificationSection() {
  return (
    <section
      id="certification"
      className="py-[120px] relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(215, 60%, 26%) 0%, hsl(216, 66%, 19%) 100%)",
      }}
    >
      {/* Watermark */}
      <div
        className="absolute -right-10 -bottom-[60px] font-serif text-[16rem] font-bold text-white/[0.03] leading-none pointer-events-none"
      >
        NIYA®
      </div>

      <div className="container-wide relative z-[1]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Badge */}
          <div
            className="bg-white/[0.05] border border-accent/30 p-10 lg:p-[52px] text-center relative"
          >
            <div
              className="absolute top-2 left-2 right-2 bottom-2 border border-accent/10 pointer-events-none"
            />
            <div
              className="w-[100px] h-[100px] rounded-full mx-auto mb-7 flex items-center justify-center font-serif text-[1.8rem] font-bold text-accent-foreground"
              style={{
                background: "linear-gradient(135deg, hsl(41, 66%, 48%) 0%, hsl(44, 86%, 59%) 100%)",
                boxShadow: "0 8px 32px rgba(201,149,42,0.4)",
              }}
            >
              N®
            </div>
            <h3 className="text-white text-[1.5rem] font-semibold mb-2">
              Repreneuse certifiée NIYA®
            </h3>
            <p className="text-white/55 text-[0.9rem] mb-8">
              La certification qui transforme une candidate en repreneuse finançable et crédible
              auprès des institutions.
            </p>
            <ul className="list-none text-left">
              {[
                "Formation certifiante de 72 heures complétée",
                "Score ≥ 90/120 à la grille de qualification",
                "Tous les livrables validés par des experts",
                "Validation par le Comité d'agrément NIYA",
                "Adhésion à la Charte NIYA signée",
                "Inscription au Registre public NIYA",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-3 border-b border-white/[0.06] text-white/70 text-[0.9rem]"
                >
                  <span className="w-7 h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0 text-[0.75rem] font-bold text-accent">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div>
            <span className="eyebrow !text-accent mb-4 block">La certification</span>
            <h2 className="text-white text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5">
              Une certification qui<br />change tout pour les IFI.
            </h2>
            <p className="text-white/65 mb-10 text-[1.05rem] leading-[1.75]">
              Les institutions financières refusent des reprises faute de dossiers solides. La
              certification NIYA® est conçue pour rendre les repreneuses finançables — en leur donnant
              les compétences, la documentation et la crédibilité que les banques et caisses exigent.
            </p>
            <ul className="list-none">
              {[
                {
                  num: "01",
                  title: "Évaluation financière d'entreprise",
                  desc: "Lecture des états financiers, valorisation, identification des risques cachés.",
                },
                {
                  num: "02",
                  title: "Montage financier et accès au capital",
                  desc: "Structure de financement, prêts BDC, financement vendeur, mise de fonds.",
                },
                {
                  num: "03",
                  title: "Due diligence et négociation",
                  desc: "Analyse documentaire, gestion des RH en transition, stratégie de négociation.",
                },
                {
                  num: "04",
                  title: "Posture de dirigeante-propriétaire",
                  desc: "Leadership, gouvernance, gestion du changement, 100 premiers jours.",
                },
              ].map((step) => (
                <li key={step.num} className="flex gap-5 mb-7">
                  <div className="font-serif text-[2.4rem] font-bold text-accent/60 leading-none flex-shrink-0 w-10">
                    {step.num}
                  </div>
                  <div>
                    <strong className="block text-white font-sans font-semibold mb-1">
                      {step.title}
                    </strong>
                    <p className="text-[0.88rem] text-white/50 mb-0">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
