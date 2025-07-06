"use client"

import { useState } from "react"
import type { ResumeData, ATSScore } from "@/types/resume"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Target, TrendingUp, AlertCircle, CheckCircle, Lightbulb, FileText, Zap, BarChart3 } from "lucide-react"

interface JobDescriptionMatcherProps {
  resumeData: ResumeData
  jobDescription: string
  onJobDescriptionChange: (description: string) => void
  onATSScoreUpdate: (score: ATSScore) => void
}

export function JobDescriptionMatcher({
  resumeData,
  jobDescription,
  onJobDescriptionChange,
  onATSScoreUpdate,
}: JobDescriptionMatcherProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchResults, setMatchResults] = useState<any>(null)

  const analyzeJobMatch = async () => {
    if (!jobDescription.trim()) return

    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Extract keywords from job description (simplified NLP simulation)
    const jobKeywords = extractKeywords(jobDescription)
    const resumeText = getResumeText(resumeData)
    const resumeKeywords = extractKeywords(resumeText)

    // Calculate matches
    const matchedKeywords = jobKeywords.filter((keyword) =>
      resumeKeywords.some(
        (rKeyword) =>
          rKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(rKeyword.toLowerCase()),
      ),
    )

    const missingKeywords = jobKeywords
      .filter((keyword) => !matchedKeywords.some((matched) => matched.toLowerCase().includes(keyword.toLowerCase())))
      .slice(0, 10)

    // Calculate scores
    const keywordMatch = Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    const formatting = calculateFormattingScore(resumeData)
    const sections = calculateSectionScore(resumeData)
    const readability = calculateReadabilityScore(resumeText)
    const overall = Math.round((keywordMatch + formatting + sections + readability) / 4)

    const suggestions = generateSuggestions(resumeData, missingKeywords, keywordMatch)

    const atsScore: ATSScore = {
      overall,
      keywordMatch,
      formatting,
      sections,
      readability,
      suggestions,
      matchedKeywords: matchedKeywords.slice(0, 15),
      missingKeywords,
      templateScore: 85,
    }

    const results = {
      jobKeywords: jobKeywords.slice(0, 20),
      matchedKeywords,
      missingKeywords,
      skillsAlignment: analyzeSkillsAlignment(resumeData.skills, jobKeywords),
      experienceRelevance: analyzeExperienceRelevance(resumeData.experience, jobKeywords),
    }

    setMatchResults(results)
    onATSScoreUpdate(atsScore)
    setIsAnalyzing(false)
  }

  // Helper functions (same as before but keeping them for completeness)
  const extractKeywords = (text: string): string[] => {
    const commonWords = [
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "can",
      "shall",
      "a",
      "an",
      "this",
      "that",
      "these",
      "those",
    ]

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.includes(word))
      .reduce((acc: string[], word) => {
        if (!acc.includes(word)) acc.push(word)
        return acc
      }, [])
      .slice(0, 50)
  }

  const getResumeText = (data: ResumeData): string => {
    let text = `${data.personalInfo.fullName} ${data.personalInfo.summary} `

    data.experience.forEach((exp) => {
      text += `${exp.position} ${exp.company} ${exp.description.join(" ")} `
    })

    data.education.forEach((edu) => {
      text += `${edu.degree} ${edu.field} ${edu.institution} `
    })

    data.skills.forEach((skill) => {
      text += `${skill.name} ${skill.category} `
    })

    data.projects.forEach((project) => {
      text += `${project.name} ${project.description} ${project.technologies.join(" ")} `
    })

    return text
  }

  const calculateFormattingScore = (data: ResumeData): number => {
    let score = 100

    if (!data.personalInfo.fullName) score -= 10
    if (!data.personalInfo.email) score -= 10
    if (!data.personalInfo.phone) score -= 10
    if (data.experience.length === 0) score -= 20
    if (data.skills.length === 0) score -= 15

    return Math.max(score, 0)
  }

  const calculateSectionScore = (data: ResumeData): number => {
    let score = 0

    if (data.personalInfo.summary) score += 20
    if (data.experience.length > 0) score += 30
    if (data.education.length > 0) score += 20
    if (data.skills.length > 0) score += 20
    if (data.projects.length > 0) score += 10

    return Math.min(score, 100)
  }

  const calculateReadabilityScore = (text: string): number => {
    const sentences = text.split(/[.!?]+/).length
    const words = text.split(/\s+/).length
    const avgWordsPerSentence = words / sentences

    if (avgWordsPerSentence < 15) return 95
    if (avgWordsPerSentence < 20) return 85
    if (avgWordsPerSentence < 25) return 75
    return 65
  }

  const generateSuggestions = (data: ResumeData, missingKeywords: string[], keywordMatch: number): string[] => {
    const suggestions: string[] = []

    if (keywordMatch < 60) {
      suggestions.push(
        "Consider incorporating more relevant keywords from the job description into your experience descriptions.",
      )
    }

    if (missingKeywords.length > 5) {
      suggestions.push(
        `Add skills related to: ${missingKeywords.slice(0, 3).join(", ")} to better match the job requirements.`,
      )
    }

    if (!data.personalInfo.summary) {
      suggestions.push("Add a professional summary that highlights your key qualifications for this role.")
    }

    if (data.experience.length === 0) {
      suggestions.push("Add relevant work experience to strengthen your application.")
    }

    return suggestions
  }

  const analyzeSkillsAlignment = (skills: any[], jobKeywords: string[]) => {
    const alignedSkills = skills.filter((skill) =>
      jobKeywords.some(
        (keyword) =>
          skill.name.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(skill.name.toLowerCase()),
      ),
    )

    return {
      total: skills.length,
      aligned: alignedSkills.length,
      percentage: skills.length > 0 ? Math.round((alignedSkills.length / skills.length) * 100) : 0,
      alignedSkills,
    }
  }

  const analyzeExperienceRelevance = (experience: any[], jobKeywords: string[]) => {
    const relevantExperience = experience.filter((exp) => {
      const expText = `${exp.position} ${exp.company} ${exp.description.join(" ")}`
      return jobKeywords.some((keyword) => expText.toLowerCase().includes(keyword.toLowerCase()))
    })

    return {
      total: experience.length,
      relevant: relevantExperience.length,
      percentage: experience.length > 0 ? Math.round((relevantExperience.length / experience.length) * 100) : 0,
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Job Matcher
          </h2>
          <p className="text-gray-600 font-medium">AI-powered job description analysis and optimization</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Job Description Analysis</span>
            </CardTitle>
            <CardDescription>
              Paste the job description to get personalized optimization recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Paste the complete job description here to analyze keyword matching, required skills, and get tailored suggestions for optimizing your resume..."
                value={jobDescription}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                rows={8}
                className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
              />
              <Button
                onClick={analyzeJobMatch}
                disabled={!jobDescription.trim() || isAnalyzing}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isAnalyzing ? (
                  <>
                    <Search className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing Job Match...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-3" />
                    Analyze Job Match
                  </>
                )}
              </Button>
            </div>

            {matchResults && (
              <div className="mt-8">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="skills"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                    >
                      Skills Match
                    </TabsTrigger>
                    <TabsTrigger
                      value="recommendations"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                    >
                      Recommendations
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-50">
                          <CardContent className="p-6 text-center">
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <div className="text-4xl font-bold text-green-700 mb-2">
                              {matchResults.matchedKeywords.length}
                            </div>
                            <div className="text-green-800 font-semibold">Keywords Matched</div>
                            <p className="text-sm text-green-700 mt-2">
                              Great job! These keywords are already in your resume.
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="border-red-200/50 bg-gradient-to-br from-red-50 to-pink-50">
                          <CardContent className="p-6 text-center">
                            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <div className="text-4xl font-bold text-red-700 mb-2">
                              {matchResults.missingKeywords.length}
                            </div>
                            <div className="text-red-800 font-semibold">Keywords Missing</div>
                            <p className="text-sm text-red-700 mt-2">
                              Consider adding these to improve your match score.
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Top Job Keywords */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            <span>Key Job Requirements</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {matchResults.jobKeywords.slice(0, 20).map((keyword: string, index: number) => (
                              <Badge
                                key={index}
                                variant={matchResults.matchedKeywords.includes(keyword) ? "default" : "outline"}
                                className={`transition-all duration-200 ${
                                  matchResults.matchedKeywords.includes(keyword)
                                    ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="skills" className="space-y-6">
                      {/* Skills Alignment */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Skills Alignment Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-gray-900">Skills Match Rate</h4>
                              <span className="text-2xl font-bold text-blue-600">
                                {matchResults.skillsAlignment.percentage}%
                              </span>
                            </div>
                            <div className="relative">
                              <Progress value={matchResults.skillsAlignment.percentage} className="h-4" />
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                              {matchResults.skillsAlignment.aligned} of {matchResults.skillsAlignment.total} skills
                              match job requirements
                            </p>
                          </div>

                          {/* Experience Relevance */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-gray-900">Experience Relevance</h4>
                              <span className="text-2xl font-bold text-purple-600">
                                {matchResults.experienceRelevance.percentage}%
                              </span>
                            </div>
                            <div className="relative">
                              <Progress value={matchResults.experienceRelevance.percentage} className="h-4" />
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                              {matchResults.experienceRelevance.relevant} of {matchResults.experienceRelevance.total}{" "}
                              positions contain relevant keywords
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="recommendations" className="space-y-6">
                      {matchResults.missingKeywords.length > 0 && (
                        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            <strong>Quick Win:</strong> Try incorporating these high-impact keywords:{" "}
                            <span className="font-semibold">{matchResults.missingKeywords.slice(0, 5).join(", ")}</span>
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="grid gap-6">
                        {[
                          {
                            icon: TrendingUp,
                            title: "Optimize Your Professional Summary",
                            description:
                              "Include 3-5 key terms from the job description in your professional summary to immediately catch the ATS attention.",
                            color: "blue",
                          },
                          {
                            icon: CheckCircle,
                            title: "Enhance Experience Descriptions",
                            description:
                              "Use action verbs and include specific technologies/skills mentioned in the job posting within your work experience.",
                            color: "green",
                          },
                          {
                            icon: AlertCircle,
                            title: "Add Missing Skills",
                            description:
                              "Consider adding relevant skills you possess that appear in the job description but are missing from your resume.",
                            color: "purple",
                          },
                          {
                            icon: Target,
                            title: "Tailor Your Projects",
                            description:
                              "Highlight projects that demonstrate the specific skills and technologies mentioned in the job requirements.",
                            color: "indigo",
                          },
                        ].map((tip, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/50 transition-all duration-300 border border-gray-200/50"
                          >
                            <div
                              className={`w-12 h-12 bg-gradient-to-r from-${tip.color}-500 to-${tip.color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}
                            >
                              <tip.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                              <p className="text-gray-700 leading-relaxed">{tip.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
