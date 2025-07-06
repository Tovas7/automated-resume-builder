"use client"

import type { ResumeData } from "@/types/resume"
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"

interface CreativeTemplateProps {
  data: ResumeData
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return ""
    const [year, month] = date.split("-")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="w-full h-full flex bg-white">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-600 text-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{data.personalInfo.fullName || "Your Name"}</h1>
          <div className="space-y-2 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="break-all">{data.personalInfo.website}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                <span className="break-all">{data.personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-1">Skills</h2>
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
                <h4 className="font-semibold text-sm mb-1">{category}</h4>
                <div className="space-y-1">
                  {skills.map((skill) => (
                    <div key={skill.id} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span>{skill.name}</span>
                        <span>{skill.level}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1">
                        <div
                          className="bg-white rounded-full h-1"
                          style={{
                            width:
                              skill.level === "Expert"
                                ? "100%"
                                : skill.level === "Advanced"
                                  ? "80%"
                                  : skill.level === "Intermediate"
                                    ? "60%"
                                    : "40%",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-1">Certifications</h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-3 text-sm">
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-white/80">{cert.issuer}</p>
                <p className="text-white/60 text-xs">{formatDate(cert.date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-6">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1">About Me</h2>
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1">Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4 relative pl-4">
                <div className="absolute left-0 top-2 w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-purple-600 font-semibold">{exp.company}</p>
                  </div>
                  <div className="text-right text-gray-600 text-sm">
                    <p>
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
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
            <h2 className="text-xl font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3 relative pl-4">
                <div className="absolute left-0 top-2 w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-purple-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-gray-600 text-sm">
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

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1">Projects</h2>
            {data.projects.map((project) => (
              <div key={project.id} className="mb-4 relative pl-4">
                <div className="absolute left-0 top-2 w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                <p className="text-gray-700 mb-2 text-sm">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 text-xs text-purple-600">
                  {project.url && <span>🔗 {project.url}</span>}
                  {project.github && <span>📱 {project.github}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
