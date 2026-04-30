import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Layout } from "@/components/layout/Layout";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase puts the access token in the URL hash after clicking reset link
    const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));
    const accessToken = hashParams.get("access_token");
    const type = hashParams.get("type");
    const error = hashParams.get("error");

    if (error) {
      toast({
        title: "Lien expiré",
        description: "Ce lien de réinitialisation est invalide ou a expiré. Veuillez faire une nouvelle demande.",
        variant: "destructive",
      });
      navigate("/member/login");
      return;
    }

    if (accessToken && type === "recovery") {
      // Set the session from the token in the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get("refresh_token") || "",
      }).then(({ error }) => {
        if (error) {
          toast({
            title: "Lien expiré",
            description: "Ce lien de réinitialisation est invalide ou a expiré. Veuillez faire une nouvelle demande.",
            variant: "destructive",
          });
          navigate("/member/login");
        } else {
          setIsValidSession(true);
        }
        setChecking(false);
      });
    } else {
      setChecking(false);
      navigate("/member/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      });

      navigate("/member");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <Layout>
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 pt-28 pb-16 px-4">
          <div className="container-wide flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!isValidSession) return null;

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 pt-28 pb-16 px-4">
        <div className="container-wide">
          <div className="w-full max-w-md mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <Logo size="sm" className="mx-auto mb-2" />
                <CardTitle>Nouveau mot de passe</CardTitle>
                <CardDescription>
                  Choisissez un nouveau mot de passe pour votre compte.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer le nouveau mot de passe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;
