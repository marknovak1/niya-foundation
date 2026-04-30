import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Building2, Eye, CheckCircle, XCircle, MessageSquare, MapPin, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getCategoryLabel } from "@/lib/businessCategories";

interface BusinessListing {
  id: string;
  name: string;
  description: string | null;
  category: string;
  location: string | null;
  price: string | null;
  image_url: string | null;
  is_published: boolean;
  status: string;
  rejection_reason: string | null;
  views_count: number;
  seller_user_id: string;
  created_at: string;
  updated_at: string;
}

interface Inquiry {
  id: string;
  listing_id: string;
  buyer_user_id: string;
  message: string | null;
  status: string;
  created_at: string;
  listing?: { name: string };
}

interface BusinessListingsManagementProps {
  listings: BusinessListing[];
  loading: boolean;
  onRefresh: () => void;
}

export function BusinessListingsManagement({ listings, loading, onRefresh }: BusinessListingsManagementProps) {
  const [selectedListing, setSelectedListing] = useState<BusinessListing | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [listingToReject, setListingToReject] = useState<BusinessListing | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    const { data } = await supabase
      .from("listing_inquiries")
      .select("*, listing:business_listings(name)")
      .order("created_at", { ascending: false });
    if (data) setInquiries(data as any);
    setInquiriesLoading(false);
  };

  const approveListing = async (listing: BusinessListing) => {
    setSaving(listing.id);
    const { error } = await supabase
      .from("business_listings")
      .update({ status: "approved", is_published: true, rejection_reason: null })
      .eq("id", listing.id);

    if (error) {
      toast.error("Erreur lors de l'approbation.");
    } else {
      toast.success(`« ${listing.name} » approuvée et publiée.`);
      onRefresh();
    }
    setSaving(null);
  };

  const openRejectDialog = (listing: BusinessListing) => {
    setListingToReject(listing);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const rejectListing = async () => {
    if (!listingToReject) return;
    setSaving(listingToReject.id);
    const { error } = await supabase
      .from("business_listings")
      .update({
        status: "rejected",
        is_published: false,
        rejection_reason: rejectReason.trim() || null,
      })
      .eq("id", listingToReject.id);

    if (error) {
      toast.error("Erreur lors du rejet.");
    } else {
      toast.success(`« ${listingToReject.name} » rejetée.`);
      onRefresh();
    }
    setSaving(null);
    setRejectDialogOpen(false);
    setListingToReject(null);
  };

  const deleteListing = async (listing: BusinessListing) => {
    if (!confirm(`Supprimer définitivement « ${listing.name} » ?`)) return;
    const { error } = await supabase.from("business_listings").delete().eq("id", listing.id);
    if (error) toast.error("Erreur lors de la suppression.");
    else { toast.success("Annonce supprimée."); onRefresh(); }
  };

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    const { error } = await supabase
      .from("listing_inquiries")
      .update({ status })
      .eq("id", inquiryId);
    if (error) toast.error("Erreur de mise à jour.");
    else { toast.success("Statut mis à jour."); fetchInquiries(); }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-CA", { year: "numeric", month: "short", day: "numeric" });

  const statusBadge = (status: string) => {
    if (status === "approved") return <Badge className="bg-green-100 text-green-800 border-green-200">Approuvée</Badge>;
    if (status === "rejected") return <Badge variant="destructive">Rejetée</Badge>;
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
  };

  const pending = listings.filter((l) => l.status === "pending");
  const approved = listings.filter((l) => l.status === "approved");
  const rejected = listings.filter((l) => l.status === "rejected");

  const ListingTable = ({ items, showApprove = false }: { items: BusinessListing[]; showApprove?: boolean }) => (
    items.length === 0 ? (
      <div className="text-center py-10 text-muted-foreground">Aucune annonce dans cette catégorie.</div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entreprise</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">{listing.name}</TableCell>
              <TableCell>{getCategoryLabel(listing.category, "fr")}</TableCell>
              <TableCell>{listing.location || "—"}</TableCell>
              <TableCell>{listing.price || "—"}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{formatDate(listing.created_at)}</TableCell>
              <TableCell>
                {statusBadge(listing.status)}
                {listing.rejection_reason && (
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-[180px] truncate" title={listing.rejection_reason}>
                    {listing.rejection_reason}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setSelectedListing(listing); setPreviewOpen(true); }}
                    title="Aperçu"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {showApprove && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => approveListing(listing)}
                        disabled={saving === listing.id}
                        title="Approuver"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        {saving === listing.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openRejectDialog(listing)}
                        disabled={saving === listing.id}
                        title="Rejeter"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {listing.status === "approved" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openRejectDialog(listing)}
                      disabled={saving === listing.id}
                      title="Dépublier / Rejeter"
                      className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {listing.status === "rejected" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => approveListing(listing)}
                      disabled={saving === listing.id}
                      title="Ré-approuver"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      {saving === listing.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteListing(listing)}
                    title="Supprimer"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Annonces — Entreprises à vendre
          </CardTitle>
          <CardDescription>
            Gérez les annonces soumises par les membres. Les nouvelles annonces et les modifications nécessitent une approbation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="pending" className="relative">
                  En attente
                  {pending.length > 0 && (
                    <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                      {pending.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approuvées
                  <span className="ml-2 text-xs text-muted-foreground">({approved.length})</span>
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejetées
                  <span className="ml-2 text-xs text-muted-foreground">({rejected.length})</span>
                </TabsTrigger>
                <TabsTrigger value="inquiries">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Demandes
                  {inquiries.filter((i) => i.status === "new").length > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                      {inquiries.filter((i) => i.status === "new").length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <ListingTable items={pending} showApprove />
              </TabsContent>

              <TabsContent value="approved">
                <ListingTable items={approved} />
              </TabsContent>

              <TabsContent value="rejected">
                <ListingTable items={rejected} />
              </TabsContent>

              <TabsContent value="inquiries">
                {inquiriesLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">Aucune demande d'acheteurs pour l'instant.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Annonce</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inq) => (
                        <TableRow key={inq.id}>
                          <TableCell className="font-medium">{(inq as any).listing?.name || "—"}</TableCell>
                          <TableCell className="max-w-[220px] text-sm text-muted-foreground truncate" title={inq.message || ""}>
                            {inq.message || <em>Sans message</em>}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(inq.created_at)}</TableCell>
                          <TableCell>
                            {inq.status === "new" && <Badge className="bg-blue-100 text-blue-800 border-blue-200">Nouvelle</Badge>}
                            {inq.status === "contacted" && <Badge variant="outline">Contacté</Badge>}
                            {inq.status === "closed" && <Badge variant="secondary">Fermée</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                            <select
                              className="text-sm border rounded px-2 py-1 bg-background"
                              value={inq.status}
                              onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                            >
                              <option value="new">Nouvelle</option>
                              <option value="contacted">Contacté</option>
                              <option value="closed">Fermée</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu de l'annonce</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              {selectedListing.image_url && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={selectedListing.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-primary">{selectedListing.name}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-2.5 py-1">
                    <Tag className="h-3 w-3" />
                    {getCategoryLabel(selectedListing.category, "fr")}
                  </span>
                  {selectedListing.location && (
                    <span className="inline-flex items-center gap-1 text-xs border rounded-full px-2.5 py-1">
                      <MapPin className="h-3 w-3" />
                      {selectedListing.location}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Prix demandé</p>
                <p className="text-xl font-bold">{selectedListing.price || "Prix sur demande"}</p>
              </div>
              {selectedListing.description && (
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Description</p>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedListing.description}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                {statusBadge(selectedListing.status)}
                <span className="text-xs text-muted-foreground">
                  {selectedListing.views_count} vue{selectedListing.views_count !== 1 ? "s" : ""}
                </span>
              </div>
              {selectedListing.rejection_reason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-medium text-red-700 mb-0.5">Raison du rejet</p>
                  <p className="text-sm text-red-600">{selectedListing.rejection_reason}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {selectedListing.status !== "approved" && (
                  <Button
                    className="flex-1"
                    onClick={() => { approveListing(selectedListing); setPreviewOpen(false); }}
                    disabled={saving === selectedListing.id}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver et publier
                  </Button>
                )}
                {selectedListing.status !== "rejected" && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => { setPreviewOpen(false); openRejectDialog(selectedListing); }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeter l'annonce</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              L'annonce <strong>« {listingToReject?.name} »</strong> sera dépubliée et marquée comme rejetée.
            </p>
            <div className="space-y-2">
              <Label htmlFor="rejectReason">Raison du rejet (optionnel)</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Informations incomplètes, description trop vague, prix manquant..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Ce message sera visible par le vendeur.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={rejectListing}
                disabled={saving === listingToReject?.id}
                className="flex-1"
              >
                {saving === listingToReject?.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
