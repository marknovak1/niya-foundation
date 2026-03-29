import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, LogOut, Mail, Users, FileText, MessageSquare, Download, Award, Calendar, Plus, Pencil, Trash2, Newspaper, Shield, BookOpen, Building2 } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV, contactSubmissionsColumns, newsletterColumns, membershipColumns, surveyColumns, eventRegistrationColumns } from "@/lib/exportUtils";
import { Json } from "@/integrations/supabase/types";
import { NewsManagement } from "@/components/admin/NewsManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { TrainingDocumentsManagement } from "@/components/admin/TrainingDocumentsManagement";
import { BusinessListingsManagement } from "@/components/admin/BusinessListingsManagement";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useTranslation } from "@/i18n";

type DonorTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'supporter';
type ContactSegment = 'donor' | 'member' | 'partner' | 'volunteer' | 'subscriber' | 'other';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  status: string;
  newsletter_optin: boolean;
}

interface NewsletterSubscription {
  id: string;
  email: string;
  name: string | null;
  interests: string[];
  is_active: boolean;
  created_at: string;
  segment: string | null;
  subscriber_type: string | null;
}

interface MembershipRegistration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  membership_tier: string;
  status: string;
  created_at: string;
  organization: string | null;
  city: string | null;
  country: string | null;
  interests: string[] | null;
}

interface SurveyResponse {
  id: string;
  survey_type: string;
  respondent_name: string | null;
  respondent_email: string | null;
  responses: Json;
  created_at: string;
}

interface RecognizedDonor {
  id: string;
  name: string;
  tier: DonorTier;
  logo_url: string | null;
  website_url: string | null;
  is_partner: boolean;
  display_order: number;
  is_visible: boolean;
}

interface Event {
  id: string;
  title: string;
  title_fr: string | null;
  description: string | null;
  description_fr: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  is_campaign: boolean;
  is_published: boolean;
  registration_url: string | null;
}

