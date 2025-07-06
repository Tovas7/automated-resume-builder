"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Sparkles, Camera, CameraOff, Crown, Brain, TrendingUp, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftRight, Eye, Users, Award } from "lucide-react"
import { useState, useEffect } from "react"

interface UserPreferences {
  fullName: string
  department: string
  totalExperience: string
  includePhoto: boolean
}

interface TemplateSelectorProps {
  selected: string
  onSelect: (template: string) => void
  userPreferences: UserPreferences
}

// Add this interface after the existing interfaces
interface AIRecommendation {
  templateId: string
  score: number
  reasoning: string[]
  confidence: "high" | "medium" | "low"
  matchFactors: {
    industry: number
    experience: number
    photoPreference: number
    atsOptimization: number
  }
}

// Add this function before the TemplateSelector component
const generateAIRecommendations = (userPreferences: UserPreferences, templates: any[]): AIRecommendation[] => {
  const recommendations: AIRecommendation[] = []

  templates.forEach((template) => {
    let score = 0
    const reasoning: string[] = []
    const matchFactors = {
      industry: 0,
      experience: 0,
      photoPreference: 0,
      atsOptimization: 0,
    }

    // Industry matching (40% weight)
    const industryMatch = template.bestFor.some(
      (field: string) =>
        userPreferences.department.toLowerCase().includes(field.toLowerCase()) ||
        field.toLowerCase().includes(userPreferences.department.toLowerCase()),
    )

    if (industryMatch) {
      matchFactors.industry = 90
      score += 36 // 40% * 90%
      reasoning.push(`Specifically designed for ${userPreferences.department} professionals`)
    } else {
      // Partial industry matching
      const partialMatch = template.bestFor.some((field: string) => {
        const dept = userPreferences.department.toLowerCase()
        return (
          (dept.includes("software") && field.toLowerCase().includes("tech")) ||
          (dept.includes("data") && field.toLowerCase().includes("tech")) ||
          (dept.includes("marketing") && field.toLowerCase().includes("creative")) ||
          (dept.includes("finance") && field.toLowerCase().includes("corporate")) ||
          (dept.includes("sales") && field.toLowerCase().includes("business"))
        )
      })

      if (partialMatch) {
        matchFactors.industry = 60
        score += 24
        reasoning.push(`Good fit for professionals in related fields`)
      } else {
        matchFactors.industry = 30
        score += 12
        reasoning.push(`General template suitable for various industries`)
      }
    }

    // Experience level matching (25% weight)
    const userLevel =
      userPreferences.totalExperience.includes("0-1") || userPreferences.totalExperience.includes("Entry")
        ? "entry"
        : userPreferences.totalExperience.includes("2-3") || userPreferences.totalExperience.includes("Junior")
          ? "junior"
          : userPreferences.totalExperience.includes("4-6") || userPreferences.totalExperience.includes("Mid")
            ? "mid"
            : userPreferences.totalExperience.includes("7-10") || userPreferences.totalExperience.includes("Senior")
              ? "senior"
              : userPreferences.totalExperience.includes("11-15") ||
                  userPreferences.totalExperience.includes("16+") ||
                  userPreferences.totalExperience.includes("Executive")
                ? "executive"
                : "all"

    if (template.experienceLevel.includes(userLevel) || template.experienceLevel.includes("all")) {
      matchFactors.experience = 95
      score += 23.75 // 25% * 95%
      reasoning.push(`Perfect for ${userPreferences.totalExperience} professionals`)
    } else {
      matchFactors.experience = 50
      score += 12.5
      reasoning.push(`Adaptable to your experience level`)
    }

    // Photo preference matching (15% weight)
    if (template.supportsPhoto === userPreferences.includePhoto) {
      matchFactors.photoPreference = 100
      score += 15
      reasoning.push(
        userPreferences.includePhoto
          ? `Supports professional photo inclusion as you prefer`
          : `Clean, photo-free design matching your preference`,
      )
    } else {
      matchFactors.photoPreference = 0
      reasoning.push(
        userPreferences.includePhoto
          ? `Note: This template doesn't support photos`
          : `This template supports photos (which you prefer not to include)`,
      )
    }

    // ATS optimization (20% weight)
    const atsWeight = template.atsScore / 100
    matchFactors.atsOptimization = template.atsScore
    score += 20 * atsWeight

    if (template.atsScore >= 95) {
      reasoning.push(`Excellent ATS compatibility (${template.atsScore}%) for maximum visibility`)
    } else if (template.atsScore >= 90) {
      reasoning.push(`High ATS compatibility (${template.atsScore}%) ensures good parsing`)
    } else if (template.atsScore >= 80) {
      reasoning.push(`Good ATS compatibility (${template.atsScore}%) with solid performance`)
    } else {
      reasoning.push(`Moderate ATS compatibility (${template.atsScore}%) - prioritizes visual appeal`)
    }

    // Determine confidence level
    let confidence: "high" | "medium" | "low" = "low"
    if (score >= 80) confidence = "high"
    else if (score >= 60) confidence = "medium"

    // Add specific insights based on user profile
    if (
      userPreferences.department.toLowerCase().includes("software") ||
      userPreferences.department.toLowerCase().includes("data") ||
      userPreferences.department.toLowerCase().includes("tech")
    ) {
      if (template.id === "tech" || template.id === "minimal" || template.id === "classic") {
        reasoning.push(`Highly recommended for tech professionals - emphasizes skills and projects`)
        score += 5
      }
    }

    if (
      userPreferences.department.toLowerCase().includes("creative") ||
      userPreferences.department.toLowerCase().includes("design") ||
      userPreferences.department.toLowerCase().includes("marketing")
    ) {
      if (template.id === "creative" || template.id === "modern") {
        reasoning.push(`Perfect for creative fields - showcases visual design skills`)
        score += 5
      }
    }

    if (userPreferences.totalExperience.includes("Executive") || userPreferences.totalExperience.includes("16+")) {
      if (template.id === "executive" || template.id === "classic" || template.id === "consulting") {
        reasoning.push(`Executive-level design conveys authority and leadership`)
        score += 5
      }
    }

    recommendations.push({
      templateId: template.id,
      score: Math.round(score),
      reasoning,
      confidence,
      matchFactors,
    })
  })

  return recommendations.sort((a, b) => b.score - a.score)
}

