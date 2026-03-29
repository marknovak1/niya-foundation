import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Stethoscope, Briefcase, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n";
import { IconContainer } from "@/components/ui/IconContainer";

export function ProgramsPreview() {
  const { t } = useTranslation();

  const programs = [
    {
      icon: GraduationCap,
      title: t.programsPreview.education.title,
      description: t.programsPreview.education.description,
      stats: t.programsPreview.education.stats,
      variant: "primary" as const,
    },
    {
      icon: Stethoscope,
      title: t.programsPreview.health.title,
      description: t.programsPreview.health.description,
      stats: t.programsPreview.health.stats,
      variant: "primary" as const,
    },
    {
      icon: Briefcase,
      title: t.programsPreview.economic.title,
      description: t.programsPreview.economic.description,
      stats: t.programsPreview.economic.stats,
      variant: "primary" as const,
    },
  ];

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              {t.programsPreview.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground">
              {t.programsPreview.title}
            </h2>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/programs">
              {t.programsPreview.viewAll}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-soft card-hover"
            >
              {/* Top accent bar */}
              <div 
                className="h-1 bg-primary"
              />
              
              <div className="p-8">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <IconContainer 
                    icon={program.icon} 
                    variant={program.variant}
                    size="lg"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                  {program.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {program.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">
                    {program.stats}
                  </span>
                  <Link 
                    to="/programs" 
                    className="text-sm font-medium text-primary hover:opacity-80 transition-colors flex items-center gap-1"
                  >
                    {t.programsPreview.learnMore}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
