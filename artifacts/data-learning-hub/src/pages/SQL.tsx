import { useState } from "react";
import { Database, ChevronDown, ChevronRight, Lightbulb, AlertTriangle } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import SectionHeader from "@/components/SectionHeader";
import InfoCard from "@/components/InfoCard";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "select", label: "SELECT & Filtering" },
  { id: "joins", label: "JOINs" },
  { id: "aggregations", label: "Aggregations" },
  { id: "ctes", label: "CTEs & Subqueries" },
  { id: "window", label: "Window Functions" },
  { id: "ddl", label: "DDL (Schema)" },
  { id: "best-practices", label: "Best Practices" },
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

const selectExamples = [
  {
    title: "Basic SELECT",
    code: `SELECT
    CustomerID,
    FirstName,
    LastName,
    Email
FROM Customers
WHERE Country = 'USA'
ORDER BY LastName ASC;`,
  },
  {
    title: "LIKE, IN, BETWEEN",
    code: `-- Pattern matching with LIKE
SELECT * FROM Products WHERE Name LIKE '%Coffee%';

-- IN clause (list of values)
SELECT * FROM Orders WHERE Status IN ('Pending', 'Processing');

-- BETWEEN (inclusive range)
SELECT * FROM Sales WHERE SaleDate BETWEEN '2024-01-01' AND '2024-12-31';`,
  },
  {
    title: "CASE Expressions",
    code: `SELECT
    OrderID,
    Amount,
    CASE
        WHEN Amount > 1000 THEN 'High'
        WHEN Amount > 500  THEN 'Medium'
        ELSE 'Low'
    END AS OrderCategory
FROM Orders;`,
  },
  {
    title: "NULL Handling",
    code: `-- Filter for NULL
SELECT * FROM Customers WHERE Phone IS NULL;

-- Replace NULL with a default value
SELECT
    CustomerID,
    COALESCE(Phone, 'No Phone') AS Phone,
    ISNULL(Email, 'N/A') AS Email  -- SQL Server
FROM Customers;`,
  },
];

const joinExamples = [
  {
    title: "INNER JOIN",
    description: "Returns only rows that match in both tables",
    code: `SELECT
    o.OrderID,
    o.OrderDate,
    c.FirstName,
    c.LastName
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID;`,
  },
  {
    title: "LEFT JOIN",
    description: "Returns all rows from the left table; NULLs where no match exists on the right",
    code: `SELECT
    c.CustomerID,
    c.FirstName,
    COUNT(o.OrderID) AS TotalOrders
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.FirstName;`,
  },
  {
    title: "Multiple JOINs",
    description: "Chain multiple joins to connect several tables",
    code: `SELECT
    o.OrderID,
    c.FirstName,
    p.ProductName,
    od.Quantity,
    od.UnitPrice
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID
JOIN OrderDetails od ON o.OrderID = od.OrderID
JOIN Products p ON od.ProductID = p.ProductID;`,
  },
  {
    title: "SELF JOIN",
    description: "Join a table to itself — useful for hierarchical data",
    code: `-- Find employees and their managers
SELECT
    e.EmployeeID,
    e.Name AS Employee,
    m.Name AS Manager
FROM Employees e
LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID;`,
  },
];

const aggregationExamples = [
  {
    title: "GROUP BY with Aggregates",
    code: `SELECT
    Category,
    COUNT(*)           AS ProductCount,
    SUM(SalesAmount)   AS TotalSales,
    AVG(SalesAmount)   AS AvgSale,
    MIN(SalesAmount)   AS MinSale,
    MAX(SalesAmount)   AS MaxSale
FROM Products
GROUP BY Category
ORDER BY TotalSales DESC;`,
  },
  {
    title: "HAVING (Filtering Groups)",
    code: `-- HAVING filters after GROUP BY (unlike WHERE which filters before)
SELECT
    CustomerID,
    COUNT(OrderID)    AS OrderCount,
    SUM(Amount)       AS TotalSpend
FROM Orders
GROUP BY CustomerID
HAVING SUM(Amount) > 5000
ORDER BY TotalSpend DESC;`,
  },
  {
    title: "ROLLUP & CUBE",
    code: `-- ROLLUP: subtotals along a hierarchy
SELECT
    Region,
    Category,
    SUM(SalesAmount) AS TotalSales
FROM Sales
GROUP BY ROLLUP(Region, Category);

-- CUBE: all possible subtotal combinations
GROUP BY CUBE(Region, Category);`,
  },
];

