import { useContext } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, BarChart3, Database, Code2, Home, Menu, X } from "lucide-react";
import { ThemeContext } from "@/App";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/powerbi", label: "Power BI", icon: BarChart3 },
  { href: "/sql", label: "SQL", icon: Database },
  { href: "/python", label: "Python", icon: Code2 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" data-testid="link-home-logo">
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-primary-foreground font-bold text-sm">DL</span>
                </div>
                <span className="font-bold text-lg tracking-tight">DataLearn</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} data-testid={`link-nav-${label.toLowerCase().replace(" ", "")}`}>
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                    location === href
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button
                data-testid="button-toggle-theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                data-testid="button-mobile-menu"
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1" data-testid="nav-mobile">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <div
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-nav-${label.toLowerCase().replace(" ", "")}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer",
                    location === href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">DL</span>
              </div>
              <span className="text-sm font-medium">DataLearn</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              A reference guide for Power BI, SQL, and Python data professionals
            </p>
            <div className="flex items-center gap-4">
              {navItems.slice(1).map(({ href, label }) => (
                <Link key={href} href={href}>
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid={`link-footer-${label.toLowerCase().replace(" ", "")}`}>
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
