import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Loader2, ArrowRight } from "lucide-react";
import logoWhite from "@/assets/logo-white.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function QRLanding() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !fullName) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs.", variant: "destructive" });
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
          name: fullName,
          subject: "Nouvelle inscription via QR Code",
        }),
      });
      const result = await response.json();

      if (result.success) {
        toast({ title: "Merci !", description: "Votre inscription est confirmée." });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-navy-deep relative flex flex-col justify-center overflow-hidden">
      {/* Background gradients for premium glassmorphism feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container px-6 relative z-10 w-full max-w-md mx-auto py-10 my-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <div className="w-44 lg:w-48 mb-2">
            <img src={logoWhite} alt="Fondation NIYA" className="w-full object-contain drop-shadow-2xl" />
          </div>

          {/* Texts */}
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white leading-tight">
              L'autonomie économique au féminin
            </h1>
            <p className="text-white/70 text-[0.95rem] leading-relaxed max-w-sm mx-auto">
              Nous sommes dédiés à l'autonomie économique des femmes par le repreneuriat. Rejoignez le mouvement et découvrez nos programmes en vous inscrivant ci-dessous.
            </p>
          </div>

          {/* Glassmorphism Card Form */}
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none"/>
            <h2 className="text-xl font-bold text-white mb-6 font-sans">
              Rejoindre gratuitement
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-left relative z-10">
              <div className="space-y-1.5">
                <label className="text-[0.7rem] font-bold text-white/50 uppercase tracking-[0.1em] pl-1">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Prénom Nom"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    maxLength={100}
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-accent focus:ring-1 focus:ring-accent w-full text-base transition-all rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.7rem] font-bold text-white/50 uppercase tracking-[0.1em] pl-1">Courriel</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="email"
                    placeholder="votre@courriel.ca"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-accent focus:ring-1 focus:ring-accent w-full text-base transition-all rounded-lg"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-4 bg-accent hover:bg-accent/90 text-navy-deep hover:text-navy-deep rounded-lg font-bold text-base shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    S'inscrire gratuitement
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="pt-3 text-center">
                <p className="text-[0.72rem] text-white/40">
                  En vous inscrivant, vous acceptez notre{" "}
                  <button type="button" onClick={() => navigate('/privacy')} className="underline hover:text-white/60">Politique de confidentialité</button>
                </p>
              </div>
            </form>
          </div>
          
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="text-white/40 text-sm hover:text-white transition-colors"
          >
            Aller au site web sans s'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}
