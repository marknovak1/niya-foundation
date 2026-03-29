import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, Lock } from "lucide-react";

interface TrainingDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_type: string | null;
  is_published: boolean;
  created_at: string;
}

const TrainingDocuments = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<TrainingDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/member/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchDocs = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("training_documents")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (data) setDocuments(data as any);
      setLoading(false);
    };
    if (user) fetchDocs();
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
          <p className="text-muted-foreground text-center">Connectez-vous pour accéder aux documents de formation.</p>
          <Button onClick={() => navigate("/member/login")}>Se connecter</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Documents de formation</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Accédez à nos ressources de formation pour développer vos compétences entrepreneuriales.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun document disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <Badge variant="secondary" className="capitalize text-xs">{doc.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase">{doc.file_type || "PDF"}</span>
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </a>
                    </Button>
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

export default TrainingDocuments;
