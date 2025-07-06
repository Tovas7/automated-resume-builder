"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Briefcase, Calendar, Camera, CameraOff, ArrowRight, Sparkles } from "lucide-react"

interface UserPreferences {
  fullName: string
  department: string
  totalExperience: string
  includePhoto: boolean
}

interface OnboardingFormProps {
  onComplete: (preferences: UserPreferences) => void
}

const departments = [
  "Software Engineering",
  "Data Science",
  "Product Management",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Design",
  "Customer Success",
  "Business Development",
  "Consulting",
  "Healthcare",
  "Education",
  "Legal",
  "Engineering",
  "Research",
  "Other",
]

const experienceRanges = [
  "0-1 years (Entry Level)",
  "2-3 years (Junior)",
  "4-6 years (Mid-Level)",
  "7-10 years (Senior)",
  "11-15 years (Lead/Principal)",
  "16+ years (Executive)",
]

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fullName: "",
    department: "",
    totalExperience: "",
    includePhoto: false,
  })

  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to ResumeAI Pro",
      subtitle: "Let's create your perfect resume in minutes",
      content: "basic-info",
    },
    {
      title: "Photo Preference",
      subtitle: "Choose if you want to include a photo in your resume",
      content: "photo-preference",
    },
  ]

  const handleInputChange = (field: keyof UserPreferences, value: string | boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(preferences)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    if (currentStep === 0) {
      return preferences.fullName.trim() && preferences.department && preferences.totalExperience
    }
    return true
  }

  const renderStepContent = () => {
    switch (steps[currentStep].content) {
      case "basic-info":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Full Name *</span>
                </Label>
                <Input
                  id="fullName"
                  value={preferences.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Department/Field *</span>
                </Label>
                <Select
                  value={preferences.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Select your department or field" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Total Years of Experience *</span>
                </Label>
                <Select
                  value={preferences.totalExperience}
                  onValueChange={(value) => handleInputChange("totalExperience", value)}
                >
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Personalized Experience</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Based on your information, we'll recommend the best resume templates and provide industry-specific
                    tips to help you stand out in your field.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "photo-preference":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Photo Preference</h3>
              <p className="text-gray-600">
                Some industries and regions prefer resumes with photos, while others don't. Choose what works best for
                your situation.
              </p>
            </div>

            <RadioGroup
              value={preferences.includePhoto ? "with-photo" : "without-photo"}
              onValueChange={(value) => handleInputChange("includePhoto", value === "with-photo")}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <RadioGroupItem value="with-photo" id="with-photo" />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="with-photo" className="font-semibold text-gray-900 cursor-pointer">
                      Include Photo
                    </Label>
                    <p className="text-sm text-gray-600">
                      Best for creative fields, hospitality, sales, and some international markets
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <RadioGroupItem value="without-photo" id="without-photo" />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <CameraOff className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="without-photo" className="font-semibold text-gray-900 cursor-pointer">
                      No Photo
                    </Label>
                    <p className="text-sm text-gray-600">
                      Recommended for most corporate, tech, and professional services roles
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">💡 Industry Recommendation</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {preferences.department === "Software Engineering" ||
                    preferences.department === "Data Science" ||
                    preferences.department === "Finance" ||
                    preferences.department === "Legal"
                      ? "For your field, we typically recommend resumes without photos to maintain focus on your technical skills and experience."
                      : preferences.department === "Marketing" ||
                          preferences.department === "Design" ||
                          preferences.department === "Sales"
                        ? "In your field, including a professional photo can help create a personal connection, but it's optional."
                        : "You can choose either option based on your personal preference and target market."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                ResumeAI Pro
              </CardTitle>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
            <p className="text-gray-600">{steps[currentStep].subtitle}</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-blue-600 w-8" : index < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="space-y-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>

              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
