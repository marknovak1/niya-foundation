import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, Award, Globe, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "@/i18n";
import { IconContainer } from "@/components/ui/IconContainer";

// Team member photos
import teamSarah from "@/assets/team-sarah.jpg";
import teamMichael from "@/assets/team-michael.jpg";
import teamAmara from "@/assets/team-amara.jpg";
import teamDavid from "@/assets/team-david.jpg";

const About = () => {
  const { t, language } = useTranslation();

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: language === "fr" ? "Fondatrice & Directrice Exécutive" : "Founder & Executive Director",
      bio: language === "fr" 
        ? "Avec plus de 20 ans d'expérience en développement international, Sarah a fondé la Fondation NIYA pour créer un changement durable."
        : "With over 20 years of experience in international development, Sarah founded NIYA Foundation to create sustainable change.",
      image: teamSarah,
      linkedin: "#",
      email: "sarah@niyafoundation.org",
    },
    {
      name: "Michael Chen",
      role: language === "fr" ? "Directeur des Programmes" : "Director of Programs",
      bio: language === "fr"
        ? "Michael supervise la mise en œuvre de tous les programmes et s'assure que nos initiatives respectent les plus hauts standards d'impact."
        : "Michael oversees all program implementation and ensures our initiatives meet the highest standards of impact.",
      image: teamMichael,
      linkedin: "#",
      email: "michael@niyafoundation.org",
    },
    {
      name: "Amara Williams",
      role: language === "fr" ? "Directrice des Partenariats" : "Director of Partnerships",
      bio: language === "fr"
        ? "Amara établit des relations stratégiques avec les donateurs, partenaires et communautés pour étendre notre portée."
        : "Amara builds strategic relationships with donors, partners, and communities to expand our reach.",
      image: teamAmara,
      linkedin: "#",
      email: "amara@niyafoundation.org",
    },
    {
      name: "David Okonkwo",
      role: language === "fr" ? "Directeur des Opérations" : "Director of Operations",
      bio: language === "fr"
        ? "David assure l'excellence opérationnelle dans tous nos programmes et fonctions administratives."
        : "David ensures operational excellence across all our programs and administrative functions.",
      image: teamDavid,
      linkedin: "#",
      email: "david@niyafoundation.org",
    },
  ];

  const values = [
    { icon: Heart, title: t.about.compassion, description: t.about.compassionDesc },
    { icon: Users, title: t.about.community, description: t.about.communityDesc },
    { icon: Award, title: t.about.excellence, description: t.about.excellenceDesc },
    { icon: Globe, title: t.about.sustainabilityValue, description: t.about.sustainabilityValueDesc },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-primary-foreground/90 uppercase tracking-wider mb-4">
              {t.about.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              {t.about.title}
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              {t.about.description}
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

      {/* Mission & Vision */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="mb-6 flex justify-center lg:justify-start">
                <IconContainer icon={Target} variant="secondary" size="md" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">{t.about.missionTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.missionDesc}
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="mb-6 flex justify-center lg:justify-start">
                <IconContainer icon={Eye} variant="accent" size="md" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">{t.about.visionTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.visionDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-muted/50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              {t.about.valuesTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {t.about.valuesBadge}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={value.title} className="text-center p-6">
                <div className="mb-4 flex justify-center">
                  <IconContainer 
                    icon={value.icon} 
                    variant={index % 2 === 0 ? "secondary" : "accent"} 
                    size="md" 
                  />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              {t.about.storyTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {t.about.storyBadge}
            </h2>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="leading-relaxed mb-6">{t.about.storyP1}</p>
            <p className="leading-relaxed mb-6">{t.about.storyP2}</p>
            <p className="leading-relaxed">{t.about.storyP3}</p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="team" className="section-padding bg-muted/50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              {t.about.teamTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              {t.about.teamBadge}
            </h2>
            <p className="text-muted-foreground">{t.about.teamDesc}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  
                  <div className="flex justify-center gap-3">
                    <a 
                      href={member.linkedin}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a 
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-narrow text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary-foreground mb-6">
            {t.about.joinTitle}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {t.about.joinDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/donate">{t.about.donateBtn}</Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/get-involved">{t.about.getInvolvedBtn}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
