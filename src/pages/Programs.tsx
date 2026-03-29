import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Stethoscope, Briefcase, Leaf, Users, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n";
import { IconContainer } from "@/components/ui/IconContainer";

// Program images
import programEducation from "@/assets/program-education.jpg";
import programHealth from "@/assets/program-health.jpg";
import programEconomic from "@/assets/program-economic.jpg";
import programEnvironment from "@/assets/program-environment.jpg";
import programCommunity from "@/assets/program-community.jpg";

const Programs = () => {
  const { t } = useTranslation();

  const programs = [
    {
      icon: GraduationCap,
      title: t.programs.education.title,
      description: t.programs.education.description,
      stats: [
        { label: t.programs.education.stats.students, value: "2,500+" },
        { label: t.programs.education.stats.schools, value: "45" },
        { label: t.programs.education.stats.scholarships, value: "350" },
      ],
      features: t.programs.education.features,
      variant: "secondary" as const,
      image: programEducation,
    },
    {
      icon: Stethoscope,
      title: t.programs.health.title,
      description: t.programs.health.description,
      stats: [
        { label: t.programs.health.stats.clinics, value: "15" },
        { label: t.programs.health.stats.patients, value: "8,000+" },
        { label: t.programs.health.stats.workers, value: "120" },
      ],
      features: t.programs.health.features,
      variant: "accent" as const,
      image: programHealth,
    },
    {
      icon: Briefcase,
      title: t.programs.economic.title,
      description: t.programs.economic.description,
      stats: [
        { label: t.programs.economic.stats.entrepreneurs, value: "1,000+" },
        { label: t.programs.economic.stats.businesses, value: "450" },
        { label: t.programs.economic.stats.microloans, value: "$500K" },
      ],
      features: t.programs.economic.features,
      variant: "primary" as const,
      image: programEconomic,
    },
    {
      icon: Leaf,
      title: t.programs.environment.title,
      description: t.programs.environment.description,
      stats: [
        { label: t.programs.environment.stats.trees, value: "50,000+" },
        { label: t.programs.environment.stats.water, value: "25" },
        { label: t.programs.environment.stats.trained, value: "30" },
      ],
      features: t.programs.environment.features,
      variant: "accent" as const,
      image: programEnvironment,
    },
    {
      icon: Users,
      title: t.programs.community.title,
      description: t.programs.community.description,
      stats: [
        { label: t.programs.community.stats.leaders, value: "200+" },
        { label: t.programs.community.stats.infrastructure, value: "35" },
        { label: t.programs.community.stats.centers, value: "12" },
      ],
      features: t.programs.community.features,
      variant: "secondary" as const,
      image: programCommunity,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-primary-foreground/90 uppercase tracking-wider mb-4">
              {t.programs.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              {t.programs.title}
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              {t.programs.description}
            </p>
          </div>
        </div>
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Programs List */}
      <section className="section-padding bg-background">
        <div className="container-wide space-y-24">
          {programs.map((program, index) => (
            <div
              key={program.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="mb-6 flex justify-center lg:justify-start">
                  <IconContainer 
                    icon={program.icon} 
                    variant={program.variant}
                    size="lg"
                  />
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
                  {program.title}
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {program.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <ArrowRight className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="warm" size="lg" asChild>
                  <Link to="/donate">{t.programs.supportBtn}</Link>
                </Button>
              </div>

              {/* Image and Stats */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="space-y-6">
                  {/* Program Image */}
                  <div className="rounded-2xl overflow-hidden shadow-soft">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  {/* Stats Card */}
                  <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {t.programs.impactTitle}
                    </h3>
                    <div className="grid gap-4">
                      {program.stats.map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                          <span className="text-xl font-serif font-bold text-foreground">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/50">
        <div className="container-narrow text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
            {t.programs.ctaTitle}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            {t.programs.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="warm" size="lg" asChild>
              <Link to="/donate">{t.programs.donateBtn}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/get-involved">{t.programs.partnerBtn}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
