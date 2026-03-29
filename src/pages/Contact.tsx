import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitFormWithRateLimit } from "@/hooks/useRateLimitedSubmit";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n";

const Contact = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const contactSchema = z.object({
    name: z.string().min(2, t.contact.name + " must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    subject: z.string().min(3, t.contact.subject + " must be at least 3 characters"),
    inquiryType: z.string().min(1, "Please select an inquiry type"),
    message: z.string().min(10, t.contact.message + " must be at least 10 characters"),
    newsletter: z.boolean().optional(),
    consent: z.boolean().refine(val => val === true, "You must agree to the privacy policy"),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      newsletter: false,
      consent: false,
    },
  });

  const contactInfo = [
    {
      icon: Mail,
      label: t.contact.email,
      value: "info@niyafondation.com",
      href: "mailto:info@niyafondation.com",
    },
    {
      icon: Phone,
      label: t.contact.phone,
      value: "+1 (234) 567-890",
      href: "tel:+1234567890",
    },
    {
      icon: MapPin,
      label: t.contact.address,
      value: "123 Foundation Street, City, Country",
      href: null,
    },
    {
      icon: Clock,
      label: t.contact.hours,
      value: t.contact.hoursValue,
      href: null,
    },
  ];

  const inquiryTypes = [
    { value: "", label: t.contact.inquiryTypes.select },
    { value: "general", label: t.contact.inquiryTypes.general },
    { value: "donation", label: t.contact.inquiryTypes.donation },
    { value: "volunteer", label: t.contact.inquiryTypes.volunteer },
    { value: "partnership", label: t.contact.inquiryTypes.partnership },
    { value: "media", label: t.contact.inquiryTypes.media },
    { value: "programs", label: t.contact.inquiryTypes.programs },
    { value: "other", label: t.contact.inquiryTypes.other },
  ];

  const onSubmit = async (data: ContactFormData) => {
    const result = await submitFormWithRateLimit('contact', {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      inquiry_type: data.inquiryType,
      subject: data.subject,
      message: data.message,
      newsletter_optin: data.newsletter || false,
    }, data.email);

    if (result.success) {
      setIsSubmitted(true);
      reset();
      toast({
        title: t.contact.success.title,
        description: t.contact.success.description,
      });
    } else if (result.isRateLimited) {
      toast({
        title: t.contact.rateLimited?.title || "Too many requests",
        description: t.contact.rateLimited?.description || "Please wait before submitting again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: t.contact.error.title,
        description: t.contact.error.description,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-primary-foreground/90 uppercase tracking-wider mb-4">
              {t.contact.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
              {t.contact.title}
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              {t.contact.description}
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

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="p-8 rounded-2xl bg-card border border-border shadow-soft">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                {t.contact.formTitle}
              </h2>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t.contact.messageSent}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t.contact.messageSentDesc}
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    {t.contact.sendAnother}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t.contact.name} *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="John Doe"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">{t.contact.email} *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="john@example.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">{t.contact.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="+1 (234) 567-890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquiryType">{t.contact.inquiryType} *</Label>
                      <select
                        id="inquiryType"
                        {...register("inquiryType")}
                        className={`w-full h-10 px-3 rounded-md border bg-background text-foreground ${
                          errors.inquiryType ? "border-destructive" : "border-input"
                        }`}
                      >
                        {inquiryTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.inquiryType && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.inquiryType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">{t.contact.subject} *</Label>
                    <Input
                      id="subject"
                      {...register("subject")}
                      placeholder="How can we help?"
                      className={errors.subject ? "border-destructive" : ""}
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">{t.contact.message} *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Newsletter Opt-in */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      {...register("newsletter")}
                      className="h-4 w-4 mt-1 rounded"
                    />
                    <Label htmlFor="newsletter" className="font-normal text-sm text-muted-foreground">
                      {t.contact.newsletter}
                    </Label>
                  </div>

                  {/* Privacy Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      {...register("consent")}
                      className={`h-4 w-4 mt-1 rounded ${errors.consent ? "border-destructive" : ""}`}
                    />
                    <div>
                      <Label htmlFor="consent" className="font-normal text-sm text-muted-foreground">
                        {t.contact.privacy.split(t.contact.privacyLink)[0]}
                        <a href="/privacy" className="text-secondary hover:underline">
                          {t.contact.privacyLink}
                        </a>
                        {t.contact.privacy.split(t.contact.privacyLink)[1]} *
                      </Label>
                      {errors.consent && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.consent.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="warm" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.contact.submitting : t.contact.submit}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                {t.contact.infoTitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t.contact.infoDesc}
              </p>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-foreground font-medium hover:text-secondary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Teaser */}
              <div className="mt-12 p-6 rounded-xl bg-muted/50">
                <h3 className="font-semibold text-foreground mb-2">{t.contact.faqTitle}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.contact.faqDesc}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/faq">{t.contact.viewFaq}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
