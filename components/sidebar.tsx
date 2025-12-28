import type React from "react"
import { HardDrive, MessageSquare, Clock, Star, Settings, User } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <HardDrive className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary">Nebula Drive</span>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<HardDrive className="w-4 h-4" />} label="All Files" active />
          <SidebarItem icon={<Clock className="w-4 h-4" />} label="Recent" />
          <SidebarItem icon={<Star className="w-4 h-4" />} label="Favorites" />
          <SidebarItem icon={<MessageSquare className="w-4 h-4" />} label="AI Assistant" />
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <SidebarItem icon={<Settings className="w-4 h-4" />} label="Settings" />
        <SidebarItem icon={<User className="w-4 h-4" />} label="Account" />
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(157,78,221,0.4)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
