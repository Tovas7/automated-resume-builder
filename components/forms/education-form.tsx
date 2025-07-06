"use client"

import { useState } from "react"
import type { Education } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface EducationFormProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }
    onChange([...data, newEducation])
    setExpandedItems(new Set([...expandedItems, newEducation.id]))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id))
    setExpandedItems(new Set([...expandedItems].filter((item) => item !== id)))
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background, starting with the most recent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((education, index) => (
          <Card key={education.id} className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{education.degree || `Education ${index + 1}`}</h4>
                    {education.institution && <p className="text-sm text-gray-600">{education.institution}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleExpanded(education.id)}>
                    {expandedItems.has(education.id) ? "Collapse" : "Expand"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeEducation(education.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {expandedItems.has(education.id) && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Institution *</Label>
                    <Input
                      value={education.institution}
                      onChange={(e) => updateEducation(education.id, "institution", e.target.value)}
                      placeholder="University of California"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree *</Label>
                    <Input
                      value={education.degree}
                      onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study *</Label>
                    <Input
                      value={education.field}
                      onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={education.location}
                      onChange={(e) => updateEducation(education.id, "location", e.target.value)}
                      placeholder="Berkeley, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={education.startDate}
                      onChange={(e) => updateEducation(education.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={education.endDate}
                      onChange={(e) => updateEducation(education.id, "endDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>GPA (Optional)</Label>
                    <Input
                      value={education.gpa || ""}
                      onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        <Button onClick={addEducation} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </CardContent>
    </Card>
  )
}
