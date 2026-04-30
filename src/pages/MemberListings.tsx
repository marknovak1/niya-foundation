import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Eye, MessageSquare, Pencil, Trash2, Building2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getCategoryLabel } from "@/lib/businessCategories";
import { useTranslation } from "@/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Listing {
  id: string;
  name: string;
  category: string;
  location: string;
  price: string | null;
  status: string;
  is_published: boolean;
  views_count: number;
  created_at: string;
  image_url: string | null;
  inquiry_count?: number;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente d'approbation", variant: "secondary" },
  approved: { label: "Publiée", variant: "default" },
  rejected: { label: "Refusée", variant: "destructive" },
};

const MemberListings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [listings, setListings] = useState<Listing[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/member/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchListings();
  }, [user]);

  const fetchListings = async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from("business_listings")
      .select("*")
      .eq("seller_user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur lors du chargement des annonces.");
    } else {
      // Fetch inquiry counts
      const listingsWithCounts = await Promise.all(
        (data || []).map(async (listing) => {
          const { count } = await supabase
            .from("listing_inquiries")
            .select("*", { count: "exact", head: true })
            .eq("listing_id", listing.id);
          return { ...listing, inquiry_count: count || 0 };
        })
      );
      setListings(listingsWithCounts);
    }
    setDataLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("business_listings")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression.");
    } else {
      toast.success("Annonce supprimée.");
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  if (dataLoading) {
    return (
      <Layout>
        <section className="pt-28 pb-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 pt-28 pb-16 px-4">
        <div className="container-wide max-w-4xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/member" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
                <ArrowLeft className="h-3 w-3" /> Tableau de bord
              </Link>
              <h1 className="text-2xl font-bold text-primary">Mes annonces</h1>
              <p className="text-muted-foreground">Gérez vos entreprises à vendre</p>
            </div>
            <Button onClick={() => navigate("/member/listings/new")} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle annonce
            </Button>
          </div>

          {listings.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune annonce pour l'instant</h3>
                <p className="text-muted-foreground mb-6">Publiez votre première annonce pour vendre votre entreprise.</p>
                <Button onClick={() => navigate("/member/listings/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une annonce
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {listing.image_url ? (
                          <img src={listing.image_url} alt={listing.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-primary truncate">{listing.name}</h3>
                          <Badge variant={statusConfig[listing.status]?.variant || "secondary"}>
                            {statusConfig[listing.status]?.label || listing.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getCategoryLabel(listing.category, language)} · {listing.location}
                        </p>
                        <p className="text-sm font-medium mt-1">{listing.price || "Prix non défini"}</p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" /> {listing.views_count} vues
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" /> {listing.inquiry_count} intérêt(s)
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/member/listings/edit/${listing.id}`)}
                          className="flex items-center gap-1"
                        >
                          <Pencil className="h-3 w-3" /> Modifier
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex items-center gap-1 text-destructive hover:text-destructive">
                              <Trash2 className="h-3 w-3" /> Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. L'annonce sera définitivement supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(listing.id)} className="bg-destructive hover:bg-destructive/90">
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MemberListings;
