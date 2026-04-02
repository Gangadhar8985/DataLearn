import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: "default" | "blue" | "green" | "orange" | "purple";
  className?: string;
}

const variantStyles = {
  default: "bg-card border-card-border",
  blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  green: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
  orange: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
  purple: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
  orange: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
  purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
};

export default function InfoCard({ title, description, icon, variant = "default", className }: InfoCardProps) {
  return (
    <div className={cn("border rounded-xl p-5 transition-all hover:shadow-md", variantStyles[variant], className)} data-testid={`card-info-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      {icon && (
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", iconStyles[variant])}>
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-base mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
