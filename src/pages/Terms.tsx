import { Layout } from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Terms of Use</h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by these Terms of Use. 
              If you do not agree, please do not use our website.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">2. Use of Website</h2>
            <p>
              You may use this website for lawful purposes only. You agree not to use the site in any way 
              that could damage, disable, or impair its functionality.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">3. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and graphics, is the property 
              of NIYA Foundation and is protected by copyright laws.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">4. Donations</h2>
            <p>
              Donations made through our website are processed securely. All donations are final and 
              non-refundable unless required by law. Tax receipts will be issued for eligible donations.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">5. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not responsible for the content 
              or practices of these external sites.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">6. Disclaimer</h2>
            <p>
              This website is provided "as is" without warranties of any kind. NIYA Foundation does not 
              guarantee the accuracy or completeness of information presented.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">7. Limitation of Liability</h2>
            <p>
              NIYA Foundation shall not be liable for any direct, indirect, incidental, or consequential 
              damages arising from your use of this website.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the website after 
              changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">9. Contact</h2>
            <p>
              For questions about these terms, please contact us at legal@niyafoundation.org.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
