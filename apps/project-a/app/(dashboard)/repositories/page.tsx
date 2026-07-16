"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Star,
  GitFork,
  Search,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { repositories } from "@/lib/mock-data";
import type { FileNode } from "@/types";

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  Python: "bg-yellow-500",
  MDX: "bg-purple-500",
  JavaScript: "bg-yellow-400",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
};

function FileTreeItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isFolder = node.type === "folder";

  return (
    <div>
      <button
        onClick={() => isFolder && setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted transition-colors",
          isFolder && "cursor-pointer"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          expanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-3.5" />
        )}
        {isFolder ? (
          <Folder className="h-3.5 w-3.5 shrink-0 text-blue-500" />
        ) : (
          <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 text-left">{node.name}</span>
        {node.size && (
          <span className="text-xs text-muted-foreground">{node.size}</span>
        )}
      </button>
      {isFolder && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function RepositoriesPage() {
  const [selectedRepo, setSelectedRepo] = useState(repositories[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">Browse and explore your project repositories.</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search repositories..." className="pl-9" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {repositories.map((repo) => (
            <motion.div key={repo.id} variants={item}>
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedRepo.id === repo.id && "border-primary ring-1 ring-primary/20"
                )}
                onClick={() => setSelectedRepo(repo)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">{repo.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{repo.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className={cn("h-2.5 w-2.5 rounded-full", languageColors[repo.language] || "bg-gray-500")} />
                        {repo.language}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stars}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {repo.forks}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                <CardTitle>{selectedRepo.name}</CardTitle>
              </div>
              <CardDescription>{selectedRepo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="files">
                <TabsList>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="commits">Commits</TabsTrigger>
                  <TabsTrigger value="branches">Branches</TabsTrigger>
                </TabsList>
                <TabsContent value="files" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="rounded-lg border">
                      {selectedRepo.files.map((file) => (
                        <FileTreeItem key={file.name} node={file} />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="commits" className="mt-4">
                  <div className="space-y-3">
                    {[
                      { hash: "a1b2c3d", message: "feat: Add AI chat streaming", author: "Alex Chen", time: "2 hours ago" },
                      { hash: "e4f5g6h", message: "fix: Dark mode toggle flicker", author: "Emily Park", time: "5 hours ago" },
                      { hash: "i7j8k9l", message: "chore: Update dependencies", author: "David Liu", time: "1 day ago" },
                      { hash: "m0n1o2p", message: "feat: Kanban drag-and-drop", author: "Marcus Johnson", time: "2 days ago" },
                    ].map((commit) => (
                      <div key={commit.hash} className="flex items-center gap-3 rounded-lg border p-3">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{commit.hash}</code>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{commit.message}</p>
                          <p className="text-xs text-muted-foreground">{commit.author} · {commit.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="branches" className="mt-4">
                  <div className="space-y-2">
                    {["main", "feat/ai-chat-streaming", "feat/kanban-dnd", "fix/dark-mode-flicker"].map((branch) => (
                      <div key={branch} className="flex items-center gap-2 rounded-lg border p-3">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{branch}</span>
                        {branch === "main" && <Badge variant="secondary" className="ml-auto text-xs">Default</Badge>}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
