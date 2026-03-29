import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Award, Building2, ExternalLink } from "lucide-react";

type DonorTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'supporter';

interface RecognizedDonor {
  id: string;
  name: string;
  tier: DonorTier;
  logo_url: string | null;
  website_url: string | null;
  is_partner: boolean;
}

const tierConfig: Record<DonorTier, { color: string; bgColor: string; label: string; labelFr: string }> = {
  platinum: { color: "text-slate-700", bgColor: "bg-gradient-to-br from-slate-100 to-slate-200", label: "Platinum", labelFr: "Platine" },
  gold: { color: "text-yellow-700", bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100", label: "Gold", labelFr: "Or" },
  silver: { color: "text-gray-600", bgColor: "bg-gradient-to-br from-gray-50 to-gray-100", label: "Silver", labelFr: "Argent" },
  bronze: { color: "text-orange-700", bgColor: "bg-gradient-to-br from-orange-50 to-orange-100", label: "Bronze", labelFr: "Bronze" },
  supporter: { color: "text-primary", bgColor: "bg-gradient-to-br from-primary/5 to-primary/10", label: "Supporter", labelFr: "Supporteur" },
};

export const DonorRecognition = () => {
  const { t, language } = useTranslation();
  const [donors, setDonors] = useState<RecognizedDonor[]>([]);
  const [partners, setPartners] = useState<RecognizedDonor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      const { data, error } = await supabase
        .from("recognized_donors")
        .select("*")
        .eq("is_visible", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        const typedData = data as RecognizedDonor[];
        setDonors(typedData.filter(d => !d.is_partner));
        setPartners(typedData.filter(d => d.is_partner));
      }
      setLoading(false);
    };

    fetchDonors();
  }, []);

  if (loading) return null;
  if (donors.length === 0 && partners.length === 0) return null;

  const renderDonorCard = (donor: RecognizedDonor) => {
    const tier = tierConfig[donor.tier];
    return (
      <div
        key={donor.id}
        className={`${tier.bgColor} rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105`}
      >
        {donor.logo_url ? (
          <img
            src={donor.logo_url}
            alt={donor.name}
            className="h-12 w-auto object-contain"
          />
        ) : (
          <div className={`${tier.color} p-2`}>
            {donor.is_partner ? <Building2 className="h-8 w-8" /> : <Award className="h-8 w-8" />}
          </div>
        )}
        <span className={`font-medium text-sm ${tier.color} text-center`}>{donor.name}</span>
        <span className={`text-xs ${tier.color} opacity-70`}>
          {language === 'fr' ? tier.labelFr : tier.label}
        </span>
        {donor.website_url && (
          <a
            href={donor.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${tier.color} opacity-60 hover:opacity-100 transition-opacity`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {donors.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'fr' ? 'Nos Donateurs' : 'Our Donors'}
              </h2>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Merci à nos généreux donateurs pour leur soutien'
                  : 'Thank you to our generous donors for their support'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {donors.map(renderDonorCard)}
            </div>
          </div>
        )}

        {partners.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'fr' ? 'Nos Partenaires' : 'Our Partners'}
              </h2>
              <p className="text-gray-600">
                {language === 'fr'
                  ? 'Des organisations qui partagent notre vision'
                  : 'Organizations that share our vision'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {partners.map(renderDonorCard)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
