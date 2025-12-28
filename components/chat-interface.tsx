import { Send, Sparkles } from "lucide-react"

export function ChatInterface() {
  return (
    <div className="flex flex-col h-full bg-card/30">
      <header className="p-4 border-b border-border flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <span className="font-medium text-sm">AI Nebula Assistant</span>
      </header>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <div className="bg-muted p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
          Hello! I'm your AI assistant. I can help you organize files, search content, or even summarize documents. How
          can I help?
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask AI about your files..."
            className="w-full bg-muted border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:border-primary outline-none"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