const cteExamples = [
  {
    title: "Common Table Expression (CTE)",
    code: `WITH SalesSummary AS (
    SELECT
        CustomerID,
        SUM(Amount) AS TotalSpend
    FROM Orders
    GROUP BY CustomerID
)
SELECT
    c.FirstName,
    c.LastName,
    ss.TotalSpend
FROM Customers c
JOIN SalesSummary ss ON c.CustomerID = ss.CustomerID
WHERE ss.TotalSpend > 1000;`,
  },
  {
    title: "Multiple CTEs",
    code: `WITH
RecentOrders AS (
    SELECT * FROM Orders
    WHERE OrderDate >= DATEADD(DAY, -30, GETDATE())
),
OrderTotals AS (
    SELECT
        CustomerID,
        COUNT(*) AS OrderCount,
        SUM(Amount) AS Total
    FROM RecentOrders
    GROUP BY CustomerID
)
SELECT * FROM OrderTotals WHERE OrderCount > 2;`,
  },
  {
    title: "Recursive CTE",
    code: `WITH RECURSIVE OrgChart AS (
    -- Anchor: start with the CEO (no manager)
    SELECT EmployeeID, Name, ManagerID, 0 AS Level
    FROM Employees
    WHERE ManagerID IS NULL

    UNION ALL

    -- Recursive: join employees to their managers
    SELECT e.EmployeeID, e.Name, e.ManagerID, oc.Level + 1
    FROM Employees e
    JOIN OrgChart oc ON e.ManagerID = oc.EmployeeID
)
SELECT * FROM OrgChart ORDER BY Level, Name;`,
  },
];

const windowExamples = [
  {
    title: "ROW_NUMBER",
    code: `-- Assign a sequential number per partition
SELECT
    SaleDate,
    CustomerID,
    Amount,
    ROW_NUMBER() OVER (
        PARTITION BY CustomerID
        ORDER BY SaleDate DESC
    ) AS RowNum
FROM Sales;`,
  },
  {
    title: "RANK vs DENSE_RANK",
    code: `-- RANK: gaps in ranking when tied
-- DENSE_RANK: no gaps
SELECT
    ProductName,
    SalesAmount,
    RANK()       OVER (ORDER BY SalesAmount DESC) AS Rank,
    DENSE_RANK() OVER (ORDER BY SalesAmount DESC) AS DenseRank
FROM Products;`,
  },
  {
    title: "SUM / AVG over a Window",
    code: `SELECT
    OrderDate,
    Amount,
    -- Running total
    SUM(Amount) OVER (ORDER BY OrderDate ROWS UNBOUNDED PRECEDING) AS RunningTotal,
    -- 7-day moving average
    AVG(Amount) OVER (ORDER BY OrderDate ROWS 6 PRECEDING) AS MovingAvg7
FROM Orders;`,
  },
  {
    title: "LAG and LEAD",
    code: `-- LAG: access the previous row's value
-- LEAD: access the next row's value
SELECT
    SaleDate,
    Amount,
    LAG(Amount, 1)  OVER (ORDER BY SaleDate) AS PrevAmount,
    LEAD(Amount, 1) OVER (ORDER BY SaleDate) AS NextAmount,
    Amount - LAG(Amount, 1) OVER (ORDER BY SaleDate) AS Change
FROM Sales;`,
  },
];

