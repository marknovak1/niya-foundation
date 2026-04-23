import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Cookie, X, Settings2 } from "lucide-react";
import { useTranslation } from "@/i18n";

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_CONSENT_KEY = "niya_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setIsVisible(false);
  };

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = { necessary: true, analytics: false, marketing: false };
    setPreferences(necessaryOnly);
    savePreferences(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!isVisible || location.pathname === '/qr') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="container-wide">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          {!showPreferences ? (
            <>
              {/* Main Banner */}
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex-shrink-0">
                  <Cookie className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t.cookies.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t.cookies.description}{" "}
                    <Link to="/cookies" className="text-secondary hover:underline">
                      {t.cookies.policy}
                    </Link>{" "}
                    {t.cookies.forMore}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="warm" onClick={acceptAll}>
                      {t.cookies.acceptAll}
                    </Button>
                    <Button variant="outline" onClick={acceptNecessary}>
                      {t.cookies.necessaryOnly}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowPreferences(true)}
                      className="gap-2"
                    >
                      <Settings2 className="h-4 w-4" />
                      {t.cookies.customize}
                    </Button>
                  </div>
                </div>
                <button
                  onClick={acceptNecessary}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close cookie banner"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Preferences Panel */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">Necessary Cookies</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                        Always Active
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Essential for the website to function properly. Cannot be disabled.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="h-5 w-5 rounded"
                  />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Analytics Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how visitors interact with our website to improve 
                      user experience.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="h-5 w-5 rounded cursor-pointer"
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Marketing Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      Used to track visitors across websites to display relevant 
                      advertisements.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="h-5 w-5 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="warm" onClick={saveCustomPreferences}>
                  {t.common.save}
                </Button>
                <Button variant="outline" onClick={acceptAll}>
                  {t.cookies.acceptAll}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
