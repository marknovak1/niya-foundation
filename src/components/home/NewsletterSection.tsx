import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n";
import { newsletterSchema, validateForm } from "@/lib/formValidation";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscriberType, setSubscriberType] = useState("general");
  const [interests, setInterests] = useState<string[]>(["All Programs"]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const subscriberTypes = [
    { id: "general", label: "General Updates" },
    { id: "member", label: "Member" },
    { id: "donor", label: "Donor" },
    { id: "volunteer", label: "Volunteer" },
    { id: "partner", label: "Partner/Organization" },
  ];

  const interestAreas = [
    "Education",
    "Healthcare",
    "Economic Empowerment",
    "Environment",
    t.newsletter.interests.all,
  ];

  const handleInterestToggle = (interest: string) => {
    if (interest === t.newsletter.interests.all) {
      setInterests([t.newsletter.interests.all]);
    } else {
      const filtered = interests.filter(i => i !== t.newsletter.interests.all);
      if (filtered.includes(interest)) {
        setInterests(filtered.filter(i => i !== interest));
      } else {
        setInterests([...filtered, interest]);
      }
    }
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    // Validate form data
    const validation = validateForm(newsletterSchema, {
      email,
      name: name || "",
      subscriberType,
      interests,
    });
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: t.newsletter.error.title,
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
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
        toast({
          title: t.newsletter.success.title,
          description: t.newsletter.success.description,
        });
        setEmail("");
        setName("");
      } else {
        toast({
          title: t.newsletter.error.title,
          description: t.newsletter.error.description,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t.newsletter.error.title,
        description: t.newsletter.error.description,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <section className="section-padding bg-sage-50">
      <div className="container-narrow text-center">
        {/* Icon */}
        <div className="mb-6 mx-auto inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
          <Mail className="h-8 w-8" />
        </div>

        {/* Content */}
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
          {t.newsletter.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
          {t.newsletter.description}
        </p>

        {/* Form */}
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-primary/10 text-primary max-w-md mx-auto">
            <CheckCircle className="h-8 w-8" />
            <span className="font-medium text-lg">{t.newsletter.success.title}</span>
            <p className="text-sm text-muted-foreground">
              {t.newsletter.success.description}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            {/* Basic Fields */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Input
                type="text"
                placeholder={t.contact.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-12 px-4 bg-background border-border"
              />
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder={t.newsletter.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  className={`h-12 px-4 bg-background border-border ${validationErrors.email ? "border-destructive" : ""}`}
                />
                {validationErrors.email && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
                )}
              </div>
            </div>

            {/* Toggle for advanced options */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary hover:underline mb-6 block"
            >
              {showAdvanced ? "Hide preferences" : "Customize your subscription"}
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="text-left p-6 rounded-xl bg-background border border-border mb-6 space-y-6">
                {/* Subscriber Type */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    I am a...
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {subscriberTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSubscriberType(type.id)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          subscriberType === type.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Areas */}
                <div>
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    {t.newsletter.interests.label}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {interestAreas.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          interests.includes(interest)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" variant="default" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t.newsletter.subscribing}
                </>
              ) : (
                t.newsletter.subscribe
              )}
            </Button>
          </form>
        )}

        {/* Privacy note */}
        <p className="mt-6 text-sm text-muted-foreground">
          {t.newsletter.privacy}{" "}
          <a href="/privacy" className="text-primary hover:underline">{t.footer.privacyPolicy}</a>
        </p>
      </div>
    </section>
  );
}
