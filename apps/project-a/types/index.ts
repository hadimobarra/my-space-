export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  aiAnalysis?: TaskAnalysis;
}

export interface TaskAnalysis {
  summary: string;
  implementationPlan: string[];
  complexity: "low" | "medium" | "high";
  suggestedFiles: string[];
  risks: string[];
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  files: FileNode[];
}

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  size?: string;
}

export interface PullRequest {
  id: string;
  title: string;
  description: string;
  status: "open" | "merged" | "closed";
  author: User;
  branch: string;
  targetBranch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  createdAt: string;
  reviewStatus: "pending" | "approved" | "changes-requested";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface DocPage {
  id: string;
  title: string;
  content: string;
  icon: string;
  children?: DocPage[];
  createdAt: string;
  updatedAt: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}
