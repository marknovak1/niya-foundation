import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, ExternalLink, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventRegistrationSchema, type EventRegistrationFormData } from "@/lib/eventValidation";

interface Event {
  id: string;
  title: string;
  title_fr: string | null;
  description: string | null;
  description_fr: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  location_url: string | null;
  image_url: string | null;
  is_campaign: boolean;
  registration_url: string | null;
  max_attendees: number | null;
}

const Events = () => {
  const { t, language } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventRegistrationFormData>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const dateLocale = language === 'fr' ? fr : enUS;

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });

      if (!error && data) {
        setEvents(data as Event[]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const getLocalizedText = (en: string | null, fr: string | null) => {
    if (language === 'fr' && fr) return fr;
    return en || '';
  };

  const onSubmitRegistration = async (data: EventRegistrationFormData) => {
    if (!selectedEvent) return;

    setSubmitting(true);
    const { error } = await supabase.from("event_registrations").insert({
      event_id: selectedEvent.id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      notes: data.notes?.trim() || null,
    });

    if (error) {
      toast.error(language === 'fr' ? "Erreur lors de l'inscription" : "Registration failed");
    } else {
      toast.success(language === 'fr' ? "Inscription réussie!" : "Registration successful!");
      setRegistrationOpen(false);
      reset();
    }
    setSubmitting(false);
  };

  const upcomingEvents = events.filter(e => !e.is_campaign);
  const campaigns = events.filter(e => e.is_campaign);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'fr' ? 'Événements & Campagnes' : 'Events & Campaigns'}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {language === 'fr'
                ? 'Rejoignez-nous lors de nos prochains événements et soutenez nos campagnes'
                : 'Join us at our upcoming events and support our campaigns'}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">
                    {language === 'fr' ? 'Événements à venir' : 'Upcoming Events'}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {event.image_url && (
                          <img src={event.image_url} alt={getLocalizedText(event.title, event.title_fr)} className="w-full h-48 object-cover" />
                        )}
                        <CardHeader>
                          <CardTitle>{getLocalizedText(event.title, event.title_fr)}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(event.event_date), "PPP", { locale: dateLocale })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 line-clamp-3">
                            {getLocalizedText(event.description, event.description_fr)}
                          </p>
                          {event.location && (
                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          {event.registration_url ? (
                            <Button asChild className="flex-1">
                              <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                                {language === 'fr' ? "S'inscrire" : 'Register'}
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </a>
                            </Button>
                          ) : (
                            <Dialog open={registrationOpen && selectedEvent?.id === event.id} onOpenChange={(open) => {
                              setRegistrationOpen(open);
                              if (open) {
                                setSelectedEvent(event);
                                reset();
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button className="flex-1">
                                  {language === 'fr' ? "S'inscrire" : 'Register'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{language === 'fr' ? 'Inscription' : 'Registration'}</DialogTitle>
                                  <DialogDescription>
                                    {getLocalizedText(event.title, event.title_fr)}
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit(onSubmitRegistration)} className="space-y-4">
                                  <div>
                                    <Label htmlFor="name">{language === 'fr' ? 'Nom complet' : 'Full Name'} *</Label>
                                    <Input
                                      id="name"
                                      {...register("name")}
                                    />
                                    {errors.name && (
                                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                                    )}
                                  </div>
                                  <div>
                                    <Label htmlFor="email">{language === 'fr' ? 'Courriel' : 'Email'} *</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      {...register("email")}
                                    />
                                    {errors.email && (
                                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                                    )}
                                  </div>
                                  <div>
                                    <Label htmlFor="phone">{language === 'fr' ? 'Téléphone' : 'Phone'}</Label>
                                    <Input
                                      id="phone"
                                      {...register("phone")}
                                    />
                                    {errors.phone && (
                                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                                    )}
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">{language === 'fr' ? 'Notes' : 'Notes'}</Label>
                                    <Textarea
                                      id="notes"
                                      {...register("notes")}
                                    />
                                    {errors.notes && (
                                      <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>
                                    )}
                                  </div>
                                  <Button type="submit" className="w-full" disabled={submitting}>
                                    {submitting 
                                      ? (language === 'fr' ? 'Envoi...' : 'Submitting...') 
                                      : (language === 'fr' ? 'Confirmer' : 'Confirm')}
                                  </Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Campaigns */}
              {campaigns.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {language === 'fr' ? 'Campagnes en cours' : 'Active Campaigns'}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {campaigns.map((campaign) => (
                      <Card key={campaign.id} className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
                        {campaign.image_url && (
                          <img src={campaign.image_url} alt={getLocalizedText(campaign.title, campaign.title_fr)} className="w-full h-56 object-cover" />
                        )}
                        <CardHeader>
                          <CardTitle className="text-primary">
                            {getLocalizedText(campaign.title, campaign.title_fr)}
                          </CardTitle>
                          {campaign.end_date && (
                            <CardDescription className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {language === 'fr' ? 'Jusqu\'au' : 'Until'} {format(new Date(campaign.end_date), "PPP", { locale: dateLocale })}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            {getLocalizedText(campaign.description, campaign.description_fr)}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full">
                            <a href="/donate">
                              {language === 'fr' ? 'Contribuer' : 'Contribute'}
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-600">
                    {language === 'fr' ? 'Aucun événement à venir' : 'No upcoming events'}
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {language === 'fr'
                      ? 'Revenez bientôt pour découvrir nos prochains événements'
                      : 'Check back soon for upcoming events'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
