import { Layout } from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">1. Information We Collect</h2>
            <p>
              NIYA Foundation collects information you provide directly, including name, email address, 
              postal address, phone number, and payment information when you make a donation or register 
              as a member.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process donations and issue tax receipts</li>
              <li>Send newsletters and updates about our programs</li>
              <li>Communicate about events and volunteer opportunities</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">3. Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              data against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">4. Data Sharing</h2>
            <p>
              We do not sell or rent your personal information. We may share data with trusted service 
              providers who assist in our operations, subject to confidentiality agreements.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">6. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. You can control cookie 
              preferences through your browser settings.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">7. Contact Us</h2>
            <p>
              For privacy-related inquiries, please contact us at privacy@niyafoundation.org or 
              write to our postal address.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
