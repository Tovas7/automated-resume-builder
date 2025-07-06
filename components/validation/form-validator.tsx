"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface ValidationRule {
  id: string
  field: string
  message: string
  severity: "error" | "warning" | "info"
  check: (data: ResumeData) => boolean
}

interface FormValidatorProps {
  resumeData: ResumeData
  currentStep: string
}

export function FormValidator({ resumeData, currentStep }: FormValidatorProps) {
  const [validationResults, setValidationResults] = useState<ValidationRule[]>([])

  const validationRules: ValidationRule[] = [
    // Personal Info Validations
    {
      id: "email_format",
      field: "personal",
      message: "Please enter a valid email address",
      severity: "error",
      check: (data) => {
        const email = data.personalInfo.email
        return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
    },
    {
      id: "phone_format",
      field: "personal",
      message: "Phone number should include area code",
      severity: "warning",
      check: (data) => {
        const phone = data.personalInfo.phone
        return !phone || phone.replace(/\D/g, "").length >= 10
      },
    },
    {
      id: "summary_length",
      field: "personal",
      message: "Professional summary should be 50-200 words for optimal impact",
      severity: "info",
      check: (data) => {
        const summary = data.personalInfo.summary
        if (!summary) return true
        const wordCount = summary.trim().split(/\s+/).length
        return wordCount >= 50 && wordCount <= 200
      },
    },

    // Experience Validations
    {
      id: "experience_descriptions",
      field: "experience",
      message: "Add detailed descriptions to showcase your achievements",
      severity: "warning",
      check: (data) => {
        return data.experience.every((exp) => exp.description.some((desc) => desc.trim().length > 30))
      },
    },
    {
      id: "experience_metrics",
      field: "experience",
      message: "Include quantifiable achievements (numbers, percentages, dollar amounts)",
      severity: "info",
      check: (data) => {
        const hasMetrics = data.experience.some((exp) =>
          exp.description.some((desc) => /\d+[%$]?|\d+\s*(percent|million|thousand|k\b)/i.test(desc)),
        )
        return hasMetrics || data.experience.length === 0
      },
    },

    // Skills Validations
    {
      id: "skills_count",
      field: "skills",
      message: "Add at least 8-12 relevant skills to strengthen your profile",
      severity: "info",
      check: (data) => data.skills.length >= 8,
    },
    {
      id: "skills_categories",
      field: "skills",
      message: "Organize skills into different categories for better readability",
      severity: "info",
      check: (data) => {
        const categories = new Set(data.skills.map((s) => s.category))
        return categories.size >= 3 || data.skills.length < 6
      },
    },

    // Education Validations
    {
      id: "education_dates",
      field: "education",
      message: "Ensure graduation dates are consistent and realistic",
      severity: "warning",
      check: (data) => {
        return data.education.every((edu) => {
          if (!edu.startDate || !edu.endDate) return true
          return new Date(edu.startDate) < new Date(edu.endDate)
        })
      },
    },

    // Projects Validations
    {
      id: "project_descriptions",
      field: "projects",
      message: "Add detailed project descriptions with technologies and outcomes",
      severity: "info",
      check: (data) => {
        return (
          data.projects.length === 0 ||
          data.projects.every((proj) => proj.description.length > 50 && proj.technologies.length > 0)
        )
      },
    },
  ]

  useEffect(() => {
    const currentRules = validationRules.filter((rule) => rule.field === currentStep || currentStep === "review")

    const failedRules = currentRules.filter((rule) => !rule.check(resumeData))
    setValidationResults(failedRules)
  }, [resumeData, currentStep])

  if (validationResults.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Great job!</strong> This section looks good. No validation issues found.
        </AlertDescription>
      </Alert>
    )
  }

  const errors = validationResults.filter((r) => r.severity === "error")
  const warnings = validationResults.filter((r) => r.severity === "warning")
  const infos = validationResults.filter((r) => r.severity === "info")

  return (
    <div className="space-y-3">
      {errors.map((rule) => (
        <Alert key={rule.id} className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{rule.message}</span>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-xs">
                Error
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      ))}

      {warnings.map((rule) => (
        <Alert key={rule.id} className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <span>{rule.message}</span>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                Warning
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      ))}

      {infos.map((rule) => (
        <Alert key={rule.id} className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>{rule.message}</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                Tip
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
