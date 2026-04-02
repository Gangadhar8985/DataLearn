import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, badge, badgeColor = "bg-primary/10 text-primary", className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {badge && (
        <span className={cn("inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider", badgeColor)}>
          {badge}
        </span>
      )}
      <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground leading-relaxed max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
