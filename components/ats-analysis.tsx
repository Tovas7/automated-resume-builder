"use client"

import { useEffect, useState } from "react"
import type { ResumeData, ATSScore, TemplateATSRating } from "@/types/resume"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Target,
  FileText,
  Eye,
  Zap,
  TrendingUp,
  Award,
  BarChart3,
  Sparkles,
} from "lucide-react"

interface ATSAnalysisProps {
  resumeData: ResumeData
  selectedTemplate: string
  jobDescription: string
  atsScore: ATSScore | null
}

export function ATSAnalysis({ resumeData, selectedTemplate, jobDescription, atsScore }: ATSAnalysisProps) {
  const [templateRatings, setTemplateRatings] = useState<TemplateATSRating[]>([])

  useEffect(() => {
    setTemplateRatings([
      {
        id: "modern",
        name: "Modern Professional",
        atsScore: 92,
        pros: ["Clean structure", "Standard sections", "Good keyword placement"],
        cons: ["Some graphics may not parse well"],
        bestFor: ["Tech roles", "Creative positions", "Startups"],
      },
      {
        id: "classic",
        name: "Executive Classic",
        atsScore: 98,
        pros: ["Excellent ATS compatibility", "Standard formatting", "No graphics"],
        cons: ["Less visually appealing"],
        bestFor: ["Corporate roles", "Finance", "Legal"],
      },
      {
        id: "creative",
        name: "Creative Portfolio",
        atsScore: 75,
        pros: ["Eye-catching design", "Good for portfolios"],
        cons: ["Complex layout", "Graphics may cause parsing issues"],
        bestFor: ["Design roles", "Marketing", "Creative industries"],
      },
      {
        id: "minimal",
        name: "Minimal Clean",
        atsScore: 95,
        pros: ["Clean parsing", "Simple structure", "High readability"],
        cons: ["May appear too plain"],
        bestFor: ["All industries", "Conservative fields", "Entry-level"],
      },
    ])
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-500"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-emerald-500 to-green-600"
    if (score >= 80) return "from-blue-500 to-indigo-600"
    if (score >= 70) return "from-yellow-500 to-orange-600"
    return "from-red-500 to-pink-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-emerald-600" />
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-blue-600" />
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const currentTemplate = templateRatings.find((t) => t.id === selectedTemplate)

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            ATS Analysis
          </h2>
          <p className="text-gray-600 font-medium">Comprehensive resume optimization insights</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="keywords"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            Keywords
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            Tips
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="overview" className="space-y-6">
            {atsScore && (
              <>
                {/* Overall Score Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-200/50">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -mr-20 -mt-20"></div>
                  <div className="relative text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      {getScoreIcon(atsScore.overall)}
                      <span className={`text-5xl font-bold ${getScoreColor(atsScore.overall)}`}>
                        {atsScore.overall}%
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Overall ATS Score</h3>
                    <p className="text-gray-600">
                      {atsScore.overall >= 90
                        ? "Excellent! Your resume is highly optimized for ATS systems."
                        : atsScore.overall >= 80
                          ? "Good! Your resume should perform well with most ATS systems."
                          : atsScore.overall >= 70
                            ? "Fair. Consider implementing the suggestions below."
                            : "Needs improvement. Follow our recommendations to boost your ATS score."}
                    </p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Keyword Match", value: atsScore.keywordMatch, icon: Target },
                    { label: "Formatting", value: atsScore.formatting, icon: FileText },
                    { label: "Section Structure", value: atsScore.sections, icon: Eye },
                    { label: "Readability", value: atsScore.readability, icon: Zap },
                  ].map((item, index) => (
                    <Card key={index} className="border-gray-200/50 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="font-semibold text-gray-900">{item.label}</span>
                          </div>
                          <span className={`text-2xl font-bold ${getScoreColor(item.value)}`}>{item.value}%</span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getScoreGradient(item.value)} transition-all duration-1000 ease-out rounded-full`}
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {!atsScore && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Add a job description to get detailed ATS analysis and keyword matching insights.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            {atsScore && (
              <>
                {/* Keywords Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-green-200/50 bg-green-50/50">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <div className="text-3xl font-bold text-green-700 mb-2">{atsScore.matchedKeywords.length}</div>
                      <div className="text-green-800 font-medium">Keywords Matched</div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-200/50 bg-red-50/50">
                    <CardContent className="p-6 text-center">
                      <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                      <div className="text-3xl font-bold text-red-700 mb-2">{atsScore.missingKeywords.length}</div>
                      <div className="text-red-800 font-medium">Keywords Missing</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Matched Keywords */}
                {atsScore.matchedKeywords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Matched Keywords ({atsScore.matchedKeywords.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {atsScore.matchedKeywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors duration-200"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Missing Keywords */}
                {atsScore.missingKeywords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-red-700">
                        <XCircle className="w-5 h-5" />
                        <span>Missing Keywords ({atsScore.missingKeywords.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {atsScore.missingKeywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50 transition-colors duration-200"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <Alert className="border-blue-200 bg-blue-50">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <strong>Pro Tip:</strong> Naturally incorporate these keywords into your experience
                          descriptions, skills section, or professional summary to improve your ATS score.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!jobDescription && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Paste a job description in the Job Matcher section to analyze keyword compatibility and get
                  personalized recommendations.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid gap-6">
              {templateRatings.map((template) => (
                <Card
                  key={template.id}
                  className={`transition-all duration-300 hover:shadow-lg ${
                    template.id === selectedTemplate ? "ring-2 ring-blue-500 bg-blue-50/50" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg flex items-center space-x-2">
                            <span>{template.name}</span>
                            {template.id === selectedTemplate && (
                              <Badge className="bg-blue-100 text-blue-700">Current</Badge>
                            )}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {getScoreIcon(template.atsScore)}
                            <span className={`font-bold ${getScoreColor(template.atsScore)}`}>
                              {template.atsScore}% ATS Compatible
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <h5 className="font-semibold text-green-700 mb-3 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Advantages</span>
                        </h5>
                        <ul className="space-y-2">
                          {template.pros.map((pro, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-red-700 mb-3 flex items-center space-x-2">
                          <XCircle className="w-4 h-4" />
                          <span>Considerations</span>
                        </h5>
                        <ul className="space-y-2">
                          {template.cons.map((con, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-blue-700 mb-3 flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>Best For</span>
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {template.bestFor.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            {atsScore && atsScore.suggestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
                {atsScore.suggestions.map((suggestion, index) => (
                  <Alert key={index} className="border-blue-200 bg-blue-50">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">{suggestion}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* General ATS Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Professional ATS Optimization Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  {[
                    {
                      icon: TrendingUp,
                      title: "Use Standard Section Headers",
                      description:
                        "Stick to conventional headers like 'Experience', 'Education', 'Skills' for better parsing.",
                      color: "blue",
                    },
                    {
                      icon: FileText,
                      title: "Optimize for Keywords",
                      description:
                        "Include relevant keywords from the job description naturally throughout your resume.",
                      color: "green",
                    },
                    {
                      icon: Eye,
                      title: "Keep Formatting Simple",
                      description: "Avoid complex layouts, tables, and graphics that may confuse ATS systems.",
                      color: "purple",
                    },
                    {
                      icon: CheckCircle,
                      title: "Use Standard Fonts",
                      description:
                        "Choose common fonts like Arial, Calibri, or Times New Roman for better readability.",
                      color: "indigo",
                    },
                  ].map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-200"
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
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
