"use client"

import { useState } from "react"
import { OnboardingForm } from "@/components/onboarding-form"
import { ResumeForm } from "@/components/resume-form"
import { ResumePreview } from "@/components/resume-preview"
import { ATSAnalysis } from "@/components/ats-analysis"
import { JobDescriptionMatcher } from "@/components/job-description-matcher"
import { StepNavigation } from "@/components/step-navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Sparkles, ArrowLeft, ArrowRight, CheckCircle, Eye } from "lucide-react"
import type { ResumeData, ATSScore } from "@/types/resume"
import { AchievementSystem } from "@/components/gamification/achievement-system"
import { ProgressTracker } from "@/components/gamification/progress-tracker"
import { PDFGenerator } from "@/components/export/pdf-generator"
import { IndustryTips } from "@/components/tips/industry-tips"

interface UserPreferences {
  fullName: string
  department: string
  totalExperience: string
  includePhoto: boolean
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
}

const steps = [
  { id: "template", title: "Choose Template", description: "Select your preferred design" },
  { id: "personal", title: "Personal Info", description: "Contact & summary" },
  { id: "experience", title: "Experience", description: "Work history" },
  { id: "education", title: "Education", description: "Academic background" },
  { id: "skills", title: "Skills", description: "Technical & soft skills" },
  { id: "projects", title: "Projects", description: "Portfolio & achievements" },
  { id: "certifications", title: "Certifications", description: "Professional credentials" },
  { id: "review", title: "Review & Download", description: "Final review & ATS analysis" },
]

