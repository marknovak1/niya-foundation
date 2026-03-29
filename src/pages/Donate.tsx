import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, CreditCard, Receipt, Shield, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n";

const donationAmounts = [25, 50, 100, 250, 500, 1000];

const Donate = () => {
  const { t } = useTranslation();

  const impactExamples = [
    { amount: "$25", impact: t.donate.impactExamples["$25"] },
    { amount: "$50", impact: t.donate.impactExamples["$50"] },
    { amount: "$100", impact: t.donate.impactExamples["$100"] },
    { amount: "$250", impact: t.donate.impactExamples["$250"] },
    { amount: "$500", impact: t.donate.impactExamples["$500"] },
    { amount: "$1,000", impact: t.donate.impactExamples["$1,000"] },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              {t.donate.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              {t.donate.title}
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              {t.donate.description}
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

      {/* Donation Form Section */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-soft">
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary">
                <Heart className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                {t.donate.formTitle}
              </h2>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-4">
                  {t.donate.selectAmount}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      className="p-4 rounded-lg border-2 border-border text-foreground font-semibold hover:border-secondary hover:bg-secondary/5 transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder={t.donate.customAmount}
                    className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Donation Type */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-4">
                  {t.donate.donationType}
                </label>
                <div className="flex gap-4">
                  <button className="flex-1 p-4 rounded-lg border-2 border-secondary bg-secondary/5 text-foreground font-semibold">
                    {t.donate.oneTime}
                  </button>
                  <button className="flex-1 p-4 rounded-lg border-2 border-border text-foreground font-semibold hover:border-secondary hover:bg-secondary/5 transition-colors">
                    {t.donate.monthly}
                  </button>
                </div>
              </div>

              {/* Coming Soon Notice */}
              <div className="p-4 rounded-lg bg-amber-50 border border-secondary/20 mb-6">
                <p className="text-sm text-secondary-foreground">
                  <strong>{t.donate.comingSoon}</strong> {t.donate.comingSoonDesc}
                </p>
              </div>

              <Button variant="warm" size="xl" className="w-full" asChild>
                <Link to="/contact">
                  {t.donate.contactToDonate}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>{t.donate.securePayment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    <span>{t.donate.taxReceipt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>{t.donate.sslEncrypted}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Information */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                {t.donate.impactTitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t.donate.impactDesc}
              </p>

              <div className="space-y-4">
                {impactExamples.map((example) => (
                  <div
                    key={example.amount}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-secondary">{example.amount}</span>
                    </div>
                    <p className="text-foreground">{example.impact}</p>
                  </div>
                ))}
              </div>

              {/* Tax Deduction Info */}
              <div className="mt-8 p-6 rounded-xl bg-sage-50 border border-accent/20">
                <h3 className="font-semibold text-foreground mb-2">{t.donate.taxDeductible}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.donate.taxDeductibleDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="section-padding bg-muted/50">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              {t.donate.otherWaysTitle}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.donate.otherWaysDesc}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                {t.donate.corporateGiving}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t.donate.corporateGivingDesc}
              </p>
              <Link to="/get-involved#partners" className="text-secondary font-medium hover:text-amber-600">
                {t.common.learnMore} →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                {t.donate.plannedGiving}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t.donate.plannedGivingDesc}
              </p>
              <Link to="/contact" className="text-secondary font-medium hover:text-amber-600">
                {t.common.contactUs} →
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                {t.donate.inKind}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t.donate.inKindDesc}
              </p>
              <Link to="/contact" className="text-secondary font-medium hover:text-amber-600">
                {t.common.getInTouch} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
