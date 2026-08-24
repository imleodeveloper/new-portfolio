"use client";

import { Globe, Building2, Cpu, Store, Briefcase, Wrench, Ellipsis, type LucideIcon } from "lucide-react";
import type { ServiceType } from "@/lib/types/lead";

const ICON_MAP: Record<ServiceType, LucideIcon> = {
  "landing-page": Globe,
  "institutional-site": Building2,
  "custom-system": Cpu,
  marketplace: Store,
  freelance: Briefcase,
  "it-services": Wrench,
  other: Ellipsis,
};

interface ServiceCardProps {
  id: ServiceType;
  label: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ServiceCard({
  id,
  label,
  description,
  isSelected,
  onClick,
}: ServiceCardProps) {
  const IconComponent = ICON_MAP[id];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer text-left ${
        isSelected
          ? "border-accent bg-accent/10 shadow-[0_0_12px_rgba(30,144,255,0.3)]"
          : "border-card-border bg-card-bg hover:border-gray-500 hover:bg-gray-800/50"
      }`}
    >
      <span
        className={`${
          isSelected ? "text-accent" : "text-muted"
        }`}
      >
        <IconComponent className="w-6 h-6" />
      </span>
      <span className="text-sm font-semibold text-center">{label}</span>
      <span className="text-xs text-muted text-center hidden sm:block">
        {description}
      </span>
    </button>
  );
}
