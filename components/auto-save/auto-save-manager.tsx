"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudOff, Save, CheckCircle } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface AutoSaveManagerProps {
  resumeData: ResumeData
  selectedTemplate: string
  onDataRestore?: (data: ResumeData, template: string) => void
}

export function AutoSaveManager({ resumeData, selectedTemplate, onDataRestore }: AutoSaveManagerProps) {
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    const saveData = async () => {
      setSaveStatus("saving")

      try {
        // Save to localStorage
        const dataToSave = {
          resumeData,
          selectedTemplate,
          timestamp: new Date().toISOString(),
        }

        localStorage.setItem("resumeai_autosave", JSON.stringify(dataToSave))

        // Simulate cloud save delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        setSaveStatus("saved")
        setLastSaved(new Date())
      } catch (error) {
        setSaveStatus("error")
        console.error("Auto-save failed:", error)
      }
    }

    // Debounce auto-save
    const timeoutId = setTimeout(saveData, 2000)
    return () => clearTimeout(timeoutId)
  }, [resumeData, selectedTemplate])

  useEffect(() => {
    // Restore data on component mount
    const restoreData = () => {
      try {
        const saved = localStorage.getItem("resumeai_autosave")
        if (saved && onDataRestore) {
          const { resumeData: savedData, selectedTemplate: savedTemplate, timestamp } = JSON.parse(saved)
          const saveTime = new Date(timestamp)
          const now = new Date()
          const hoursSinceLastSave = (now.getTime() - saveTime.getTime()) / (1000 * 60 * 60)

          // Only restore if saved within last 24 hours
          if (hoursSinceLastSave < 24) {
            onDataRestore(savedData, savedTemplate)
            setLastSaved(saveTime)
          }
        }
      } catch (error) {
        console.error("Failed to restore auto-saved data:", error)
      }
    }

    restoreData()
  }, [onDataRestore])

  const getStatusIcon = () => {
    switch (saveStatus) {
      case "saving":
        return <Save className="w-3 h-3 animate-pulse" />
      case "saved":
        return <CheckCircle className="w-3 h-3" />
      case "error":
        return <CloudOff className="w-3 h-3" />
      default:
        return <Cloud className="w-3 h-3" />
    }
  }

  const getStatusColor = () => {
    switch (saveStatus) {
      case "saving":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "saved":
        return "bg-green-100 text-green-700 border-green-200"
      case "error":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving..."
      case "saved":
        return lastSaved ? `Saved ${formatTime(lastSaved)}` : "Saved"
      case "error":
        return "Save failed"
      default:
        return "Auto-save"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    return date.toLocaleDateString()
  }

  return (
    <Badge variant="outline" className={`${getStatusColor()} flex items-center space-x-1 text-xs`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </Badge>
  )
}