const ddlExamples = [
  {
    title: "CREATE TABLE",
    code: `CREATE TABLE Customers (
    CustomerID   INT           PRIMARY KEY,
    FirstName    VARCHAR(50)   NOT NULL,
    LastName     VARCHAR(50)   NOT NULL,
    Email        VARCHAR(100)  UNIQUE NOT NULL,
    Phone        VARCHAR(20),
    Country      VARCHAR(50)   DEFAULT 'Unknown',
    CreatedAt    DATETIME      DEFAULT GETDATE()
);`,
  },
  {
    title: "ALTER TABLE",
    code: `-- Add a column
ALTER TABLE Customers ADD DateOfBirth DATE;

-- Modify a column data type
ALTER TABLE Customers ALTER COLUMN Phone VARCHAR(30);

-- Add a constraint
ALTER TABLE Orders
ADD CONSTRAINT fk_customer
FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);`,
  },
  {
    title: "Indexes",
    code: `-- Clustered index (physical order of table)
CREATE CLUSTERED INDEX idx_orders_date
ON Orders(OrderDate);

-- Non-clustered index (separate lookup structure)
CREATE NONCLUSTERED INDEX idx_customers_email
ON Customers(Email)
INCLUDE (FirstName, LastName);`,
  },
];

const bestPractices = [
  { tip: "Use table aliases consistently (e.g., c for Customers, o for Orders) to improve readability.", type: "good" },
  { tip: "Prefer WHERE over HAVING when filtering before aggregation — it's more efficient.", type: "good" },
  { tip: "Use CTEs instead of nested subqueries for better readability and maintainability.", type: "good" },
  { tip: "Avoid SELECT * in production queries — always specify column names explicitly.", type: "warn" },
  { tip: "Add indexes on columns used frequently in WHERE, JOIN, and ORDER BY clauses.", type: "good" },
  { tip: "Be careful with functions on indexed columns in WHERE clauses — they prevent index usage.", type: "warn" },
  { tip: "Use NOLOCK hints with caution in SQL Server — it can return dirty reads.", type: "warn" },
];

