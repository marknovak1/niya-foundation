export function ProcessusSection() {
  const steps = [
    {
      num: "1",
      title: "Sélection & Qualification",
      desc: "Constitution d'un portefeuille de cédants et sélection rigoureuse d'une cohorte de 8 à 12 repreneuses candidates.",
      color: "hsl(var(--teal))",
    },
    {
      num: "2",
      title: "Formation certifiante",
      desc: "72 heures de formation intensive : évaluation d'entreprise, montage financier, négociation, posture de dirigeante.",
      color: "hsl(var(--navy))",
    },
    {
      num: "3",
      title: "Certification & Jumelage",
      desc: "Obtention de la certification « Repreneuse NIYA® » et jumelage confidentiel avec les entreprises cédantes.",
      color: "hsl(var(--gold))",
    },
    {
      num: "4",
      title: "Accompagnement & Suivi",
      desc: "Accompagnement transactionnel structuré, puis suivi post-acquisition sur 24 mois pour garantir la réussite.",
      color: "hsl(var(--teal-mid))",
    },
  ];

  return (
    <section id="processus" className="relative overflow-hidden">
      {/* Content area with white background */}
      <div className="bg-background pt-[120px] pb-16">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="eyebrow mb-4 block">Notre approche</span>
            <h2 className="text-primary text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5">
              Le modèle « Vague NIYA »
            </h2>
            <p className="mx-auto max-w-[520px] text-muted-foreground text-[1.05rem] leading-[1.75]">
              Un cycle structuré et reproductible — de la sélection des candidates à la réussite
              post-acquisition.
            </p>
          </div>

          <div className="relative">
            {/* Connection line - desktop */}
            <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-teal via-accent to-primary z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
              {steps.map((step) => (
                <div key={step.num} className="px-5 relative z-[1]">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 font-serif text-[1.4rem] font-bold text-white relative z-[2]"
                    style={{
                      background: step.color,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    {step.num}
                  </div>
                  <h4 className="text-[1.1rem] text-primary text-center mb-3">{step.title}</h4>
                  <p className="text-[0.88rem] text-muted-foreground text-center">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video wave transition */}
      <div className="relative h-[280px] md:h-[360px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45) saturate(0.8) hue-rotate(-10deg)" }}
        >
          <source src="/videos/ocean-waves.mp4" type="video/mp4" />
        </video>
        {/* Top gradient fade from white */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent z-[1]" />
        {/* Bottom gradient fade to next section */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent z-[1]" />
      </div>
    </section>
  );
}
