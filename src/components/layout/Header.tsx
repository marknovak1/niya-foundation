import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, LayoutDashboard } from "lucide-react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Notre mission", href: "/#probleme" },
    { name: "Nos axes", href: "/#solution" },
    { name: "Entreprises", href: "/businesses", isRoute: true },
  ];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location.pathname === "/") {
        scrollToId(id);
      } else {
        navigate("/");
        setTimeout(() => scrollToId(id), 300);
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md"
          : "bg-white"
      )}
      style={{ borderBottom: scrolled ? undefined : "1px solid hsl(220, 13%, 91%)" }}
    >
      <nav className="container-wide flex h-[72px] items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <Logo size="md" variant="dark" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-9 list-none mx-auto">
          {navLinks.map((item) => (
            <li key={item.href}>
              {item.isRoute ? (
                <Link
                  to={item.href}
                  className="text-foreground/70 text-sm font-medium tracking-wide hover:text-primary transition-colors no-underline"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-foreground/70 text-sm font-medium tracking-wide hover:text-primary transition-colors no-underline"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
          <li>
            {user ? (
              <Link
                to="/member"
                className="flex items-center gap-1.5 text-foreground/70 text-sm font-medium tracking-wide hover:text-primary transition-colors no-underline"
              >
                <LayoutDashboard className="h-4 w-4" />
                Mon espace
              </Link>
            ) : (
              <Link
                to="/member/login"
                className="flex items-center gap-1.5 text-foreground/70 text-sm font-medium tracking-wide hover:text-primary transition-colors no-underline"
              >
                <LogIn className="h-4 w-4" />
                Connexion
              </Link>
            )}
          </li>
          <li>
            {!user && (
              <Link
                to="/devenir-membre"
                className="bg-primary text-white border border-primary px-5 py-2.5 text-sm font-semibold tracking-wide hover:bg-primary/90 transition-colors no-underline"
              >
                Devenir membre
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden rounded-md p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors no-underline"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="block px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors no-underline"
                >
                  {item.name}
                </a>
              )
            ))}
            {user ? (
              <Link
                to="/member"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors no-underline"
              >
                <LayoutDashboard className="h-4 w-4" />
                Mon espace
              </Link>
            ) : (
              <>
                <Link
                  to="/member/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors no-underline"
                >
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Link>
                <Link
                  to="/devenir-membre"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mt-3 bg-primary text-white border border-primary px-5 py-3 text-sm font-semibold text-center no-underline"
                >
                  Devenir membre
                </Link>
              </>
            )}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={cn(
                  "flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
                  language === "fr"
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-foreground/70 border-border hover:bg-muted"
                )}
              >
                Francais
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
                  language === "en"
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-foreground/70 border-border hover:bg-muted"
                )}
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
