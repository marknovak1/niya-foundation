import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitFormWithRateLimit } from "@/hooks/useRateLimitedSubmit";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Adresse courriel invalide"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "Vous devez accepter la politique de confidentialité"),
});

type FormData = z.infer<typeof schema>;

const cards = [
  {
    title: "Formations et ateliers",
    description: "Des contenus concrets pour développer tes compétences, structurer tes projets et prendre des décisions éclairées.",
  },
  {
    title: "Mentorat et accompagnement",
    description: "Être guidée, poser tes questions, briser l'isolement entrepreneurial et avancer avec plus de clarté.",
  },
  {
    title: "Communauté engagée",
    description: "Un réseau de femmes ambitieuses, bienveillantes et alignées, avec qui échanger, collaborer et grandir.",
  },
  {
    title: "Annuaire d'entreprises féminines",
    description: "Gagne en visibilité en intégrant notre répertoire et découvre d'autres entreprises dirigées par des femmes.",
  },
  {
    title: "Opportunités de collaboration et de rayonnement",
    description: "Partage tes projets, événements et initiatives à travers nos plateformes.",
  },
];

const DevenirMembre = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  });

  const onSubmit = async (data: FormData) => {
    const result = await submitFormWithRateLimit('membership', {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone || null,
      organization: data.organization || null,
      message: data.message || null,
    }, data.email);

    if (result.success) {
      setIsSubmitted(true);
      reset();
    } else if (result.isRateLimited) {
      toast({
        title: "Trop de demandes",
        description: "Veuillez patienter avant de soumettre à nouveau.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Une erreur est survenue",
        description: "Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section
        className="pt-28 pb-16 text-white"
        style={{ background: "linear-gradient(135deg, #141772 0%, #3a025b 100%)" }}
      >
        <div className="container-wide">
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] mb-4">
            Devenir membre
          </h1>
          <p className="text-white/70 text-[1.1rem] max-w-[560px] leading-[1.75]">
            Rejoindre NIYA, c'est bien plus qu'une adhésion.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left — text content */}
            <div>
              <h2 className="text-primary text-[1.4rem] font-semibold mb-3 leading-[1.2]">
                Un espace fait pour toi
              </h2>
              <div className="space-y-4 text-muted-foreground leading-[1.75] text-[1rem] mb-10">
                <p>
                  C'est entrer dans un espace pensé par et pour les femmes qui bâtissent, reprennent, évoluent.
                  Que tu sois entrepreneure, travailleuse qualifiée ou en transition vers le repreneuriat,
                  notre cohorte a été créée pour t'offrir un environnement où tu peux avancer, entourée.
                </p>
                <p>
                  Nous sommes encore au début de cette aventure — et c'est justement ce qui la rend précieuse.
                  En devenant membre aujourd'hui, tu participes activement à la construction d'un écosystème
                  qui nous ressemble.
                </p>
              </div>

              <h2 className="text-primary text-[1.4rem] font-semibold mb-3 leading-[1.2]">
                Pourquoi nous rejoindre
              </h2>
              <p className="text-muted-foreground leading-[1.75] text-[1rem] mb-10">
                Chez NIYA, on croit à la force du collectif pour accélérer les parcours individuels.
                Notre approche repose sur trois piliers : transmission, soutien et visibilité.
              </p>

              <h2 className="text-primary text-[1.4rem] font-semibold mb-5 leading-[1.2]">
                Ce à quoi tu as accès dès maintenant
              </h2>
              <div className="space-y-4 mb-10">
                {cards.map((card, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card">
                    <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-secondary" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-[0.95rem] mb-1">{card.title}</p>
                      <p className="text-[0.9rem] text-muted-foreground leading-[1.6]">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-primary text-[1.4rem] font-semibold mb-3 leading-[1.2]">
                Une communauté en construction
              </h2>
              <p className="text-muted-foreground leading-[1.75] text-[1rem] mb-8">
                Nous bâtissons NIYA avec intention. De nouveaux avantages, partenariats et opportunités viendront
                enrichir l'expérience au fil du temps. En rejoignant maintenant, tu fais partie des premières
                à façonner cette vision avec nous.
              </p>

              <div className="p-6 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="text-primary font-semibold text-[1.1rem] mb-2">
                  Prête à faire partie du mouvement ?
                </h3>
                <p className="text-muted-foreground text-[0.95rem] leading-[1.7]">
                  Remplis le formulaire de manifestation d'intérêt et rejoins une cohorte de femmes qui avancent, ensemble.
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-card border border-border p-8 shadow-soft">
              <h2 className="text-primary text-[1.4rem] font-semibold mb-1">
                Formulaire de manifestation d'intérêt
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Remplissez ce formulaire et nous vous contacterons sous peu.
              </p>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Demande reçue !</h3>
                  <p className="text-muted-foreground mb-6">
                    Merci pour votre intérêt. Nous vous contacterons prochainement.
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Soumettre une autre demande
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Marie"
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Tremblay"
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Courriel *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="marie@exemple.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />{errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="+1 (514) 000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organisation</Label>
                      <Input
                        id="organization"
                        {...register("organization")}
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Partagez-nous vos attentes ou questions..."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      {...register("consent")}
                      className={`h-4 w-4 mt-1 rounded ${errors.consent ? "border-destructive" : ""}`}
                    />
                    <div>
                      <Label htmlFor="consent" className="font-normal text-sm text-muted-foreground">
                        J'accepte la{" "}
                        <a href="/privacy" className="text-secondary hover:underline">
                          politique de confidentialité
                        </a>{" "}
                        *
                      </Label>
                      {errors.consent && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{errors.consent.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Soumettre ma candidature"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DevenirMembre;
