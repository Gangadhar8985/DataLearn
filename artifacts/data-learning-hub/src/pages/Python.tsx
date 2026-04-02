import { useState } from "react";
import { Code2, ChevronDown, ChevronRight, Lightbulb, AlertTriangle } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import SectionHeader from "@/components/SectionHeader";
import InfoCard from "@/components/InfoCard";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "basics", label: "Basics" },
  { id: "pandas", label: "Pandas" },
  { id: "numpy", label: "NumPy" },
  { id: "data-cleaning", label: "Data Cleaning" },
  { id: "visualization", label: "Visualization" },
  { id: "file-handling", label: "File Handling" },
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

const basicsExamples = [
  {
    title: "Data Types & Variables",
    code: `# Numbers
age = 30
price = 19.99
big_num = 1_000_000     # underscore for readability

# Strings
name = "Alice"
greeting = f"Hello, {name}!"   # f-string

# Lists (mutable, ordered)
fruits = ["apple", "banana", "cherry"]

# Tuples (immutable, ordered)
coordinates = (40.7128, -74.0060)

# Dictionaries (key-value pairs)
person = {"name": "Alice", "age": 30, "city": "NYC"}

# Sets (unordered, unique values)
unique_tags = {"python", "data", "sql"}`,
  },
  {
    title: "List Comprehensions",
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Basic comprehension
squares = [x**2 for x in numbers]
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# With filter
even_squares = [x**2 for x in numbers if x % 2 == 0]
# [4, 16, 36, 64, 100]

# Nested
matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]
# [[1, 2, 3], [2, 4, 6], [3, 6, 9]]

# Dict comprehension
word_lengths = {word: len(word) for word in ["apple", "cat", "banana"]}
# {'apple': 5, 'cat': 3, 'banana': 6}`,
  },
  {
    title: "Functions & Lambda",
    code: `# Regular function
def calculate_discount(price, discount_pct=10):
    """Apply a percentage discount to a price."""
    discount = price * (discount_pct / 100)
    return price - discount

# Default parameter
print(calculate_discount(100))       # 90.0
print(calculate_discount(100, 25))   # 75.0

# Lambda (anonymous function)
square = lambda x: x ** 2
double = lambda x: x * 2

# Useful with map, filter, sorted
prices = [29.99, 9.99, 49.99, 19.99]
sorted_prices = sorted(prices, key=lambda x: x)
# [9.99, 19.99, 29.99, 49.99]`,
  },
  {
    title: "Error Handling",
    code: `# try / except / else / finally
try:
    result = 100 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except ValueError:
    print("Invalid value")
else:
    print(f"Result: {result}")   # runs if no exception
finally:
    print("Always runs")         # cleanup code

# Raise your own exceptions
def validate_age(age):
    if age < 0:
        raise ValueError(f"Age cannot be negative: {age}")
    return age`,
  },
];

const pandasExamples = [
  {
    title: "Creating & Reading DataFrames",
    code: `import pandas as pd

# Create from dict
df = pd.DataFrame({
    "Name":  ["Alice", "Bob", "Carol"],
    "Sales": [5000, 3200, 4800],
    "Region": ["North", "South", "North"]
})

# Read from CSV
df = pd.read_csv("sales.csv")

# Read from Excel
df = pd.read_excel("report.xlsx", sheet_name="Sheet1")

# Read from SQL
import sqlalchemy
engine = sqlalchemy.create_engine("postgresql://user:pass@host/db")
df = pd.read_sql("SELECT * FROM sales", engine)

# Basic info
df.head(5)        # first 5 rows
df.tail(5)        # last 5 rows
df.info()         # columns, dtypes, non-null counts
df.describe()     # summary statistics
df.shape          # (rows, columns)`,
  },
  {
    title: "Selecting & Filtering",
    code: `# Select columns
df["Name"]               # Series (one column)
df[["Name", "Sales"]]    # DataFrame (multiple columns)

# Select rows by label (loc) or position (iloc)
df.loc[0]                # row at label 0
df.iloc[0:3]             # first 3 rows by position
df.loc[df["Region"] == "North"]   # filter rows

# Boolean filtering
high_sales = df[df["Sales"] > 4000]
north_high = df[(df["Region"] == "North") & (df["Sales"] > 4000)]

# query() method (string syntax)
result = df.query("Sales > 4000 and Region == 'North'")`,
  },
  {
    title: "GroupBy & Aggregation",
    code: `# Group by one column
region_totals = df.groupby("Region")["Sales"].sum()

# Group by multiple columns
df.groupby(["Region", "Category"])["Sales"].agg(["sum", "mean", "count"])

# Named aggregations (newer syntax)
summary = df.groupby("Region").agg(
    TotalSales=("Sales", "sum"),
    AvgSales=("Sales", "mean"),
    OrderCount=("OrderID", "count")
).reset_index()

# Pivot table
pivot = df.pivot_table(
    values="Sales",
    index="Region",
    columns="Category",
    aggfunc="sum",
    fill_value=0
)`,
  },
  {
    title: "Merging & Joining",
    code: `# Merge (like SQL JOIN)
result = pd.merge(
    df_orders,
    df_customers,
    on="CustomerID",
    how="left"    # left, right, inner, outer
)

# Merge on different column names
result = pd.merge(
    df_orders,
    df_products,
    left_on="ProductID",
    right_on="ID",
    how="inner"
)

# Concatenate DataFrames vertically (same columns)
combined = pd.concat([df_2023, df_2024], ignore_index=True)

# Concatenate horizontally (same rows)
combined = pd.concat([df_main, df_extras], axis=1)`,
  },
  {
    title: "Apply & Transform",
    code: `# Apply a function to a column
df["Sales_K"] = df["Sales"].apply(lambda x: x / 1000)

# Apply to multiple columns with axis=1 (row-wise)
def classify_sale(row):
    if row["Sales"] > 5000:
        return "High"
    elif row["Sales"] > 2000:
        return "Medium"
    return "Low"

df["Category"] = df.apply(classify_sale, axis=1)

# Map values
df["Region_Code"] = df["Region"].map({
    "North": "N", "South": "S", "East": "E", "West": "W"
})

# String operations
df["Name_Upper"] = df["Name"].str.upper()
df["Name_Clean"] = df["Name"].str.strip().str.title()`,
  },
];

