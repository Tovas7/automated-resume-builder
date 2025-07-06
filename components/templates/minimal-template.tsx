"use client"

import type { ResumeData } from "@/types/resume"

interface MinimalTemplateProps {
  data: ResumeData
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return ""
    const [year, month] = date.split("-")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="w-full h-full p-12 text-sm bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-4">{data.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-widest">Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-medium text-gray-900">{exp.position}</h3>
                <span className="text-gray-500 text-xs">
                  {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                {exp.company} {exp.location && `• ${exp.location}`}
              </p>
              {exp.description.length > 0 && (
                <div className="text-gray-700 space-y-1">
                  {exp.description.map((desc, index) => desc.trim() && <p key={index}>• {desc}</p>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-widest">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                <span className="text-gray-500 text-xs">
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-gray-600">
                {edu.field} • {edu.institution}
              </p>
              {edu.location && <p className="text-gray-500 text-xs">{edu.location}</p>}
              {edu.gpa && <p className="text-gray-500 text-xs">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-widest">Skills</h2>
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
            <div key={category} className="mb-3">
              <span className="text-gray-600 font-medium">{category}: </span>
              <span className="text-gray-700">{skills.map((skill) => skill.name).join(" • ")}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-widest">Projects</h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>
              <p className="text-gray-700 mb-2">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-gray-500 text-xs mb-1">{project.technologies.join(" • ")}</p>
              )}
              <div className="flex gap-4 text-xs text-gray-500">
                {project.url && <span>{project.url}</span>}
                {project.github && <span>{project.github}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-widest">Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-gray-900">{cert.name}</h3>
                <span className="text-gray-500 text-xs">{formatDate(cert.date)}</span>
              </div>
              <p className="text-gray-600">{cert.issuer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
