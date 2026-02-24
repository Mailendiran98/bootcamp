import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: MetricCardProps) {
  return (
    <div className="card flex items-start gap-4">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg", color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
