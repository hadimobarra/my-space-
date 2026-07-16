"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "@/components/command-palette";
import { useAppStore } from "@/stores/app-store";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Topbar />
      <CommandPalette />
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="min-h-[calc(100vh-56px)] p-6"
      >
        {children}
      </motion.main>
    </div>
  );
}
