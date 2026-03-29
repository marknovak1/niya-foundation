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
import { Loader2, Plus, Pencil, Trash2, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

interface TrainingDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_type: string | null;
  file_size_bytes: number | null;
  is_published: boolean;
  created_at: string;
}

interface TrainingDocumentsManagementProps {
  documents: TrainingDocument[];
  loading: boolean;
  onRefresh: () => void;
}

const categories = ["general", "leadership", "entrepreneurship", "finance", "marketing", "legal", "technology"];

export function TrainingDocumentsManagement({ documents, loading, onRefresh }: TrainingDocumentsManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TrainingDocument | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
    file_url: "",
    file_type: "pdf",
    is_published: false,
  });

  const resetForm = () => {
    setForm({ title: "", description: "", category: "general", file_url: "", file_type: "pdf", is_published: false });
    setEditing(null);
  };

  const openEdit = (doc: TrainingDocument) => {
    setEditing(doc);
    setForm({
      title: doc.title,
      description: doc.description || "",
      category: doc.category,
      file_url: doc.file_url,
      file_type: doc.file_type || "pdf",
      is_published: doc.is_published,
    });
    setDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage.from("training-documents").upload(filePath, file);

    if (error) {
      toast.error("Failed to upload file");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("training-documents").getPublicUrl(filePath);
    setForm({ ...form, file_url: urlData.publicUrl, file_type: fileExt || "pdf" });
    setUploading(false);
    toast.success("File uploaded successfully");
  };

  const saveDocument = async () => {
    setSaving(true);
    const docData = {
      title: form.title,
      description: form.description || null,
      category: form.category,
      file_url: form.file_url,
      file_type: form.file_type,
      is_published: form.is_published,
    };

    if (editing) {
      const { error } = await supabase.from("training_documents").update(docData as any).eq("id", editing.id);
      if (error) toast.error("Failed to update document");
      else toast.success("Document updated");
    } else {
      const { error } = await supabase.from("training_documents").insert(docData as any);
      if (error) toast.error("Failed to create document");
      else toast.success("Document created");
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    onRefresh();
  };

  const deleteDocument = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    const { error } = await supabase.from("training_documents").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Document deleted");
      onRefresh();
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Training Documents
          </CardTitle>
          <CardDescription>Manage training materials for members</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Document</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Document" : "Add Document"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Upload File</Label>
                <div className="flex gap-2">
                  <Input type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" disabled={uploading} />
                  {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
                </div>
                {form.file_url && (
                  <p className="text-xs text-muted-foreground truncate">File: {form.file_url}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Or paste file URL</Label>
                <Input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={(c) => setForm({ ...form, is_published: c })} />
                <Label>Published</Label>
              </div>
              <Button onClick={saveDocument} className="w-full" disabled={!form.title || !form.file_url || saving}>
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
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No training documents yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell className="capitalize">{doc.category}</TableCell>
                  <TableCell className="uppercase text-xs">{doc.file_type}</TableCell>
                  <TableCell>
                    <Badge variant={doc.is_published ? "default" : "outline"}>
                      {doc.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(doc.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(doc)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteDocument(doc.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
