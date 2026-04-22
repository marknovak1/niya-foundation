import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList, CheckCircle, MessageSquare, BarChart3,
  Users, ArrowRight, Star, Loader2
} from "lucide-react";
import { submitFormWithRateLimit } from "@/hooks/useRateLimitedSubmit";
import { useToast } from "@/hooks/use-toast";
import { surveySchema, validateForm } from "@/lib/formValidation";

type SurveyType = "needs" | "satisfaction" | "impact" | "volunteer";

interface SurveyConfig {
  id: SurveyType;
  title: string;
  description: string;
  icon: typeof ClipboardList;
  questions: {
    id: string;
    question: string;
    type: "text" | "textarea" | "radio" | "checkbox" | "rating";
    options?: string[];
    required?: boolean;
  }[];
}

const surveys: SurveyConfig[] = [
  {
    id: "needs",
    title: "Évaluation des besoins communautaires",
    description: "Aidez-nous à comprendre les besoins de votre communauté pour mieux orienter nos ressources.",
    icon: Users,
    questions: [
      { id: "community", question: "Quelle communauté ou région représentez-vous ?", type: "text", required: true },
      { id: "primaryNeed", question: "Quel est le besoin le plus pressant dans votre communauté ?", type: "radio", options: ["Éducation", "Santé", "Opportunités économiques", "Eau potable / Assainissement", "Sécurité alimentaire", "Logement", "Autre"], required: true },
      { id: "affectedPopulation", question: "Qui est le plus touché par ce besoin ?", type: "checkbox", options: ["Enfants", "Jeunes", "Femmes", "Personnes âgées", "Personnes handicapées", "Toute la communauté"] },
      { id: "currentSupport", question: "Quel soutien existe actuellement pour ce problème ?", type: "textarea" },
      { id: "proposedSolution", question: "Quelle solution vous semble la plus efficace ?", type: "textarea", required: true },
      { id: "urgency", question: "À quel point ce besoin est-il urgent ?", type: "rating", required: true },
    ],
  },
  {
    id: "satisfaction",
    title: "Enquête de satisfaction des programmes",
    description: "Partagez votre expérience avec nos programmes pour nous aider à nous améliorer.",
    icon: MessageSquare,
    questions: [
      { id: "program", question: "À quel programme avez-vous participé ?", type: "radio", options: ["Initiative éducative", "Santé et bien-être", "Autonomisation économique", "Durabilité environnementale", "Développement communautaire"], required: true },
      { id: "overallSatisfaction", question: "Dans quelle mesure êtes-vous satisfait(e) du programme dans l'ensemble ?", type: "rating", required: true },
      { id: "expectations", question: "Le programme a-t-il répondu à vos attentes ?", type: "radio", options: ["A dépassé les attentes", "A répondu aux attentes", "A partiellement répondu aux attentes", "N'a pas répondu aux attentes"], required: true },
      { id: "mostValuable", question: "Quel a été l'aspect le plus précieux du programme ?", type: "textarea" },
      { id: "improvements", question: "Quelles améliorations suggéreriez-vous ?", type: "textarea" },
      { id: "recommend", question: "Recommanderiez-vous ce programme à d'autres personnes ?", type: "radio", options: ["Certainement oui", "Probablement oui", "Je ne sais pas", "Probablement non", "Certainement non"], required: true },
    ],
  },
  {
    id: "impact",
    title: "Enquête sur la mesure de l'impact",
    description: "Aidez-nous à mesurer l'impact durable de nos programmes dans votre vie.",
    icon: BarChart3,
    questions: [
      { id: "programParticipated", question: "De quel(s) programme(s) avez-vous bénéficié ?", type: "checkbox", options: ["Initiative éducative", "Santé et bien-être", "Autonomisation économique", "Durabilité environnementale", "Développement communautaire"] },
      { id: "lifeChange", question: "Comment le programme a-t-il changé votre vie ?", type: "textarea", required: true },
      { id: "skillsGained", question: "Quelles nouvelles compétences ou connaissances avez-vous acquises ?", type: "textarea" },
      { id: "incomeChange", question: "Le cas échéant, votre situation financière s'est-elle améliorée ?", type: "radio", options: ["Nettement améliorée", "Légèrement améliorée", "Aucun changement", "Non applicable"] },
      { id: "healthChange", question: "Le cas échéant, votre état de santé s'est-il amélioré ?", type: "radio", options: ["Nettement amélioré", "Légèrement amélioré", "Aucun changement", "Non applicable"] },
      { id: "overallImpact", question: "Évaluez l'impact global sur votre qualité de vie", type: "rating", required: true },
      { id: "testimonial", question: "Souhaitez-vous partager un témoignage ? (Utilisé avec votre permission)", type: "textarea" },
    ],
  },
  {
    id: "volunteer",
    title: "Formulaire d'intérêt bénévole",
    description: "Parlez-nous de vos compétences et de vos disponibilités pour vous engager avec nous.",
    icon: ClipboardList,
    questions: [
      { id: "skills", question: "Quelles compétences pouvez-vous offrir ?", type: "checkbox", options: ["Enseignement / Tutorat", "Santé", "Commerce / Finance", "Technologie", "Construction", "Agriculture", "Communication / Marketing", "Juridique", "Autre"] },
      { id: "availability", question: "Quelle est votre disponibilité ?", type: "radio", options: ["Temps plein (40h+ / semaine)", "Mi-temps (20-40h / semaine)", "Occasionnel (5-20h / semaine)", "Weekends uniquement", "À distance uniquement"], required: true },
      { id: "location", question: "Êtes-vous prêt(e) à voyager ou à vous déplacer ?", type: "radio", options: ["Oui, à l'international", "Oui, au niveau national", "Local uniquement", "À distance uniquement"], required: true },
      { id: "experience", question: "Décrivez toute expérience bénévole ou professionnelle pertinente", type: "textarea" },
      { id: "motivation", question: "Qu'est-ce qui vous motive à faire du bénévolat pour la Fondation NIYA ?", type: "textarea", required: true },
      { id: "commitment", question: "Pendant combien de temps pouvez-vous vous engager en tant que bénévole ?", type: "radio", options: ["1 à 3 mois", "3 à 6 mois", "6 à 12 mois", "1 an et plus", "Flexible"], required: true },
    ],
  },
];

