export interface BusinessCategory {
  value: string;
  fr: string;
  en: string;
}

export const businessCategories: BusinessCategory[] = [
  { value: "restaurant", fr: "Restaurant & Alimentation", en: "Restaurant & Food" },
  { value: "retail", fr: "Commerce de détail", en: "Retail Store" },
  { value: "beauty", fr: "Beauté & Bien-être", en: "Beauty & Wellness" },
  { value: "technology", fr: "Technologie & Informatique", en: "Technology & IT" },
  { value: "construction", fr: "Construction & Rénovation", en: "Construction & Renovation" },
  { value: "transport", fr: "Transport & Logistique", en: "Transport & Logistics" },
  { value: "education", fr: "Éducation & Formation", en: "Education & Training" },
  { value: "healthcare", fr: "Santé & Services médicaux", en: "Health & Medical Services" },
  { value: "finance", fr: "Finance & Comptabilité", en: "Finance & Accounting" },
  { value: "realestate", fr: "Immobilier", en: "Real Estate" },
  { value: "manufacturing", fr: "Fabrication & Production", en: "Manufacturing & Production" },
  { value: "agriculture", fr: "Agriculture & Agroalimentaire", en: "Agriculture & Agri-food" },
  { value: "media", fr: "Médias & Communication", en: "Media & Communication" },
  { value: "hospitality", fr: "Hôtellerie & Tourisme", en: "Hospitality & Tourism" },
  { value: "cleaning", fr: "Nettoyage & Entretien", en: "Cleaning & Maintenance" },
  { value: "legal", fr: "Services juridiques", en: "Legal Services" },
  { value: "marketing", fr: "Marketing & Publicité", en: "Marketing & Advertising" },
  { value: "childcare", fr: "Services à l'enfance", en: "Childcare Services" },
  { value: "automotive", fr: "Automobile & Mécanique", en: "Automotive & Mechanics" },
  { value: "other", fr: "Autre", en: "Other" },
];

export function getCategoryLabel(value: string, language: string = "fr"): string {
  const cat = businessCategories.find((c) => c.value === value);
  if (!cat) return value;
  return language === "fr" ? cat.fr : cat.en;
}
