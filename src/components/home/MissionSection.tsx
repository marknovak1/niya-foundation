import { Target, Users, Leaf, Heart } from "lucide-react";
import { useTranslation } from "@/i18n";
import { IconContainer } from "@/components/ui/IconContainer";

export function MissionSection() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Target,
      title: t.mission.ourMission,
      description: t.mission.ourMissionDesc,
      variant: "primary" as const,
    },
    {
      icon: Users,
      title: t.mission.communityFirst,
      description: t.mission.communityFirstDesc,
      variant: "primary" as const,
    },
    {
      icon: Leaf,
      title: t.mission.sustainability,
      description: t.mission.sustainabilityDesc,
      variant: "primary" as const,
    },
    {
      icon: Heart,
      title: t.mission.compassion,
      description: t.mission.compassionDesc,
      variant: "primary" as const,
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            {t.mission.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            {t.mission.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.mission.description}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-card border border-border card-hover text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <IconContainer 
                  icon={value.icon} 
                  variant={value.variant}
                  size="md"
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
