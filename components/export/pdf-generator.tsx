"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, Printer, Share2, CheckCircle, Loader2 } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface PDFGeneratorProps {
  resumeData: ResumeData
  selectedTemplate: string
  atsScore: number | null
}

export function PDFGenerator({ resumeData, selectedTemplate, atsScore }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | "txt">("pdf")

  const generatePDF = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate PDF generation process
    const steps = [
      { message: "Preparing resume data...", progress: 20 },
      { message: "Applying template styling...", progress: 40 },
      { message: "Optimizing for ATS...", progress: 60 },
      { message: "Generating PDF...", progress: 80 },
      { message: "Finalizing document...", progress: 100 },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setGenerationProgress(step.progress)
    }

    // In a real implementation, this would generate and download the actual PDF
    const blob = new Blob(["Mock PDF content"], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const generateWord = async () => {
    setIsGenerating(true)
    setExportFormat("docx")

    // Simulate Word generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const blob = new Blob(["Mock Word content"], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsGenerating(false)
  }

  const generatePlainText = async () => {
    setIsGenerating(true)
    setExportFormat("txt")

    // Generate plain text version
    let textContent = `${resumeData.personalInfo.fullName}\n`
    textContent += `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}\n`
    textContent += `${resumeData.personalInfo.location}\n\n`

    if (resumeData.personalInfo.summary) {
      textContent += `PROFESSIONAL SUMMARY\n${resumeData.personalInfo.summary}\n\n`
    }

    if (resumeData.experience.length > 0) {
      textContent += `WORK EXPERIENCE\n`
      resumeData.experience.forEach((exp) => {
        textContent += `${exp.position} at ${exp.company}\n`
        textContent += `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}\n`
        exp.description.forEach((desc) => {
          if (desc.trim()) textContent += `• ${desc}\n`
        })
        textContent += "\n"
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const blob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsGenerating(false)
  }

  const printResume = () => {
    window.print()
  }

  const shareResume = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resumeData.personalInfo.fullName}'s Resume`,
          text: "Check out my professional resume created with ResumeAI Pro",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Resume link copied to clipboard!")
    }
  }

  return (
    <Card className="border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Export Your Resume</h3>
            <p className="text-gray-600">Download in multiple formats or share with others</p>
          </div>
        </div>

        {/* ATS Score Display */}
        {atsScore && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">ATS Optimization Score</span>
              <Badge
                variant="outline"
                className={
                  atsScore >= 90
                    ? "bg-green-100 text-green-700 border-green-200"
                    : atsScore >= 80
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : atsScore >= 70
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                }
              >
                {atsScore}%
              </Badge>
            </div>
            <Progress value={atsScore} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              {atsScore >= 90
                ? "Excellent! Your resume is highly optimized for ATS systems."
                : atsScore >= 80
                  ? "Good! Your resume should perform well with most ATS systems."
                  : atsScore >= 70
                    ? "Fair. Consider the suggestions to improve your ATS score."
                    : "Needs improvement. Review the ATS analysis for recommendations."}
            </p>
          </div>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="font-medium text-blue-900">Generating your resume...</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-blue-700 mt-2">
              {generationProgress === 20 && "Preparing resume data..."}
              {generationProgress === 40 && "Applying template styling..."}
              {generationProgress === 60 && "Optimizing for ATS..."}
              {generationProgress === 80 && "Generating PDF..."}
              {generationProgress === 100 && "Finalizing document..."}
            </p>
          </div>
        )}

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            className="h-16 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Download PDF</div>
                <div className="text-sm opacity-90">Best for applications</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={generateWord}
            disabled={isGenerating}
            variant="outline"
            className="h-16 border-blue-200 hover:bg-blue-50 bg-transparent"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Download Word</div>
                <div className="text-sm text-gray-600">Easy to edit</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={generatePlainText}
            disabled={isGenerating}
            variant="outline"
            className="h-16 border-gray-200 hover:bg-gray-50 bg-transparent"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Plain Text</div>
                <div className="text-sm text-gray-600">ATS-friendly</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={printResume}
            disabled={isGenerating}
            variant="outline"
            className="h-16 border-purple-200 hover:bg-purple-50 bg-transparent"
          >
            <div className="flex items-center space-x-3">
              <Printer className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Print Resume</div>
                <div className="text-sm text-gray-600">Physical copy</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
          <Button
            onClick={shareResume}
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Resume</span>
          </Button>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Resume ready for export</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
