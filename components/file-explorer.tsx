"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Grid3x3,
  List,
  Folder,
  File,
  ImageIcon,
  FileText,
  FileCode,
  Clock,
  Star,
  Share2,
  MoreVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FileItem {
  id: string
  name: string
  type: "folder" | "file"
  fileType?: string
  size: number
  preview?: string
  modified: string
  starred?: boolean
}

const MOCK_FILES: FileItem[] = [
  { id: "1", name: "Documents", type: "folder", size: 0, modified: "2025-12-20" },
  { id: "2", name: "Images", type: "folder", size: 0, modified: "2025-12-21" },
  { id: "3", name: "project-plan.pdf", type: "file", fileType: "pdf", size: 2048000, modified: "2025-12-25" },
  {
    id: "4",
    name: "dashboard.png",
    type: "file",
    fileType: "image",
    size: 1024000,
    modified: "2025-12-26",
    preview: "/general-data-dashboard.png",
  },
  { id: "5", name: "data.json", type: "file", fileType: "json", size: 45000, modified: "2025-12-27" },
  { id: "6", name: "index.tsx", type: "file", fileType: "code", size: 8900, modified: "2025-12-28", starred: true },
  { id: "7", name: "readme.md", type: "file", fileType: "text", size: 3400, modified: "2025-12-28" },
]

interface FileExplorerProps {
  onFileSelect: (file: any) => void
  selectedFileId?: string
}

export function FileExplorer({ onFileSelect, selectedFileId }: FileExplorerProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "recent" | "starred">("all")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (folderId: string) => {
    const next = new Set(expandedFolders)
    if (next.has(folderId)) next.delete(folderId)
    else next.add(folderId)
    setExpandedFolders(next)
  }

  const filteredFiles = MOCK_FILES.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (filter === "starred") return file.starred
    if (filter === "recent") {
      const date = new Date(file.modified)
      const now = new Date("2025-12-28")
      const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    }
    return true
  })

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "-"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (file: FileItem) => {
    if (file.type === "folder") return <Folder className="w-4 h-4" />
    switch (file.fileType) {
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "code":
        return <FileCode className="w-4 h-4" />
      case "text":
        return <FileText className="w-4 h-4" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === "file") {
      onFileSelect({
        id: file.id,
        name: file.name,
        type: file.fileType || "file",
        size: file.size,
        preview: file.preview,
        content: file.fileType === "text" ? "# Sample Markdown\n\nThis is a preview of the file content." : undefined,
      })
    } else {
      toggleFolder(file.id)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border space-y-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Files</h2>

        {/* Navigation Categories */}
        <div className="space-y-1">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setFilter("all")}
          >
            <Folder className="w-4 h-4" /> All Files
          </Button>
          <Button
            variant={filter === "recent" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setFilter("recent")}
          >
            <Clock className="w-4 h-4" /> Recent
          </Button>
          <Button
            variant={filter === "starred" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setFilter("starred")}
          >
            <Star className="w-4 h-4" /> Starred
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 bg-sidebar-accent border-sidebar-border"
          />
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-sidebar-accent p-1 rounded-md">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex-1"
          >
            <List className="w-4 h-4 mr-1" />
            List
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex-1"
          >
            <Grid3x3 className="w-4 h-4 mr-1" />
            Grid
          </Button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        {viewMode === "list" ? (
          <div className="space-y-1">
            {filteredFiles.map((file) => (
              <div key={file.id} className="space-y-1">
                <div
                  className={cn(
                    "group relative w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-left",
                    selectedFileId === file.id && "bg-sidebar-accent ring-1 ring-primary/50",
                  )}
                >
                  <button
                    onClick={() => handleFileClick(file)}
                    className="flex-1 flex items-center gap-3 overflow-hidden"
                  >
                    <div
                      className={cn(
                        "text-sidebar-foreground transition-transform duration-200",
                        file.type === "folder" && expandedFolders.has(file.id) && "rotate-90 text-primary",
                      )}
                    >
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-sidebar-foreground truncate flex items-center gap-2">
                        {file.name}
                        {file.starred && <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {formatSize(file.size)} • {file.modified}
                      </div>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 bg-popover text-popover-foreground border-border"
                      >
                        <DropdownMenuItem className="gap-2">
                          <Star className="h-4 w-4" /> Star
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Share2 className="h-4 w-4" /> Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {file.type === "folder" && expandedFolders.has(file.id) && (
                  <div className="pl-6 border-l border-primary/10 ml-4 animate-in slide-in-from-left-2 duration-200">
                    <p className="text-[10px] text-muted-foreground font-mono italic p-2">Empty Cluster...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "group relative flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-sidebar-accent transition-colors",
                  selectedFileId === file.id && "bg-sidebar-accent ring-1 ring-primary/50",
                )}
              >
                <button onClick={() => handleFileClick(file)} className="flex flex-col items-center gap-2 w-full">
                  <div className="text-sidebar-foreground p-4 bg-sidebar-accent/50 rounded-lg group-hover:scale-110 transition-transform">
                    {getFileIcon(file)}
                  </div>
                  <div className="text-xs font-medium text-sidebar-foreground text-center truncate w-full">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{formatSize(file.size)}</div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
