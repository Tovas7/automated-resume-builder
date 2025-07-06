"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Star,
  Target,
  Zap,
  Crown,
  Award,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Medal,
  Flame,
  Gift,
} from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  points: number
  unlocked: boolean
  category: "completion" | "quality" | "optimization" | "milestone"
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface GamificationProps {
  resumeData: ResumeData
  selectedTemplate: string
  atsScore: number | null
  currentStep: number
  completedSteps: Set<number>
}

export function AchievementSystem({
  resumeData,
  selectedTemplate,
  atsScore,
  currentStep,
  completedSteps,
}: GamificationProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [showNewAchievement, setShowNewAchievement] = useState<Achievement | null>(null)
  const [streak, setStreak] = useState(0)

  const allAchievements: Achievement[] = [
    // Completion Achievements
    {
      id: "first_template",
      title: "Style Selector",
      description: "Choose your first resume template",
      icon: Sparkles,
      points: 50,
      unlocked: false,
      category: "completion",
      rarity: "common",
    },
    {
      id: "personal_complete",
      title: "Identity Established",
      description: "Complete your personal information",
      icon: CheckCircle,
      points: 100,
      unlocked: false,
      category: "completion",
      rarity: "common",
    },
    {
      id: "experience_master",
      title: "Career Chronicler",
      description: "Add 3+ work experiences",
      icon: Trophy,
      points: 150,
      unlocked: false,
      category: "completion",
      rarity: "rare",
    },
    {
      id: "skill_collector",
      title: "Skill Collector",
      description: "Add 10+ skills to your resume",
      icon: Target,
      points: 120,
      unlocked: false,
      category: "completion",
      rarity: "common",
    },
    {
      id: "project_showcase",
      title: "Project Showcase",
      description: "Add 2+ projects with detailed descriptions",
      icon: Star,
      points: 130,
      unlocked: false,
      category: "completion",
      rarity: "rare",
    },
    {
      id: "certified_professional",
      title: "Certified Professional",
      description: "Add professional certifications",
      icon: Award,
      points: 110,
      unlocked: false,
      category: "completion",
      rarity: "common",
    },

    // Quality Achievements
    {
      id: "wordsmith",
      title: "Wordsmith",
      description: "Write a compelling 100+ word summary",
      icon: Zap,
      points: 80,
      unlocked: false,
      category: "quality",
      rarity: "common",
    },
    {
      id: "detail_oriented",
      title: "Detail Oriented",
      description: "Add detailed descriptions to all experiences",
      icon: TrendingUp,
      points: 140,
      unlocked: false,
      category: "quality",
      rarity: "rare",
    },
    {
      id: "tech_stack_master",
      title: "Tech Stack Master",
      description: "Organize skills into 5+ categories",
      icon: Medal,
      points: 160,
      unlocked: false,
      category: "quality",
      rarity: "rare",
    },

    // Optimization Achievements
    {
      id: "ats_optimizer",
      title: "ATS Optimizer",
      description: "Achieve 90+ ATS score",
      icon: Crown,
      points: 200,
      unlocked: false,
      category: "optimization",
      rarity: "epic",
    },
    {
      id: "keyword_ninja",
      title: "Keyword Ninja",
      description: "Match 80%+ job description keywords",
      icon: Flame,
      points: 180,
      unlocked: false,
      category: "optimization",
      rarity: "epic",
    },
    {
      id: "perfect_score",
      title: "Perfection Achieved",
      description: "Achieve 100% ATS score",
      icon: Gift,
      points: 500,
      unlocked: false,
      category: "optimization",
      rarity: "legendary",
    },

    // Milestone Achievements
    {
      id: "resume_complete",
      title: "Resume Master",
      description: "Complete all resume sections",
      icon: Trophy,
      points: 300,
      unlocked: false,
      category: "milestone",
      rarity: "epic",
    },
    {
      id: "speed_demon",
      title: "Speed Demon",
      description: "Complete resume in under 30 minutes",
      icon: Zap,
      points: 250,
      unlocked: false,
      category: "milestone",
      rarity: "rare",
    },
  ]

  useEffect(() => {
    checkAchievements()
  }, [resumeData, selectedTemplate, atsScore, currentStep, completedSteps])

  const checkAchievements = () => {
    const newAchievements = [...allAchievements]
    const newlyUnlocked: Achievement[] = []

    // Check each achievement
    newAchievements.forEach((achievement) => {
      if (!achievement.unlocked) {
        let shouldUnlock = false

        switch (achievement.id) {
          case "first_template":
            shouldUnlock = selectedTemplate !== ""
            break
          case "personal_complete":
            shouldUnlock =
              resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.summary
            break
          case "experience_master":
            shouldUnlock = resumeData.experience.length >= 3
            break
          case "skill_collector":
            shouldUnlock = resumeData.skills.length >= 10
            break
          case "project_showcase":
            shouldUnlock =
              resumeData.projects.length >= 2 && resumeData.projects.every((p) => p.description.length > 50)
            break
          case "certified_professional":
            shouldUnlock = resumeData.certifications.length > 0
            break
          case "wordsmith":
            shouldUnlock = resumeData.personalInfo.summary.length >= 100
            break
          case "detail_oriented":
            shouldUnlock =
              resumeData.experience.length > 0 &&
              resumeData.experience.every((exp) => exp.description.some((desc) => desc.length > 30))
            break
          case "tech_stack_master":
            const categories = new Set(resumeData.skills.map((s) => s.category))
            shouldUnlock = categories.size >= 5
            break
          case "ats_optimizer":
            shouldUnlock = atsScore !== null && atsScore >= 90
            break
          case "keyword_ninja":
            shouldUnlock = atsScore !== null && atsScore >= 80
            break
          case "perfect_score":
            shouldUnlock = atsScore !== null && atsScore >= 100
            break
          case "resume_complete":
            shouldUnlock = completedSteps.size >= 6
            break
          case "speed_demon":
            // This would need timestamp tracking in real implementation
            shouldUnlock = false
            break
        }

        if (shouldUnlock) {
          achievement.unlocked = true
          newlyUnlocked.push(achievement)
        }
      }
    })

    setAchievements(newAchievements)

    // Calculate points and level
    const points = newAchievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0)
    setTotalPoints(points)
    setLevel(Math.floor(points / 500) + 1)

    // Show new achievement notification
    if (newlyUnlocked.length > 0) {
      setShowNewAchievement(newlyUnlocked[0])
      setTimeout(() => setShowNewAchievement(null), 3000)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-500 to-gray-600"
      case "rare":
        return "from-blue-500 to-indigo-600"
      case "epic":
        return "from-purple-500 to-pink-600"
      case "legendary":
        return "from-yellow-500 to-orange-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-700 border-gray-200"
      case "rare":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const progressToNextLevel = ((totalPoints % 500) / 500) * 100

  return (
    <>
      {/* Achievement Panel */}
      <Card className="border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Achievement Progress</h3>
                <p className="text-gray-600">
                  Level {level} • {totalPoints} points
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2">
              {unlockedAchievements.length}/{achievements.length} Unlocked
            </Badge>
          </div>

          {/* Level Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Level {level} Progress</span>
              <span className="text-sm text-gray-600">{totalPoints % 500}/500 XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>

          {/* Recent Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    achievement.unlocked ? "bg-white shadow-md hover:shadow-lg" : "bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.unlocked ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}` : "bg-gray-300"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${achievement.unlocked ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4
                          className={`font-semibold text-sm ${achievement.unlocked ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {achievement.title}
                        </h4>
                        <Badge variant="outline" className={`text-xs ${getRarityBadge(achievement.rarity)}`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className={`text-xs ${achievement.unlocked ? "text-gray-600" : "text-gray-400"}`}>
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs font-medium ${achievement.unlocked ? "text-purple-600" : "text-gray-400"}`}
                        >
                          +{achievement.points} XP
                        </span>
                        {achievement.unlocked && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* New Achievement Notification */}
      {showNewAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-500">
          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${getRarityColor(showNewAchievement.rarity)} rounded-xl flex items-center justify-center`}
                >
                  <showNewAchievement.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="font-bold text-yellow-800">Achievement Unlocked!</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{showNewAchievement.title}</h4>
                  <p className="text-sm text-gray-600">{showNewAchievement.description}</p>
                  <span className="text-sm font-medium text-purple-600">+{showNewAchievement.points} XP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
