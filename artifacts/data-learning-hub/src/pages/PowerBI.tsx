import { useState } from "react";
import { BarChart3, ChevronDown, ChevronRight, Lightbulb, AlertTriangle } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import SectionHeader from "@/components/SectionHeader";
import InfoCard from "@/components/InfoCard";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "dax", label: "DAX Formulas" },
  { id: "power-query", label: "Power Query" },
  { id: "data-model", label: "Data Modeling" },
  { id: "visualizations", label: "Visualizations" },
  { id: "best-practices", label: "Best Practices" },
];

const daxExamples = [
  {
    title: "Total Sales",
    description: "Sum a column across all rows in context",
    code: `Total Sales = SUM(Sales[Amount])`,
  },
  {
    title: "Sales % of Total",
    description: "Calculate a percentage using DIVIDE and ALL to remove filters",
    code: `Sales % = DIVIDE(
    SUM(Sales[Amount]),
    CALCULATE(SUM(Sales[Amount]), ALL(Sales)),
    0
)`,
  },
  {
    title: "Year-over-Year Growth",
    description: "Compare current period sales to the same period last year",
    code: `YoY Growth % = 
VAR CurrentSales = SUM(Sales[Amount])
VAR PreviousSales = CALCULATE(
    SUM(Sales[Amount]),
    SAMEPERIODLASTYEAR('Date'[Date])
)
RETURN DIVIDE(CurrentSales - PreviousSales, PreviousSales, 0)`,
  },
  {
    title: "Running Total",
    description: "Cumulative sum up to the current date",
    code: `Running Total = CALCULATE(
    SUM(Sales[Amount]),
    FILTER(
        ALL('Date'[Date]),
        'Date'[Date] <= MAX('Date'[Date])
    )
)`,
  },
  {
    title: "RANKX – Top N by Sales",
    description: "Rank products by their sales amount",
    code: `Product Rank = RANKX(
    ALL(Products[ProductName]),
    SUM(Sales[Amount]),
    ,
    DESC,
    Dense
)`,
  },
  {
    title: "Calculated Column vs Measure",
    description: "Measures are evaluated at query time; columns are stored",
    code: `-- Calculated Column (stored, row context)
Profit = Sales[Revenue] - Sales[Cost]

-- Measure (evaluated dynamically, filter context)
Total Profit = SUM(Sales[Revenue]) - SUM(Sales[Cost])`,
  },
];

const powerQueryExamples = [
  {
    title: "Filter Rows",
    description: "Keep only rows where a column meets a condition",
    code: `= Table.SelectRows(Source, each [Status] = "Active")`,
  },
  {
    title: "Remove Duplicates",
    description: "Remove duplicate rows based on all columns",
    code: `= Table.Distinct(Source)`,
  },
  {
    title: "Add a Custom Column",
    description: "Add a new calculated column using M language",
    code: `= Table.AddColumn(Source, "Profit", each [Revenue] - [Cost], type number)`,
  },
  {
    title: "Merge Queries (Join)",
    description: "Join two tables like an SQL JOIN",
    code: `= Table.NestedJoin(
    Orders, {"CustomerID"},
    Customers, {"CustomerID"},
    "CustomerData",
    JoinKind.LeftOuter
)`,
  },
  {
    title: "Unpivot Columns",
    description: "Transform wide data to long/tall format",
    code: `= Table.UnpivotOtherColumns(Source, {"Product"}, "Month", "Value")`,
  },
];

const modelingConcepts = [
  { title: "Star Schema", description: "A fact table connected to dimension tables. Fact tables contain measurable events (sales, orders); dimensions contain descriptive attributes (customers, products, dates).", variant: "blue" as const },
  { title: "Relationships", description: "Connect tables using primary/foreign keys. Power BI supports one-to-many and many-to-many relationships. Always prefer one-to-many for performance.", variant: "green" as const },
  { title: "Date Table", description: "Always create a dedicated date table marked as a Date Table. It enables time intelligence functions like SAMEPERIODLASTYEAR and DATESYTD.", variant: "orange" as const },
  { title: "Cardinality", description: "Refers to the uniqueness of values in a relationship column. One-to-many is most common and most efficient. Avoid many-to-many when possible.", variant: "purple" as const },
];

