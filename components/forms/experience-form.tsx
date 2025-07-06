"use client"

import { useState } from "react"
import type { Experience } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface ExperienceFormProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    }
    onChange([...data, newExperience])
    setExpandedItems(new Set([...expandedItems, newExperience.id]))
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id))
    setExpandedItems(new Set([...expandedItems].filter((item) => item !== id)))
  }

  const addDescriptionPoint = (id: string) => {
    const experience = data.find((exp) => exp.id === id)
    if (experience) {
      updateExperience(id, "description", [...experience.description, ""])
    }
  }

  const updateDescriptionPoint = (id: string, index: number, value: string) => {
    const experience = data.find((exp) => exp.id === id)
    if (experience) {
      const newDescription = [...experience.description]
      newDescription[index] = value
      updateExperience(id, "description", newDescription)
    }
  }

  const removeDescriptionPoint = (id: string, index: number) => {
    const experience = data.find((exp) => exp.id === id)
    if (experience && experience.description.length > 1) {
      const newDescription = experience.description.filter((_, i) => i !== index)
      updateExperience(id, "description", newDescription)
    }
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
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>Add your professional work experience, starting with the most recent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((experience, index) => (
          <Card key={experience.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{experience.position || `Experience ${index + 1}`}</h4>
                    {experience.company && <p className="text-sm text-gray-600">{experience.company}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleExpanded(experience.id)}>
                    {expandedItems.has(experience.id) ? "Collapse" : "Expand"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeExperience(experience.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {expandedItems.has(experience.id) && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <Input
                      value={experience.position}
                      onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company *</Label>
                    <Input
                      value={experience.company}
                      onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                      placeholder="Tech Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={experience.location}
                      onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                      disabled={experience.current}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${experience.id}`}
                      checked={experience.current}
                      onCheckedChange={(checked) => {
                        updateExperience(experience.id, "current", checked)
                        if (checked) {
                          updateExperience(experience.id, "endDate", "")
                        }
                      }}
                    />
                    <Label htmlFor={`current-${experience.id}`}>Currently working here</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Job Description</Label>
                  {experience.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex items-center space-x-2">
                      <Textarea
                        value={desc}
                        onChange={(e) => updateDescriptionPoint(experience.id, descIndex, e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={2}
                        className="flex-1"
                      />
                      {experience.description.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDescriptionPoint(experience.id, descIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addDescriptionPoint(experience.id)}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Description Point
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        <Button onClick={addExperience} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </CardContent>
    </Card>
  )
}
