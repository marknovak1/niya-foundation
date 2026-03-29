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
import { Loader2, Download, Plus, Pencil, Trash2, Newspaper, Languages } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useTranslation } from "@/i18n";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

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

interface NewsManagementProps {
  news: NewsArticle[];
  loading: boolean;
  onRefresh: () => void;
}

const newsColumns: { key: keyof NewsArticle; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
  { key: "is_published", label: "Published" },
  { key: "created_at", label: "Created" },
];

const categories = ["announcements", "programs", "events", "partnerships", "community"];

export function NewsManagement({ news, loading, onRefresh }: NewsManagementProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "announcements",
    author: "NIYA Foundation",
    image_url: "",
    is_featured: false,
    is_published: false,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "announcements",
      author: "NIYA Foundation",
      image_url: "",
      is_featured: false,
      is_published: false,
    });
    setEditing(null);
  };

  const openEdit = (article: NewsArticle) => {
    setEditing(article);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content || "",
      category: article.category,
      author: article.author,
      image_url: article.image_url || "",
      is_featured: article.is_featured,
      is_published: article.is_published,
    });
    setDialogOpen(true);
  };

  const translateContent = async () => {
    try {
      const response = await supabase.functions.invoke("translate-content", {
        body: {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content || undefined,
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

  const saveArticle = async () => {
    setSaving(true);
    
    // First translate the content
    toast.info("Translating content to all languages...");
    const translations = await translateContent();

    // Sanitize HTML content before saving to prevent XSS
    const sanitizedContent = form.content ? sanitizeHtml(form.content) : null;

    const articleData: Record<string, unknown> = {
      title: form.title,
      excerpt: form.excerpt,
      content: sanitizedContent,
      category: form.category,
      author: form.author,
      image_url: form.image_url || null,
      is_featured: form.is_featured,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    // Add translations if available
    if (translations) {
      articleData.title_fr = translations.fr?.title || null;
      articleData.title_es = translations.es?.title || null;
      articleData.title_ar = translations.ar?.title || null;
      articleData.title_ru = translations.ru?.title || null;
      articleData.title_zh = translations.zh?.title || null;
      articleData.excerpt_fr = translations.fr?.excerpt || null;
      articleData.excerpt_es = translations.es?.excerpt || null;
      articleData.excerpt_ar = translations.ar?.excerpt || null;
      articleData.excerpt_ru = translations.ru?.excerpt || null;
      articleData.excerpt_zh = translations.zh?.excerpt || null;
      articleData.content_fr = translations.fr?.content || null;
      articleData.content_es = translations.es?.content || null;
      articleData.content_ar = translations.ar?.content || null;
      articleData.content_ru = translations.ru?.content || null;
      articleData.content_zh = translations.zh?.content || null;
    }

    if (editing) {
      const { error } = await supabase.from("news_articles").update(articleData as any).eq("id", editing.id);
      if (error) toast.error("Failed to update article");
      else toast.success(translations ? "Article updated and translated!" : "Article updated (translation failed)");
    } else {
      const { error } = await supabase.from("news_articles").insert(articleData as any);
      if (error) toast.error("Failed to create article");
      else toast.success(translations ? "Article created and translated!" : "Article created (translation failed)");
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    onRefresh();
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("news_articles").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Article deleted");
      onRefresh();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            {t.admin.news.title}
          </CardTitle>
          <CardDescription>{t.admin.news.description}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToCSV(news, "news_articles", newsColumns)}>
            <Download className="h-4 w-4 mr-2" /> {t.admin.exportCSV}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> {t.admin.news.addArticle}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? t.admin.news.editArticle : t.admin.news.addArticle}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t.admin.news.titleLabel} *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">{t.admin.news.category}</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">{t.admin.news.author}</Label>
                    <Input
                      id="author"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">{t.admin.news.excerptEN} *</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">{t.admin.news.contentEN}</Label>
                  <RichTextEditor
                    content={form.content}
                    onChange={(content) => setForm({ ...form, content })}
                    placeholder={t.admin.news.contentPlaceholderEN}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">{t.admin.news.imageUrl}</Label>
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={form.is_featured}
                      onCheckedChange={(c) => setForm({ ...form, is_featured: c })}
                    />
                    <Label htmlFor="is_featured">{t.admin.news.isFeatured}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_published"
                      checked={form.is_published}
                      onCheckedChange={(c) => setForm({ ...form, is_published: c })}
                    />
                    <Label htmlFor="is_published">{t.admin.common.published}</Label>
                  </div>
                </div>

                <Button onClick={saveArticle} className="w-full" disabled={!form.title || !form.excerpt || saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <Languages className="h-4 w-4 mr-2" />
                      Translating...
                    </>
                  ) : (
                    editing ? t.admin.news.updateBtn : t.admin.news.createBtn
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t.admin.news.empty}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.news.titleLabel}</TableHead>
                <TableHead>{t.admin.news.category}</TableHead>
                <TableHead>{t.admin.news.author}</TableHead>
                <TableHead>{t.admin.contacts.status}</TableHead>
                <TableHead>{t.admin.contacts.date}</TableHead>
                <TableHead className="w-24">{t.admin.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {article.title}
                      {article.is_featured && (
                        <Badge variant="secondary" className="text-xs">{t.admin.common.featured}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{article.category}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>
                    <Badge variant={article.is_published ? "default" : "outline"}>
                      {article.is_published ? t.admin.common.published : t.admin.common.draft}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(article.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(article)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteArticle(article.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