const numpyExamples = [
  {
    title: "Arrays & Operations",
    code: `import numpy as np

# Create arrays
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 4))     # 3x4 array of zeros
c = np.ones((2, 3))      # 2x3 array of ones
d = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
e = np.linspace(0, 1, 5) # 5 evenly-spaced values

# Array info
a.shape    # (5,)
a.dtype    # dtype('int64')
a.ndim     # 1

# Element-wise operations (vectorized)
x = np.array([1, 2, 3])
y = np.array([4, 5, 6])
x + y    # [5, 7, 9]
x * y    # [4, 10, 18]
x ** 2   # [1, 4, 9]

# Broadcasting
matrix = np.ones((3, 3))
matrix * 5               # multiply every element by 5`,
  },
  {
    title: "Statistics with NumPy",
    code: `data = np.array([10, 20, 30, 40, 50, 60, 70])

np.mean(data)    # 40.0
np.median(data)  # 40.0
np.std(data)     # std deviation
np.var(data)     # variance
np.min(data)     # 10
np.max(data)     # 70
np.sum(data)     # 280
np.cumsum(data)  # running total

# Percentiles
np.percentile(data, 25)   # Q1
np.percentile(data, 75)   # Q3

# 2D array statistics
m = np.array([[1, 2, 3], [4, 5, 6]])
np.mean(m, axis=0)  # mean per column: [2.5, 3.5, 4.5]
np.mean(m, axis=1)  # mean per row: [2.0, 5.0]`,
  },
];

const cleaningExamples = [
  {
    title: "Handling Missing Values",
    code: `import pandas as pd

# Check for nulls
df.isnull().sum()          # nulls per column
df.isnull().sum().sum()    # total nulls

# Drop rows with any null
df.dropna(inplace=True)

# Drop rows only if specific columns are null
df.dropna(subset=["Email", "CustomerID"])

# Fill nulls with a value
df["Sales"].fillna(0, inplace=True)
df["Region"].fillna("Unknown", inplace=True)

# Fill with column mean / median
df["Age"].fillna(df["Age"].mean(), inplace=True)

# Forward fill (use previous value)
df["Price"].fillna(method="ffill")`,
  },
  {
    title: "Duplicates & Data Types",
    code: `# Check for duplicates
df.duplicated().sum()

# Remove duplicates
df.drop_duplicates(inplace=True)

# Drop duplicates based on specific columns
df.drop_duplicates(subset=["OrderID"], keep="first")

# Change data types
df["SaleDate"] = pd.to_datetime(df["SaleDate"])
df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
df["CustomerID"] = df["CustomerID"].astype(str)

# Strip whitespace from strings
df["Name"] = df["Name"].str.strip()

# Rename columns
df.rename(columns={"CustID": "CustomerID", "Amt": "Amount"}, inplace=True)`,
  },
  {
    title: "Outlier Detection",
    code: `import numpy as np
import pandas as pd

# IQR method
Q1 = df["Sales"].quantile(0.25)
Q3 = df["Sales"].quantile(0.75)
IQR = Q3 - Q1

lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

# Filter outliers
no_outliers = df[(df["Sales"] >= lower) & (df["Sales"] <= upper)]

# Z-score method
from scipy import stats
z_scores = np.abs(stats.zscore(df["Sales"]))
no_outliers = df[z_scores < 3]`,
  },
];

