export function ProblemeSection() {
  return (
    <section id="probleme" className="bg-card py-[120px]">
      <div className="container-wide">
        <div className="mb-[60px]">
          <span className="eyebrow mb-4 block">Le constat</span>
          <h2 className="text-primary text-[clamp(2rem,4vw,3.2rem)] font-semibold mb-5">
            Deux enjeux économiques<br />structurels. Une réponse
          </h2>
          <p className="max-w-[560px] text-muted-foreground leading-[1.75] text-[1.05rem]">
            Le Québec et le Canada font face à deux défis simultanés qui représentent ensemble une
            opportunité économique historique pour les femmes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Data Cards */}
          <div>
            <div className="data-card">
              <div className="font-serif text-[3rem] font-bold text-primary leading-none mb-2">
                12 000<span className="text-secondary">/an</span>
              </div>
              <p className="text-[0.95rem] text-muted-foreground mb-0">
                Entreprises déclarent leur intention de vendre au Québec chaque année — avec un écart
                persistant entre intentions et transactions faute de repreneurs qualifiés.
              </p>
            </div>

            <div className="data-card" style={{ borderLeftColor: "hsl(var(--gold))" }}>
              <div className="font-serif text-[3rem] font-bold text-accent leading-none mb-2">
                82 %
              </div>
              <p className="text-[0.95rem] text-muted-foreground mb-0">
                Des transferts concernent des entreprises de 1 à 19 employés — le cœur du marché
                accessible pour une première reprise.
              </p>
            </div>

            <div className="data-card" style={{ borderLeftColor: "hsl(var(--navy))" }}>
              <div className="font-serif text-[3rem] font-bold text-primary leading-none mb-2">
                80–150k$
              </div>
              <p className="text-[0.95rem] text-muted-foreground mb-0">
                Revenus annuels dans les emplois qualifiés ciblés par le pilier Mobilité économique de
                NIYA — des postes où les femmes immigrantes qualifiées sont massivement
                sous-représentées.
              </p>
            </div>
          </div>

          {/* Problem List */}
          <div>
            <ul className="list-none">
              {[
                {
                  icon: "🏭",
                  title: "Des entreprises sans repreneuses",
                  desc: "Des milliers de PME viables risquent de fermer faute d'acheteurs préparés — emportant emplois, savoir-faire et tissu économique local.",
                },
                {
                  icon: "👩‍💼",
                  title: "Des femmes qualifiées sous-utilisées",
                  desc: "Des milliers de femmes — notamment immigrantes — occupent des postes bien en dessous de leurs compétences réelles, faute d'un pont structuré vers les employeurs.",
                },
                {
                  icon: "🏦",
                  title: "Un déficit de qualification, pas de talent",
                  desc: "Les institutions financières refusent des reprises faute de dossiers solides. Le problème n'est pas le manque de candidates — c'est le manque de préparation structurée.",
                },
                {
                  icon: "🔗",
                  title: "Une fragmentation des programmes",
                  desc: "Les programmes existants sont isolés, de courte durée, et faiblement intégrés aux marchés réels. NIYA est l'orchestrateur qui manquait.",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 items-start py-5 border-b border-grey-light last:border-b-0"
                >
                  <div className="w-[42px] h-[42px] rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-[1.1rem]">
                    {item.icon}
                  </div>
                  <div>
                    <strong className="block font-sans font-semibold text-primary mb-1 text-base">
                      {item.title}
                    </strong>
                    <p className="text-[0.9rem] text-muted-foreground mb-0">{item.desc}</p>
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
