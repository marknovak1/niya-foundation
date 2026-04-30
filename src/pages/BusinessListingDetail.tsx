import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Building2, MapPin, Tag, ArrowLeft, Heart, Eye, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getCategoryLabel } from "@/lib/businessCategories";
import { useTranslation } from "@/i18n";

interface Listing {
  id: string;
  name: string;
  category: string;
  location: string;
  price: string | null;
  description: string | null;
  image_url: string | null;
  views_count: number;
  created_at: string;
}

const BusinessListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [listing, setListing] = useState<Listing | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadyInterested, setAlreadyInterested] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/member/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    fetchListing();
    checkExistingInquiry();
    incrementViews();
  }, [user, id]);

  const fetchListing = async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from("business_listings")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .eq("is_published", true)
      .single();

    if (error || !data) {
      toast.error("Annonce introuvable.");
      navigate("/businesses");
    } else {
      setListing(data);
    }
    setDataLoading(false);
  };

  const checkExistingInquiry = async () => {
    const { data } = await supabase
      .from("listing_inquiries")
      .select("id")
      .eq("listing_id", id)
      .eq("buyer_user_id", user!.id)
      .single();
    if (data) setAlreadyInterested(true);
  };

  const incrementViews = async () => {
    await supabase
      .from("business_listings")
      .update({ views_count: supabase.rpc as any })
      .eq("id", id);

    // Simple increment via SQL
    await supabase.rpc("increment_listing_views" as any, { listing_id: id }).catch(() => {});
  };

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from("listing_inquiries").insert({
        listing_id: id,
        buyer_user_id: user.id,
        message: message.trim() || null,
        status: "new",
      });

      if (error) throw error;

      setSubmitted(true);
      setAlreadyInterested(true);
      toast.success("Votre intérêt a été transmis à notre équipe !");
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("Vous avez déjà manifesté votre intérêt pour cette annonce.");
        setAlreadyInterested(true);
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <Layout>
        <section className="pt-28 pb-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </section>
      </Layout>
    );
  }

  if (!listing) return null;

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 pt-28 pb-16 px-4">
        <div className="container-wide max-w-4xl mx-auto">

          <button
            onClick={() => navigate("/businesses")}
            className="flex items-center gap-1 text-sm text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-3 w-3" /> Retour aux annonces
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Image */}
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                {listing.image_url ? (
                  <img src={listing.image_url} alt={listing.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-2xl text-primary">{listing.name}</CardTitle>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Eye className="h-3 w-3" /> {listing.views_count} vues
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {getCategoryLabel(listing.category, language)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {listing.location}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* Price Card */}
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Prix demandé</p>
                  <p className="text-2xl font-bold text-primary">
                    {listing.price || "Prix sur demande"}
                  </p>
                </CardContent>
              </Card>

              {/* Interest Card */}
              <Card>
                <CardContent className="pt-6">
                  {submitted || alreadyInterested ? (
                    <div className="text-center py-4">
                      <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Intérêt enregistré</h3>
                      <p className="text-sm text-muted-foreground">
                        Notre équipe vous contactera pour la suite du processus.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInterest} className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Je suis intéressé(e)</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Manifestez votre intérêt et notre équipe vous mettra en contact avec le vendeur.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message (optionnel)</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Questions ou commentaires pour l'équipe..."
                          rows={3}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Envoyer ma demande
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Vos coordonnées restent confidentielles jusqu'à la mise en relation.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BusinessListingDetail;
