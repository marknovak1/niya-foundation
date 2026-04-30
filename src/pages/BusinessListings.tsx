import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Building2, MapPin, Tag, Eye, Plus } from "lucide-react";
import { businessCategories, getCategoryLabel } from "@/lib/businessCategories";
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

const BusinessListings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (!loading && !user) navigate("/member/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchListings();
  }, [user]);

  useEffect(() => {
    let result = listings;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((l) => l.category === categoryFilter);
    }
    setFiltered(result);
  }, [search, categoryFilter, listings]);

  const fetchListings = async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from("business_listings")
      .select("*")
      .eq("status", "approved")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setListings(data);
      setFiltered(data);
    }
    setDataLoading(false);
  };

  const handleViewListing = (id: string) => {
    navigate(`/businesses/${id}`);
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

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 pt-28 pb-8 px-4">
        <div className="container-wide max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Entreprises à vendre</h1>
              <p className="text-muted-foreground">
                Parcourez les entreprises disponibles au sein de notre communauté.
              </p>
            </div>
            <Button onClick={() => navigate("/member/listings/new")} className="flex items-center gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Publier une annonce
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {businessCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {language === "fr" ? cat.fr : cat.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune annonce trouvée</h3>
              <p className="text-muted-foreground">Essayez d'autres critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <Card
                  key={listing.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => handleViewListing(listing.id)}
                >
                  <div className="aspect-video bg-muted overflow-hidden">
                    {listing.image_url ? (
                      <img
                        src={listing.image_url}
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-primary text-lg mb-1 truncate">{listing.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <Tag className="h-3 w-3" />
                        {getCategoryLabel(listing.category, language)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <MapPin className="h-3 w-3" />
                        {listing.location}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        {listing.price || "Prix sur demande"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" /> {listing.views_count}
                      </span>
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

export default BusinessListings;