export default function HomePage() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [atsScore, setATSScore] = useState<ATSScore | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [showPreview, setShowPreview] = useState(false)

  /* -------------------------------------------------------------------- */
  /* -----------------------  ONBOARDING  -------------------------------- */
  /* -------------------------------------------------------------------- */
  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs)
    // Pre-fill name
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, fullName: prefs.fullName },
    }))
  }

  /* -------------------------------------------------------------------- */
  /* -----------------------  STEP CONTROLS  ----------------------------- */
  /* -------------------------------------------------------------------- */
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      setCurrentStep(currentStep + 1)
    }
  }
  const handlePrevious = () => currentStep > 0 && setCurrentStep(currentStep - 1)
  const handleStepClick = (index: number) => {
    if (completedSteps.has(index) || index === currentStep || index === currentStep + 1) {
      setCurrentStep(index)
    }
  }

  /* -------------------------------------------------------------------- */
  /* --------------------  EXPORT PLACEHOLDERS  -------------------------- */
  /* -------------------------------------------------------------------- */
  const handleExportPDF = () => {
    // This will be handled by the PDFGenerator component
  }
  const handleExportWord = () => {
    // This will be handled by the PDFGenerator component
  }

  /* -------------------------------------------------------------------- */
  /* -----------------------  VALIDATION  -------------------------------- */
  /* -------------------------------------------------------------------- */
  const isStepValid = () => {
    const info = resumeData.personalInfo
    switch (steps[currentStep].id) {
      case "template":
        return selectedTemplate !== ""
      case "personal":
        return info.fullName && info.email && info.phone && info.location && info.summary
      case "experience":
        return resumeData.experience.length > 0
      case "education":
        return resumeData.education.length > 0
      case "skills":
        return resumeData.skills.length > 0
      default:
        return true
    }
  }

  /* -------------------------------------------------------------------- */
  /* -----------------------  UTILS  ------------------------------------- */
  /* -------------------------------------------------------------------- */
  const scoreColor = (s: number) =>
    s >= 90
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : s >= 80
        ? "bg-blue-100 text-blue-700 border-blue-200"
        : s >= 70
          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
          : "bg-red-100 text-red-700 border-red-200"

  /* -------------------------------------------------------------------- */
  /* -----------------------  EARLY EXIT  -------------------------------- */
  /* -------------------------------------------------------------------- */
  if (!userPreferences) return <OnboardingForm onComplete={handleOnboardingComplete} />

  /* -------------------------------------------------------------------- */
  /* -----------------------  RENDER  ------------------------------------ */
  /* -------------------------------------------------------------------- */
  const isReviewStep = currentStep === steps.length - 1

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* ---------------------------  HEADER  --------------------------- */}
      {/* ---------------------------------------------------------------- */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Progress */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  ResumeAI Pro
                </h1>
                <p className="text-xs text-gray-500 font-medium">Building resume for {userPreferences.fullName}</p>
              </div>
            </div>

            {/* Desktop progress hint */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}:
              </span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {steps[currentStep].title}
              </Badge>
            </div>

            {/* ATS badge (only on Review step) */}
            {atsScore && isReviewStep && (
              <div className="hidden lg:flex items-center space-x-2">
                <span className="text-sm text-gray-600">ATS Score:</span>
                <Badge variant="outline" className={scoreColor(atsScore.overall)}>
                  {atsScore.overall}%
                </Badge>
              </div>
            )}
          </div>

          {/* Right-hand actions */}
          <div className="flex items-center space-x-3">
            {/* Preview – available on all steps, disabled until a template is chosen */}
            <Button
              variant="outline"
              size="sm"
              disabled={!selectedTemplate}
              onClick={() => setShowPreview(true)}
              className="border-gray-300 hover:border-purple-400 hover:bg-purple-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>

            {/* Export buttons – only visible on review step */}
            {isReviewStep && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-blue-400 hover:bg-blue-50 bg-transparent"
                  onClick={handleExportWord}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Word
                </Button>
                <Button
                  onClick={handleExportPDF}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* ----------------------------  MAIN  --------------------------- */}
      {/* ---------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step navigation */}
        <div className="mb-8">
          <StepNavigation
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Single-column layout */}
        <div className="space-y-8">
          {/* 1) The main form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <ResumeForm
              data={resumeData}
              onChange={setResumeData}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              currentStep={steps[currentStep].id}
              atsScore={atsScore}
              userPreferences={userPreferences}
            />

            {/* Gamification & Progress Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AchievementSystem
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                atsScore={atsScore?.overall || null}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
              <ProgressTracker
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                currentStep={currentStep}
                completedSteps={completedSteps}
                atsScore={atsScore?.overall || null}
              />
            </div>

            {/* Industry Tips */}
            <IndustryTips
              department={userPreferences.department}
              experienceLevel={userPreferences.totalExperience}
              currentStep={steps[currentStep].id}
            />

            {/* Footer navigation buttons */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-200/50 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-2">
                {isStepValid() && currentStep < steps.length - 1 && <CheckCircle className="w-5 h-5 text-green-600" />}
                <span className="text-sm text-gray-600">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </Button>
              )}
            </div>
          </div>

          {/* 2) Extra panels on Review step */}
          {isReviewStep && (
            <div className="space-y-8">
              <PDFGenerator
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                atsScore={atsScore?.overall || null}
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <JobDescriptionMatcher
                  resumeData={resumeData}
                  jobDescription={jobDescription}
                  onJobDescriptionChange={setJobDescription}
                  onATSScoreUpdate={setATSScore}
                />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                <ATSAnalysis
                  resumeData={resumeData}
                  selectedTemplate={selectedTemplate}
                  jobDescription={jobDescription}
                  atsScore={atsScore}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* --------------------------  PREVIEW  -------------------------- */}
      {/* ---------------------------------------------------------------- */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Resume Preview</span>
            </DialogTitle>
          </DialogHeader>

          {/* Actual preview */}
          <div className="bg-white border rounded-lg p-8" style={{ aspectRatio: "8.5/11", minHeight: "600px" }}>
            {selectedTemplate ? (
              <ResumePreview data={resumeData} template={selectedTemplate} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Select a template first to preview your resume.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
