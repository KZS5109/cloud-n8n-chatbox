"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, PanelRightClose, PanelRightOpen, Lock, ShieldCheck } from "lucide-react"
import { FileExplorer } from "@/components/file-explorer"
import { ChatPanel } from "@/components/chat-panel"
import { PreviewPanel } from "@/components/preview-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const [selectedFile, setSelectedFile] = useState<{
    id: string
    name: string
    type: string
    size: number
    preview?: string
    content?: string
  } | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsPreviewOpen(false)
      } else {
        setIsPreviewOpen(true)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "Kunzaw5109") {
      setIsAuthenticated(true)
      setLoginError(false)
    } else {
      setLoginError(true)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background bg-grid-cyber relative overflow-hidden p-4">
        <div className="scanline pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 pointer-events-none" />

        <div className="w-full max-w-sm z-10 space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 glow-subtle">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter glow-text uppercase">Aegis_Core_Access</h1>
            <p className="text-xs text-muted-foreground font-mono">Authentication Required for Uplink</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="ACCESS_CODE"
                className={cn(
                  "bg-muted/30 border-border/50 text-center font-mono tracking-widest",
                  loginError && "border-red-500/50 animate-shake",
                )}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginError && (
                <p className="text-[10px] text-red-500 text-center font-mono uppercase">Invalid Security Token</p>
              )}
            </div>
            <Button type="submit" className="w-full font-mono text-xs uppercase tracking-[0.2em] h-11">
              Initiate_Sync
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative bg-grid-cyber">
      <div className="scanline pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Mobile Toggle Icons */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-50 text-muted-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground bg-background/50 backdrop-blur-md rounded-lg border border-border/50"
          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
        >
          {isPreviewOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
        </Button>
      </div>

      {/* Left Sidebar - File Explorer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar/95 backdrop-blur-xl transition-transform lg:relative lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <FileExplorer
          onFileSelect={(file) => {
            setSelectedFile(file)
            if (isMobile) {
              setIsMobileMenuOpen(false)
              setIsPreviewOpen(true)
            }
          }}
          selectedFileId={selectedFile?.id}
        />
      </div>

      {/* Middle - Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 lg:border-r border-border/50">
        <ChatPanel
          onFileSelect={(file) => {
            setSelectedFile(file)
            setIsPreviewOpen(true)
          }}
        />
      </div>

      {/* Right - Preview Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-full md:w-96 bg-card/95 backdrop-blur-2xl transition-transform lg:relative lg:translate-x-0",
          isPreviewOpen ? "translate-x-0" : "translate-x-full lg:hidden",
        )}
      >
        <PreviewPanel file={selectedFile} onClose={() => setIsPreviewOpen(false)} />
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 bg-background/50 backdrop-blur-md border-primary/20 hover:border-primary/50 text-primary glow-subtle transition-all hover:scale-110"
          onClick={() => setIsAuthenticated(false)}
        >
          <Lock className="w-5 h-5" />
        </Button>
      </div>

      {/* Overlay for mobile sidebars */}
      {(isMobileMenuOpen || (isMobile && isPreviewOpen)) && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false)
            setIsPreviewOpen(false)
          }}
        />
      )}
    </div>
  )
}
