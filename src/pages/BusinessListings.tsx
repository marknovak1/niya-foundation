import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, MapPin, Lock } from "lucide-react";

interface BusinessListing {
  id: string;
  name: string;
  description: string | null;
  category: string;
  location: string | null;
  price: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
}

const BusinessListings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/member/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("business_listings")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (data) setListings(data as any);
      setLoading(false);
    };
    if (user) fetchListings();
  }, [user]);

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Accès réservé aux membres</h1>
          <p className="text-muted-foreground text-center">Connectez-vous pour voir les entreprises à vendre.</p>
          <Button onClick={() => navigate("/member/login")}>Se connecter</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Entreprises à vendre</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les opportunités d'acquisition d'entreprises disponibles pour nos membres.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune entreprise disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {listing.image_url && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img src={listing.image_url} alt={listing.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{listing.name}</CardTitle>
                    <Badge variant="secondary" className="capitalize text-xs shrink-0">
                      {listing.category.replace("-", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {listing.description && (
                    <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>
                  )}
                  <div className="space-y-2">
                    {listing.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {listing.location}
                      </div>
                    )}
                    {listing.price && (
                      <p className="text-lg font-bold text-primary">{listing.price}</p>
                    )}
                    {listing.contact_email && (
                      <Button size="sm" variant="outline" className="w-full mt-2" asChild>
                        <a href={`mailto:${listing.contact_email}`}>Contacter</a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessListings;
