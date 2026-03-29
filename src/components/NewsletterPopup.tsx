import { useState, useEffect } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitFormWithRateLimit } from "@/hooks/useRateLimitedSubmit";
import { useToast } from "@/hooks/use-toast";
import { newsletterSchema, validateForm } from "@/lib/formValidation";

const POPUP_STORAGE_KEY = "niya_newsletter_popup_dismissed";
const POPUP_DELAY_MS = 5000;

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const dismissed = localStorage.getItem(POPUP_STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setIsOpen(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setIsOpen(false);
    localStorage.setItem(POPUP_STORAGE_KEY, "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm(newsletterSchema, {
      email,
      name: name || "",
      subscriberType: "general",
      interests: ["All Programs"],
    });

    if (!validation.isValid) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse courriel valide.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const result = await submitFormWithRateLimit(
      "newsletter",
      {
        email,
        name: name || null,
        subscriber_type: "general",
        interests: ["All Programs"],
      },
      email
    );

    if (result.success) {
      setIsSubmitted(true);
      toast({ title: "Merci !", description: "Vous êtes inscrit(e) à notre infolettre." });
      setTimeout(dismiss, 3000);
    } else if (result.isDuplicate) {
      toast({ title: "Déjà inscrit(e)", description: "Cette adresse est déjà abonnée." });
      setTimeout(dismiss, 2000);
    } else if (result.isRateLimited) {
      toast({ title: "Trop de requêtes", description: "Veuillez réessayer plus tard.", variant: "destructive" });
    } else {
      toast({ title: "Erreur", description: "Une erreur est survenue. Réessayez.", variant: "destructive" });
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="bg-primary px-6 py-8 text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/15">
            <Mail className="h-7 w-7 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-primary-foreground mb-2">
            Restez informé(e)
          </h3>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Recevez nos actualités sur le repreneuriat féminin et les opportunités NIYA.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {isSubmitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-primary">
              <CheckCircle className="h-10 w-10" />
              <span className="font-medium text-lg">Merci pour votre inscription !</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Votre nom (optionnel)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 bg-background border-border"
              />
              <Input
                type="email"
                placeholder="Votre adresse courriel"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                className="h-11 bg-background border-border"
              />
              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Inscription...
                  </>
                ) : (
                  "S'inscrire à l'infolettre"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-1">
                Aucun spam. Désabonnement en un clic.{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Politique de confidentialité
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