const vizExamples = [
  {
    title: "Matplotlib — Basic Plots",
    code: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Line plot
axes[0].plot(x, y, color="steelblue", linewidth=2)
axes[0].set_title("Sine Wave")
axes[0].set_xlabel("X")
axes[0].set_ylabel("sin(x)")
axes[0].grid(True, alpha=0.3)

# Bar chart
categories = ["A", "B", "C", "D"]
values = [23, 45, 12, 67]
axes[1].bar(categories, values, color="coral", edgecolor="white")
axes[1].set_title("Category Sales")

plt.tight_layout()
plt.savefig("chart.png", dpi=150, bbox_inches="tight")
plt.show()`,
  },
  {
    title: "Seaborn — Statistical Plots",
    code: `import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="whitegrid")

# Scatter with regression line
sns.lmplot(data=df, x="Spend", y="Revenue", hue="Region")

# Box plot — distribution per category
sns.boxplot(data=df, x="Category", y="Sales", palette="Set2")

# Heatmap — correlation matrix
corr = df.select_dtypes("number").corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm",
            center=0, square=True)

# Histogram with KDE
sns.histplot(df["Sales"], bins=30, kde=True, color="steelblue")

plt.tight_layout()
plt.show()`,
  },
];

const fileExamples = [
  {
    title: "CSV, Excel, JSON",
    code: `import pandas as pd

# CSV
df = pd.read_csv("data.csv", encoding="utf-8")
df.to_csv("output.csv", index=False)

# Excel (requires openpyxl)
df = pd.read_excel("report.xlsx", sheet_name="Sales")
df.to_excel("output.xlsx", sheet_name="Clean", index=False)

# JSON
import json
with open("data.json", "r") as f:
    data = json.load(f)

df = pd.read_json("data.json")
df.to_json("output.json", orient="records", indent=2)

# Write multiple sheets to Excel
with pd.ExcelWriter("multi_sheet.xlsx") as writer:
    df_sales.to_excel(writer, sheet_name="Sales", index=False)
    df_customers.to_excel(writer, sheet_name="Customers", index=False)`,
  },
  {
    title: "SQL Databases",
    code: `import pandas as pd
import sqlalchemy

# SQLite (no server needed)
engine = sqlalchemy.create_engine("sqlite:///mydb.sqlite")

# PostgreSQL
engine = sqlalchemy.create_engine(
    "postgresql://username:password@host:5432/dbname"
)

# Read from SQL
df = pd.read_sql("SELECT * FROM sales WHERE year = 2024", engine)
df = pd.read_sql_table("customers", engine)

# Write DataFrame to SQL table
df.to_sql("sales_clean", engine, if_exists="replace", index=False)

# Parameterized query (safe from SQL injection)
query = "SELECT * FROM sales WHERE region = :region"
df = pd.read_sql(query, engine, params={"region": "North"})`,
  },
];

const bestPractices = [
  { tip: "Use vectorized operations (pandas/NumPy) instead of Python for-loops — they are orders of magnitude faster on large datasets.", type: "good" },
  { tip: "Use .copy() when creating a subset of a DataFrame to avoid SettingWithCopyWarning and unintended mutations.", type: "good" },
  { tip: "Prefer pd.to_datetime() over manual string parsing for dates — it handles many formats automatically.", type: "good" },
  { tip: "Avoid using inplace=True — it can make code harder to debug and is often no faster than assignment.", type: "warn" },
  { tip: "Use context managers (with statements) when reading/writing files to ensure proper cleanup.", type: "good" },
  { tip: "Profile slow code with %timeit (Jupyter) or cProfile before optimizing — avoid premature optimization.", type: "good" },
  { tip: "Never hard-code credentials in scripts — use environment variables or config files excluded from version control.", type: "warn" },
];

export default function Python() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-testid="page-python">
      {/* Page header */}
      <div className="flex items-start gap-4 mb-10 pb-8 border-b border-border">
        <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 flex items-center justify-center flex-shrink-0">
          <Code2 className="w-7 h-7 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2.5 py-0.5 rounded-full border border-green-200 dark:border-green-800">
              Data Science
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="text-page-title">Python</h1>
          <p className="text-muted-foreground max-w-2xl">
            Python is the most popular language for data science and analytics. Its rich ecosystem — including pandas, NumPy, matplotlib, and scikit-learn — makes it indispensable for data manipulation, analysis, and visualization.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar navigation */}
        <aside className="lg:w-52 flex-shrink-0" data-testid="sidebar-python">
          <nav className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                data-testid={`nav-section-${s.id}`}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeSection === s.id
                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
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
              title="Python for Data"
              badge="Overview"
              badgeColor="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              subtitle="Python's data ecosystem provides everything from data loading to machine learning. The core libraries every data professional needs."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard title="pandas" description="The primary library for data manipulation. DataFrames are the core data structure — think of them as powerful in-memory spreadsheets." variant="green" />
              <InfoCard title="NumPy" description="Foundation for numerical computing in Python. Provides efficient n-dimensional arrays and mathematical functions." variant="blue" />
              <InfoCard title="matplotlib" description="The base plotting library for Python. Highly customizable, works well with pandas DataFrames." variant="orange" />
              <InfoCard title="seaborn" description="Statistical visualization library built on matplotlib. Beautiful default aesthetics and high-level API for common plot types." variant="purple" />
            </div>

            <div className="mt-6">
              <CodeBlock
                title="Quick Setup"
                language="bash"
                code={`# Install core data libraries
