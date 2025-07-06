"use client"

import { useState } from "react"
import type { Project } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical, X } from "lucide-react"

interface ProjectsFormProps {
  data: Project[]
  onChange: (data: Project[]) => void
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      github: "",
    }
    onChange([...data, newProject])
    setExpandedItems(new Set([...expandedItems, newProject.id]))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(data.map((project) => (project.id === id ? { ...project, [field]: value } : project)))
  }

  const removeProject = (id: string) => {
    onChange(data.filter((project) => project.id !== id))
    setExpandedItems(new Set([...expandedItems].filter((item) => item !== id)))
  }

  const addTechnology = (id: string, tech: string) => {
    if (tech.trim()) {
      const project = data.find((p) => p.id === id)
      if (project && !project.technologies.includes(tech.trim())) {
        updateProject(id, "technologies", [...project.technologies, tech.trim()])
      }
    }
  }

  const removeTechnology = (id: string, tech: string) => {
    const project = data.find((p) => p.id === id)
    if (project) {
      updateProject(
        id,
        "technologies",
        project.technologies.filter((t) => t !== tech),
      )
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
        <CardTitle>Projects</CardTitle>
        <CardDescription>Showcase your personal and professional projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((project, index) => (
          <Card key={project.id} className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{project.name || `Project ${index + 1}`}</h4>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleExpanded(project.id)}>
                    {expandedItems.has(project.id) ? "Collapse" : "Expand"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {expandedItems.has(project.id) && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Name *</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, "name", e.target.value)}
                      placeholder="E-commerce Website"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Live URL</Label>
                    <Input
                      value={project.url || ""}
                      onChange={(e) => updateProject(project.id, "url", e.target.value)}
                      placeholder="https://myproject.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>GitHub Repository</Label>
                    <Input
                      value={project.github || ""}
                      onChange={(e) => updateProject(project.id, "github", e.target.value)}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                    placeholder="Describe your project, its features, and your role..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center space-x-1">
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTechnology(project.id, tech)}
                          className="hover:bg-black/10 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add technology (e.g., React, Node.js)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTechnology(project.id, e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addTechnology(project.id, input.value)
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        <Button onClick={addProject} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </CardContent>
    </Card>
  )
}
