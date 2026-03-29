import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ProblemeSection } from "@/components/home/ProblemeSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { ProcessusSection } from "@/components/home/ProcessusSection";
import { AudienceSection } from "@/components/home/AudienceSection";
import { CertificationSection } from "@/components/home/CertificationSection";
import { PartenairesSection } from "@/components/home/PartenairesSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { GouvernanceSection } from "@/components/home/GouvernanceSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ProblemeSection />
      <SolutionSection />
      <ProcessusSection />
      <AudienceSection />
      <CertificationSection />
      <PartenairesSection />
      <ImpactSection />
      <GouvernanceSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
