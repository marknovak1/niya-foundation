import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp, Users, Heart } from "lucide-react";
import { useTranslation } from "@/i18n";

const Reports = () => {
  const { t } = useTranslation();

  const reports = [
    {
      year: "2025",
      title: "Annual Impact Report 2025",
      description: "Comprehensive overview of our programs, achievements, and financial transparency for the year 2025.",
      highlights: ["10,000+ lives impacted", "$2.5M in community investments", "15 new programs launched"],
      downloadUrl: "#",
      featured: true,
    },
    {
      year: "2024",
      title: "Annual Impact Report 2024",
      description: "A year of growth and meaningful change across all our program areas.",
      highlights: ["8,500 lives impacted", "$2.1M in community investments", "12 programs expanded"],
      downloadUrl: "#",
      featured: false,
    },
    {
      year: "2023",
      title: "Annual Impact Report 2023",
      description: "Foundation milestones and community achievements from our third year of operation.",
      highlights: ["6,200 lives impacted", "$1.8M in community investments", "8 new partnerships"],
      downloadUrl: "#",
      featured: false,
    },
    {
      year: "2022",
      title: "Annual Impact Report 2022",
      description: "Building stronger foundations and expanding our reach into new communities.",
      highlights: ["4,500 lives impacted", "$1.2M in community investments", "5 flagship programs"],
      downloadUrl: "#",
      featured: false,
    },
  ];

  const financialReports = [
    { year: "2025", title: "Financial Statement 2025", type: t.reports.audited },
    { year: "2024", title: "Financial Statement 2024", type: t.reports.audited },
    { year: "2023", title: "Financial Statement 2023", type: t.reports.audited },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {t.reports.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t.reports.description}
          </p>
        </div>
      </section>

      {/* Impact Overview */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <Users className="h-8 w-8 mx-auto text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">29,200+</div>
                <p className="text-sm text-muted-foreground">{t.reports.livesTotal}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <TrendingUp className="h-8 w-8 mx-auto text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">$7.6M</div>
                <p className="text-sm text-muted-foreground">{t.reports.investments}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <Heart className="h-8 w-8 mx-auto text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">40+</div>
                <p className="text-sm text-muted-foreground">{t.reports.activePrograms}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-2">
                <Calendar className="h-8 w-8 mx-auto text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">4 Years</div>
                <p className="text-sm text-muted-foreground">{t.reports.yearsService}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Annual Reports */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{t.reports.annualReportsTitle}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.reports.annualReportsDesc}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {reports.map((report) => (
              <Card 
                key={report.year} 
                className={report.featured ? "border-primary/50 shadow-lg" : ""}
              >
                {report.featured && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium rounded-t-lg">
                    {t.reports.latestReport}
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                    <FileText className="h-10 w-10 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">{t.reports.highlights}</h4>
                    <ul className="space-y-1">
                      {report.highlights.map((highlight, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant={report.featured ? "default" : "outline"} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t.reports.download}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Reports */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{t.reports.financialTitle}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.reports.financialDesc}
          </p>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t.reports.audited}</CardTitle>
                <CardDescription>
                  {t.reports.auditedDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {financialReports.map((report) => (
                  <div 
                    key={report.year}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">{report.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fund Allocation */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{t.reports.allocationTitle}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.reports.allocationDesc}
          </p>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t.reports.programServices}</span>
                      <span className="font-bold text-foreground">82%</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t.reports.administration}</span>
                      <span className="font-bold text-foreground">10%</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/70 rounded-full" style={{ width: "10%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t.reports.fundraising}</span>
                      <span className="font-bold text-foreground">8%</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/50 rounded-full" style={{ width: "8%" }} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6 text-center">
                  {t.reports.allocationNote}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.reports.ctaTitle}</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {t.reports.ctaDesc}
          </p>
          <Button variant="secondary" size="lg" asChild>
            <a href="/contact">{t.reports.contactBtn}</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Reports;
