"use client"

import type { ResumeData } from "@/types/resume"
import { ModernTemplate } from "./templates/modern-template"
import { ClassicTemplate } from "./templates/classic-template"
import { CreativeTemplate } from "./templates/creative-template"
import { MinimalTemplate } from "./templates/minimal-template"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

interface ResumePreviewProps {
  data: ResumeData
  template: string
}

export function ResumePreview({ data, template }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} />
      case "classic":
        return <ClassicTemplate data={data} />
      case "creative":
        return <CreativeTemplate data={data} />
      case "minimal":
        return <MinimalTemplate data={data} />
      default:
        return <ModernTemplate data={data} />
    }
  }

  const getTemplateName = () => {
    switch (template) {
      case "modern":
        return "Modern Professional"
      case "classic":
        return "Executive Classic"
      case "creative":
        return "Creative Portfolio"
      case "minimal":
        return "Minimal Clean"
      default:
        return "Modern Professional"
    }
  }

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-t-2xl border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Resume Preview</h3>
            <p className="text-sm text-gray-600">Live preview of your resume</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
          {getTemplateName()}
        </Badge>
      </div>

      {/* Resume Preview */}
      <Card className="overflow-hidden shadow-2xl border-0">
        <div className="bg-white" style={{ aspectRatio: "8.5/11", minHeight: "800px" }}>
          {renderTemplate()}
        </div>
      </Card>
    </div>
  )
}
