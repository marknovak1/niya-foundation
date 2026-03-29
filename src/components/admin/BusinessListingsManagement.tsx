import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";

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

interface BusinessListingsManagementProps {
  listings: BusinessListing[];
  loading: boolean;
  onRefresh: () => void;
}

const categories = ["retail", "food-service", "technology", "services", "manufacturing", "healthcare", "education", "other"];

export function BusinessListingsManagement({ listings, loading, onRefresh }: BusinessListingsManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BusinessListing | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", category: "other", location: "", price: "",
    contact_email: "", contact_phone: "", image_url: "", is_published: false,
  });

  const resetForm = () => {
    setForm({ name: "", description: "", category: "other", location: "", price: "", contact_email: "", contact_phone: "", image_url: "", is_published: false });
    setEditing(null);
  };

  const openEdit = (listing: BusinessListing) => {
    setEditing(listing);
    setForm({
      name: listing.name, description: listing.description || "", category: listing.category,
      location: listing.location || "", price: listing.price || "",
      contact_email: listing.contact_email || "", contact_phone: listing.contact_phone || "",
      image_url: listing.image_url || "", is_published: listing.is_published,
    });
    setDialogOpen(true);
  };

  const saveListing = async () => {
    setSaving(true);
    const data = {
      name: form.name, description: form.description || null, category: form.category,
      location: form.location || null, price: form.price || null,
      contact_email: form.contact_email || null, contact_phone: form.contact_phone || null,
      image_url: form.image_url || null, is_published: form.is_published,
    };

    if (editing) {
      const { error } = await supabase.from("business_listings").update(data as any).eq("id", editing.id);
      if (error) toast.error("Failed to update listing");
      else toast.success("Listing updated");
    } else {
      const { error } = await supabase.from("business_listings").insert(data as any);
      if (error) toast.error("Failed to create listing");
      else toast.success("Listing created");
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    onRefresh();
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    const { error } = await supabase.from("business_listings").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Listing deleted"); onRefresh(); }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Listings
          </CardTitle>
          <CardDescription>Manage businesses for sale</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Listing</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Listing" : "Add Listing"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Business Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat.replace("-", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. $50,000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={(c) => setForm({ ...form, is_published: c })} />
                <Label>Published</Label>
              </div>
              <Button onClick={saveListing} className="w-full" disabled={!form.name || saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No business listings yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>{listing.name}</TableCell>
                  <TableCell className="capitalize">{listing.category.replace("-", " ")}</TableCell>
                  <TableCell>{listing.location || "-"}</TableCell>
                  <TableCell>{listing.price || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={listing.is_published ? "default" : "outline"}>
                      {listing.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(listing)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteListing(listing.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
