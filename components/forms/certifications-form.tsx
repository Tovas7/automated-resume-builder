"use client"

import { useState } from "react"
import type { Certification } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface CertificationsFormProps {
  data: Certification[]
  onChange: (data: Certification[]) => void
}

export function CertificationsForm({ data, onChange }: CertificationsFormProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    }
    onChange([...data, newCertification])
    setExpandedItems(new Set([...expandedItems, newCertification.id]))
  }

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChange(data.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)))
  }

  const removeCertification = (id: string) => {
    onChange(data.filter((cert) => cert.id !== id))
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
        <CardTitle>Certifications</CardTitle>
        <CardDescription>Add your professional certifications and licenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((certification, index) => (
          <Card key={certification.id} className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{certification.name || `Certification ${index + 1}`}</h4>
                    {certification.issuer && <p className="text-sm text-gray-600">{certification.issuer}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleExpanded(certification.id)}>
                    {expandedItems.has(certification.id) ? "Collapse" : "Expand"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeCertification(certification.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {expandedItems.has(certification.id) && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Certification Name *</Label>
                    <Input
                      value={certification.name}
                      onChange={(e) => updateCertification(certification.id, "name", e.target.value)}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization *</Label>
                    <Input
                      value={certification.issuer}
                      onChange={(e) => updateCertification(certification.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issue Date *</Label>
                    <Input
                      type="month"
                      value={certification.date}
                      onChange={(e) => updateCertification(certification.id, "date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credential URL</Label>
                    <Input
                      value={certification.url || ""}
                      onChange={(e) => updateCertification(certification.id, "url", e.target.value)}
                      placeholder="https://credential-url.com"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        <Button onClick={addCertification} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </CardContent>
    </Card>
  )
}
