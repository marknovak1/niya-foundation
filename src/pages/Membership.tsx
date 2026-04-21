import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Heart, CheckCircle, User, Building2, 
  ArrowRight, Mail, Phone, MapPin, Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n";
import { membershipSchema, validateForm } from "@/lib/formValidation";

const Membership = () => {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<string>("family");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    organization: "",
    howHeard: "",
    interests: [] as string[],
    newsletter: true,
  });

  const membershipTiers = [
    {
      id: "individual",
      name: t.membership.individual.title,
      price: t.membership.individual.price,
      period: t.membership.perYear,
      description: t.membership.individual.description,
      benefits: t.membership.individual.benefits,
    },
    {
      id: "family",
      name: t.membership.familyTier.title,
      price: t.membership.familyTier.price,
      period: t.membership.perYear,
      description: t.membership.familyTier.description,
      benefits: t.membership.familyTier.benefits,
      popular: true,
    },
    {
      id: "lifetime",
      name: t.membership.lifetime.title,
      price: t.membership.lifetime.price,
      period: t.membership.oneTime,
      description: t.membership.lifetime.description,
      benefits: t.membership.lifetime.benefits,
    },
  ];

  const interests = t.membership.interests_list;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    // Validate form data
    const validation = validateForm(membershipSchema, formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: t.membership.error.title,
        description: "Please fix the validation errors.",
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
          membership_tier: selectedTier,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || "",
          address: formData.address || "",
          city: formData.city || "",
          country: formData.country || "",
          postal_code: formData.postalCode || "",
          organization: formData.organization || "",
          how_heard: formData.howHeard || "",
          interests: formData.interests.join(", "),
          newsletter_optin: formData.newsletter,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: t.membership.success.title,
          description: t.membership.success.description,
        });
      } else {
        toast({
          title: t.membership.error.title,
          description: t.membership.error.description,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t.membership.error.title,
        description: t.membership.error.description,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
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
              {t.membership.successTitle}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {t.membership.successDesc}
            </p>
            <div className="p-6 rounded-xl bg-muted/50 max-w-md mx-auto mb-8">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{t.membership.selectedMembership}</strong>{" "}
                {membershipTiers.find(tier => tier.id === selectedTier)?.name}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong className="text-foreground">{t.membership.amount}</strong>{" "}
                {membershipTiers.find(tier => tier.id === selectedTier)?.price}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.membership.paymentContact}
            </p>
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
              {t.membership.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              {t.membership.title}
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              {t.membership.description}
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

      {/* Membership Tiers */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              {t.membership.chooseTitle}
            </h2>
            <p className="text-muted-foreground">
              {t.membership.chooseDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {membershipTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedTier === tier.id 
                    ? "border-secondary ring-2 ring-secondary/20" 
                    : "border-border hover:border-secondary/50"
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded-full">
                      {t.membership.mostPopular}
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedTier === tier.id ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
                    }`}>
                      {tier.id === "individual" ? <User className="h-5 w-5" /> : 
                       tier.id === "family" ? <Users className="h-5 w-5" /> : 
                       <Heart className="h-5 w-5" />}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedTier === tier.id ? "border-secondary bg-secondary" : "border-muted-foreground"
                    }`}>
                      {selectedTier === tier.id && (
                        <CheckCircle className="h-4 w-4 text-secondary-foreground" />
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground ml-2">{tier.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Registration Form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  {t.membership.formTitle}
                </CardTitle>
                <CardDescription>
                  {t.membership.formDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User className="h-4 w-4" /> {t.membership.personalInfo}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t.membership.firstName} *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          maxLength={100}
                          className={`mt-1 ${validationErrors.firstName ? "border-destructive" : ""}`}
                        />
                        {validationErrors.firstName && (
                          <p className="text-xs text-destructive mt-1">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t.membership.lastName} *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          maxLength={100}
                          className={`mt-1 ${validationErrors.lastName ? "border-destructive" : ""}`}
                        />
                        {validationErrors.lastName && (
                          <p className="text-xs text-destructive mt-1">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {t.membership.contactInfo}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">{t.contact.email} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t.contact.phone}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {t.membership.addressSection}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">{t.membership.streetAddress}</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">{t.membership.city}</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">{t.membership.country}</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">{t.membership.postalCode}</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> {t.membership.organization}
                    </h3>
                    <div>
                      <Label htmlFor="organization">{t.membership.companyOrg}</Label>
                      <Input
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder={t.membership.ifApplicable}
                      />
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">
                      {t.membership.interests}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            formData.interests.includes(interest)
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* How Heard */}
                  <div>
                    <Label htmlFor="howHeard">{t.membership.howHeard}</Label>
                    <select
                      id="howHeard"
                      name="howHeard"
                      value={formData.howHeard}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-foreground"
                    >
                      <option value="">{t.membership.selectOption}</option>
                      <option value="social-media">{t.membership.howHeardOptions.socialMedia}</option>
                      <option value="search-engine">{t.membership.howHeardOptions.searchEngine}</option>
                      <option value="friend">{t.membership.howHeardOptions.friend}</option>
                      <option value="event">{t.membership.howHeardOptions.event}</option>
                      <option value="news">{t.membership.howHeardOptions.news}</option>
                      <option value="other">{t.membership.howHeardOptions.other}</option>
                    </select>
                  </div>

                  {/* Newsletter */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="h-4 w-4 mt-1 rounded"
                    />
                    <Label htmlFor="newsletter" className="font-normal text-sm text-muted-foreground">
                      {t.membership.newsletterOpt}
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    variant="warm" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t.membership.submitting}
                      </>
                    ) : (
                      <>
                        {t.membership.submitBtn}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Membership;
