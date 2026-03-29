import { Layout } from "@/components/layout/Layout";

const Ethics = () => {
  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Code of Ethics & Anti-Corruption Policy</h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              NIYA Foundation is committed to the highest standards of ethical conduct and transparency 
              in all our operations.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Our Commitment</h2>
            <p>
              We believe that ethical behavior is fundamental to achieving our mission. Every board member, 
              employee, volunteer, and partner is expected to uphold these standards.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Core Principles</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Integrity:</strong> We act honestly and transparently in all dealings</li>
              <li><strong>Accountability:</strong> We take responsibility for our actions and decisions</li>
              <li><strong>Respect:</strong> We treat all individuals with dignity and fairness</li>
              <li><strong>Stewardship:</strong> We manage resources responsibly and efficiently</li>
              <li><strong>Compliance:</strong> We adhere to all applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Anti-Corruption Policy</h2>
            <p>NIYA Foundation has zero tolerance for corruption in any form. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bribery of public officials or private parties</li>
              <li>Kickbacks or facilitation payments</li>
              <li>Conflicts of interest that are not disclosed</li>
              <li>Misappropriation of funds or assets</li>
              <li>Fraudulent financial reporting</li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Conflict of Interest</h2>
            <p>
              All personnel must disclose any potential conflicts of interest. Board members and staff 
              are required to recuse themselves from decisions where they have a personal interest.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Financial Transparency</h2>
            <p>
              We maintain accurate financial records and publish annual reports detailing how donor 
              funds are used. Our accounts are audited annually by an independent auditor.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Whistleblower Protection</h2>
            <p>
              We encourage reporting of any suspected violations. Reports can be made confidentially 
              and reporters are protected from retaliation.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-8">Reporting Concerns</h2>
            <p>
              To report a concern or suspected violation, please contact our Ethics Officer at 
              ethics@niyafoundation.org. All reports are investigated promptly and confidentially.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ethics;
