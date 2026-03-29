import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Handshake, Heart, Star, Award, Gem, Crown } from "lucide-react";
import { useTranslation } from "@/i18n";
import { IconContainer } from "@/components/ui/IconContainer";

const GetInvolved = () => {
  const { t } = useTranslation();

  const memberBenefits = t.getInvolved.memberBenefits;

  const partnershipTiers = [
    {
      icon: Star,
      name: t.getInvolved.communityPartner,
      amount: "$1,000 - $4,999",
      benefits: t.getInvolved.partnerBenefits.community,
    },
    {
      icon: Award,
      name: t.getInvolved.impactPartner,
      amount: "$5,000 - $24,999",
      benefits: t.getInvolved.partnerBenefits.impact,
    },
    {
      icon: Gem,
      name: t.getInvolved.foundingPartner,
      amount: "$25,000 - $99,999",
      benefits: t.getInvolved.partnerBenefits.founding,
    },
    {
      icon: Crown,
      name: t.getInvolved.legacyPartner,
      amount: "$100,000+",
      benefits: t.getInvolved.partnerBenefits.legacy,
    },
  ];

  const majorDonors = [
    { name: "The Johnson Family Foundation", tier: "Legacy" },
    { name: "TechCorp International", tier: "Founding" },
    { name: "Community First Bank", tier: "Impact" },
    { name: "Global Health Initiative", tier: "Founding" },
    { name: "The Williams Trust", tier: "Legacy" },
    { name: "Sustainable Futures Inc.", tier: "Impact" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              {t.getInvolved.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              {t.getInvolved.title}
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              {t.getInvolved.description}
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

      {/* Membership Section */}
      <section id="members" className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6 flex justify-center lg:justify-start">
                <IconContainer icon={Users} variant="secondary" size="lg" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
                {t.getInvolved.membershipTitle}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t.getInvolved.membershipDesc}
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                {t.getInvolved.membershipPricing} <span className="font-semibold text-foreground">$50</span> ({t.getInvolved.individual}) 
                | <span className="font-semibold text-foreground">$100</span> ({t.getInvolved.family})
              </p>
              <Button variant="warm" size="lg" asChild>
                <Link to="/membership">{t.getInvolved.joinNow}</Link>
              </Button>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-6">{t.getInvolved.memberBenefitsTitle}</h3>
              <ul className="space-y-4">
                {memberBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partners" className="section-padding bg-muted/50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="mb-6 flex justify-center">
              <IconContainer icon={Handshake} variant="accent" size="lg" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              {t.getInvolved.partnershipTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.getInvolved.partnershipDesc}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnershipTiers.map((tier) => (
              <div key={tier.name} className="p-6 rounded-2xl bg-card border border-border">
                <div className="mb-4 flex justify-center">
                  <IconContainer icon={tier.icon} variant="secondary" size="sm" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                  {tier.name}
                </h3>
                <p className="text-secondary font-semibold mb-4">{tier.amount}</p>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-secondary">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="sage" size="lg" asChild>
              <Link to="/contact">{t.getInvolved.discussPartnership}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Major Donors Recognition */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              {t.getInvolved.supportersTitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              {t.getInvolved.supportersBadge}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.getInvolved.supportersDesc}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorDonors.map((donor) => (
              <div
                key={donor.name}
                className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  donor.tier === "Legacy" 
                    ? "bg-secondary/20 text-secondary" 
                    : donor.tier === "Founding"
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {donor.tier === "Legacy" ? (
                    <Crown className="h-6 w-6" />
                  ) : donor.tier === "Founding" ? (
                    <Gem className="h-6 w-6" />
                  ) : (
                    <Award className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{donor.name}</h3>
                  <p className="text-sm text-muted-foreground">{donor.tier} Partner</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section id="volunteer" className="section-padding bg-primary">
        <div className="container-narrow text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary-foreground mb-6">
            {t.getInvolved.volunteerTitle}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {t.getInvolved.volunteerDesc}
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">{t.getInvolved.volunteerBtn}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolved;
