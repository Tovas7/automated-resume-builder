"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Lock, Target, TrendingUp, Zap } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface ProgressTrackerProps {
  resumeData: ResumeData
  selectedTemplate: string
  currentStep: number
  completedSteps: Set<number>
  atsScore: number | null
}

export function ProgressTracker({
  resumeData,
  selectedTemplate,
  currentStep,
  completedSteps,
  atsScore,
}: ProgressTrackerProps) {
  const calculateCompletionScore = () => {
    let score = 0
    const maxScore = 100

    // Template selection (10 points)
    if (selectedTemplate) score += 10

    // Personal info (20 points)
    const { personalInfo } = resumeData
    if (personalInfo.fullName) score += 4
    if (personalInfo.email) score += 4
    if (personalInfo.phone) score += 4
    if (personalInfo.location) score += 4
    if (personalInfo.summary && personalInfo.summary.length > 50) score += 4

    // Experience (25 points)
    if (resumeData.experience.length > 0) score += 10
    if (resumeData.experience.length >= 2) score += 8
    if (resumeData.experience.some((exp) => exp.description.some((desc) => desc.length > 30))) score += 7

    // Education (15 points)
    if (resumeData.education.length > 0) score += 10
    if (resumeData.education.some((edu) => edu.gpa)) score += 5

    // Skills (15 points)
    if (resumeData.skills.length >= 5) score += 8
    if (resumeData.skills.length >= 10) score += 7

    // Projects (10 points)
    if (resumeData.projects.length > 0) score += 5
    if (resumeData.projects.length >= 2) score += 5

    // Certifications (5 points)
    if (resumeData.certifications.length > 0) score += 5

    return Math.min(score, maxScore)
  }

  const getQualityMetrics = () => {
    const metrics = []

    // Content Quality
    const summaryLength = resumeData.personalInfo.summary?.length || 0
    metrics.push({
      label: "Summary Quality",
      value: Math.min((summaryLength / 150) * 100, 100),
      status: summaryLength >= 100 ? "excellent" : summaryLength >= 50 ? "good" : "needs-work",
    })

    // Experience Detail
    const hasDetailedExperience = resumeData.experience.some((exp) => exp.description.some((desc) => desc.length > 50))
    metrics.push({
      label: "Experience Detail",
      value: hasDetailedExperience ? 100 : resumeData.experience.length > 0 ? 60 : 0,
      status: hasDetailedExperience ? "excellent" : resumeData.experience.length > 0 ? "good" : "needs-work",
    })

    // Skills Diversity
    const skillCategories = new Set(resumeData.skills.map((s) => s.category)).size
    metrics.push({
      label: "Skills Diversity",
      value: Math.min((skillCategories / 5) * 100, 100),
      status: skillCategories >= 4 ? "excellent" : skillCategories >= 2 ? "good" : "needs-work",
    })

    // ATS Optimization
    if (atsScore !== null) {
      metrics.push({
        label: "ATS Optimization",
        value: atsScore,
        status: atsScore >= 90 ? "excellent" : atsScore >= 75 ? "good" : "needs-work",
      })
    }

    return metrics
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200"
      case "good":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "needs-work":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const completionScore = calculateCompletionScore()
  const qualityMetrics = getQualityMetrics()

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Resume Completion</h3>
                <p className="text-gray-600">Overall progress towards a complete resume</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-lg px-3 py-1">
              {completionScore}%
            </Badge>
          </div>

          <div className="relative">
            <Progress value={completionScore} className="h-4" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Getting Started</span>
              <span>Good Progress</span>
              <span>Almost Done</span>
              <span>Complete</span>
            </div>
          </div>

          {completionScore === 100 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-semibold">Congratulations! Your resume is complete!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card className="border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quality Metrics</h3>
              <p className="text-gray-600">How well-optimized is your resume?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-white rounded-xl border border-gray-200/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">{metric.label}</span>
                  <Badge variant="outline" className={getStatusColor(metric.status)}>
                    {Math.round(metric.value)}%
                  </Badge>
                </div>
                <div className="relative">
                  <Progress value={metric.value} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Progress */}
      <Card className="border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Step Progress</h3>
              <p className="text-gray-600">Track your journey through each section</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { step: 0, label: "Template", icon: Circle },
              { step: 1, label: "Personal", icon: Circle },
              { step: 2, label: "Experience", icon: Circle },
              { step: 3, label: "Education", icon: Circle },
              { step: 4, label: "Skills", icon: Circle },
              { step: 5, label: "Projects", icon: Circle },
              { step: 6, label: "Certificates", icon: Circle },
              { step: 7, label: "Review", icon: Circle },
            ].map((item) => {
              const isCompleted = completedSteps.has(item.step)
              const isCurrent = currentStep === item.step
              const isAccessible =
                completedSteps.has(item.step) || item.step === currentStep || item.step === currentStep + 1

              return (
                <div
                  key={item.step}
                  className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                    isCompleted
                      ? "bg-green-100 border-green-200 text-green-700"
                      : isCurrent
                        ? "bg-blue-100 border-blue-200 text-blue-700"
                        : isAccessible
                          ? "bg-gray-50 border-gray-200 text-gray-600"
                          : "bg-gray-50 border-gray-200 text-gray-400 opacity-50"
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Circle className="w-5 h-5 fill-current" />
                    ) : isAccessible ? (
                      <Circle className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
