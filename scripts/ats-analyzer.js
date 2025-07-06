// Advanced ATS Analysis Engine
class ATSAnalyzer {
  constructor() {
    this.commonATSKeywords = [
      "experience",
      "skills",
      "education",
      "certification",
      "management",
      "leadership",
      "development",
      "analysis",
      "communication",
      "project",
      "team",
      "technical",
      "software",
      "programming",
      "database",
    ]
  }

  analyzeResume(resumeData, jobDescription) {
    const analysis = {
      keywordDensity: this.calculateKeywordDensity(resumeData, jobDescription),
      sectionStructure: this.analyzeSectionStructure(resumeData),
      formattingScore: this.analyzeFormatting(resumeData),
      readabilityScore: this.analyzeReadability(resumeData),
      atsCompatibility: this.checkATSCompatibility(resumeData),
    }

    return this.generateOverallScore(analysis)
  }

  calculateKeywordDensity(resumeData, jobDescription) {
    const jobKeywords = this.extractKeywords(jobDescription)
    const resumeText = this.getResumeText(resumeData)
    const resumeKeywords = this.extractKeywords(resumeText)

    const matches = jobKeywords.filter((keyword) =>
      resumeKeywords.some((rKeyword) => this.isKeywordMatch(keyword, rKeyword)),
    )

    return {
      totalJobKeywords: jobKeywords.length,
      matchedKeywords: matches.length,
      density: (matches.length / jobKeywords.length) * 100,
      matches: matches,
    }
  }

  extractKeywords(text) {
    // Advanced keyword extraction with NLP-like processing
    const stopWords = new Set(["the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"])

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
      }, {})
  }

  isKeywordMatch(keyword1, keyword2) {
    // Fuzzy matching for similar keywords
    const similarity = this.calculateSimilarity(keyword1, keyword2)
    return similarity > 0.8
  }

  calculateSimilarity(str1, str2) {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  levenshteinDistance(str1, str2) {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  analyzeSectionStructure(resumeData) {
    const requiredSections = ["personalInfo", "experience", "education", "skills"]
    const optionalSections = ["projects", "certifications"]

    let score = 0
    const feedback = []

    requiredSections.forEach((section) => {
      if (resumeData[section] && this.hasContent(resumeData[section])) {
        score += 25
      } else {
        feedback.push(`Missing or incomplete ${section} section`)
      }
    })

    optionalSections.forEach((section) => {
      if (resumeData[section] && this.hasContent(resumeData[section])) {
        score += 5
      }
    })

    return { score: Math.min(score, 100), feedback }
  }

  hasContent(section) {
    if (Array.isArray(section)) {
      return section.length > 0
    }
    if (typeof section === "object") {
      return Object.values(section).some((value) => value && value.toString().trim().length > 0)
    }
    return section && section.toString().trim().length > 0
  }

  generateOverallScore(analysis) {
    const weights = {
      keywordDensity: 0.4,
      sectionStructure: 0.3,
      formattingScore: 0.2,
      readabilityScore: 0.1,
    }

    const overallScore = Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (analysis[key].score || analysis[key]) * weight
    }, 0)

    return {
      overall: Math.round(overallScore),
      breakdown: analysis,
      recommendations: this.generateRecommendations(analysis),
    }
  }

  generateRecommendations(analysis) {
    const recommendations = []

    if (analysis.keywordDensity.density < 60) {
      recommendations.push("Increase keyword density by incorporating more job-relevant terms")
    }

    if (analysis.sectionStructure.score < 80) {
      recommendations.push("Complete all required resume sections")
    }

    if (analysis.formattingScore < 85) {
      recommendations.push("Improve resume formatting for better ATS parsing")
    }

    return recommendations
  }
}

// Export for use in the application
if (typeof module !== "undefined" && module.exports) {
  module.exports = ATSAnalyzer
}

console.log("ATS Analyzer engine loaded successfully")
