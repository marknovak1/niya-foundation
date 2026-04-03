import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation, useLanguage } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";

interface NewsArticle {
  id: string;
  title: string;
  title_fr: string | null;
  excerpt: string;
  excerpt_fr: string | null;
  category: string;
  author: string;
  image_url: string | null;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
}

const News = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { key: "all", label: t.news.categories.all },
    { key: "programs", label: t.news.categories.programs },
    { key: "events", label: t.news.categories.events },
    { key: "announcements", label: t.news.categories.announcements },
    { key: "partnerships", label: t.news.categories.partnerships },
    { key: "community", label: t.news.categories.community },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      
      if (data && !error) {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  const getLocalizedTitle = (article: NewsArticle) => {
    return language === "fr" && article.title_fr ? article.title_fr : article.title;
  };

  const getLocalizedExcerpt = (article: NewsArticle) => {
    return language === "fr" && article.excerpt_fr ? article.excerpt_fr : article.excerpt;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      programs: t.news.categories.programs,
      events: t.news.categories.events,
      announcements: t.news.categories.announcements,
      partnerships: t.news.categories.partnerships,
      community: t.news.categories.community,
    };
    return categoryMap[category] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredArticles = activeCategory === "all" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const featuredArticle = filteredArticles.find((article) => article.is_featured);
  const regularArticles = filteredArticles.filter((article) => !article.is_featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            {t.news.title}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t.news.description}
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={activeCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.key)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : articles.length === 0 ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-muted-foreground text-lg">No news articles yet. Check back soon!</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Article */}
          {featuredArticle && (
            <section className="py-12">
              <div className="max-w-7xl mx-auto px-4">
                <Card className="overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="aspect-video lg:aspect-auto bg-muted flex items-center justify-center">
                      <img 
                        src={featuredArticle.image_url || "/placeholder.svg"} 
                        alt={getLocalizedTitle(featuredArticle)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-4">{getCategoryLabel(featuredArticle.category)}</Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        {getLocalizedTitle(featuredArticle)}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {getLocalizedExcerpt(featuredArticle)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredArticle.published_at || featuredArticle.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredArticle.author}
                        </span>
                      </div>
                      <Button className="w-fit">
                        {t.news.readFull}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}

          {/* Article Grid */}
          {regularArticles.length > 0 && (
            <section className="py-12 bg-muted/30">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8">{t.news.latest}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-muted">
                        <img 
                          src={article.image_url || "/placeholder.svg"} 
                          alt={getLocalizedTitle(article)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{getCategoryLabel(article.category)}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(article.published_at || article.created_at)}
                          </span>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{getLocalizedTitle(article)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-3 mb-4">
                          {getLocalizedExcerpt(article)}
                        </CardDescription>
                        <Button variant="link" className="px-0">
                          {t.news.readMore} <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.news.stayUpdated.title}</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {t.news.stayUpdated.description}
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/#newsletter">{t.news.stayUpdated.btn}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default News;
