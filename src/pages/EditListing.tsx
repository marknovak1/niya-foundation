import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X, Building2 } from "lucide-react";
import { toast } from "sonner";
import { businessCategories } from "@/lib/businessCategories";
import { useTranslation } from "@/i18n";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [priceNegotiable, setPriceNegotiable] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (!user || !id) return;
    fetchListing();
  }, [user, id]);

  const fetchListing = async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from("business_listings")
      .select("*")
      .eq("id", id)
      .eq("seller_user_id", user!.id)
      .single();

    if (error || !data) {
      toast.error("Annonce introuvable.");
      navigate("/member/listings");
      return;
    }

    setForm({
      name: data.name,
      category: data.category,
      location: data.location || "",
      price: data.price_negotiable ? "" : (data.price || ""),
      description: data.description || "",
    });
    setPriceNegotiable(data.price_negotiable || false);
    setExistingImageUrl(data.image_url);
    setDataLoading(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining);

    const oversized = toAdd.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error("Certaines photos dépassent la limite de 10 Mo.");
      return;
    }

    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...toAdd]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.name || !form.category || !form.location || !form.description) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!priceNegotiable && !form.price) {
      toast.error("Veuillez entrer un prix ou cocher 'À discuter'.");
      return;
    }

    setIsLoading(true);

    try {
      // Upload new photos if any
      let imageUrl = existingImageUrl;
      if (photos.length > 0) {
        const photo = photos[0];
        const ext = photo.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // Update listing — goes back to pending for re-approval
      const { error } = await supabase
        .from("business_listings")
        .update({
          name: form.name,
          category: form.category,
          location: form.location,
          price: priceNegotiable ? "À discuter" : form.price,
          price_negotiable: priceNegotiable,
          description: form.description,
          image_url: imageUrl,
          status: "pending",
          is_published: false,
        })
        .eq("id", id)
        .eq("seller_user_id", user.id);

      if (error) throw error;

      toast.success("Annonce mise à jour ! Elle sera vérifiée avant republication.");
      navigate("/member/listings");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
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
        <div className="container-wide max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Modifier l'annonce</CardTitle>
                  <CardDescription>
                    Toute modification soumettra l'annonce à une nouvelle vérification avant republication.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nom de votre entreprise"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Catégorie *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {language === "fr" ? cat.fr : cat.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation *</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Ville, Province"
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <Label>Prix demandé *</Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={priceNegotiable}
                      onCheckedChange={setPriceNegotiable}
                      id="negotiable"
                    />
                    <Label htmlFor="negotiable" className="cursor-pointer font-normal">
                      Prix à discuter
                    </Label>
                  </div>
                  {!priceNegotiable && (
                    <Input
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="Ex: 150 000 $"
                    />
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Décrivez votre entreprise, son historique, ses atouts, la raison de la vente..."
                    rows={6}
                    required
                  />
                </div>

                {/* Photos */}
                <div className="space-y-3">
                  <Label>Photos ({photos.length}/{MAX_PHOTOS})</Label>

                  {/* Existing image */}
                  {existingImageUrl && photos.length === 0 && (
                    <div className="relative w-32 aspect-square rounded-lg overflow-hidden border">
                      <img src={existingImageUrl} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setExistingImageUrl(null)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    {photoPreviews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {photos.length < MAX_PHOTOS && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Ajouter</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Max {MAX_PHOTOS} photos · 10 Mo par photo</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/member/listings")} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer les modifications
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default EditListing;
