import { Link } from "wouter";
import { BarChart3, Database, Code2, ArrowRight, BookOpen, Zap, Target } from "lucide-react";

const topics = [
  {
    href: "/powerbi",
    label: "Power BI",
    icon: BarChart3,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    badge: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300",
    description: "Business intelligence platform for creating interactive dashboards, reports, and data visualizations. Learn DAX, data modeling, and Power Query.",
    topics: ["DAX Formulas", "Data Modeling", "Power Query", "Visualizations", "Reports & Dashboards"],
  },
  {
    href: "/sql",
    label: "SQL",
    icon: Database,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    description: "The universal language for querying and managing relational databases. Master SELECT, JOINs, aggregations, CTEs, window functions, and more.",
    topics: ["SELECT & Filtering", "JOINs", "Aggregations", "CTEs", "Window Functions"],
  },
  {
    href: "/python",
    label: "Python",
    icon: Code2,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
    description: "The go-to language for data science, automation, and analytics. Explore pandas, NumPy, matplotlib, and common data workflows.",
    topics: ["Pandas", "NumPy", "Data Cleaning", "Visualization", "File Handling"],
  },
];

const features = [
  { icon: BookOpen, title: "Reference Guide", description: "Concise, well-organized content covering key concepts and syntax." },
  { icon: Zap, title: "Code Examples", description: "Ready-to-use code snippets you can copy and adapt immediately." },
  { icon: Target, title: "Best Practices", description: "Tips, patterns, and common pitfalls to help you write better code." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10 border-b border-border" data-testid="section-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Data & Analytics Reference
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6" data-testid="text-hero-title">
              Learn Power BI,{" "}
              <span className="text-primary">SQL</span> &{" "}
              <span className="text-primary">Python</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl" data-testid="text-hero-subtitle">
              A comprehensive reference hub for data professionals. Find syntax guides, code examples, best practices, and key concepts — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              {topics.map(({ href, label, icon: Icon, color }) => (
                <Link key={href} href={href}>
                  <div data-testid={`button-hero-${label.toLowerCase().replace(" ", "")}`} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-card-border text-sm font-medium hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                    <Icon className={`w-4 h-4 ${color}`} />
                    {label}
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-accent/20 rounded-full translate-y-1/2 blur-2xl pointer-events-none" />
      </section>

      {/* Features strip */}
      <section className="border-b border-border bg-muted/30" data-testid="section-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4" data-testid={`feature-${title.toLowerCase().replace(" ", "-")}`}>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topic Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="section-topics">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Explore by Topic</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Pick a subject to dive into curated guides, syntax references, and practical examples.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topics.map(({ href, label, icon: Icon, color, bg, border, badge, description, topics: subtopics }) => (
            <Link key={href} href={href}>
              <div
                data-testid={`card-topic-${label.toLowerCase().replace(" ", "")}`}
                className={`group border ${border} ${bg} rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-xl ${badge} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {subtopics.map((t) => (
                    <span key={t} className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge}`}>{t}</span>
                  ))}
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-medium ${color} group-hover:gap-2.5 transition-all`}>
                  Explore {label}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick reference CTA */}
      <section className="border-t border-border bg-primary/5 py-14" data-testid="section-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to sharpen your skills?</h2>
          <p className="text-muted-foreground mb-6">Jump straight into any topic and explore syntax references, practical examples, and tips.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {topics.map(({ href, label, icon: Icon, color }) => (
              <Link key={href} href={href}>
                <div data-testid={`button-cta-${label.toLowerCase().replace(" ", "")}`} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-card-border font-medium text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer shadow-sm">
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label} Guide
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
