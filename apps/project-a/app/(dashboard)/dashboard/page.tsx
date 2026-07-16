"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  GitPullRequest,
  GitBranch,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { tasks, pullRequests, repositories, teamMembers, currentUser } from "@/lib/mock-data";

const productivityData = [
  { name: "Mon", tasks: 4, commits: 12 },
  { name: "Tue", tasks: 6, commits: 18 },
  { name: "Wed", tasks: 5, commits: 15 },
  { name: "Thu", tasks: 8, commits: 22 },
  { name: "Fri", tasks: 7, commits: 20 },
  { name: "Sat", tasks: 3, commits: 8 },
  { name: "Sun", tasks: 2, commits: 5 },
];

const aiUsageData = [
  { name: "Week 1", requests: 120 },
  { name: "Week 2", requests: 180 },
  { name: "Week 3", requests: 240 },
  { name: "Week 4", requests: 310 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stats = [
  {
    title: "Active Tasks",
    value: tasks.filter((t) => t.status === "in-progress").length,
    change: "+2",
    trend: "up",
    icon: CheckSquare,
    color: "text-blue-500",
  },
  {
    title: "Open PRs",
    value: pullRequests.filter((p) => p.status === "open").length,
    change: "+1",
    trend: "up",
    icon: GitPullRequest,
    color: "text-purple-500",
  },
  {
    title: "Repositories",
    value: repositories.length,
    change: "+0",
    trend: "neutral",
    icon: GitBranch,
    color: "text-emerald-500",
  },
  {
    title: "AI Requests",
    value: "310",
    change: "+28%",
    trend: "up",
    icon: Sparkles,
    color: "text-amber-500",
  },
];

export default function DashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : stat.trend === "down" ? (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                ) : null}
                <span className={stat.trend === "up" ? "text-emerald-500" : stat.trend === "down" ? "text-red-500" : "text-muted-foreground"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-7">
        <motion.div variants={item} className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Productivity</CardTitle>
              <CardDescription>Tasks completed and commits this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productivityData}>
                    <defs>
                      <linearGradient id="tasksGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="commitsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="tasks" stroke="#6366f1" fill="url(#tasksGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="commits" stroke="#22d3ee" fill="url(#commitsGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest team updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { user: teamMembers[1], action: "merged PR #42", time: "2h ago", icon: GitPullRequest },
                { user: teamMembers[2], action: "completed task: Kanban DnD", time: "4h ago", icon: CheckSquare },
                { user: teamMembers[0], action: "pushed 3 commits", time: "5h ago", icon: GitBranch },
                { user: teamMembers[3], action: "deployed to staging", time: "6h ago", icon: Zap },
                { user: teamMembers[4], action: "requested review on PR #41", time: "8h ago", icon: Clock },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {activity.user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name.split(" ")[0]}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Usage Trends</CardTitle>
              <CardDescription>Weekly AI request volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="requests" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Overview</CardTitle>
              <CardDescription>Team member contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.slice(0, 4).map((member) => {
                const memberTasks = tasks.filter((t) => t.assignee?.id === member.id);
                const completedTasks = memberTasks.filter((t) => t.status === "done").length;
                const totalTasks = memberTasks.length;
                const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{member.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {completedTasks}/{totalTasks} tasks
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
