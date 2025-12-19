import Link from "next/link";
import { ReactElement } from "react";

interface DashboardCardProps {
  label: string;
  value: number;
  icon?: ReactElement;
  color?: string;
  description?: string;
  href?: string; // ADD THIS
}

const gradientMap: Record<string, string> = {
  blue: "linear-gradient(135deg, #3b82f6, #60a5fa)",
  green: "linear-gradient(135deg, #10b981, #34d399)",
  purple: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  yellow: "linear-gradient(135deg, #facc15, #fcd34d)",
  orange: "linear-gradient(135deg, #f97316, #fb923c)",
  red: "linear-gradient(135deg, #ef4444, #f87171)",
  teal: "linear-gradient(135deg, #14b8a6, #2dd4bf)",
  gray: "linear-gradient(135deg, #9ca3af, #d1d5db)",
};

export default function DashboardCard({
  label,
  value,
  icon,
  color = "gray",
  description,
  href,
}: DashboardCardProps) {
  const bgGradient = gradientMap[color] || gradientMap.gray;
  const iconColorClass = `text-${color}-100`;

const CardContent = (
  <div
    className="h-full" // fill grid cell
  >
    <div
      className="h-full p-6 rounded-lg shadow flex flex-col justify-between space-y-4
                 transition-transform hover:scale-[1.03] cursor-pointer"
      style={{ background: bgGradient }}
    >
      <div className="flex items-center space-x-4">
        {icon && <div className={`${iconColorClass} text-4xl`}>{icon}</div>}
        <div className="text-white">
          <h2 className="text-lg font-medium">{label}</h2>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
      </div>
      {description && (
        <p className="text-sm text-white/80 mt-1">{description}</p>
      )}
    </div>
  </div>
);

return href ? <Link href={href}>{CardContent}</Link> : CardContent;
}