const Surveys = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyType | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: "", email: "" });

  const currentSurvey = surveys.find(s => s.id === selectedSurvey);

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const current = (responses[questionId] as string[]) || [];
    const updated = checked
      ? [...current, option]
      : current.filter(o => o !== option);
    handleResponseChange(questionId, updated);
  };

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const validation = validateForm(surveySchema, {
      name: contactInfo.name,
      email: contactInfo.email,
      surveyType: selectedSurvey,
      responses: responses,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs de validation.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const identifier = contactInfo.email || `anonymous-${Date.now()}`;

    const result = await submitFormWithRateLimit('survey', {
      survey_type: selectedSurvey,
      respondent_name: contactInfo.name || null,
      respondent_email: contactInfo.email || null,
      responses: responses,
    }, identifier);

    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "Enquête soumise !",
        description: "Merci pour vos précieux retours.",
      });
    } else if (result.isRateLimited) {
      toast({
        title: "Trop de soumissions",
        description: "Veuillez patienter avant de soumettre une autre enquête.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Échec de l'envoi de l'enquête. Veuillez réessayer.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const renderQuestion = (question: SurveyConfig["questions"][0]) => {
    const value = responses[question.id];

    switch (question.type) {
      case "text":
        return (
          <Input
            value={(value as string) || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      case "textarea":
        return (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            required={question.required}
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-foreground resize-y"
            placeholder="Votre réponse..."
          />
        );

      case "radio":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  required={question.required}
                  className="h-4 w-4"
                />
                <span className="text-foreground">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={((value as string[]) || []).includes(option)}
                  onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-foreground">{option}</span>
              </label>
            ))}
          </div>
        );

      case "rating":
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleResponseChange(question.id, rating.toString())}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  value === rating.toString()
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border text-muted-foreground hover:border-secondary/50"
                }`}
              >
                <Star className={`h-5 w-5 ${value === rating.toString() ? "fill-secondary" : ""}`} />
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="section-padding bg-background min-h-[60vh] flex items-center">
          <div className="container-narrow text-center">
            <div className="mb-6 mx-auto inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 text-accent">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Merci pour vos retours !
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Votre réponse a bien été enregistrée. Vos contributions sont précieuses pour nous aider
              à améliorer nos programmes et à mieux servir nos communautés.
            </p>
            <Button
              variant="warm"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedSurvey(null);
                setResponses({});
              }}
            >
              Répondre à une autre enquête
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              Faites entendre votre voix
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              Enquêtes & Retours
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Vos retours nous aident à améliorer nos programmes et à mieux servir les communautés.
              Prenez quelques minutes pour partager vos pensées et expériences.
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

      <section className="section-padding bg-background">
        <div className="container-wide">
          {!selectedSurvey ? (
            <>
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  Choisissez une enquête
                </h2>
                <p className="text-muted-foreground">
                  Sélectionnez l'enquête qui correspond le mieux à votre situation ou à votre expérience.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {surveys.map((survey) => (
                  <Card
                    key={survey.id}
                    className="cursor-pointer transition-all duration-200 hover:border-secondary hover:shadow-md"
                    onClick={() => setSelectedSurvey(survey.id)}
                  >
                    <CardHeader>
                      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary">
                        <survey.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{survey.title}</CardTitle>
                      <CardDescription>{survey.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {survey.questions.length} questions
                        </span>
                        <ArrowRight className="h-5 w-5 text-secondary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setSelectedSurvey(null)}
                className="mb-6 text-sm text-secondary hover:underline flex items-center gap-1"
              >
                ← Retour à la sélection des enquêtes
              </button>

              <Card>
                <CardHeader>
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary">
                    {currentSurvey && <currentSurvey.icon className="h-6 w-6" />}
                  </div>
                  <CardTitle>{currentSurvey?.title}</CardTitle>
                  <CardDescription>{currentSurvey?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Info */}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h3 className="text-sm font-semibold text-foreground mb-4">
                        Vos informations (facultatif)
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nom</Label>
                          <Input
                            id="name"
                            value={contactInfo.name}
                            onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            value={contactInfo.email}
                            onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Questions */}
                    {currentSurvey?.questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <Label className="text-base">
                          {index + 1}. {question.question}
                          {question.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {renderQuestion(question)}
                      </div>
                    ))}

                    {/* Submit */}
                    <div className="pt-4">
                      <Button type="submit" variant="warm" size="lg" className="w-full">
                        Soumettre l'enquête
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Data Usage Notice */}
      <section className="py-12 bg-muted/50">
        <div className="container-narrow text-center">
          <p className="text-sm text-muted-foreground">
            Vos réponses sont confidentielles et seront utilisées pour améliorer nos programmes.
            Les données peuvent être agrégées pour des demandes de subventions et des rapports annuels.
            Consultez notre <a href="/privacy" className="text-secondary hover:underline">Politique de confidentialité</a> pour plus d'informations.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Surveys;
