import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/i18n";

const MemberLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({
          title: t.memberPortal.signupSuccess,
          description: t.memberPortal.signupSuccessDesc,
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/member");
      }
    } catch (error: any) {
      toast({
        title: t.memberPortal.error,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t.memberPortal.backToSite}
          </Link>
          <LanguageSwitcher />
        </div>
        
        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <Logo size="sm" className="mx-auto mb-2" />
            <CardTitle>{isSignUp ? t.memberPortal.createAccount : t.memberPortal.login}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? t.memberPortal.createAccountDesc
                : t.memberPortal.loginDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.memberPortal.fullName}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    placeholder={t.memberPortal.fullNamePlaceholder}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t.memberPortal.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t.memberPortal.emailPlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.memberPortal.password}</Label>
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? t.memberPortal.createAccountBtn : t.memberPortal.loginBtn}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp ? t.memberPortal.haveAccount : t.memberPortal.needAccount}
              </button>
            </div>
            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-xs text-muted-foreground mb-2">{t.memberPortal.adminAccess}</p>
              <Link to="/admin/login" className="text-xs text-primary hover:underline">
                {t.memberPortal.adminLogin}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberLogin;
