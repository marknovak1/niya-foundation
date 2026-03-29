import { useTranslation } from "@/i18n";

export function ImpactStats() {
  const { t } = useTranslation();

  const stats = [
    { value: "10,000+", label: t.impact.lives, description: t.impact.livesDesc },
    { value: "50+", label: t.impact.communities, description: t.impact.communitiesDesc },
    { value: "$2.5M", label: t.impact.funds, description: t.impact.fundsDesc },
    { value: "95%", label: t.impact.efficiency, description: t.impact.efficiencyDesc },
  ];

  return (
    <section className="section-padding bg-accent">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            {t.impact.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            {t.impact.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.impact.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-background border border-border shadow-sm"
            >
              <div className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                {stat.label}
              </div>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
