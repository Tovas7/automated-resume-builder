"use client"

import type { ResumeData } from "@/types/resume"
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"

interface ModernTemplateProps {
  data: ResumeData
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return ""
    const [year, month] = date.split("-")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="w-full h-full p-8 text-sm bg-white">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data.personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              <span>{data.personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                </div>
                <div className="text-right text-gray-600">
                  <p>
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                  {exp.location && <p>{exp.location}</p>}
                </div>
              </div>
              {exp.description.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  {exp.description.map((desc, index) => desc.trim() && <li key={index}>{desc}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-right text-gray-600">
                  <p>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.location && <p>{edu.location}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Skills</h2>
          {Object.entries(
            data.skills.reduce(
              (acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = []
                acc[skill.category].push(skill)
                return acc
              },
              {} as Record<string, typeof data.skills>,
            ),
          ).map(([category, skills]) => (
            <div key={category} className="mb-2">
              <h4 className="font-medium text-gray-800 mb-1">{category}:</h4>
              <p className="text-gray-700">{skills.map((skill) => skill.name).join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Projects</h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 mb-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-gray-600 text-xs">
                  <strong>Technologies:</strong> {project.technologies.join(", ")}
                </p>
              )}
              <div className="flex gap-4 text-xs text-blue-600 mt-1">
                {project.url && <span>Live: {project.url}</span>}
                {project.github && <span>GitHub: {project.github}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-blue-600 mb-3">Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer}</p>
                </div>
                <p className="text-gray-600">{formatDate(cert.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
