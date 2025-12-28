"use client"

import { FileText, ImageIcon, FileCode, File, Download, Share2, Info, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PreviewPanelProps {
  file: {
    id: string
    name: string
    type: string
    size: number
    preview?: string
    content?: string
    modified?: string
  } | null
  onClose?: () => void
}

export function PreviewPanel({ file, onClose }: PreviewPanelProps) {
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-card/20">
        <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 border border-primary/10 glow-subtle">
          <File className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-sm font-bold tracking-widest uppercase glow-text mb-2">Null Data Stream</h3>
        <p className="text-xs text-muted-foreground font-mono leading-relaxed max-w-[200px]">
          Select a localized file entity to initialize the holographic preview subsystem.
        </p>
      </div>
    )
  }

  const formatSize = (bytes: number) => {
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = () => {
    switch (file.type) {
      case "image":
        return <ImageIcon className="w-5 h-5" />
      case "code":
        return <FileCode className="w-5 h-5" />
      case "text":
        return <FileText className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Entity Manifest
            </span>
          </div>
          <div className="flex items-center gap-1">
            {onClose && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground lg:hidden" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 glow-subtle">
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate glow-text mb-1">{file.name}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-mono text-secondary-foreground">
                {file.type.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{formatSize(file.size)}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <div className="px-4 border-b border-border">
          <TabsList className="bg-transparent w-full justify-start gap-6 p-0 h-12">
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none h-full px-0 text-[10px] font-mono uppercase tracking-widest"
            >
              Visualizer
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 border-primary rounded-none h-full px-0 text-[10px] font-mono uppercase tracking-widest"
            >
              Metadata
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="flex-1 min-h-0 mt-0 focus-visible:ring-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              {file.type === "image" && file.preview && (
                <div className="relative group animate-in zoom-in-95 duration-500">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500" />
                  <img
                    src={file.preview || "/placeholder.svg"}
                    alt={file.name}
                    className="relative w-full rounded-lg border border-border shadow-2xl"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {file.type === "text" && file.content && (
                <div className="font-mono text-[11px] leading-relaxed p-4 bg-muted/30 rounded-xl border border-border/50 animate-in slide-in-from-right-4 duration-500">
                  <pre className="whitespace-pre-wrap text-muted-foreground">
                    <span className="text-primary/50">001 | </span>
                    {file.content}
                  </pre>
                </div>
              )}

              {file.type === "code" && (
                <div className="font-mono text-[11px] leading-relaxed p-4 bg-background border border-border rounded-xl shadow-inner animate-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    <span className="ml-2 opacity-50 text-[9px] uppercase tracking-tighter">Source_Inspector.sys</span>
                  </div>
                  <pre className="text-primary/90">
                    <span className="text-muted-foreground/30">01 </span>
                    <span className="text-accent">import</span> React <span className="text-accent">from</span>{" "}
                    <span className="text-green-500">'react'</span>
                    {"\n"}
                    <span className="text-muted-foreground/30">02 </span>
                    {"\n"}
                    <span className="text-muted-foreground/30">03 </span>
                    <span className="text-accent">export function</span>{" "}
                    <span className="text-yellow-500">Component</span>() {"{"}
                    {"\n"}
                    <span className="text-muted-foreground/30">04 </span> <span className="text-accent">return</span> (
                    {"\n"}
                    <span className="text-muted-foreground/30">05 </span> &lt;
                    <span className="text-yellow-500">div</span>
                    &gt;Hello World&lt;/<span className="text-yellow-500">div</span>&gt;
                    {"\n"}
                    <span className="text-muted-foreground/30">06 </span> ){"\n"}
                    <span className="text-muted-foreground/30">07 </span>
                    {"}"}
                  </pre>
                </div>
              )}

              {file.type === "pdf" && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-3xl animate-in fade-in duration-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <FileText className="relative w-16 h-16 text-primary mb-4" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Encrypted PDF</h4>
                  <p className="text-[10px] text-muted-foreground font-mono">Stream available via secure downlink</p>
                </div>
              )}

              {/* Generic placeholder for unknown types */}
              {!["image", "text", "code", "pdf"].includes(file.type) && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <File className="w-12 h-12 text-muted-foreground/20 mb-4" />
                  <p className="text-xs text-muted-foreground italic">Visual representation mapping unavailable.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="details" className="flex-1 mt-0 focus-visible:ring-0">
          <div className="p-6 space-y-6 font-mono">
            <div className="space-y-4">
              <h4 className="text-[10px] text-primary font-bold uppercase tracking-[0.3em]">Hardware_Tags</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                  <p className="text-[9px] text-muted-foreground mb-1">ALLOCATION</p>
                  <p className="text-xs">{formatSize(file.size)}</p>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border border-border/50">
                  <p className="text-[9px] text-muted-foreground mb-1">MODIFIED</p>
                  <p className="text-xs truncate">{file.modified || "2025.12.28"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] text-primary font-bold uppercase tracking-[0.3em]">Network_Stats</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">ACCESS_LVL</span>
                  <span className="text-green-500">AUTHORIZED</span>
                </div>
                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%] animate-pulse" />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">ENCRYPTION</span>
                  <span>AES-256-GCM</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer / Quick Actions */}
      <div className="p-4 border-t border-border bg-background/20 mt-auto">
        <Button className="w-full font-mono text-[10px] uppercase tracking-[0.2em] glow-subtle h-10">
          Initialize Sync
        </Button>
      </div>
    </div>
  )
}