interface EventRegistration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface NewsArticle {
  id: string;
  title: string;
  title_fr: string | null;
  excerpt: string;
  excerpt_fr: string | null;
  content: string | null;
  content_fr: string | null;
  category: string;
  author: string;
  image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscription[]>([]);
  const [memberships, setMemberships] = useState<MembershipRegistration[]>([]);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [donors, setDonors] = useState<RecognizedDonor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [trainingDocs, setTrainingDocs] = useState<any[]>([]);
  const [businessListings, setBusinessListings] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isModerator, setIsModerator] = useState<boolean>(false);

  // Donor form state
  const [donorDialogOpen, setDonorDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<RecognizedDonor | null>(null);
  const [donorForm, setDonorForm] = useState<{ name: string; tier: DonorTier; logo_url: string; website_url: string; is_partner: boolean; is_visible: boolean; display_order: number }>({ name: "", tier: "supporter", logo_url: "", website_url: "", is_partner: false, is_visible: true, display_order: 0 });

  // Event form state
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", description: "", event_date: "", end_date: "", location: "", is_campaign: false, is_published: false, registration_url: "" });

  // Selected event for registrations
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      
      const hasAdmin = data?.some(r => r.role === "admin");
      const hasModerator = data?.some(r => r.role === "moderator");
      
      setIsAdmin(hasAdmin || false);
      setIsModerator(hasModerator || false);
    };

    if (user) {
      checkUserRole();
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setDataLoading(true);
    const [contactsRes, newslettersRes, membershipsRes, surveysRes, donorsRes, eventsRes, registrationsRes, newsRes, trainingRes, listingsRes] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscriptions").select("*").order("created_at", { ascending: false }),
      supabase.from("membership_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("survey_responses").select("*").order("created_at", { ascending: false }),
      supabase.from("recognized_donors").select("*").order("display_order", { ascending: true }),
      supabase.from("events").select("*").order("event_date", { ascending: false }),
      supabase.from("event_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("news_articles").select("*").order("created_at", { ascending: false }),
      supabase.from("training_documents").select("*").order("created_at", { ascending: false }),
      supabase.from("business_listings").select("*").order("created_at", { ascending: false }),
    ]);

    if (contactsRes.data) setContacts(contactsRes.data);
    if (newslettersRes.data) setNewsletters(newslettersRes.data as NewsletterSubscription[]);
    if (membershipsRes.data) setMemberships(membershipsRes.data);
    if (surveysRes.data) setSurveys(surveysRes.data);
    if (donorsRes.data) setDonors(donorsRes.data as RecognizedDonor[]);
    if (eventsRes.data) setEvents(eventsRes.data as Event[]);
    if (registrationsRes.data) setEventRegistrations(registrationsRes.data as EventRegistration[]);
    if (newsRes.data) setNews(newsRes.data as NewsArticle[]);
    if (trainingRes.data) setTrainingDocs(trainingRes.data);
    if (listingsRes.data) setBusinessListings(listingsRes.data);
    setDataLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Donor management
  const saveDonor = async () => {
    if (editingDonor) {
      const { error } = await supabase.from("recognized_donors").update(donorForm).eq("id", editingDonor.id);
      if (error) toast.error("Failed to update donor");
      else toast.success("Donor updated");
    } else {
      const { error } = await supabase.from("recognized_donors").insert(donorForm);
      if (error) toast.error("Failed to add donor");
      else toast.success("Donor added");
    }
    setDonorDialogOpen(false);
    setEditingDonor(null);
    setDonorForm({ name: "", tier: "supporter", logo_url: "", website_url: "", is_partner: false, is_visible: true, display_order: 0 });
    fetchData();
  };

  const deleteDonor = async (id: string) => {
    if (!confirm("Delete this donor?")) return;
    const { error } = await supabase.from("recognized_donors").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Donor deleted");
      fetchData();
    }
  };

  // Event management
  const translateEventContent = async (title: string, description: string) => {
    try {
      const response = await supabase.functions.invoke("translate-content", {
        body: {
          title,
          excerpt: title, // Use title as excerpt for events
          content: description || undefined,
        },
      });

      if (response.error) {
        console.error("Translation error:", response.error);
        return null;
      }

      return response.data?.translations || null;
    } catch (error) {
      console.error("Translation failed:", error);
      return null;
    }
  };

  const saveEvent = async () => {
    setSavingEvent(true);
    
    // Translate content
    toast.info("Translating event to all languages...");
    const translations = await translateEventContent(eventForm.title, eventForm.description);

    const eventData: Record<string, unknown> = {
      title: eventForm.title,
      description: eventForm.description || null,
      event_date: eventForm.event_date,
      end_date: eventForm.end_date || null,
      location: eventForm.location || null,
      is_campaign: eventForm.is_campaign,
      is_published: eventForm.is_published,
      registration_url: eventForm.registration_url || null,
    };

    // Add translations if available
    if (translations) {
      eventData.title_fr = translations.fr?.title || null;
      eventData.title_es = translations.es?.title || null;
      eventData.title_ar = translations.ar?.title || null;
      eventData.title_ru = translations.ru?.title || null;
      eventData.title_zh = translations.zh?.title || null;
      eventData.description_fr = translations.fr?.content || null;
      eventData.description_es = translations.es?.content || null;
      eventData.description_ar = translations.ar?.content || null;
      eventData.description_ru = translations.ru?.content || null;
      eventData.description_zh = translations.zh?.content || null;
    }

    if (editingEvent) {
      const { error } = await supabase.from("events").update(eventData as any).eq("id", editingEvent.id);
      if (error) toast.error("Failed to update event");
      else toast.success(translations ? "Event updated and translated!" : "Event updated (translation failed)");
    } else {
      const { error } = await supabase.from("events").insert(eventData as any);
      if (error) toast.error("Failed to add event");
      else toast.success(translations ? "Event created and translated!" : "Event created (translation failed)");
    }
    setSavingEvent(false);
    setEventDialogOpen(false);
    setEditingEvent(null);
    setEventForm({ title: "", description: "", event_date: "", end_date: "", location: "", is_campaign: false, is_published: false, registration_url: "" });
    fetchData();
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event and all registrations?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Event deleted");
      fetchData();
    }
  };

  // Update segment
  const updateSegment = async (id: string, segment: ContactSegment) => {
    const { error } = await supabase.from("newsletter_subscriptions").update({ segment }).eq("id", id);
    if (error) toast.error("Failed to update segment");
    else {
      toast.success("Segment updated");
      setNewsletters(newsletters.map(n => n.id === id ? { ...n, segment } : n));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show access denied if not admin or moderator
  if (isAdmin === false && !isModerator) {
    const handleClaimAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/assign-admin-role`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        
        if (response.ok && result.isAdmin) {
          setIsAdmin(true);
          fetchData();
        } else {
          alert(result.error || "Could not assign admin role");
        }
      } catch {
        alert("Failed to claim admin role");
      }
    };

    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Logo size="md" />
            <CardTitle className="mt-4">{t.admin.accessRestricted}</CardTitle>
            <CardDescription>
              {t.admin.noAccess}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t.admin.noAccessHelp}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                {t.admin.goHome}
              </Button>
              <Button className="flex-1" onClick={handleClaimAdmin}>
                {t.admin.claimAdmin}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin === null && !isModerator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredRegistrations = selectedEventId 
    ? eventRegistrations.filter(r => r.event_id === selectedEventId)
    : eventRegistrations;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="text-lg font-semibold">{t.admin.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t.admin.signOut}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.admin.stats.messages}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.admin.stats.subscribers}</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsletters.filter(n => n.is_active).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.admin.stats.members}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberships.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.admin.stats.surveys}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{surveys.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.admin.stats.donors}</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.admin.stats.events}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t.admin.stats.news}</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{news.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="contacts">{t.admin.tabs.contacts}</TabsTrigger>
            <TabsTrigger value="newsletters">{t.admin.tabs.newsletters}</TabsTrigger>
            <TabsTrigger value="memberships">{t.admin.tabs.memberships}</TabsTrigger>
            <TabsTrigger value="surveys">{t.admin.tabs.surveys}</TabsTrigger>
            <TabsTrigger value="donors">{t.admin.tabs.donors}</TabsTrigger>
            <TabsTrigger value="events">{t.admin.tabs.events}</TabsTrigger>
            <TabsTrigger value="news">{t.admin.tabs.news}</TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Training
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              {t.admin.tabs.users}
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.admin.contacts.title}</CardTitle>
                  <CardDescription>{t.admin.contacts.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(contacts, "contact_submissions", contactSubmissionsColumns)}>
                  <Download className="h-4 w-4 mr-2" /> {t.admin.exportCSV}
                </Button>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : contacts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t.admin.contacts.empty}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.admin.contacts.date}</TableHead>
                        <TableHead>{t.admin.contacts.name}</TableHead>
                        <TableHead>{t.admin.contacts.email}</TableHead>
                        <TableHead>{t.admin.contacts.type}</TableHead>
                        <TableHead>{t.admin.contacts.subject}</TableHead>
                        <TableHead>{t.admin.contacts.status}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="whitespace-nowrap">{formatDate(contact.created_at)}</TableCell>
                          <TableCell>{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.inquiry_type}</TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell><Badge variant={contact.status === "new" ? "default" : "secondary"}>{contact.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Tab with Segmentation */}
          <TabsContent value="newsletters">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.admin.newsletters.title}</CardTitle>
                  <CardDescription>{t.admin.newsletters.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(newsletters, "newsletter_subscribers", newsletterColumns)}>
                  <Download className="h-4 w-4 mr-2" /> {t.admin.exportCSV}
                </Button>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : newsletters.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t.admin.newsletters.empty}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.admin.contacts.date}</TableHead>
                        <TableHead>{t.admin.contacts.email}</TableHead>
                        <TableHead>{t.admin.contacts.name}</TableHead>
                        <TableHead>{t.admin.newsletters.segment}</TableHead>
                        <TableHead>{t.admin.newsletters.interests}</TableHead>
                        <TableHead>{t.admin.contacts.status}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsletters.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="whitespace-nowrap">{formatDate(sub.created_at)}</TableCell>
                          <TableCell>{sub.email}</TableCell>
                          <TableCell>{sub.name || "-"}</TableCell>
                          <TableCell>
                            <Select value={sub.segment || "subscriber"} onValueChange={(value) => updateSegment(sub.id, value as ContactSegment)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="subscriber">{t.admin.segments.subscriber}</SelectItem>
                                <SelectItem value="donor">{t.admin.segments.donor}</SelectItem>
                                <SelectItem value="member">{t.admin.segments.member}</SelectItem>
                                <SelectItem value="partner">{t.admin.segments.partner}</SelectItem>
                                <SelectItem value="volunteer">{t.admin.segments.volunteer}</SelectItem>
                                <SelectItem value="other">{t.admin.segments.other}</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{sub.interests?.join(", ") || "-"}</TableCell>
                          <TableCell><Badge variant={sub.is_active ? "default" : "secondary"}>{sub.is_active ? t.admin.newsletters.active : t.admin.newsletters.unsubscribed}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memberships Tab */}
          <TabsContent value="memberships">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.admin.memberships.title}</CardTitle>
                  <CardDescription>{t.admin.memberships.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(memberships, "memberships", membershipColumns)}>
                  <Download className="h-4 w-4 mr-2" /> {t.admin.exportCSV}
                </Button>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : memberships.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t.admin.memberships.empty}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.admin.contacts.date}</TableHead>
                        <TableHead>{t.admin.contacts.name}</TableHead>
                        <TableHead>{t.admin.contacts.email}</TableHead>
                        <TableHead>{t.admin.memberships.tier}</TableHead>
                        <TableHead>{t.admin.contacts.status}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberships.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="whitespace-nowrap">{formatDate(member.created_at)}</TableCell>
                          <TableCell>{member.first_name} {member.last_name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell className="capitalize">{member.membership_tier}</TableCell>
                          <TableCell><Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Surveys Tab */}
          <TabsContent value="surveys">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.admin.surveys.title}</CardTitle>
                  <CardDescription>{t.admin.surveys.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(surveys, "survey_responses", surveyColumns)}>
                  <Download className="h-4 w-4 mr-2" /> {t.admin.exportCSV}
                </Button>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : surveys.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t.admin.surveys.empty}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.admin.contacts.date}</TableHead>
                        <TableHead>{t.admin.surveys.surveyType}</TableHead>
                        <TableHead>{t.admin.surveys.respondent}</TableHead>
                        <TableHead>{t.admin.contacts.email}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {surveys.map((survey) => (
                        <TableRow key={survey.id}>
                          <TableCell className="whitespace-nowrap">{formatDate(survey.created_at)}</TableCell>
                          <TableCell className="capitalize">{survey.survey_type.replace("-", " ")}</TableCell>
                          <TableCell>{survey.respondent_name || t.admin.common.anonymous}</TableCell>
                          <TableCell>{survey.respondent_email || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donors Tab */}
          <TabsContent value="donors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.admin.donors.title}</CardTitle>
                  <CardDescription>{t.admin.donors.description}</CardDescription>
                </div>
                <Dialog open={donorDialogOpen} onOpenChange={(open) => {
                  setDonorDialogOpen(open);
                  if (!open) {
                    setEditingDonor(null);
                    setDonorForm({ name: "", tier: "supporter", logo_url: "", website_url: "", is_partner: false, is_visible: true, display_order: 0 });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-2" /> {t.admin.donors.addDonor}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingDonor ? t.admin.donors.editDonor : t.admin.donors.addDonor}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>{t.admin.donors.name} *</Label>
                        <Input value={donorForm.name} onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })} />
                      </div>
                      <div>
                        <Label>{t.admin.donors.tier}</Label>
                        <Select value={donorForm.tier} onValueChange={(value) => setDonorForm({ ...donorForm, tier: value as DonorTier })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="platinum">{t.admin.donors.tiers.platinum}</SelectItem>
                            <SelectItem value="gold">{t.admin.donors.tiers.gold}</SelectItem>
                            <SelectItem value="silver">{t.admin.donors.tiers.silver}</SelectItem>
                            <SelectItem value="bronze">{t.admin.donors.tiers.bronze}</SelectItem>
                            <SelectItem value="supporter">{t.admin.donors.tiers.supporter}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t.admin.donors.logoUrl}</Label>
                        <Input value={donorForm.logo_url} onChange={(e) => setDonorForm({ ...donorForm, logo_url: e.target.value })} />
                      </div>
                      <div>
                        <Label>{t.admin.donors.websiteUrl}</Label>
                        <Input value={donorForm.website_url} onChange={(e) => setDonorForm({ ...donorForm, website_url: e.target.value })} />
                      </div>
                      <div>
                        <Label>{t.admin.donors.displayOrder}</Label>
                        <Input type="number" value={donorForm.display_order} onChange={(e) => setDonorForm({ ...donorForm, display_order: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={donorForm.is_partner} onCheckedChange={(checked) => setDonorForm({ ...donorForm, is_partner: checked })} />
                          <Label>{t.admin.donors.isPartner}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={donorForm.is_visible} onCheckedChange={(checked) => setDonorForm({ ...donorForm, is_visible: checked })} />
                          <Label>{t.admin.donors.isVisible}</Label>
                        </div>
                      </div>
                      <Button onClick={saveDonor} className="w-full">{t.admin.donors.save}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {donors.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t.admin.donors.empty}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.admin.donors.name}</TableHead>
                        <TableHead>{t.admin.donors.tier}</TableHead>
                        <TableHead>{t.admin.donors.type}</TableHead>
                        <TableHead>{t.admin.donors.isVisible}</TableHead>
                        <TableHead>{t.admin.common.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donors.map((donor) => (
                        <TableRow key={donor.id}>
                          <TableCell>{donor.name}</TableCell>
                          <TableCell>{t.admin.donors.tiers[donor.tier as keyof typeof t.admin.donors.tiers]}</TableCell>
                          <TableCell>{donor.is_partner ? t.admin.donors.types.partner : t.admin.donors.types.donor}</TableCell>
                          <TableCell><Badge variant={donor.is_visible ? "default" : "secondary"}>{donor.is_visible ? t.admin.common.yes : t.admin.common.no}</Badge></TableCell>
                          <TableCell className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditingDonor(donor);
                              setDonorForm({ name: donor.name, tier: donor.tier, logo_url: donor.logo_url || "", website_url: donor.website_url || "", is_partner: donor.is_partner, is_visible: donor.is_visible, display_order: donor.display_order });
                              setDonorDialogOpen(true);
                            }}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteDonor(donor.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t.admin.events.title}</CardTitle>
                    <CardDescription>{t.admin.events.description}</CardDescription>
                  </div>
                  <Dialog open={eventDialogOpen} onOpenChange={(open) => {
                    setEventDialogOpen(open);
                    if (!open) {
                      setEditingEvent(null);
                      setEventForm({ title: "", description: "", event_date: "", end_date: "", location: "", is_campaign: false, is_published: false, registration_url: "" });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="h-4 w-4 mr-2" /> {t.admin.events.addEvent}</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingEvent ? t.admin.events.editEvent : t.admin.events.addEvent}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>{t.admin.events.titleLabel} *</Label>
                          <Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
                        </div>
                        <div>
                          <Label>{t.admin.events.descriptionEN}</Label>
                          <RichTextEditor
                            content={eventForm.description}
                            onChange={(content) => setEventForm({ ...eventForm, description: content })}
                            placeholder="Event description..."
                          />
                        </div>
                        <div>
                          <Label>{t.admin.events.date} *</Label>
                          <Input type="datetime-local" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} />
                        </div>
                        <div>
                          <Label>{t.admin.events.endDate}</Label>
                          <Input type="datetime-local" value={eventForm.end_date} onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })} />
                        </div>
                        <div>
                          <Label>{t.admin.events.location}</Label>
                          <Input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
                        </div>
                        <div>
                          <Label>{t.admin.events.registrationUrl}</Label>
                          <Input value={eventForm.registration_url} onChange={(e) => setEventForm({ ...eventForm, registration_url: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={eventForm.is_campaign} onCheckedChange={(checked) => setEventForm({ ...eventForm, is_campaign: checked })} />
                            <Label>{t.admin.events.isCampaign}</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={eventForm.is_published} onCheckedChange={(checked) => setEventForm({ ...eventForm, is_published: checked })} />
                            <Label>{t.admin.events.isPublished}</Label>
                          </div>
                        </div>
                        <Button onClick={saveEvent} className="w-full" disabled={savingEvent || !eventForm.title || !eventForm.event_date}>
                          {savingEvent ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Translating...
                            </>
                          ) : (
                            t.admin.donors.save
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t.admin.events.empty}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.admin.events.titleLabel}</TableHead>
                          <TableHead>{t.admin.events.date}</TableHead>
                          <TableHead>{t.admin.donors.type}</TableHead>
                          <TableHead>{t.admin.events.isPublished}</TableHead>
                          <TableHead>{t.admin.events.registrations}</TableHead>
                          <TableHead>{t.admin.common.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>{event.title}</TableCell>
                            <TableCell className="whitespace-nowrap">{formatDate(event.event_date)}</TableCell>
                            <TableCell>{event.is_campaign ? t.admin.events.types.campaign : t.admin.events.types.event}</TableCell>
                            <TableCell><Badge variant={event.is_published ? "default" : "secondary"}>{event.is_published ? t.admin.common.yes : t.admin.common.no}</Badge></TableCell>
                            <TableCell>{eventRegistrations.filter(r => r.event_id === event.id).length}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setEditingEvent(event);
                                setEventForm({
                                  title: event.title,
                                  description: event.description || "",
                                  event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : "",
                                  end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
                                  location: event.location || "",
                                  is_campaign: event.is_campaign,
                                  is_published: event.is_published,
                                  registration_url: event.registration_url || "",
                                });
                                setEventDialogOpen(true);
                              }}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Event Registrations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t.admin.events.registrations}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedEventId || "all"} onValueChange={(value) => setSelectedEventId(value === "all" ? null : value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder={t.admin.events.filterByEvent} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t.admin.events.allEvents}</SelectItem>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(filteredRegistrations, "event_registrations", eventRegistrationColumns)}>
                      <Download className="h-4 w-4 mr-2" /> {t.admin.exportCSV}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredRegistrations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t.admin.events.noRegistrations}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.admin.contacts.date}</TableHead>
                          <TableHead>{t.admin.events.event}</TableHead>
                          <TableHead>{t.admin.contacts.name}</TableHead>
                          <TableHead>{t.admin.contacts.email}</TableHead>
                          <TableHead>{t.admin.contacts.status}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRegistrations.map((reg) => (
                          <TableRow key={reg.id}>
                            <TableCell className="whitespace-nowrap">{formatDate(reg.created_at)}</TableCell>
                            <TableCell>{events.find(e => e.id === reg.event_id)?.title || "-"}</TableCell>
                            <TableCell>{reg.name}</TableCell>
                            <TableCell>{reg.email}</TableCell>
                            <TableCell><Badge>{reg.status}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <NewsManagement news={news} loading={dataLoading} onRefresh={fetchData} />
          </TabsContent>

          {/* Training Documents Tab */}
          <TabsContent value="training">
            <TrainingDocumentsManagement documents={trainingDocs} loading={dataLoading} onRefresh={fetchData} />
          </TabsContent>

          {/* Business Listings Tab */}
          <TabsContent value="listings">
            <BusinessListingsManagement listings={businessListings} loading={dataLoading} onRefresh={fetchData} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagement isAdmin={isAdmin || false} isModerator={isModerator} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
