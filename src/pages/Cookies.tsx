import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Cookies = () => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const handleSave = () => {
    // TODO: Implement cookie preference saving
    alert("Preferences saved!");
  };

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              This policy explains how NIYA Foundation uses cookies on our website.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help 
              websites remember your preferences and improve your browsing experience.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-serif font-semibold text-foreground mt-6">Necessary Cookies</h3>
            <p>
              These cookies are essential for the website to function properly. They cannot be disabled.
            </p>

            <h3 className="text-xl font-serif font-semibold text-foreground mt-6">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website, allowing us to 
              improve our content and services.
            </p>

            <h3 className="text-xl font-serif font-semibold text-foreground mt-6">Marketing Cookies</h3>
            <p>
              These cookies are used to deliver relevant advertisements and track the effectiveness of 
              our marketing campaigns.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Managing Your Preferences</h2>
            <p>
              You can manage your cookie preferences below or through your browser settings.
            </p>
          </div>

          {/* Cookie Preferences */}
          <div className="mt-12 p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">Cookie Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Necessary Cookies</p>
                  <p className="text-sm text-muted-foreground">Required for basic website functionality</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="h-5 w-5 rounded border-border"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Analytics Cookies</p>
                  <p className="text-sm text-muted-foreground">Help us improve our website</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="h-5 w-5 rounded border-border"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Marketing Cookies</p>
                  <p className="text-sm text-muted-foreground">Used for targeted advertising</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="h-5 w-5 rounded border-border"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button variant="warm" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6 mt-12">
            <h2 className="text-2xl font-serif font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at privacy@niyafoundation.org.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cookies;
