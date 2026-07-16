"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  Sparkles,
  ChevronRight,
  Clock,
  User,
  Tag,
  AlertCircle,
  CheckCircle2,
  Circle,
  Loader2,
  Inbox,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { tasks, teamMembers } from "@/lib/mock-data";
import type { Task, TaskStatus, TaskPriority } from "@/types";

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  backlog: { label: "Backlog", color: "text-muted-foreground", icon: Inbox },
  todo: { label: "Todo", color: "text-blue-500", icon: Circle },
  "in-progress": { label: "In Progress", color: "text-amber-500", icon: Loader2 },
  review: { label: "Review", color: "text-purple-500", icon: AlertCircle },
  done: { label: "Done", color: "text-emerald-500", icon: CheckCircle2 },
};

const priorityConfig: Record<TaskPriority, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "info" },
  high: { label: "High", variant: "warning" },
  urgent: { label: "Urgent", variant: "destructive" },
};

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const statuses: TaskStatus[] = ["backlog", "todo", "in-progress", "review", "done"];

  const getColumnTasks = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your project tasks with AI-powered insights.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => {
          const config = statusConfig[status];
          const columnTasks = getColumnTasks(status);
          return (
            <div key={status} className="min-w-[300px] w-[300px] shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <config.icon className={cn("h-4 w-4", config.color)} />
                <span className="text-sm font-medium">{config.label}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {columnTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/20"
                        onClick={() => setSelectedTask(task)}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
                              <Badge variant={priorityConfig[task.priority].variant} className="shrink-0 text-[10px]">
                                {priorityConfig[task.priority].label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {task.labels.map((label) => (
                                  <Badge key={label} variant="outline" className="text-[10px] px-1.5 py-0">
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                              {task.assignee && (
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                    {task.assignee.name.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selectedTask.title}</DialogTitle>
                  <Badge variant={priorityConfig[selectedTask.priority].variant}>
                    {priorityConfig[selectedTask.priority].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status</span>
                    <p className="font-medium capitalize">{selectedTask.status.replace("-", " ")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assignee</span>
                    <p className="font-medium">{selectedTask.assignee?.name || "Unassigned"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Hours</span>
                    <p className="font-medium">{selectedTask.estimatedHours || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Labels</span>
                    <div className="flex gap-1 mt-1">
                      {selectedTask.labels.map((l) => (
                        <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedTask.aiAnalysis && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">AI Analysis</h3>
                      </div>

                      <Card className="bg-primary/5 border-primary/10">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium mb-2">Summary</h4>
                          <p className="text-sm text-muted-foreground">{selectedTask.aiAnalysis.summary}</p>
                        </CardContent>
                      </Card>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Implementation Plan</h4>
                        <div className="space-y-2">
                          {selectedTask.aiAnalysis.implementationPlan.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                                {i + 1}
                              </span>
                              <span className="text-muted-foreground">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Complexity</h4>
                        <Badge variant={selectedTask.aiAnalysis.complexity === "high" ? "destructive" : selectedTask.aiAnalysis.complexity === "medium" ? "warning" : "success"}>
                          {selectedTask.aiAnalysis.complexity.charAt(0).toUpperCase() + selectedTask.aiAnalysis.complexity.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Suggested Files</h4>
                        <div className="space-y-1">
                          {selectedTask.aiAnalysis.suggestedFiles.map((file) => (
                            <code key={file} className="block text-xs bg-muted rounded px-2 py-1 font-mono">
                              {file}
                            </code>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Risks</h4>
                        <div className="space-y-1">
                          {selectedTask.aiAnalysis.risks.map((risk, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
                              <span className="text-muted-foreground">{risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