export default function SQL() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-testid="page-sql">
      {/* Page header */}
      <div className="flex items-start gap-4 mb-10 pb-8 border-b border-border">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
          <Database className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              Structured Query Language
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="text-page-title">SQL</h1>
          <p className="text-muted-foreground max-w-2xl">
            SQL is the standard language for interacting with relational databases. From simple data retrieval to complex analytics with window functions and CTEs — SQL is an essential skill for every data professional.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar navigation */}
        <aside className="lg:w-52 flex-shrink-0" data-testid="sidebar-sql">
          <nav className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                data-testid={`nav-section-${s.id}`}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeSection === s.id
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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
              title="SQL Fundamentals"
              badge="Overview"
              badgeColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              subtitle="SQL (Structured Query Language) is used to create, read, update, and delete data in relational databases. It's declarative — you describe what data you want, not how to get it."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard title="DQL (Query)" description="Data Query Language — SELECT statements to read data from tables. The most-used category of SQL commands." variant="blue" />
              <InfoCard title="DML (Manipulation)" description="Data Manipulation Language — INSERT, UPDATE, DELETE. Used to modify the data stored in tables." variant="green" />
              <InfoCard title="DDL (Definition)" description="Data Definition Language — CREATE, ALTER, DROP. Used to define and modify the database schema structure." variant="orange" />
              <InfoCard title="DCL / TCL" description="Data Control Language (GRANT, REVOKE) and Transaction Control Language (COMMIT, ROLLBACK) for permissions and transactions." variant="purple" />
            </div>

            <div className="mt-6">
              <CodeBlock
                title="SQL Query Execution Order"
                language="sql"
                code={`-- SQL is written in this order but executed differently:
-- Written order:
SELECT   → FROM → WHERE → GROUP BY → HAVING → ORDER BY

-- Logical execution order:
-- 1. FROM / JOINs     (which tables?)
-- 2. WHERE            (filter rows)
-- 3. GROUP BY         (aggregate)
-- 4. HAVING           (filter groups)
-- 5. SELECT           (choose columns)
-- 6. ORDER BY         (sort result)
-- 7. LIMIT / TOP      (limit rows)`}
              />
            </div>
          </section>

          {/* SELECT */}
          <section id="select" data-testid="section-select">
            <SectionHeader
              title="SELECT & Filtering"
              badge="DQL"
              badgeColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              subtitle="The SELECT statement retrieves data from one or more tables. The WHERE clause filters which rows are returned."
            />
            <div className="space-y-4">
              {selectExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Basic SELECT"}>
                  <CodeBlock code={ex.code} language="sql" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* JOINs */}
          <section id="joins" data-testid="section-joins">
            <SectionHeader
              title="JOINs"
              badge="Joins"
              badgeColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              subtitle="JOINs combine rows from multiple tables based on a related column. Understanding join types is fundamental for working with relational data."
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER"].map((t) => (
                <div key={t} className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center" data-testid={`badge-join-${t.toLowerCase().replace(" ", "-")}`}>
                  <p className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-300">{t}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {joinExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "INNER JOIN"}>
                  <p className="text-sm text-muted-foreground mb-3">{ex.description}</p>
                  <CodeBlock code={ex.code} language="sql" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* Aggregations */}
          <section id="aggregations" data-testid="section-aggregations">
            <SectionHeader
              title="Aggregations & GROUP BY"
              badge="Aggregations"
              badgeColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              subtitle="Aggregate functions collapse multiple rows into a single value. GROUP BY splits the data into groups before aggregating."
            />
            <div className="space-y-4">
              {aggregationExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "GROUP BY with Aggregates"}>
                  <CodeBlock code={ex.code} language="sql" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* CTEs */}
          <section id="ctes" data-testid="section-ctes">
            <SectionHeader
              title="CTEs & Subqueries"
              badge="CTEs"
              badgeColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              subtitle="Common Table Expressions (CTEs) create named temporary result sets that you can reference in the main query. They make complex queries much more readable."
            />
            <div className="space-y-4">
              {cteExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Common Table Expression (CTE)"}>
                  <CodeBlock code={ex.code} language="sql" />
                </CollapsibleSection>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex gap-3">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-400">CTEs are not persisted — they exist only for the duration of the query. For reusable logic, consider views or stored procedures instead.</p>
            </div>
          </section>

          {/* Window Functions */}
          <section id="window" data-testid="section-window">
            <SectionHeader
              title="Window Functions"
              badge="Analytics"
              badgeColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              subtitle="Window functions perform calculations across a set of rows related to the current row — without collapsing the result like GROUP BY. They use the OVER() clause."
            />
            <CodeBlock
              title="Window Function Syntax"
              language="sql"
              code={`function_name(column)
OVER (
    [PARTITION BY partition_column]   -- like GROUP BY
    [ORDER BY order_column]           -- defines row order
    [ROWS/RANGE frame_spec]           -- optional frame
)`}
            />
            <div className="mt-4 space-y-4">
              {windowExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "ROW_NUMBER"}>
                  <CodeBlock code={ex.code} language="sql" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* DDL */}
          <section id="ddl" data-testid="section-ddl">
            <SectionHeader
              title="DDL — Schema Definition"
              badge="DDL"
              badgeColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              subtitle="Data Definition Language commands create and modify database objects like tables, constraints, and indexes."
            />
            <div className="space-y-4">
              {ddlExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "CREATE TABLE"}>
                  <CodeBlock code={ex.code} language="sql" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" data-testid="section-best-practices">
            <SectionHeader
              title="Best Practices"
              badge="Tips"
              badgeColor="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
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
