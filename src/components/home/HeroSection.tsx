import heroBackground from "@/assets/hero-community.jpg";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen relative flex flex-col justify-center overflow-visible"
      style={{ paddingTop: "72px" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, hsla(238, 75%, 18%, 0.60) 0%, hsla(238, 70%, 26%, 0.50) 50%, hsla(238, 65%, 30%, 0.45) 100%)
            `,
          }}
        />
      </div>

      <div className="container-wide relative z-[2] pb-4 lg:pb-48">
        <div className="max-w-[780px]">
          {/* Tag */}

          {/* Heading */}
          <h1 className="text-white mb-7 text-[clamp(2.8rem,6vw,5.5rem)] font-bold leading-[1.1]">
            La reprise d'entreprise<br />est{" "}
            <em className="text-accent not-italic">l'avenir</em>
            <br />des femmes
          </h1>

          {/* Sub */}
          <p className="text-[1.15rem] text-white/70 max-w-[580px] leading-[1.75] mb-8 md:mb-12 hidden md:block">
            NIYA structure, certifie et accompagne les femmes dans la reprise de PME et l'accès aux
            carrières qualifiées — transformant deux enjeux économiques majeurs du Canada en
            opportunités concrètes.
          </p>

          {/* Actions */}
          <div className="flex gap-4 flex-wrap">
            <a href="#solution" className="btn-primary">
              Découvrir nos axes →
            </a>
            <a href="#cta" className="btn-outline-hero">
              Devenir partenaire
            </a>
          </div>
        </div>
      </div>

      {/* Hero Stats — overlaps hero and white section below */}
      <div className="relative lg:absolute lg:bottom-0 left-0 right-0 z-[2] mt-8 lg:mt-0 lg:translate-y-1/2">
        <div className="container-wide">
          <div
            className="grid grid-cols-2 lg:grid-cols-4"
            style={{
              gap: "1px",
              background: "#141772",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {[
              { num: "80 000+", label: "PME à transférer au Québec\ndans les 10 prochaines années" },
              { num: "9 365", label: "Transferts de PME réalisés\nau Québec en 2022" },
              { num: "37 G$", label: "Actifs économiques transférés\nau Québec en 2022" },
              { num: "144k+", label: "Emplois préservés grâce\naux reprises en 2022" },
            ].map((stat) => (
              <div
                key={stat.num}
                className="px-8 py-7"
                style={{
                  background: "#141772",
                }}
              >
                <div className="font-serif text-[2.4rem] font-bold text-gold-light leading-none mb-1.5">
                  {stat.num}
                </div>
                <div className="text-[0.82rem] text-white/55 leading-[1.4] whitespace-pre-line">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
