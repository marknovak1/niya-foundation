import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle, Heart, Users, Briefcase, Shield } from "lucide-react";
import { useTranslation } from "@/i18n";

const FAQ = () => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const faqCategories = [
    {
      id: "donations",
      name: t.faq.categories.donations,
      icon: Heart,
      faqs: language === "fr" ? [
        {
          question: "Comment puis-je faire un don?",
          answer: "Vous pouvez faire un don via notre page de don en ligne, par courrier ou en nous contactant directement. Nous acceptons les cartes de crédit, les virements bancaires et les chèques.",
        },
        {
          question: "Mon don est-il déductible des impôts?",
          answer: "Oui! La Fondation NIYA est une organisation à but non lucratif enregistrée. Tous les dons sont déductibles des impôts dans les limites prévues par la loi.",
        },
        {
          question: "Puis-je faire un don mensuel récurrent?",
          answer: "Absolument! Les dons mensuels sont l'un des moyens les plus efficaces de soutenir notre travail. Contactez-nous pour mettre en place un don récurrent.",
        },
        {
          question: "Comment mon don est-il utilisé?",
          answer: "95% de chaque don va directement à nos programmes. Les 5% restants couvrent les frais administratifs essentiels.",
        },
      ] : [
        {
          question: "How can I make a donation?",
          answer: "You can make a donation through our online donation page, by mail, or by contacting us directly. We accept credit cards, bank transfers, and checks.",
        },
        {
          question: "Is my donation tax-deductible?",
          answer: "Yes! NIYA Foundation is a registered 501(c)(3) non-profit organization. All donations are tax-deductible to the extent permitted by law.",
        },
        {
          question: "Can I make a recurring monthly donation?",
          answer: "Absolutely! Monthly giving is one of the most impactful ways to support our work. Contact us to set up a recurring donation.",
        },
        {
          question: "How is my donation used?",
          answer: "95% of every donation goes directly to our programs. The remaining 5% covers essential administrative costs.",
        },
      ],
    },
    {
      id: "volunteering",
      name: t.faq.categories.volunteering,
      icon: Users,
      faqs: language === "fr" ? [
        {
          question: "Comment puis-je faire du bénévolat avec la Fondation NIYA?",
          answer: "Nous offrons diverses opportunités de bénévolat localement et internationalement. Remplissez notre formulaire d'intérêt bénévole sur la page Sondages.",
        },
        {
          question: "Ai-je besoin de compétences spéciales pour faire du bénévolat?",
          answer: "Pas nécessairement! Bien que nous ayons besoin de spécialistes, nous avons aussi des opportunités pour les bénévoles généraux.",
        },
        {
          question: "Puis-je faire du bénévolat à distance?",
          answer: "Oui! Nous avons des opportunités de bénévolat à distance incluant la création de contenu, la traduction et le soutien administratif.",
        },
      ] : [
        {
          question: "How can I volunteer with NIYA Foundation?",
          answer: "We offer various volunteering opportunities both locally and internationally. Fill out our Volunteer Interest Form on the Surveys page.",
        },
        {
          question: "Do I need special skills to volunteer?",
          answer: "Not necessarily! While we do need specialists, we also have opportunities for general volunteers.",
        },
        {
          question: "Can I volunteer remotely?",
          answer: "Yes! We have remote volunteering opportunities including content creation, translation, and administrative support.",
        },
      ],
    },
    {
      id: "programs",
      name: t.faq.categories.programs,
      icon: Briefcase,
      faqs: language === "fr" ? [
        {
          question: "Quels programmes la Fondation NIYA gère-t-elle?",
          answer: "Nous gérons cinq programmes principaux: Initiative Éducation, Santé & Bien-être, Autonomisation Économique, Durabilité Environnementale et Développement Communautaire.",
        },
        {
          question: "Où opérez-vous?",
          answer: "Nous opérons actuellement dans plus de 50 communautés à travers plusieurs régions mondiales.",
        },
        {
          question: "Comment mesurez-vous l'impact?",
          answer: "Nous utilisons des cadres complets de suivi et d'évaluation incluant des évaluations de base, un suivi régulier des progrès et des études d'impact à long terme.",
        },
      ] : [
        {
          question: "What programs does NIYA Foundation run?",
          answer: "We run five core programs: Education Initiative, Health & Wellness, Economic Empowerment, Environmental Sustainability, and Community Development.",
        },
        {
          question: "Where do you operate?",
          answer: "We currently operate in over 50 communities across multiple regions globally.",
        },
        {
          question: "How do you measure impact?",
          answer: "We use comprehensive monitoring and evaluation frameworks including baseline assessments, regular progress tracking, and long-term impact studies.",
        },
      ],
    },
    {
      id: "membership",
      name: t.faq.categories.membership,
      icon: Shield,
      faqs: language === "fr" ? [
        {
          question: "Quels sont les avantages de devenir membre?",
          answer: "Les membres reçoivent des mises à jour exclusives, des invitations aux événements, des droits de vote aux assemblées annuelles et des rapports d'impact annuels.",
        },
        {
          question: "Comment mon entreprise peut-elle s'associer à la Fondation NIYA?",
          answer: "Nous offrons diverses opportunités de partenariat incluant les parrainages d'entreprise, les programmes de dons jumelés et les campagnes de dons des employés.",
        },
      ] : [
        {
          question: "What are the benefits of becoming a member?",
          answer: "Members receive exclusive updates, invitations to events, voting rights at annual meetings, and annual impact reports.",
        },
        {
          question: "How can my company partner with NIYA Foundation?",
          answer: "We offer various partnership opportunities including corporate sponsorships, matching gift programs, and employee giving campaigns.",
        },
      ],
    },
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.faqs.length > 0);

  const displayCategories = activeCategory
    ? filteredCategories.filter(c => c.id === activeCategory)
    : filteredCategories;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              {t.faq.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              {t.faq.title}
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              {t.faq.description}
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

      {/* Search & Filter */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.faq.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {t.faq.all}
              </button>
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          {displayCategories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.faq.noResults}</h3>
              <p className="text-muted-foreground">
                {t.faq.noResultsDesc}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(null);
                }}
              >
                {t.faq.clearFilters}
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {displayCategories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                      <category.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground">
                      {category.name}
                    </h2>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                        className="border border-border rounded-xl px-6 data-[state=open]:bg-muted/30"
                      >
                        <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-muted/50">
        <div className="container-narrow text-center">
          <HelpCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            {t.faq.stillHaveQuestions}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            {t.faq.stillHaveQuestionsDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="warm" size="lg" asChild>
              <Link to="/contact">{t.faq.contactUs}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/surveys">{t.faq.takeSurvey}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