const bestPractices = [
  { tip: "Use measures instead of calculated columns for aggregations — measures are evaluated at query time and are more flexible.", type: "good" },
  { tip: "Mark your date table and always use a dedicated calendar table for time intelligence.", type: "good" },
  { tip: "Avoid using CALCULATE with complex nested filters — simplify with variables (VAR) for readability.", type: "good" },
  { tip: "Do not create relationships on text columns — use integer keys for better performance.", type: "warn" },
  { tip: "Avoid bidirectional relationships unless absolutely needed — they can cause ambiguous filter paths.", type: "warn" },
  { tip: "Keep visuals per page to a minimum (6-8 max) to improve load performance.", type: "good" },
];

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold bg-muted/50 hover:bg-muted transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`button-collapse-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {title}
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-6 space-y-4">{children}</div>}
    </div>
  );
}

export default function PowerBI() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-testid="page-powerbi">
      {/* Page header */}
      <div className="flex items-start gap-4 mb-10 pb-8 border-b border-border">
        <div className="w-14 h-14 rounded-2xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 px-2.5 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800">
              Microsoft
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="text-page-title">Power BI</h1>
          <p className="text-muted-foreground max-w-2xl">
            Power BI is Microsoft's business intelligence and data visualization platform. It connects to hundreds of data sources, transforms data with Power Query, models data relationships, and creates interactive reports using DAX.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar navigation */}
        <aside className="lg:w-52 flex-shrink-0" data-testid="sidebar-powerbi">
          <nav className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                data-testid={`nav-section-${s.id}`}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeSection === s.id
                    ? "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-10">

          {/* Overview */}
          <section id="overview" data-testid="section-overview">
            <SectionHeader
              title="What is Power BI?"
              badge="Overview"
              badgeColor="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
              subtitle="Power BI is a suite of tools for transforming raw data into actionable insights through interactive dashboards and reports."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard title="Power BI Desktop" description="Free Windows application for building reports and data models. This is where you design your visuals and write DAX." variant="blue" />
              <InfoCard title="Power BI Service" description="Cloud-based platform (app.powerbi.com) for publishing, sharing, and collaborating on reports and dashboards." variant="green" />
              <InfoCard title="Power Query" description="Built-in ETL tool for connecting to data sources, cleaning, and transforming data using a low-code M language editor." variant="orange" />
              <InfoCard title="DAX" description="Data Analysis Expressions — the formula language used to create calculated columns, measures, and tables in Power BI." variant="purple" />
            </div>
          </section>

          {/* DAX */}
          <section id="dax" data-testid="section-dax">
            <SectionHeader
              title="DAX Formulas"
              badge="DAX"
              badgeColor="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
              subtitle="DAX (Data Analysis Expressions) is the formula language powering calculations in Power BI. It operates on tables and columns in a filter context."
            />
            <div className="space-y-4">
              {daxExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Total Sales"}>
                  <p className="text-sm text-muted-foreground mb-3">{ex.description}</p>
                  <CodeBlock code={ex.code} language="dax" />
                </CollapsibleSection>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex gap-3">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Understanding Filter Context</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">DAX formulas are always evaluated within a filter context — the current row, column headers, slicers, and report filters all affect what rows are considered when calculating a measure. Use CALCULATE to modify this context.</p>
              </div>
            </div>
          </section>

          {/* Power Query */}
          <section id="power-query" data-testid="section-power-query">
            <SectionHeader
              title="Power Query (M Language)"
              badge="Power Query"
              badgeColor="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
              subtitle="Power Query is the ETL layer in Power BI. Each transformation creates a step written in M, a functional language. The Query Editor is the visual interface for building these steps."
            />
            <div className="space-y-4">
              {powerQueryExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Filter Rows"}>
                  <p className="text-sm text-muted-foreground mb-3">{ex.description}</p>
                  <CodeBlock code={ex.code} language="m" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* Data Modeling */}
          <section id="data-model" data-testid="section-data-model">
            <SectionHeader
              title="Data Modeling"
              badge="Modeling"
              badgeColor="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
              subtitle="A well-designed data model is the foundation of every good Power BI report. The model view lets you define relationships between tables."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modelingConcepts.map((c) => (
                <InfoCard key={c.title} title={c.title} description={c.description} variant={c.variant} />
              ))}
            </div>
            <div className="mt-6">
              <CodeBlock
                title="Example: Date Table in DAX"
                language="dax"
                code={`DateTable = CALENDAR(DATE(2020, 1, 1), DATE(2025, 12, 31))

-- Add columns to the date table:
Year = YEAR('DateTable'[Date])
Month = FORMAT('DateTable'[Date], "MMMM")
Quarter = "Q" & QUARTER('DateTable'[Date])
WeekNum = WEEKNUM('DateTable'[Date])`}
              />
            </div>
          </section>

          {/* Visualizations */}
          <section id="visualizations" data-testid="section-visualizations">
            <SectionHeader
              title="Visualizations"
              badge="Visuals"
              badgeColor="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
              subtitle="Power BI offers a rich library of built-in visuals plus a marketplace for custom ones. Choosing the right visual for your data type is critical."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Bar / Column Chart", description: "Compare values across categories. Column = vertical. Bar = horizontal. Best for ranked comparisons." },
                { title: "Line Chart", description: "Show trends over time. Ideal for continuous data like sales over months or years." },
                { title: "Pie / Donut Chart", description: "Show part-to-whole relationships. Use sparingly — limit to 5 or fewer slices." },
                { title: "Matrix", description: "Equivalent to a pivot table. Supports row and column groupings with subtotals." },
                { title: "Card", description: "Display a single KPI value prominently. Useful for totals, averages, or goal metrics." },
                { title: "Map", description: "Visualize geographic data using locations, latitude/longitude, or region names." },
                { title: "Slicer", description: "Add interactive filters to the report page. Users can click to filter all visuals on the page." },
                { title: "Scatter Chart", description: "Show the relationship between two numeric values. Great for identifying correlations and outliers." },
                { title: "Waterfall Chart", description: "Illustrate how an initial value increases or decreases through a series of intermediate values." },
              ].map(({ title, description }) => (
                <div key={title} className="bg-card border border-card-border rounded-xl p-4 hover:shadow-sm transition-shadow" data-testid={`card-visual-${title.toLowerCase().replace(/[\s\/]/g, "-")}`}>
                  <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" data-testid="section-best-practices">
            <SectionHeader
              title="Best Practices"
              badge="Tips"
              badgeColor="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
            />
            <div className="space-y-3">
              {bestPractices.map(({ tip, type }, i) => (
                <div key={i} className={cn("flex gap-3 p-4 rounded-xl border", type === "good" ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" : "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800")} data-testid={`tip-${i}`}>
                  {type === "good" ? <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />}
                  <p className={cn("text-sm", type === "good" ? "text-green-800 dark:text-green-300" : "text-orange-800 dark:text-orange-300")}>{tip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
