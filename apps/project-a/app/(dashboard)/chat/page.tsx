"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Plus,
  MessageSquare,
  Trash2,
  Code,
  FileText,
  Lightbulb,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";

const suggestedPrompts = [
  { icon: Code, label: "Explain this code", prompt: "Can you explain how this code works and what it does?" },
  { icon: FileText, label: "Write documentation", prompt: "Write comprehensive documentation for this component." },
  { icon: Lightbulb, label: "Suggest improvements", prompt: "Suggest improvements for this codebase." },
  { icon: Zap, label: "Fix a bug", prompt: "Help me debug and fix this issue." },
];

const models = ["GPT-4o", "Claude 3.5 Sonnet", "Gemini Pro"];

function simulateAIResponse(userMessage: string): string {
  const responses: Record<string, string> = {
    default: `Great question! Here's my analysis:\n\n## Overview\n\nBased on your request, I can provide a comprehensive solution. Let me break this down into key areas:\n\n### Key Points\n\n1. **Architecture**: The solution follows a modular architecture pattern\n2. **Performance**: Optimized for sub-100ms response times\n3. **Scalability**: Designed to handle horizontal scaling\n\n### Code Example\n\n\`\`\`typescript\nimport { useState, useEffect } from 'react';\n\nexport function useCustomHook() {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    async function fetchData() {\n      const response = await fetch('/api/data');\n      const json = await response.json();\n      setData(json);\n      setLoading(false);\n    }\n    fetchData();\n  }, []);\n\n  return { data, loading };\n}\n\`\`\`\n\n### Next Steps\n\nWould you like me to elaborate on any of these points?`,
    explain: `This code implements a custom React hook for data fetching with the following characteristics:\n\n1. **State Management**: Uses \`useState\` for data and loading states\n2. **Side Effects**: \`useEffect\` handles the async data fetching\n3. **Error Handling**: Can be extended with try-catch blocks\n4. **Cleanup**: Should include abort controller for cleanup\n\nThe hook pattern is ideal for:\n- Reusable data fetching logic\n- Component-level state management\n- Clean separation of concerns`,
    bug: `I've identified the potential issue:\n\n## Root Cause\n\nThe bug is likely caused by a race condition in the state update. When the component unmounts during an async operation, the state update is attempted on an unmounted component.\n\n## Solution\n\n\`\`\`typescript\nuseEffect(() => {\n  let cancelled = false;\n  \n  async function fetchData() {\n    try {\n      const response = await fetch('/api/data');\n      const json = await response.json();\n      if (!cancelled) {\n        setData(json);\n      }\n    } catch (error) {\n      if (!cancelled) {\n        setError(error);\n      }\n    } finally {\n      if (!cancelled) {\n        setLoading(false);\n      }\n    }\n  }\n  \n  fetchData();\n  return () => { cancelled = true; };\n}, []);\n\`\`\`\n\nThis ensures no state updates happen after unmounting.`,
  };

  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes("explain")) return responses.explain;
  if (lowerMessage.includes("bug") || lowerMessage.includes("fix")) return responses.bug;
  return responses.default;
}

export default function ChatPage() {
  const { conversations, activeConversationId, setActiveConversation, addMessage, createConversation, isStreaming, setIsStreaming } = useChatStore();
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation(input.slice(0, 50) + (input.length > 50 ? "..." : ""));
    }

    const userMessage = {
      id: Math.random().toString(36).substring(2, 15),
      role: "user" as const,
      content: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(convId, userMessage);
    setInput("");
    setIsStreaming(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiMessage = {
      id: Math.random().toString(36).substring(2, 15),
      role: "assistant" as const,
      content: simulateAIResponse(input),
      timestamp: new Date().toISOString(),
    };

    addMessage(convId, aiMessage);
    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="flex w-64 flex-col gap-2">
        <Button onClick={() => { createConversation("New Chat"); }} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  conv.id === activeConversationId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex flex-1 flex-col rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">AI Assistant</span>
            <Badge variant="secondary" className="text-xs">
              {selectedModel}
            </Badge>
          </div>
          <div className="flex gap-1">
            {models.map((model) => (
              <Button
                key={model}
                variant={model === selectedModel ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedModel(model)}
                className="text-xs h-7"
              >
                {model}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-2xl bg-primary/10 p-4 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                I can help with code review, debugging, documentation, architecture decisions, and more.
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-lg w-full">
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt.label}
                    variant="outline"
                    className="justify-start gap-2 h-auto py-3"
                    onClick={() => setInput(prompt.prompt)}
                  >
                    <prompt.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs">{prompt.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "group flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "relative max-w-[70%] rounded-xl px-4 py-3 text-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.role === "assistant" && (
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="absolute -right-2 -top-2 hidden group-hover:flex h-7 w-7 items-center justify-center rounded-md border bg-background shadow-sm hover:bg-muted"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content.split("\n").map((line, i) => {
                          if (line.startsWith("```")) {
                            return null;
                          }
                          if (line.startsWith("## ")) {
                            return <h2 key={i} className="text-base font-semibold mt-2 mb-1">{line.slice(3)}</h2>;
                          }
                          if (line.startsWith("### ")) {
                            return <h3 key={i} className="text-sm font-semibold mt-2 mb-1">{line.slice(4)}</h3>;
                          }
                          if (line.startsWith("- ") || line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                            return <li key={i} className="ml-4 list-disc">{line.replace(/^[-\d.]+\s*/, "")}</li>;
                          }
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>;
                          }
                          if (line.trim() === "") {
                            return <br key={i} />;
                          }
                          const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
                          return (
                            <p key={i}>
                              {parts.map((part, j) => {
                                if (part.startsWith("`") && part.endsWith("`")) {
                                  return <code key={j} className="rounded bg-muted-foreground/20 px-1 py-0.5 text-xs">{part.slice(1, -1)}</code>;
                                }
                                if (part.startsWith("**") && part.endsWith("**")) {
                                  return <strong key={j}>{part.slice(2, -2)}</strong>;
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-muted">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-xl bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything... (Shift+Enter for new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              size="icon"
              className="h-[60px] w-[60px] shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
