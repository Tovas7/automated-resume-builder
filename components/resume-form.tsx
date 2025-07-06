"use client"
import type { ResumeData, ATSScore } from "@/types/resume"
import { PersonalInfoForm } from "./forms/personal-info-form"
import { ExperienceForm } from "./forms/experience-form"
import { EducationForm } from "./forms/education-form"
import { SkillsForm } from "./forms/skills-form"
import { ProjectsForm } from "./forms/projects-form"
import { CertificationsForm } from "./forms/certifications-form"
import { TemplateSelector } from "./template-selector"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Palette,
  Sparkles,
  TrendingUp,
  BarChart3,
} from "lucide-react"

interface UserPreferences {
  fullName: string
  department: string
  totalExperience: string
  includePhoto: boolean
}

interface ResumeFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
  selectedTemplate: string
  onTemplateChange: (template: string) => void
  currentStep: string
  atsScore?: ATSScore | null
  userPreferences: UserPreferences
}

export function ResumeForm({
  data,
  onChange,
  selectedTemplate,
  onTemplateChange,
  currentStep,
  atsScore,
  userPreferences,
}: ResumeFormProps) {
  const updateData = (section: keyof ResumeData, value: any) => {
    onChange({
      ...data,
      [section]: value,
    })
  }

  const getStepIcon = (step: string) => {
    switch (step) {
      case "template":
        return Palette
      case "personal":
        return User
      case "experience":
        return Briefcase
      case "education":
        return GraduationCap
      case "skills":
        return Code
      case "projects":
        return FolderOpen
      case "certifications":
        return Award
      case "review":
        return BarChart3
      default:
        return Sparkles
    }
  }

  const getStepTitle = (step: string) => {
    switch (step) {
      case "template":
        return "Choose Your Template"
      case "personal":
        return "Personal Information"
      case "experience":
        return "Work Experience"
      case "education":
        return "Education"
      case "skills":
        return "Skills & Expertise"
      case "projects":
        return "Projects & Portfolio"
      case "certifications":
        return "Certifications"
      case "review":
        return "Review & Analysis"
      default:
        return "Resume Builder"
    }
  }

  const getStepDescription = (step: string) => {
    switch (step) {
      case "template":
        return "Select a professional template that matches your industry and style"
      case "personal":
        return "Add your contact information and professional summary"
      case "experience":
        return "Detail your work history and achievements"
      case "education":
        return "Include your educational background"
      case "skills":
        return "Highlight your technical and soft skills"
      case "projects":
        return "Showcase your projects and accomplishments"
      case "certifications":
        return "Add your professional certifications and licenses"
      case "review":
        return "Review your resume and optimize for ATS systems"
      default:
        return "Build your professional resume"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-emerald-500 to-green-600"
    if (score >= 80) return "from-blue-500 to-indigo-600"
    if (score >= 70) return "from-yellow-500 to-orange-600"
    return "from-red-500 to-pink-600"
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 90) return "text-emerald-700"
    if (score >= 80) return "text-blue-700"
    if (score >= 70) return "text-yellow-700"
    return "text-red-700"
  }

  const StepIcon = getStepIcon(currentStep)

  const renderStepContent = () => {
    switch (currentStep) {
      case "template":
        return (
          <TemplateSelector selected={selectedTemplate} onSelect={onTemplateChange} userPreferences={userPreferences} />
        )
      case "personal":
        return (
          <PersonalInfoForm
            data={data.personalInfo}
            onChange={(personalInfo) => updateData("personalInfo", personalInfo)}
          />
        )
      case "experience":
        return <ExperienceForm data={data.experience} onChange={(experience) => updateData("experience", experience)} />
      case "education":
        return <EducationForm data={data.education} onChange={(education) => updateData("education", education)} />
      case "skills":
        return <SkillsForm data={data.skills} onChange={(skills) => updateData("skills", skills)} />
      case "projects":
        return <ProjectsForm data={data.projects} onChange={(projects) => updateData("projects", projects)} />
      case "certifications":
        return (
          <CertificationsForm
            data={data.certifications}
            onChange={(certifications) => updateData("certifications", certifications)}
          />
        )
      case "review":
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resume Complete!</h3>
              <p className="text-gray-600 mb-6">
                Your resume is ready for review. Use the analysis panel on the right to optimize for ATS systems.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      {/* Step Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <StepIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {getStepTitle(currentStep)}
            </h2>
            <p className="text-gray-600 font-medium">{getStepDescription(currentStep)}</p>
          </div>
        </div>

        {/* Auto-save indicator in header */}
        {atsScore && currentStep !== "template" && (
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Current ATS Score</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-lg font-bold px-4 py-2 ${getScoreTextColor(atsScore.overall)} border-current`}
                >
                  {atsScore.overall}%
                </Badge>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getScoreColor(atsScore.overall)} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${atsScore.overall}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Poor</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="transition-all duration-300">{renderStepContent()}</div>

      {/* Step-specific tips */}
      {currentStep !== "review" && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentStep === "template" &&
                  `Based on your ${userPreferences.department} background, we've highlighted the most suitable templates. Templates with photo support are marked for your preference.`}
                {currentStep === "personal" &&
                  "Your professional summary is crucial for ATS optimization. Include 3-5 key skills and quantifiable achievements that match your target role."}
                {currentStep === "experience" &&
                  "Use action verbs and include specific metrics (numbers, percentages, dollar amounts) to quantify your achievements. This helps both ATS systems and hiring managers."}
                {currentStep === "education" &&
                  "List your most recent education first. Include relevant coursework, honors, or GPA if it strengthens your application."}
                {currentStep === "skills" &&
                  "Organize skills by category and include both technical and soft skills. Match the skill names exactly as they appear in job descriptions."}
                {currentStep === "projects" &&
                  "Highlight projects that demonstrate skills relevant to your target role. Include technologies used and quantifiable results when possible."}
                {currentStep === "certifications" &&
                  "Include active certifications and licenses. Add expiration dates if applicable and provide credential URLs for verification."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
