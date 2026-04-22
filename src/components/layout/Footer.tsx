import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import logoWhite from "@/assets/logo-white.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { newsletterSchema, validateForm } from "@/lib/formValidation";

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm(newsletterSchema, {
      email,
      name: "",
      subscriberType: "general",
      interests: ["All Programs"],
    });

    if (!validation.isValid) {
      toast({ title: "Erreur", description: "Veuillez entrer un courriel valide.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "7b4d08ef-a2e0-4be6-8f70-3973e72d4e66",
          email,
        }),
      });
      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast({ title: "Merci !", description: "Vous êtes inscrit(e) à notre infolettre." });
      } else {
        toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    }

    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center gap-2 text-accent">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm">Merci pour votre inscription !</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Votre courriel"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={255}
          className="h-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-accent"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="h-10 px-4 bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-[0.75rem] text-white/30">
        Aucun spam. <a href="/privacy" className="text-white/40 hover:text-white/60 underline">Politique de confidentialité</a>
      </p>
    </form>
  );
}

export function Footer() {
  const orgLinks = [
    { name: "Nos axes", href: "/#solution" },
    { name: "Notre approche", href: "/#processus" },
    { name: "La certification NIYA®", href: "/#certification" },
    { name: "Notre impact", href: "/#impact" },
    { name: "Nos partenaires", href: "/#partenaires" },
  ];

  const joinLinks = [
    { name: "Devenir repreneuse", href: "/#cta" },
    { name: "Soumettre une entreprise", href: "/#cta" },
    { name: "Partenariat institutionnel", href: "/#cta" },
    { name: "Partenariat financier", href: "/#cta" },
  ];

  const legalLinks = [
    { name: "Politique de confidentialité", href: "/privacy" },
    { name: "Conditions d'utilisation", href: "/terms" },
    { name: "Code d'éthique NIYA", href: "/ethics" },
  ];

  const handleAnchor = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-navy-deep text-white pt-[72px] pb-8">
      <div className="container-wide">
        {/* Newsletter bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-white/[0.08] mb-12">
          <div>
            <h4 className="font-serif text-xl font-bold text-white mb-1">Infolettre NIYA</h4>
            <p className="text-sm text-white/50">Restez à l'affût de toutes nos actualités et opportunités</p>
          </div>
          <div className="w-full md:w-auto md:min-w-[340px]">
            <FooterNewsletter />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pb-12 border-b border-white/[0.08] mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logoWhite} alt="Fondation NIYA" className="h-14 object-contain" />
            <p className="text-sm text-white leading-relaxed max-w-[280px]">
               Nous sommes une organisation à but non lucratif dédiée à l'autonomie économique des femmes par le repreneuriat et la mobilité économique au Canada.
            </p>
          </div>

          {/* Organisation */}
          <div>
            <h5 className="font-sans text-[0.7rem] font-bold tracking-[2px] uppercase text-white mb-5">Organisation</h5>
            <ul className="list-none space-y-2.5">
              {orgLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchor(e, link.href)}
                    className="text-white hover:text-white/80 text-sm no-underline transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Rejoindre NIYA */}
          <div>
            <h5 className="font-sans text-[0.7rem] font-bold tracking-[2px] uppercase text-white mb-5">Rejoindre NIYA</h5>
            <ul className="list-none space-y-2.5">
              {joinLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchor(e, link.href)}
                    className="text-white hover:text-white/80 text-sm no-underline transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h5 className="font-sans text-[0.7rem] font-bold tracking-[2px] uppercase text-white mb-5">Légal</h5>
            <ul className="list-none space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white hover:text-white/80 text-sm no-underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
           <p className="text-[0.82rem] text-white/30">
            © Fondation NIYA. Tous droits réservés. Organisme à but non lucratif.
          </p>
          <div className="flex items-center gap-4">
             <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
