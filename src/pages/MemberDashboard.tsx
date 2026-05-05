import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Loader2, LogOut, User, Calendar, Heart, Mail, ArrowRight, Settings, Building2, BarChart2 } from "lucide-react";
import { useTranslation } from "@/i18n";

interface MemberProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface MembershipInfo {
  membership_tier: string;
  status: string;
  created_at: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  created_at: string;
  events?: {
    title: string;
    event_date: string;
  };
}

const MemberDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/member/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user) return;
      setDataLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      // Fetch membership if exists
      const { data: membershipData } = await supabase
        .from("membership_registrations")
        .select("membership_tier, status, created_at")
        .eq("email", user.email)
        .single();
      
      if (membershipData) setMembership(membershipData);

      // Fetch event registrations
      const { data: regData } = await supabase
        .from("event_registrations")
        .select("id, event_id, created_at")
        .eq("email", user.email)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (regData) setRegistrations(regData);

      setDataLoading(false);
    };

    if (user) {
      fetchMemberData();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="text-lg font-semibold">{t.memberPortal.dashboard}</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t.memberPortal.signOut}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t.memberPortal.welcome}, {profile?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">{t.memberPortal.welcomeDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.memberPortal.profile}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t.memberPortal.name}</p>
                <p className="font-medium">{profile?.full_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.memberPortal.email}</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.memberPortal.memberSince}</p>
                <p className="font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Membership Status — hidden for now, revisit later */}
          {membership && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                {t.memberPortal.membershipStatus}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="capitalize">
                    {membership.membership_tier}
                  </Badge>
                  <Badge variant={membership.status === "approved" ? "default" : "secondary"}>
                    {membership.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t.memberPortal.joinedOn}: {new Date(membership.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t.memberPortal.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/events">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t.memberPortal.viewEvents}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  {t.memberPortal.makeDonation}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  {t.memberPortal.contactUs}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/businesses">
                  <Building2 className="h-4 w-4 mr-2" />
                  Entreprises à vendre
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/member/listings">
                  <Building2 className="h-4 w-4 mr-2" />
                  Mes annonces
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/outils/tresorerie">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Outil de trésorerie
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Event Registrations */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t.memberPortal.yourRegistrations}
              </CardTitle>
              <CardDescription>{t.memberPortal.registrationsDesc}</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/events">
                {t.memberPortal.seeAllEvents}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t.memberPortal.noRegistrations}</p>
                <Button variant="link" asChild>
                  <Link to="/events">{t.memberPortal.browseEvents}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{t.memberPortal.eventRegistration}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.memberPortal.registeredOn}: {new Date(reg.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{t.memberPortal.registered}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemberDashboard;
