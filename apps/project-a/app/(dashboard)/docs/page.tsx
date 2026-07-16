"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Sparkles,
  ChevronRight,
  Edit3,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { docPages } from "@/lib/mock-data";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DocsPage() {
  const [selectedPage, setSelectedPage] = useState(docPages[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const renderMarkdown = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold mb-4 mt-6">{line.slice(2)}</h1>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold mb-3 mt-5">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold mb-2 mt-4">{line.slice(4)}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-muted-foreground mb-1">{line.slice(2)}</li>;
      if (line.startsWith("```")) return null;
      if (line.trim() === "") return <br key={i} />;
      const parts = line.split(/(`[^`]+`)/g);
      return (
        <p key={i} className="text-sm text-muted-foreground mb-2">
          {parts.map((part, j) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              return <code key={j} className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">{part.slice(1, -1)}</code>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground">Create and manage project documentation with AI assistance.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search docs..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="space-y-1">
            {docPages
              .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    selectedPage.id === page.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <span className="text-base">{page.icon}</span>
                  <span className="flex-1 truncate">{page.title}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                </button>
              ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <div className="flex items-center justify-between border-b px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="text-base">{selectedPage.icon}</span>
                <h2 className="font-semibold">{selectedPage.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI Assist
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="max-w-none">
                {renderMarkdown(selectedPage.content)}
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Last updated {new Date(selectedPage.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
