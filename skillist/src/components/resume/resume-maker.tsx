'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, Sparkles, Eye, Edit3, 
  Trash2, Plus, Check, ChevronRight, Loader2,
  Briefcase, GraduationCap, Award, Code, User,
  Mail, Phone, MapPin, Link, Link2, Globe,
  AlertCircle, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { generateAIResume, saveResume, ResumeData, getResumeTemplates } from '@/lib/resume-generator'
import { cn } from '@/lib/utils'

interface StudentData {
  id: string
  name: string
  email: string
  bio?: string
  phone?: string
  location?: string
  linkedin?: string
  githubUsername?: string
  portfolioUrl?: string
  skills: { skill: { name: string }; proficiency: string }[]
  projects: { id: string; title: string; description: string; technologies: string[]; url?: string }[]
  certifications: { id: string; name: string; issuer: string; date?: string }[]
  experience: any[]
  education: any[]
}

interface UserResume {
  id: string
  title: string
  template: string
  createdAt: string
  updatedAt: string
}

interface ResumeMakerProps {
  studentData: StudentData
  initialResumes?: UserResume[]
}

export function ResumeMaker({ studentData, initialResumes = [] }: ResumeMakerProps) {
  const [resumes, setResumes] = useState<UserResume[]>(initialResumes)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('ats-optimized')
  const [targetRole, setTargetRole] = useState('')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list')
  const [editingResume, setEditingResume] = useState<ResumeData | null>(null)

  const handleGenerate = async () => {
    if (!targetRole.trim()) return

    setIsGenerating(true)
    setGenerationProgress(10)

    try {
      setGenerationProgress(30)
      const formattedData = {
        name: studentData.name,
        email: studentData.email,
        bio: studentData.bio,
        phone: studentData.phone,
        location: studentData.location,
        linkedin: studentData.linkedin,
        github: studentData.githubUsername,
        portfolio: studentData.portfolioUrl,
        skills: studentData.skills.map((s) => ({
          name: s.skill.name,
          proficiency: s.proficiency
        })),
        projects: studentData.projects.map((p) => ({
          title: p.title,
          description: p.description,
          technologies: p.technologies,
          url: p.url
        })),
        certifications: studentData.certifications.map((c) => ({
          name: c.name,
          issuer: c.issuer,
          date: c.date
        })),
        experience: studentData.experience || [],
        education: studentData.education || [],
        targetRole
      }

      setGenerationProgress(50)
      const resume = await generateAIResume(formattedData, targetRole)
      
      setGenerationProgress(80)
      setGeneratedResume(resume)
      setViewMode('editor')
      setGenerationProgress(100)
    } catch (error) {
      console.error('Failed to generate resume:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedResume) return

    try {
      const saved = await saveResume(studentData.id, {
        ...generatedResume,
        personalInfo: {
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          location: studentData.location,
          linkedIn: studentData.linkedin,
          github: studentData.githubUsername,
          portfolio: studentData.portfolioUrl
        }
      })
      
      setResumes([...resumes, { 
        id: saved.id, 
        title: `${targetRole} Resume`,
        template: selectedTemplate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      
      setViewMode('list')
      setGeneratedResume(null)
      setTargetRole('')
    } catch (error) {
      console.error('Failed to save resume:', error)
    }
  }

  const templates = [
    { id: 'ats-optimized', name: 'ATS Optimized', icon: FileText, color: 'bg-blue-500' },
    { id: 'modern-tech', name: 'Modern Tech', icon: Code, color: 'bg-purple-500' },
    { id: 'executive', name: 'Executive', icon: Briefcase, color: 'bg-amber-500' },
    { id: 'creative', name: 'Creative', icon: Sparkles, color: 'bg-pink-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Resume Maker</h2>
          <p className="text-sm text-muted-foreground">
            Generate professional, SEO-optimized resumes using AI
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-indigo-500">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Generate New Resume</h3>
                      <p className="text-sm text-muted-foreground">
                        AI will create a tailored resume based on your profile
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Target Job Role
                      </label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g., Frontend Developer, Data Scientist"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select Template
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all text-left",
                              selectedTemplate === template.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-lg mb-2 flex items-center justify-center", template.color)}>
                              <template.icon className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-xs font-medium">{template.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !targetRole.trim()}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating... {generationProgress}%
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>

                    {isGenerating && (
                      <Progress value={generationProgress} className="h-2" />
                    )}
                  </div>
                </Card>

                {resumes.length > 0 && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Your Resumes</h3>
                    <div className="space-y-3">
                      {resumes.map((resume) => (
                        <div
                          key={resume.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{resume.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(resume.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setViewMode('list')
                          setGeneratedResume(null)
                        }}
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </Button>
                      <h3 className="font-semibold">Preview Resume</h3>
                      <Badge variant="outline" className="ml-2">
                        {templates.find(t => t.id === selectedTemplate)?.name}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleGenerate}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Check className="w-4 h-4 mr-2" />
                        Save Resume
                      </Button>
                    </div>
                  </div>

                  {generatedResume && (
                    <div className="bg-white border rounded-xl p-8 max-w-3xl mx-auto shadow-sm">
                      <div className="text-center border-b pb-6 mb-6">
                        <h1 className="text-2xl font-bold">{generatedResume.personalInfo.name}</h1>
                        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {generatedResume.personalInfo.email}
                          </span>
                          {generatedResume.personalInfo.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {generatedResume.personalInfo.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {generatedResume.professionalSummary && (
                        <section className="mb-6">
                          <h4 className="font-semibold text-sm uppercase tracking-wide mb-2">Professional Summary</h4>
                          <p className="text-sm">{generatedResume.professionalSummary}</p>
                        </section>
                      )}

                      {generatedResume.skills.length > 0 && (
                        <section className="mb-6">
                          <h4 className="font-semibold text-sm uppercase tracking-wide mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {generatedResume.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary">
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        </section>
                      )}

                      {generatedResume.experience.length > 0 && (
                        <section className="mb-6">
                          <h4 className="font-semibold text-sm uppercase tracking-wide mb-2">Experience</h4>
                          <div className="space-y-4">
                            {generatedResume.experience.map((exp, idx) => (
                              <div key={idx}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{exp.title}</p>
                                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate}
                                  </span>
                                </div>
                                <p className="text-sm mt-2">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {generatedResume.education.length > 0 && (
                        <section className="mb-6">
                          <h4 className="font-semibold text-sm uppercase tracking-wide mb-2">Education</h4>
                          <div className="space-y-2">
                            {generatedResume.education.map((edu, idx) => (
                              <div key={idx} className="flex justify-between">
                                <div>
                                  <p className="font-medium">{edu.school}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                  </p>
                                </div>
                                {edu.graduationDate && (
                                  <span className="text-xs text-muted-foreground">
                                    {edu.graduationDate}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {generatedResume.projects.length > 0 && (
                        <section>
                          <h4 className="font-semibold text-sm uppercase tracking-wide mb-2">Projects</h4>
                          <div className="space-y-3">
                            {generatedResume.projects.map((proj, idx) => (
                              <div key={idx}>
                                <p className="font-medium">{proj.title}</p>
                                <p className="text-sm">{proj.description}</p>
                                <div className="flex gap-2 mt-1">
                                  {proj.technologies.map((tech, tidx) => (
                                    <Badge key={tidx} variant="outline" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Profile Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{studentData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{studentData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Skills</p>
                  <p className="text-sm font-medium">{studentData.skills.length} skills added</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Projects</p>
                  <p className="text-sm font-medium">{studentData.projects.length} projects</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">SEO Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <p className="text-muted-foreground">Use keywords from job descriptions</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <p className="text-muted-foreground">Keep resume under 2 pages</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <p className="text-muted-foreground">Use action verbs in descriptions</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <p className="text-muted-foreground">Quantify achievements with numbers</p>
              </div>
            </div>
          </Card>

          {(!studentData.name || studentData.skills.length === 0) && (
            <Card className="p-5 border-amber-500/50 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium text-sm">Complete Your Profile</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your name and skills to generate a better resume
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}