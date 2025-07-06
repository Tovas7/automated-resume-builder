"use client"

import type { ResumeData } from "@/types/resume"

interface ClassicTemplateProps {
  data: ResumeData
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return ""
    const [year, month] = date.split("-")
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="w-full h-full p-8 text-sm bg-white font-serif">
      {/* Header */}
      <div className="text-center border-b border-gray-400 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{data.personalInfo.fullName || "Your Name"}</h1>
        <div className="text-gray-700 space-y-1">
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
          {data.personalInfo.website && <div>{data.personalInfo.website}</div>}
          {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide">Objective</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">Professional Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <p className="italic text-gray-700">{exp.company}</p>
                </div>
                <div className="text-right text-gray-600">
                  <p>
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                  {exp.location && <p className="italic">{exp.location}</p>}
                </div>
              </div>
              {exp.description.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
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
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="italic text-gray-700">{edu.field}</p>
                  <p className="text-gray-700">{edu.institution}</p>
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-right text-gray-600">
                  <p>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.location && <p className="italic">{edu.location}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">Skills</h2>
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
              <span className="font-bold text-gray-800">{category}: </span>
              <span className="text-gray-700">{skills.map((skill) => skill.name).join(", ")}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">Projects</h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-bold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 mb-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-gray-600 text-xs">
                  <span className="font-bold">Technologies: </span>
                  {project.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{cert.name}</h3>
                  <p className="italic text-gray-700">{cert.issuer}</p>
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
