"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab: externalActiveTab,
  onTabChange,
  className,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || "");
  const activeTab = externalActiveTab ?? internalActiveTab;

  const handleTabChange = (id: string) => {
    setInternalActiveTab(id);
    onTabChange?.(id);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-alt p-1",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
