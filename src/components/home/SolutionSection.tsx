export function SolutionSection() {
  return (
    <section id="solution" className="bg-navy-deep py-[120px] relative overflow-hidden">
      <div
        className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(13,115,119,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="container-wide relative z-[1]">
        <span className="eyebrow !text-accent mb-4 block">Notre réponse</span>
        <h2 className="text-white text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-4">
          Deux axes. Une excellence.
        </h2>
        <p className="text-white/65 max-w-[600px] mb-16 text-[1.05rem] leading-[1.75]">
          NIYA a délibérément choisi de concentrer son action sur deux axes complémentaires — et de
          les faire mieux que quiconque au Canada. Exceller sur deux fronts vaut infiniment mieux que
          se disperser sur six.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Axe 1 */}
          <div
            className="border border-white/10 bg-white/[0.04] p-10 lg:p-12 relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.07]"
            style={{ borderTop: "3px solid hsl(var(--gold))" }}
          >
            <div className="absolute top-5 right-8 font-serif text-[5rem] font-bold text-white/[0.12] leading-none">
              01
            </div>
            <div className="inline-block text-[0.68rem] font-bold tracking-[2px] uppercase px-3 py-1 mb-5 bg-accent/20 text-accent">
              Axe fondateur
            </div>
            <h3 className="text-white text-[1.6rem] font-semibold mb-4">
              Repreneuriat féminin<br />&amp; Transmission de PME
            </h3>
            <p className="text-white/60 text-[0.95rem] mb-8">
              Préparer, qualifier et certifier des femmes capables de reprendre des entreprises
              existantes — préservant emplois, actifs et savoir-faire économique.
            </p>
            <ul className="list-none">
              {[
                "Formation certifiante de 72 heures",
                "Grille de qualification rigoureuse (120 points)",
                "Certification officielle « Repreneuse NIYA® »",
                "Registre public des repreneuses certifiées",
                "Accompagnement transactionnel structuré",
                "Suivi post-acquisition sur 24 mois",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 py-2.5 border-b border-white/[0.06] text-white/75 text-[0.9rem] last:border-b-0"
                >
                  <span className="text-accent font-semibold flex-shrink-0">→</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 p-5 bg-white/[0.06]" style={{ borderLeft: "3px solid hsl(var(--gold))" }}>
              <div className="font-serif text-[2rem] font-bold text-gold-light leading-none">52</div>
              <div className="text-[0.82rem] text-white/50 mt-1">entreprises reprises ciblées · phase 1</div>
            </div>
          </div>

          {/* Axe 2 */}
          <div
            className="border border-white/10 bg-white/[0.04] p-10 lg:p-12 relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.07]"
            style={{ borderTop: "3px solid hsl(var(--teal-mid))" }}
          >
            <div className="absolute top-5 right-8 font-serif text-[5rem] font-bold text-white/[0.12] leading-none">
              02
            </div>
            <div className="inline-block text-[0.68rem] font-bold tracking-[2px] uppercase px-3 py-1 mb-5 bg-secondary/25 text-teal-mid">
              Axe complémentaire
            </div>
            <h3 className="text-white text-[1.6rem] font-semibold mb-4">
              Mobilité économique<br />&amp; Carrières qualifiées
            </h3>
            <p className="text-white/60 text-[0.95rem] mb-8">
              Intégrer durablement les femmes — notamment immigrantes qualifiées — dans des emplois à
              haute valeur ajoutée, en alignement avec les priorités d'IRCC, MIFI et MTESS.
            </p>
            <ul className="list-none">
              {[
                "Évaluation et reconnaissance des compétences",
                "Francisation intégrée en milieu professionnel",
                "Coaching et placement en emplois 80–150k$/an",
                "Suivi de progression sur 24 mois",
                "Partenariats employeurs structurés",
                "Réseau pairs et mentorat",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 py-2.5 border-b border-white/[0.06] text-white/75 text-[0.9rem] last:border-b-0"
                >
                  <span className="text-accent font-semibold flex-shrink-0">→</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 p-5 bg-white/[0.06]" style={{ borderLeft: "3px solid hsl(var(--gold))" }}>
              <div className="font-serif text-[2rem] font-bold text-gold-light leading-none">1 265</div>
              <div className="text-[0.82rem] text-white/50 mt-1">placements qualifiés ciblés · phase 1</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
