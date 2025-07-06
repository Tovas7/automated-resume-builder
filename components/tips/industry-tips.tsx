"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Target, Zap, Star, Award } from "lucide-react"

interface IndustryTipsProps {
  department: string
  experienceLevel: string
  currentStep: string
}

export function IndustryTips({ department, experienceLevel, currentStep }: IndustryTipsProps) {
  const getTipsForStep = () => {
    const tips = []

    // Department-specific tips
    const deptTips = getDepartmentTips(department, currentStep)
    if (deptTips.length > 0) tips.push(...deptTips)

    // Experience level tips
    const expTips = getExperienceTips(experienceLevel, currentStep)
    if (expTips.length > 0) tips.push(...expTips)

    // General tips
    const generalTips = getGeneralTips(currentStep)
    if (generalTips.length > 0) tips.push(...generalTips)

    return tips.slice(0, 3) // Limit to 3 tips
  }

  const getDepartmentTips = (dept: string, step: string) => {
    const tips = []
    const deptLower = dept.toLowerCase()

    if (step === "personal") {
      if (deptLower.includes("software") || deptLower.includes("tech")) {
        tips.push({
          icon: Zap,
          title: "Tech Professional Summary",
          content:
            "Highlight your programming languages, frameworks, and years of experience. Mention specific technologies you've mastered.",
          category: "Tech Focus",
        })
      } else if (deptLower.includes("marketing")) {
        tips.push({
          icon: TrendingUp,
          title: "Marketing Impact",
          content:
            "Quantify your marketing achievements with metrics like conversion rates, lead generation, and campaign ROI.",
          category: "Marketing",
        })
      } else if (deptLower.includes("finance")) {
        tips.push({
          icon: Target,
          title: "Financial Expertise",
          content:
            "Emphasize your analytical skills, certifications (CPA, CFA), and experience with financial modeling or analysis.",
          category: "Finance",
        })
      }
    }

    if (step === "experience") {
      if (deptLower.includes("software") || deptLower.includes("tech")) {
        tips.push({
          icon: Star,
          title: "Technical Achievements",
          content:
            "Focus on projects you've built, technologies you've implemented, and problems you've solved. Include metrics like performance improvements.",
          category: "Tech Focus",
        })
      } else if (deptLower.includes("sales")) {
        tips.push({
          icon: Award,
          title: "Sales Performance",
          content:
            "Always include numbers: quota attainment, revenue generated, deals closed, and territory growth percentages.",
          category: "Sales",
        })
      }
    }

    if (step === "skills") {
      if (deptLower.includes("software") || deptLower.includes("tech")) {
        tips.push({
          icon: Zap,
          title: "Technical Skills Organization",
          content:
            "Group skills by category: Programming Languages, Frameworks, Databases, Tools, and Cloud Platforms.",
          category: "Tech Focus",
        })
      }
    }

    return tips
  }

  const getExperienceTips = (experience: string, step: string) => {
    const tips = []

    if (experience.includes("Entry") || experience.includes("0-1")) {
      if (step === "experience") {
        tips.push({
          icon: Lightbulb,
          title: "Entry-Level Experience",
          content:
            "Include internships, part-time work, volunteer experience, and significant academic projects. Focus on transferable skills.",
          category: "Entry Level",
        })
      }
      if (step === "projects") {
        tips.push({
          icon: Star,
          title: "Showcase Learning",
          content:
            "Highlight personal projects, hackathons, and coursework that demonstrate your skills and passion for learning.",
          category: "Entry Level",
        })
      }
    } else if (experience.includes("Executive") || experience.includes("16+")) {
      if (step === "experience") {
        tips.push({
          icon: Award,
          title: "Executive Leadership",
          content:
            "Focus on strategic initiatives, team leadership, P&L responsibility, and organizational transformation you've led.",
          category: "Executive",
        })
      }
    }

    return tips
  }

  const getGeneralTips = (step: string) => {
    const tips = []

    switch (step) {
      case "personal":
        tips.push({
          icon: Target,
          title: "Professional Summary Power",
          content:
            "Your summary should be 3-4 lines that capture your value proposition. Include years of experience, key skills, and career focus.",
          category: "General",
        })
        break
      case "experience":
        tips.push({
          icon: TrendingUp,
          title: "Action Verbs & Metrics",
          content:
            "Start each bullet point with a strong action verb and include quantifiable results whenever possible (percentages, dollar amounts, time saved).",
          category: "General",
        })
        break
      case "skills":
        tips.push({
          icon: Zap,
          title: "Skill Relevance",
          content:
            "Tailor your skills to match the job description. Include both hard and soft skills, and organize them by proficiency level.",
          category: "General",
        })
        break
      case "projects":
        tips.push({
          icon: Star,
          title: "Project Impact",
          content:
            "For each project, explain the problem, your solution, technologies used, and the measurable impact or outcome.",
          category: "General",
        })
        break
    }

    return tips
  }

  const tips = getTipsForStep()

  if (tips.length === 0) return null

  return (
    <Card className="border-yellow-200/50 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Industry Tips</h3>
            <p className="text-gray-600">Personalized advice for {department} professionals</p>
          </div>
        </div>

        <div className="space-y-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <div key={index} className="p-4 bg-white rounded-xl border border-yellow-200/50">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
                        {tip.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{tip.content}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
