"use client"

import type { PersonalInfo } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Globe, Linkedin, FileText } from "lucide-react"

interface PersonalInfoFormProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-gray-900">Personal Information</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Add your contact information and professional summary
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Full Name *</span>
            </Label>
            <Input
              id="fullName"
              value={data.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="John Doe"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email *</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Phone *</span>
            </Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Location *</span>
            </Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="New York, NY"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="website" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Website</span>
            </Label>
            <Input
              id="website"
              value={data.website || ""}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://johndoe.com"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </Label>
            <Input
              id="linkedin"
              value={data.linkedin || ""}
              onChange={(e) => updateField("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label htmlFor="summary" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Professional Summary *</span>
          </Label>
          <Textarea
            id="summary"
            value={data.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives. This section is crucial for ATS optimization..."
            rows={5}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Include 3-5 key skills and quantifiable achievements in your summary for better ATS performance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
