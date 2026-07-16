"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GitPullRequest,
  Plus,
  Check,
  X,
  Clock,
  MessageSquare,
  Sparkles,
  Shield,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { pullRequests } from "@/lib/mock-data";

const statusColors = {
  open: "text-emerald-500",
  merged: "text-purple-500",
  closed: "text-red-500",
};

const reviewColors = {
  pending: "info" as const,
  approved: "success" as const,
  "changes-requested": "warning" as const,
};

const reviewLabels = {
  pending: "Pending Review",
  approved: "Approved",
  "changes-requested": "Changes Requested",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PullRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pull Requests</h1>
          <p className="text-muted-foreground">Review and manage pull requests with AI-powered insights.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New PR
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({pullRequests.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({pullRequests.filter((p) => p.status === "open").length})</TabsTrigger>
          <TabsTrigger value="merged">Merged ({pullRequests.filter((p) => p.status === "merged").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {pullRequests.map((pr) => (
              <motion.div key={pr.id} variants={item}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <GitPullRequest className={cn("h-4 w-4", statusColors[pr.status])} />
                            <h3 className="text-sm font-medium">{pr.title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{pr.description}</p>
                        </div>
                        <Badge variant={reviewColors[pr.reviewStatus]} className="shrink-0">
                          {reviewLabels[pr.reviewStatus]}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="bg-primary/10 text-primary text-[8px]">
                              {pr.author.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {pr.author.name}
                        </div>
                        <span className="font-mono text-[11px]">{pr.branch} → {pr.targetBranch}</span>
                        <span>{pr.filesChanged} files</span>
                        <span className="text-emerald-500">+{pr.additions}</span>
                        <span className="text-red-500">-{pr.deletions}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(pr.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <Sparkles className="h-3 w-3 text-primary" />
                          AI Review
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <MessageSquare className="h-3 w-3" />
                          Comment
                        </Button>
                        {pr.reviewStatus === "pending" && (
                          <>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-emerald-500 hover:text-emerald-600">
                              <Check className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-amber-500 hover:text-amber-600">
                              <X className="h-3 w-3" />
                              Request Changes
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="open" className="mt-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {pullRequests.filter((p) => p.status === "open").map((pr) => (
              <motion.div key={pr.id} variants={item}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <GitPullRequest className="h-4 w-4 text-emerald-500" />
                            <h3 className="text-sm font-medium">{pr.title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{pr.description}</p>
                        </div>
                        <Badge variant={reviewColors[pr.reviewStatus]}>
                          {reviewLabels[pr.reviewStatus]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="bg-primary/10 text-primary text-[8px]">
                              {pr.author.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {pr.author.name}
                        </div>
                        <span className="font-mono text-[11px]">{pr.branch} → {pr.targetBranch}</span>
                        <span>{pr.filesChanged} files</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="merged" className="mt-4">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {pullRequests.filter((p) => p.status === "merged").map((pr) => (
              <motion.div key={pr.id} variants={item}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <GitPullRequest className="h-4 w-4 text-purple-500" />
                        <h3 className="text-sm font-medium">{pr.title}</h3>
                        <Badge variant="success">Merged</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{pr.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
