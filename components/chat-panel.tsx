"use client"

import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, Sparkles, Loader2, User, Bot, FileText } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ChatPanelProps {
  onFileSelect: (file: any) => void
}

export function ChatPanel({ onFileSelect }: ChatPanelProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [n8nError, setN8nError] = useState<string | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your AI assistant. I can help you manage and analyze your cloud drive files. Ask me to search for documents, summarize images, or explain code!",
      },
    ],
    onResponse: (response) => {
      if (!response.ok) {
        setN8nError("CORE_LINK_FAILURE: n8n.sys not responding")
      }
    },
    onError: () => {
      setN8nError("CORE_LINK_FAILURE: n8n.sys connection refused")
    },
  })

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      console.log("[v0] Mock upload complete")
    }, 2000)
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between pr-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-subtle border border-primary/30">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight glow-text uppercase">Aegis Core</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">System Active</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] font-mono text-muted-foreground hidden sm:inline-flex"
          >
            v1.0.4-alpha
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {n8nError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase text-center animate-pulse">
            {n8nError}
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
              message.role === "user" ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border",
                message.role === "user"
                  ? "bg-secondary border-secondary text-secondary-foreground"
                  : "bg-primary/10 border-primary/20 text-primary",
              )}
            >
              {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={cn(
                "max-w-[85%] rounded-2xl p-4 shadow-sm transition-all",
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none glow-subtle"
                  : "bg-card border border-border rounded-tl-none",
              )}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{message.content}</div>

              {/* Mock suggested action for files mentioned */}
              {message.content.includes(".pdf") && (
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[10px] uppercase tracking-wider font-bold bg-background/50"
                    onClick={() => onFileSelect({ id: "3", name: "project-plan.pdf", type: "pdf", size: 2048000 })}
                  >
                    <FileText className="w-3 h-3 mr-2" />
                    Open Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 w-32">
              <div className="h-2 bg-muted rounded-full w-full mb-2" />
              <div className="h-2 bg-muted rounded-full w-2/3" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border bg-card/30 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative flex items-center gap-2 bg-background/80 border border-border rounded-xl p-2 pl-4 shadow-2xl">
            <input type="file" id="file-upload" className="hidden" onChange={handleUpload} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 text-muted-foreground hover:text-primary transition-colors",
                isUploading && "animate-pulse text-primary",
              )}
              asChild
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
              </label>
            </Button>
            <Input
              placeholder="Query the system..."
              value={input}
              onChange={handleInputChange}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/50 h-9"
            />
            <Button
              type="submit"
              disabled={isLoading || !input?.trim()}
              size="icon"
              className="h-9 w-9 glow-subtle hover:scale-105 transition-transform"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </form>
        <p className="mt-3 text-[10px] text-center text-muted-foreground font-mono uppercase tracking-[0.2em] opacity-50">
          Encrypted Neural Uplink Active
        </p>
      </div>
    </div>
  )
}