pip install pandas numpy matplotlib seaborn openpyxl sqlalchemy

# Or with conda
conda install pandas numpy matplotlib seaborn

# Check installed version
python -c "import pandas as pd; print(pd.__version__)"
python -c "import numpy as np; print(np.__version__)"

# Start Jupyter notebook
pip install jupyter
jupyter notebook`}
              />
            </div>
          </section>

          {/* Basics */}
          <section id="basics" data-testid="section-basics">
            <SectionHeader
              title="Python Basics"
              badge="Fundamentals"
              badgeColor="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              subtitle="Core Python concepts every data professional needs — data types, control flow, comprehensions, and error handling."
            />
            <div className="space-y-4">
              {basicsExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Data Types & Variables"}>
                  <CodeBlock code={ex.code} language="python" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* Pandas */}
          <section id="pandas" data-testid="section-pandas">
            <SectionHeader
              title="pandas"
              badge="Data Manipulation"
              badgeColor="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              subtitle="pandas is the workhorse of data manipulation in Python. The DataFrame is the central data structure — a table with labeled rows and columns."
            />
            <div className="space-y-4">
              {pandasExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Creating & Reading DataFrames"}>
                  <CodeBlock code={ex.code} language="python" />
                </CollapsibleSection>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 flex gap-3">
              <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 dark:text-green-400">Use df.info() and df.describe() at the start of any analysis to quickly understand your data's shape, types, and distribution.</p>
            </div>
          </section>

          {/* NumPy */}
          <section id="numpy" data-testid="section-numpy">
            <SectionHeader
              title="NumPy"
              badge="Numerical Computing"
              badgeColor="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              subtitle="NumPy provides the ndarray — a fast, memory-efficient multi-dimensional array. Most data science libraries are built on top of NumPy."
            />
            <div className="space-y-4">
              {numpyExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Arrays & Operations"}>
                  <CodeBlock code={ex.code} language="python" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* Data Cleaning */}
          <section id="data-cleaning" data-testid="section-data-cleaning">
            <SectionHeader
              title="Data Cleaning"
              badge="Data Quality"
              badgeColor="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              subtitle="Real-world data is messy. Data cleaning — handling nulls, duplicates, wrong types, and outliers — is often 80% of a data project."
            />
            <div className="space-y-4">
              {cleaningExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Handling Missing Values"}>
                  <CodeBlock code={ex.code} language="python" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* Visualization */}
          <section id="visualization" data-testid="section-visualization">
            <SectionHeader
              title="Data Visualization"
              badge="Charts"
              badgeColor="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              subtitle="Visualizing data reveals patterns, outliers, and trends that raw numbers hide. matplotlib gives you full control; seaborn makes common statistical plots effortless."
            />
            <div className="space-y-4">
              {vizExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "Matplotlib — Basic Plots"}>
                  <CodeBlock code={ex.code} language="python" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* File Handling */}
          <section id="file-handling" data-testid="section-file-handling">
            <SectionHeader
              title="File Handling & Databases"
              badge="I/O"
              badgeColor="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              subtitle="Data lives in CSV files, Excel workbooks, JSON APIs, and SQL databases. pandas and SQLAlchemy make reading from and writing to these sources straightforward."
            />
            <div className="space-y-4">
              {fileExamples.map((ex) => (
                <CollapsibleSection key={ex.title} title={ex.title} defaultOpen={ex.title === "CSV, Excel, JSON"}>
                  <CodeBlock code={ex.code} language="python" />
                </CollapsibleSection>
              ))}
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" data-testid="section-best-practices">
            <SectionHeader
              title="Best Practices"
              badge="Tips"
              badgeColor="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
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