// Add this component before the main TemplateSelector component
const AIRecommendationCard = ({
  recommendation,
  template,
  onSelect,
  isSelected,
}: {
  recommendation: AIRecommendation
  template: any
  onSelect: (id: string) => void
  isSelected: boolean
}) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "from-green-500 to-emerald-600"
      case "medium":
        return "from-blue-500 to-indigo-600"
      case "low":
        return "from-yellow-500 to-orange-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "Highly Recommended"
      case "medium":
        return "Good Match"
      case "low":
        return "Consider This Option"
      default:
        return "Alternative Choice"
    }
  }

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50/50" : ""
      }`}
      onClick={() => onSelect(template.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${getConfidenceColor(recommendation.confidence)} rounded-xl flex items-center justify-center`}
            >
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">{template.name}</h4>
              <Badge className={`bg-gradient-to-r ${getConfidenceColor(recommendation.confidence)} text-white`}>
                {getConfidenceText(recommendation.confidence)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{recommendation.score}%</div>
            <div className="text-sm text-gray-600">AI Match Score</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
              Why This Template?
            </h5>
            <ul className="space-y-1">
              {recommendation.reasoning.slice(0, 3).map((reason, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">Industry Match</span>
                <span className="text-xs font-bold text-gray-900">{recommendation.matchFactors.industry}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${recommendation.matchFactors.industry}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">Experience</span>
                <span className="text-xs font-bold text-gray-900">{recommendation.matchFactors.experience}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${recommendation.matchFactors.experience}%` }}
                ></div>
              </div>
            </div>
          </div>

          {isSelected && (
            <div className="flex items-center justify-center space-x-2 text-blue-600 font-medium text-sm pt-2 border-t">
              <Check className="w-4 h-4" />
              <span>Selected Template</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const templates = [
  // Example templates data
  {
    id: "tech",
    name: "Tech Template",
    bestFor: ["software", "data"],
    experienceLevel: ["junior", "mid", "senior"],
    supportsPhoto: true,
    atsScore: 98,
    preview: "bg-tech-preview",
    icon: Zap,
    features: ["Modern", "Clean"],
  },
  {
    id: "creative",
    name: "Creative Template",
    bestFor: ["creative", "design"],
    experienceLevel: ["junior", "mid", "senior"],
    supportsPhoto: true,
    atsScore: 92,
    preview: "bg-creative-preview",
    icon: Sparkles,
    features: ["Creative", "Artistic"],
  },
  {
    id: "executive",
    name: "Executive Template",
    bestFor: ["executive"],
    experienceLevel: ["executive"],
    supportsPhoto: true,
    atsScore: 85,
    preview: "bg-executive-preview",
    icon: Crown,
    features: ["Formal", "Professional"],
  },
  // Add more templates as needed
]

export function TemplateSelector({ selected, onSelect, userPreferences }: TemplateSelectorProps) {
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([])
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const recommendations = generateAIRecommendations(userPreferences, templates)
    setAIRecommendations(recommendations)
  }, [userPreferences])

  // Add this section after the personalized header and before the comparison controls
  const topRecommendations = aiRecommendations.slice(0, 3)

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-emerald-600 bg-emerald-50 border-emerald-200"
    if (score >= 90) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 80) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getExperienceLevel = (experience: string) => {
    if (experience.includes("0-1") || experience.includes("Entry")) return "entry"
    if (experience.includes("2-3") || experience.includes("Junior")) return "junior"
    if (experience.includes("4-6") || experience.includes("Mid")) return "mid"
    if (experience.includes("7-10") || experience.includes("Senior")) return "senior"
    if (experience.includes("11-15") || experience.includes("16+") || experience.includes("Executive"))
      return "executive"
    return "all"
  }

  const isTemplateRecommended = (template: any) => {
    const userLevel = getExperienceLevel(userPreferences.totalExperience)
    const departmentMatch = template.bestFor.some((field: string) =>
      userPreferences.department.toLowerCase().includes(field.toLowerCase()),
    )
    const photoCompatible = template.supportsPhoto === userPreferences.includePhoto
    const experienceMatch = template.experienceLevel.includes("all") || template.experienceLevel.includes(userLevel)

    return departmentMatch || (photoCompatible && experienceMatch)
  }

  const getRecommendationReason = (template: any) => {
    const userLevel = getExperienceLevel(userPreferences.totalExperience)
    const departmentMatch = template.bestFor.some((field: string) =>
      userPreferences.department.toLowerCase().includes(field.toLowerCase()),
    )

    if (departmentMatch) return `Perfect for ${userPreferences.department}`
    if (template.experienceLevel.includes(userLevel)) return `Ideal for ${userPreferences.totalExperience}`
    if (template.supportsPhoto === userPreferences.includePhoto) {
      return userPreferences.includePhoto ? "Supports photo inclusion" : "Clean, photo-free design"
    }
    return "Good general fit"
  }

  const [compareTemplates, setCompareTemplates] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const toggleCompare = (templateId: string) => {
    setCompareTemplates((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId)
      } else if (prev.length < 3) {
        return [...prev, templateId]
      }
      return prev
    })
  }

  const getComparisonTemplates = () => {
    return templates.filter((t) => compareTemplates.includes(t.id))
  }

  const ComparisonDialog = () => (
    <Dialog open={showComparison} onOpenChange={setShowComparison}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ArrowLeftRight className="w-5 h-5" />
            <span>Template Comparison ({compareTemplates.length})</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="suitability">Best For</TabsTrigger>
            <TabsTrigger value="scores">ATS Scores</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${compareTemplates.length}, 1fr)` }}>
              {getComparisonTemplates().map((template) => (
                <Card key={template.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div
                      className={`w-full h-32 rounded-lg mb-4 ${template.preview} flex items-center justify-center border`}
                    >
                      {(() => {
                        const Icon = template.icon
                        return <Icon className="w-8 h-8 text-gray-600" />
                      })()}
                    </div>
                    <h4 className="font-bold text-lg mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getScoreColor(template.atsScore)}>
                        {template.atsScore}% ATS
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {template.supportsPhoto ? (
                          <Camera className="w-4 h-4 text-green-600" />
                        ) : (
                          <CameraOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Feature</th>
                    {getComparisonTemplates().map((template) => (
                      <th key={template.id} className="text-center p-3 font-semibold min-w-[150px]">
                        {template.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">ATS Score</td>
                    {getComparisonTemplates().map((template) => (
                      <td key={template.id} className="text-center p-3">
                        <Badge variant="outline" className={getScoreColor(template.atsScore)}>
                          {template.atsScore}%
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Photo Support</td>
                    {getComparisonTemplates().map((template) => (
                      <td key={template.id} className="text-center p-3">
                        {template.supportsPhoto ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Design Style</td>
                    {getComparisonTemplates().map((template) => (
                      <td key={template.id} className="text-center p-3 text-sm">
                        {template.features?.[1] || template.features?.[0] || "—"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Experience Level</td>
                    {getComparisonTemplates().map((template) => (
                      <td key={template.id} className="text-center p-3 text-sm">
                        {template.experienceLevel.includes("all")
                          ? "All Levels"
                          : template.experienceLevel
                              .map((level) => level.charAt(0).toUpperCase() + level.slice(1))
                              .join(", ")}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="suitability" className="space-y-6">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${compareTemplates.length}, 1fr)` }}>
              {getComparisonTemplates().map((template) => (
                <Card key={template.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-lg mb-4 text-center">{template.name}</h4>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-green-700 mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Perfect For
                        </h5>
                        <div className="space-y-1">
                          {template.bestFor.map((item, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="mr-1 mb-1 text-xs border-green-200 text-green-700"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-blue-700 mb-2 flex items-center">
                          <Award className="w-4 h-4 mr-2" />
                          Key Strengths
                        </h5>
                        <div className="space-y-1">
                          {(template.features ?? []).map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {isTemplateRecommended(template) && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center text-green-700 text-sm font-medium mb-1">
                            <Star className="w-4 h-4 mr-1" />
                            Recommended for You
                          </div>
                          <p className="text-xs text-green-600">{getRecommendationReason(template)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scores" className="space-y-6">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${compareTemplates.length}, 1fr)` }}>
              {getComparisonTemplates().map((template) => (
                <Card key={template.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-lg mb-4 text-center">{template.name}</h4>

                    <div className="space-y-4">
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${getScoreColor(template.atsScore).split(" ")[0]}`}>
                          {template.atsScore}%
                        </div>
                        <p className="text-sm text-gray-600">ATS Compatibility</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Parsing Quality</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(template.atsScore)}`}
                                style={{ width: `${Math.min(template.atsScore, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{template.atsScore}%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Readability</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(Math.max(template.atsScore - 5, 85))}`}
                                style={{ width: `${Math.max(template.atsScore - 5, 85)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{Math.max(template.atsScore - 5, 85)}%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Keyword Optimization</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(Math.max(template.atsScore - 3, 87))}`}
                                style={{ width: `${Math.max(template.atsScore - 3, 87)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{Math.max(template.atsScore - 3, 87)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="text-center">
                          <Button
                            onClick={() => {
                              onSelect(template.id)
                              setShowComparison(false)
                            }}
                            variant={selected === template.id ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                          >
                            {selected === template.id ? "Currently Selected" : "Select This Template"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )

  const PreviewDialog = () => (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Resume Preview</span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="bg-white border rounded-lg p-8" style={{ aspectRatio: "8.5/11", minHeight: "600px" }}>
            <div className="text-center text-gray-500">Resume preview for {selected} template would appear here</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Sort templates to show recommended ones first
  const sortedTemplates = [...templates].sort((a, b) => {
    const aRecommended = isTemplateRecommended(a)
    const bRecommended = isTemplateRecommended(b)
    if (aRecommended && !bRecommended) return -1
    if (!aRecommended && bRecommended) return 1
    return b.atsScore - a.atsScore
  })

  return (
    <div className="space-y-8">
      {/* Personalized Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Perfect Templates for {userPreferences.fullName}</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your {userPreferences.department} background and {userPreferences.totalExperience} of experience,
          we've curated the best templates for your career level.
        </p>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {userPreferences.department}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {userPreferences.totalExperience}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {userPreferences.includePhoto ? (
              <div className="flex items-center space-x-1">
                <Camera className="w-3 h-3" />
                <span>With Photo</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <CameraOff className="w-3 h-3" />
                <span>No Photo</span>
              </div>
            )}
          </Badge>
        </div>
      </div>

      {/* Preview Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Resume Preview</h4>
              <p className="text-sm text-gray-600">See how your resume looks with the selected template</p>
            </div>
          </div>
          <Button
            onClick={() => setShowPreview(true)}
            disabled={!selected}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Resume
          </Button>
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      {showAIInsights && topRecommendations.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border border-purple-200/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h3>
                  <p className="text-gray-600">Personalized template suggestions based on your profile analysis</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIInsights(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {topRecommendations.map((recommendation, index) => {
                const template = templates.find((t) => t.id === recommendation.templateId)
                if (!template) return null

                return (
                  <div key={recommendation.templateId} className="relative">
                    {index === 0 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 shadow-lg">
                          🏆 Top Pick
                        </Badge>
                      </div>
                    )}
                    <AIRecommendationCard
                      recommendation={recommendation}
                      template={template}
                      onSelect={onSelect}
                      isSelected={selected === template.id}
                    />
                  </div>
                )
              })}
            </div>

            <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">How AI Recommendations Work</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Our AI analyzes your industry ({userPreferences.department}), experience level (
                    {userPreferences.totalExperience}), photo preference, and ATS optimization needs to suggest
                    templates that maximize your chances of success. Each recommendation includes detailed reasoning and
                    match scores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Controls */}
      {compareTemplates.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Template Comparison</h4>
                <p className="text-sm text-gray-600">
                  {compareTemplates.length} template{compareTemplates.length !== 1 ? "s" : ""} selected for comparison
                  {compareTemplates.length < 3 && ` (select up to ${3 - compareTemplates.length} more)`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => setCompareTemplates([])} variant="outline" size="sm">
                Clear All
              </Button>
              <Button
                onClick={() => setShowComparison(true)}
                disabled={compareTemplates.length < 2}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Eye className="w-4 h-4 mr-2" />
                Compare Templates
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTemplates.map((template) => {
          const isRecommended = isTemplateRecommended(template)
          const recommendationReason = getRecommendationReason(template)
          const aiRecommendation = aiRecommendations.find((r) => r.templateId === template.id)

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative ${
                selected === template.id
                  ? "ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
                  : "hover:shadow-lg border-gray-200/50"
              }`}
              onClick={() => onSelect(template.id)}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 shadow-lg">
                    ⭐ Recommended
                  </Badge>
                </div>
              )}

              {/* AI Score Badge */}
              {aiRecommendation && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {aiRecommendation.score}
                  </div>
                </div>
              )}

              <CardContent className="p-4">
                {/* Template Preview */}
                <div
                  className={`w-full h-32 rounded-xl mb-4 ${template.preview} flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300 border border-gray-200/50`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  {selected === template.id ? (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-3 shadow-lg">
                      <Check className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200 p-3 bg-white/80 rounded-full shadow-lg">
                      {(() => {
                        const Icon = template.icon
                        return <Icon className="w-6 h-6" />
                      })()}
                    </div>
                  )}
                </div>

                {/* Comparison Checkbox */}
                <div className="absolute top-2 right-2">
                  <input
                    type="checkbox"
                    checked={compareTemplates.includes(template.id)}
                    onChange={() => toggleCompare(template.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    disabled={!compareTemplates.includes(template.id) && compareTemplates.length >= 3}
                  />
                </div>

                {/* Template Info */}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 flex items-center justify-between mb-1">
                      <span>{template.name}</span>
                      {selected === template.id && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          Selected
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                  </div>

                  {/* AI Insight */}
                  {aiRecommendation && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                      <div className="flex items-center text-purple-700 text-xs font-medium mb-1">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Insight ({aiRecommendation.score}% match)
                      </div>
                      <p className="text-xs text-purple-600">{aiRecommendation.reasoning[0]}</p>
                    </div>
                  )}

                  {/* Recommendation Reason */}
                  {isRecommended && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <p className="text-xs text-green-700 font-medium">{recommendationReason}</p>
                    </div>
                  )}

                  {/* ATS Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">ATS Score</span>
                    <Badge variant="outline" className={`font-semibold text-sm ${getScoreColor(template.atsScore)}`}>
                      {template.atsScore}%
                    </Badge>
                  </div>

                  {/* Photo Support */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Photo Support</span>
                    <div className="flex items-center space-x-1">
                      {template.supportsPhoto ? (
                        <Camera className="w-3 h-3 text-green-600" />
                      ) : (
                        <CameraOff className="w-3 h-3 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-600">{template.supportsPhoto ? "Yes" : "No"}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {(template.features?.slice(0, 2) ?? []).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Selection Indicator */}
                  {selected === template.id && (
                    <div className="flex items-center justify-center space-x-2 text-blue-600 font-medium text-sm">
                      <Check className="w-4 h-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selection Prompt */}
      {!selected && (
        <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50">
          <h4 className="font-semibold text-gray-900 mb-2">👆 Select a Template to Continue</h4>
          <p className="text-gray-700">
            Choose the template that best matches your style and industry. Recommended templates are highlighted based
            on your preferences.
          </p>
        </div>
      )}
      {ComparisonDialog()}
      {PreviewDialog()}
    </div>
  )
}
