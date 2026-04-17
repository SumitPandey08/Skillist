'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, Sparkles, Eye, Edit3, 
  Trash2, Plus, Check, ChevronRight, Loader2,
  Briefcase, GraduationCap, Award, Code, User,
  Mail, Phone, MapPin, Link, Link2, Globe,
  AlertCircle, RefreshCw, Settings, Target,
  BarChart2, FileType, Wand, Save, Undo, Redo,
  Zap, CheckCircle, XCircle, Lightbulb, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { generateAIResume, saveResume, ResumeData } from '@/lib/resume-generator'
import { cn } from '@/lib/utils'
import { TemplateSelector, ResumePreview, TemplateType } from './template-selector'
import { useResumeExport } from '@/lib/resume-export'

// Types
type ModelProvider = 'gemini-flash' | 'gemini-pro' | 'gpt-4' | 'gpt-4-turbo'

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
  atsScore?: number
}

interface ResumeMakerProps {
  studentData: StudentData
  initialResumes?: UserResume[]
}

// Model options
const MODEL_OPTIONS = [
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', speed: 'Fast', quality: 'Good' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', speed: 'Medium', quality: 'Excellent' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', speed: 'Medium', quality: 'Excellent' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', speed: 'Fast', quality: 'Excellent' },
] as const

const TEMPLATE_OPTIONS = [
  { 
    id: 'ats-optimized', 
    name: 'ATS Optimized', 
    icon: BarChart2, 
    color: 'bg-blue-500',
    description: 'Best for passing through Applicant Tracking Systems',
    atsScore: 95
  },
  { 
    id: 'modern-tech', 
    name: 'Modern Tech', 
    icon: Code, 
    color: 'bg-purple-500',
    description: 'Clean design tailored for tech companies',
    atsScore: 88
  },
  { 
    id: 'executive', 
    name: 'Executive', 
    icon: Briefcase, 
    color: 'bg-amber-500',
    description: 'Professional format for senior roles',
    atsScore: 90
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    icon: Sparkles, 
    color: 'bg-pink-500',
    description: 'Standout design for design & creative roles',
    atsScore: 75
  },
]

// Editable Resume Section Component
function EditableSection({ 
  title, 
  children, 
  onRegenerate,
  isGenerating 
}: { 
  title: string
  children: React.ReactNode
  onRegenerate?: () => void
  isGenerating?: boolean
}) {
  return (
    <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all">
      <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-b">
        <h3 className="font-semibold text-lg">{title}</h3>
        {onRegenerate && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRegenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            <Wand className="w-4 h-4" />
            Regenerate
          </Button>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </Card>
  )
}

// Text Editor Component
function TextEditor({ 
  value, 
  onChange, 
  placeholder, 
  multiline = false,
  className = '' 
}: { 
  value: string
  onChange: (val: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
}) {
  if (multiline) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("min-h-[120px] resize-none", className)}
      />
    )
  }

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  )
}

// Main Component
export function ResumeMaker({ studentData, initialResumes = [] }: ResumeMakerProps) {
  const [resumes, setResumes] = useState<UserResume[]>(initialResumes)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('ats-optimized')
  const [targetRole, setTargetRole] = useState('')
  const [industry, setIndustry] = useState('technology')
  const [modelProvider, setModelProvider] = useState<ModelProvider>('gemini-flash')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [viewMode, setViewMode] = useState<'list' | 'generator' | 'editor'>('list')
  const [atsScore, setAtsScore] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showModelSettings, setShowModelSettings] = useState(false)
  const [showLivePreview, setShowLivePreview] = useState(true)

  // Editable resume state
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)

  // Export functionality
  const { downloadPDF, downloadTXT, downloadDOCX } = useResumeExport()

  // Simulate generation progress
  const simulateProgress = useCallback(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress > 90) progress = 90
      setGenerationProgress(progress)
    }, 300)
    return () => clearInterval(interval)
  }, [])

  const handleGenerate = async () => {
    if (!targetRole.trim()) return

    setIsGenerating(true)
       setGenerationProgress(0)
       setAtsScore(null)
       setSuggestions([])

       const cleanup = simulateProgress()

       try {
         const formattedData = {
           name: studentData.name,
           email: studentData.email,
           bio: studentData.bio,
           phone: studentData.phone,
           location: studentData.location,
           linkedin: studentData.linkedin,
           github: studentData.githubUsername,
           portfolio: studentData.portfolioUrl,
           skills: studentData.skills.map((s: { skill: { name: string }; proficiency: string }) => ({
             name: s.skill.name,
             proficiency: s.proficiency
           })),
           projects: studentData.projects.map((p: { id: string; title: string; description: string; technologies: string[]; url?: string }) => ({
             title: p.title,
             description: p.description,
             technologies: p.technologies,
             url: p.url
           })),
           certifications: studentData.certifications.map((c: { id: string; name: string; issuer: string; date?: string }) => ({
             name: c.name,
             issuer: c.issuer,
             date: c.date
           })),
           experience: studentData.experience || [],
           education: studentData.education || [],
         }

         const resume = await generateAIResume(
           formattedData,
           targetRole,
           { modelProvider, industry }
         )

      setGeneratedResume(resume)
      setResumeData(resume)
      setAtsScore(resume.atsScore || null)
      setSuggestions(resume.suggestions || [])
      setViewMode('generator')
      setGenerationProgress(100)
    } catch (error) {
      console.error('Failed to generate resume:', error)
    } finally {
      setIsGenerating(false)
      cleanup()
    }
  }

  const handleSave = async () => {
    if (!resumeData) return

    try {
      const saved = await saveResume(studentData.id, resumeData)
      
      setResumes([...resumes, { 
        id: saved.id, 
        title: `${targetRole} Resume`,
        template: selectedTemplate,
        atsScore: atsScore || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      
      setViewMode('list')
      setGeneratedResume(null)
      setResumeData(null)
      setTargetRole('')
      setAtsScore(null)
    } catch (error) {
      console.error('Failed to save resume:', error)
    }
  }

  const handleRegenerateSection = async (section: string) => {
    if (!resumeData || !targetRole) return
    
    setIsGenerating(true)
    try {
      const resume = await generateAIResume(
        studentData,
        targetRole,
        { 
          modelProvider, 
          industry,
          currentResume: resumeData,
          regenerateSection: section,
        }
      )
      setResumeData(resume)
      setGeneratedResume(resume)
      setAtsScore(resume.atsScore || null)
      setSuggestions(resume.suggestions || [])
    } catch (error) {
      console.error('Failed to regenerate section:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const updateResumeField = (path: string, value: any) => {
    if (!resumeData) return
    
    const newData = { ...resumeData }
    const keys = path.split('.')
    let current: any = newData
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    
    setResumeData(newData)
    setGeneratedResume(newData)
  }

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getATSScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 75) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            AI Resume Maker
          </h2>
          <p className="text-sm text-muted-foreground">
            Generate professional, ATS-optimized resumes with AI assistance
          </p>
        </div>
        {viewMode === 'list' && (
          <Dialog open={showModelSettings} onOpenChange={setShowModelSettings}>
            <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
              <Settings className="w-4 h-4" />
              AI Settings
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Model Settings</DialogTitle>
                <DialogDescription>
                  Choose the AI model for resume generation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Model Provider</Label>
                  <Select value={modelProvider} onValueChange={(v, _e) => setModelProvider(v as ModelProvider)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODEL_OPTIONS.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({model.provider} • {model.speed} • {model.quality})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Industry</Label>
                  <Select value={industry} onValueChange={(v, _e) => {
                    if (v) setIndustry(v)
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card className="p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent" />
                  <div className="relative space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Generate New AI Resume</h3>
                        <p className="text-sm text-muted-foreground">
                          Create a tailored, ATS-optimized resume in seconds
                        </p>
                      </div>
                    </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="target-role" className="text-sm font-medium">
                            Target Job Role
                          </Label>
                          <Input
                            id="target-role"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g., Senior Frontend Engineer, Product Manager, Data Scientist"
                            className="h-12 text-base"
                          />
                          <p className="text-xs text-muted-foreground">
                            AI will tailor your resume specifically for this role
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Choose Template</Label>
                          <TemplateSelector
                            data={resumeData || {
                              personalInfo: { name: '', email: '' },
                              professionalSummary: '',
                              skills: [],
                              experience: [],
                              education: [],
                              projects: [],
                              certifications: [],
                            }}
                            selectedTemplate={selectedTemplate as TemplateType}
                            onTemplateChange={(t: TemplateType) => setSelectedTemplate(t)}
                          />
                         </div>

                       <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !targetRole.trim()}
                        className="w-full h-14 text-lg gap-3 shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Your Resume... {Math.round(generationProgress)}%
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate Professional Resume
                          </>
                        )}
                      </Button>

                      {isGenerating && (
                        <Progress value={generationProgress} className="h-3" />
                      )}
                    </div>
                  </div>
                </Card>

                {resumes.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Your Resumes</h3>
                      <Badge variant="secondary" className="gap-1">
                        <FileText className="w-3 h-3" />
                        {resumes.length} saved
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {resumes.map((resume) => (
                        <div
                          key={resume.id}
                          className="flex items-center justify-between p-5 rounded-xl bg-muted/50 hover:bg-muted transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{resume.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(resume.createdAt).toLocaleDateString()}
                                </span>
                                {resume.atsScore && (
                                  <Badge variant="outline" className="text-xs gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    ATS: {resume.atsScore}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" title="View">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Download PDF">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Edit">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Delete" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </motion.div>
            ) : viewMode === 'editor' ? (
              <motion.div
                key="generator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Toolbar */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setViewMode('list')
                          setGeneratedResume(null)
                          setResumeData(null)
                        }}
                      >
                        <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                        Back
                      </Button>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <Sparkles className="w-3 h-3" />
                          {modelProvider}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Target className="w-3 h-3" />
                          {industry}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="gap-2"
                      >
                        <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                        Regenerate All
                      </Button>
                      <Button size="sm" onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Resume
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* ATS Score Card */}
                {atsScore !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <Card className="p-6 overflow-hidden">
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r opacity-10",
                        getATSScoreGradient(atsScore)
                      )} />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">ATS Score</h3>
                          <p className="text-sm text-muted-foreground">
                            How well your resume will perform with automated systems
                          </p>
                        </div>
                        <div className={cn("text-6xl font-bold", getATSScoreColor(atsScore))}>
                          {atsScore}
                        </div>
                      </div>
                      <Progress 
                        value={atsScore} 
                        className="mt-4 h-2" 
                      />
                    </Card>
                  </motion.div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <Card className="p-6 border-amber-200 bg-amber-50/50">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-amber-900">Improvement Suggestions</h3>
                        <ul className="mt-2 space-y-2">
                          {suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Editable Resume Sections */}
                {resumeData && (
                  <div className="space-y-6">
                    {/* Professional Summary */}
                    <EditableSection 
                      title="Professional Summary"
                      onRegenerate={() => handleRegenerateSection('professionalSummary')}
                      isGenerating={isGenerating}
                    >
                      <TextEditor
                        value={resumeData.professionalSummary}
                        onChange={(val) => updateResumeField('professionalSummary', val)}
                        placeholder="Enter a compelling professional summary..."
                        multiline
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        {resumeData.professionalSummary.length} characters • Aim for 150-300 characters
                      </div>
                    </EditableSection>

                    {/* Experience */}
                    <EditableSection 
                      title="Work Experience"
                      onRegenerate={() => handleRegenerateSection('experience')}
                      isGenerating={isGenerating}
                    >
                      <div className="space-y-6">
                        {resumeData.experience.map((exp, idx) => (
                          <Card key={idx} className="p-4 border-dashed">
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Job Title</Label>
                                  <Input
                                    value={exp.title}
                                    onChange={(e) => {
                                      const newExp = [...resumeData.experience]
                                      newExp[idx].title = e.target.value
                                      setResumeData({ ...resumeData, experience: newExp })
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Company</Label>
                                  <Input
                                    value={exp.company}
                                    onChange={(e) => {
                                      const newExp = [...resumeData.experience]
                                      newExp[idx].company = e.target.value
                                      setResumeData({ ...resumeData, experience: newExp })
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Description & Achievements</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience]
                                    newExp[idx].description = e.target.value
                                    setResumeData({ ...resumeData, experience: newExp })
                                  }}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Start Date</Label>
                                  <Input
                                    type="month"
                                    value={exp.startDate}
                                    onChange={(e) => {
                                      const newExp = [...resumeData.experience]
                                      newExp[idx].startDate = e.target.value
                                      setResumeData({ ...resumeData, experience: newExp })
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>End Date</Label>
                                  <Input
                                    type="month"
                                    value={exp.endDate || ''}
                                    onChange={(e) => {
                                      const newExp = [...resumeData.experience]
                                      newExp[idx].endDate = e.target.value
                                      setResumeData({ ...resumeData, experience: newExp })
                                    }}
                                    placeholder="Present"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`current-${idx}`}
                                  checked={exp.isCurrentRole}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience]
                                    newExp[idx].isCurrentRole = e.target.checked
                                    setResumeData({ ...resumeData, experience: newExp })
                                  }}
                                  className="rounded"
                                />
                                <Label htmlFor={`current-${idx}`} className="text-sm">
                                  I currently work here
                                </Label>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </EditableSection>

                    {/* Skills */}
                    <EditableSection title="Skills">
                      <div className="space-y-4">
                        {resumeData.skills.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={skill.name}
                                onChange={(e) => {
                                  const newSkills = [...resumeData.skills]
                                  newSkills[idx].name = e.target.value
                                  setResumeData({ ...resumeData, skills: newSkills })
                                }}
                                placeholder="Skill name"
                              />
                            </div>
                            <div className="w-40 space-y-2">
                              <Select
                                value={skill.proficiency}
                                onValueChange={(val, _e) => {
                                  if (val) {
                                    const newSkills = [...resumeData.skills]
                                    newSkills[idx].proficiency = val
                                    setResumeData({ ...resumeData, skills: newSkills })
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Beginner">Beginner</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Advanced">Advanced</SelectItem>
                                  <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSkills = resumeData.skills.filter((_, i) => i !== idx)
                                setResumeData({ ...resumeData, skills: newSkills })
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setResumeData({
                              ...resumeData,
                              skills: [...resumeData.skills, { name: '', proficiency: 'Intermediate' }]
                            })
                          }}
                          className="w-full gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Skill
                        </Button>
                      </div>
                    </EditableSection>

                    {/* Projects */}
                    <EditableSection 
                      title="Projects"
                      onRegenerate={() => handleRegenerateSection('projects')}
                      isGenerating={isGenerating}
                    >
                      <div className="space-y-6">
                        {resumeData.projects.map((proj, idx) => (
                          <Card key={idx} className="p-4 border-dashed">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Project Title</Label>
                                <Input
                                  value={proj.title}
                                  onChange={(e) => {
                                    const newProjs = [...resumeData.projects]
                                    newProjs[idx].title = e.target.value
                                    setResumeData({ ...resumeData, projects: newProjs })
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={proj.description}
                                  onChange={(e) => {
                                    const newProjs = [...resumeData.projects]
                                    newProjs[idx].description = e.target.value
                                    setResumeData({ ...resumeData, projects: newProjs })
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Technologies (comma-separated)</Label>
                                <Input
                                  value={proj.technologies.join(', ')}
                                  onChange={(e) => {
                                    const newProjs = [...resumeData.projects]
                                    newProjs[idx].technologies = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                    setResumeData({ ...resumeData, projects: newProjs })
                                  }}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newProject = {
                              title: '', 
                              description: '', 
                              technologies: [] as string[], 
                              url: null
                            } as const
                            setResumeData({
                              ...resumeData,
                              projects: [...resumeData.projects, newProject]
                            })
                          }}
                          className="w-full gap-2 h-9"
                        >
                          <Plus className="w-4 h-4" />
                          Add Project
                        </Button>
                      </div>
                    </EditableSection>

                    {/* Education */}
                    <EditableSection title="Education">
                      <div className="space-y-4">
                        {resumeData.education.map((edu, idx) => (
                          <Card key={idx} className="p-4 border-dashed">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>School</Label>
                                <Input
                                  value={edu.school}
                                  onChange={(e) => {
                                    const newEdu = [...resumeData.education]
                                    newEdu[idx].school = e.target.value
                                    setResumeData({ ...resumeData, education: newEdu })
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Degree</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const newEdu = [...resumeData.education]
                                    newEdu[idx].degree = e.target.value
                                    setResumeData({ ...resumeData, education: newEdu })
                                  }}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </EditableSection>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Toolbar */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setViewMode('list')
                            setGeneratedResume(null)
                          }}
                        >
                          <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                          Back
                        </Button>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <Sparkles className="w-3 h-3" />
                          {modelProvider}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Target className="w-3 h-3" />
                          {industry}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <BarChart2 className="w-3 h-3" />
                          {TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowLivePreview(!showLivePreview)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {showLivePreview ? 'Hide' : 'Show'} Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="gap-2"
                      >
                        <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                        Regenerate
                      </Button>
                       <Button size="sm" onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
                          <Download className="w-4 h-4" />
                          Export
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => resumeData && downloadPDF(resumeData, selectedTemplate, `${targetRole || 'resume'}-resume`)}
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => resumeData && downloadDOCX(resumeData, `${targetRole || 'resume'}-resume`)}
                          >
                            <FileType className="w-4 h-4" />
                            Export as DOCX
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => resumeData && downloadTXT(resumeData, `${targetRole || 'resume'}-resume`)}
                          >
                            <FileText className="w-4 h-4" />
                            Export as TXT
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>

                {/* ATS Score & Suggestions */}
                {(atsScore !== null || suggestions.length > 0) && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {atsScore !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                              <BarChart2 className="w-5 h-5" />
                              ATS Score
                            </h3>
                            <span className={cn("text-2xl font-bold", getATSScoreColor(atsScore))}>
                              {atsScore}
                            </span>
                          </div>
                          <Progress value={atsScore} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-2">
                            Applicant Tracking System compatibility
                          </p>
                        </Card>
                      </motion.div>
                    )}

                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="p-6 border-amber-200 bg-amber-50/50">
                          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" />
                            AI Suggestions
                          </h3>
                          <ul className="space-y-1">
                            {suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Split view: Editor + Preview */}
                <div className={cn(
                  "grid gap-6",
                  showLivePreview ? "lg:grid-cols-2" : "lg:grid-cols-1"
                )}>
                  {/* Left: Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Edit Resume</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setResumeData(generatedResume)}
                          title="Reset to last generated version"
                        >
                          <Undo className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>

                    {resumeData && (
                      <div className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
                        {/* Professional Summary */}
                        <Card className="border-2">
                          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                            <h4 className="font-semibold">Professional Summary</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRegenerateSection('professionalSummary')}
                              disabled={isGenerating}
                              className="gap-1 h-8"
                            >
                              <Wand className="w-3 h-3" />
                              Rewrite
                            </Button>
                          </div>
                          <div className="p-4 space-y-2">
                            <Textarea
                              value={resumeData.professionalSummary}
                              onChange={(val) => updateResumeField('professionalSummary', val)}
                              placeholder="Write a compelling professional summary that highlights your value..."
                              className="min-h-[100px] resize-none"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{resumeData.professionalSummary.length} chars</span>
                              <span>Target: 150-300</span>
                            </div>
                          </div>
                        </Card>

                        {/* Experience */}
                        <Card className="border-2">
                          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                            <h4 className="font-semibold">Work Experience</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRegenerateSection('experience')}
                              disabled={isGenerating}
                              className="gap-1 h-8"
                            >
                              <Wand className="w-3 h-3" />
                              Optimize
                            </Button>
                          </div>
                          <div className="p-4 space-y-4">
                            {resumeData.experience.map((exp, idx) => (
                              <Card key={idx} className="p-3 border-dashed bg-muted/20">
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs">Title</Label>
                                      <Input
                                        value={exp.title}
                                        onChange={(e) => {
                                          const newExp = [...resumeData.experience]
                                          newExp[idx].title = e.target.value
                                          setResumeData({ ...resumeData, experience: newExp })
                                        }}
                                        className="h-8"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Company</Label>
                                      <Input
                                        value={exp.company}
                                        onChange={(e) => {
                                          const newExp = [...resumeData.experience]
                                          newExp[idx].company = e.target.value
                                          setResumeData({ ...resumeData, experience: newExp })
                                        }}
                                        className="h-8"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Description (use bullet points or paragraphs with achievements)</Label>
                                    <Textarea
                                      value={exp.description}
                                      onChange={(e) => {
                                        const newExp = [...resumeData.experience]
                                        newExp[idx].description = e.target.value
                                        setResumeData({ ...resumeData, experience: newExp })
                                      }}
                                      className="min-h-[80px] resize-none text-sm"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs">Start</Label>
                                      <Input
                                        type="month"
                                        value={exp.startDate}
                                        onChange={(e) => {
                                          const newExp = [...resumeData.experience]
                                          newExp[idx].startDate = e.target.value
                                          setResumeData({ ...resumeData, experience: newExp })
                                        }}
                                        className="h-8"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">End</Label>
                                      <Input
                                        type="month"
                                        value={exp.endDate || ''}
                                        onChange={(e) => {
                                          const newExp = [...resumeData.experience]
                                          newExp[idx].endDate = e.target.value
                                          setResumeData({ ...resumeData, experience: newExp })
                                        }}
                                        className="h-8"
                                        placeholder="Present"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`current-${idx}`}
                                      checked={exp.isCurrentRole}
                                      onChange={(e) => {
                                        const newExp = [...resumeData.experience]
                                        newExp[idx].isCurrentRole = e.target.checked
                                        setResumeData({ ...resumeData, experience: newExp })
                                      }}
                                      className="rounded border-gray-300"
                                    />
                                    <Label htmlFor={`current-${idx}`} className="text-sm cursor-pointer">
                                      Currently working here
                                    </Label>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </Card>

                        {/* Skills */}
                        <Card className="border-2">
                          <div className="px-4 py-3 bg-muted/30 border-b">
                            <h4 className="font-semibold">Skills</h4>
                          </div>
                          <div className="p-4 space-y-3">
                            {resumeData.skills.map((skill, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                                <div className="flex-1 space-y-1">
                                  <Input
                                    value={skill.name}
                                    onChange={(e) => {
                                      const newSkills = [...resumeData.skills]
                                      newSkills[idx].name = e.target.value
                                      setResumeData({ ...resumeData, skills: newSkills })
                                    }}
                                    placeholder="Skill name"
                                    className="h-8"
                                  />
                                </div>
                                <div className="w-36 space-y-1">
                                  <Select
                                    value={skill.proficiency}
                                    onValueChange={(val, _e) => {
                                      if (val) {
                                        const newSkills = [...resumeData.skills]
                                        newSkills[idx].proficiency = val
                                        setResumeData({ ...resumeData, skills: newSkills })
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Beginner">Beginner</SelectItem>
                                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                                      <SelectItem value="Advanced">Advanced</SelectItem>
                                      <SelectItem value="Expert">Expert</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newSkills = resumeData.skills.filter((_, i) => i !== idx)
                                    setResumeData({ ...resumeData, skills: newSkills })
                                  }}
                                  className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setResumeData({
                                  ...resumeData,
                                  skills: [...resumeData.skills, { name: '', proficiency: 'Intermediate' }]
                                })
                              }}
                              className="w-full gap-2 h-9"
                            >
                              <Plus className="w-4 h-4" />
                              Add Skill
                            </Button>
                          </div>
                        </Card>

                        {/* Projects */}
                        <Card className="border-2">
                          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                            <h4 className="font-semibold">Projects</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRegenerateSection('projects')}
                              disabled={isGenerating}
                              className="gap-1 h-8"
                            >
                              <Wand className="w-3 h-3" />
                              Rewrite
                            </Button>
                          </div>
                          <div className="p-4 space-y-4">
                            {resumeData.projects.map((proj, idx) => (
                              <Card key={idx} className="p-3 border-dashed bg-muted/20">
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <Label className="text-xs">Project Title</Label>
                                    <Input
                                      value={proj.title}
                                      onChange={(e) => {
                                        const newProjs = [...resumeData.projects]
                                        newProjs[idx].title = e.target.value
                                        setResumeData({ ...resumeData, projects: newProjs })
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Description</Label>
                                    <Textarea
                                      value={proj.description}
                                      onChange={(e) => {
                                        const newProjs = [...resumeData.projects]
                                        newProjs[idx].description = e.target.value
                                        setResumeData({ ...resumeData, projects: newProjs })
                                      }}
                                      className="min-h-[80px] resize-none text-sm"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Technologies (comma-separated)</Label>
                                    <Input
                                      value={proj.technologies.join(', ')}
                                      onChange={(e) => {
                                        const newProjs = [...resumeData.projects]
                                        newProjs[idx].technologies = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                        setResumeData({ ...resumeData, projects: newProjs })
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setResumeData({
                              ...resumeData,
                              projects: [...resumeData.projects, { 
                                title: '', 
                                description: '', 
                                technologies: [] as string[], 
                                url: undefined 
                              }]
                            })
                          }}
                          className="w-full gap-2 h-9"
                        >
                              <Plus className="w-4 h-4" />
                              Add Project
                            </Button>
                          </div>
                        </Card>

                        {/* Education */}
                        <Card className="border-2">
                          <div className="px-4 py-3 bg-muted/30 border-b">
                            <h4 className="font-semibold">Education</h4>
                          </div>
                          <div className="p-4 space-y-4">
                            {resumeData.education.map((edu, idx) => (
                              <Card key={idx} className="p-3 border-dashed bg-muted/20">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-xs">School</Label>
                                    <Input
                                      value={edu.school}
                                      onChange={(e) => {
                                        const newEdu = [...resumeData.education]
                                        newEdu[idx].school = e.target.value
                                        setResumeData({ ...resumeData, education: newEdu })
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Degree</Label>
                                    <Input
                                      value={edu.degree}
                                      onChange={(e) => {
                                        const newEdu = [...resumeData.education]
                                        newEdu[idx].degree = e.target.value
                                        setResumeData({ ...resumeData, education: newEdu })
                                      }}
                                      className="h-8"
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Right: Live Preview */}
                  {showLivePreview && resumeData && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="lg:col-span-1"
                    >
                      <div className="sticky top-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Live Preview
                          </h3>
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="w-3 h-3" />
                            {TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.name}
                          </Badge>
                        </div>
                        <div className="border rounded-xl overflow-hidden bg-white shadow-lg max-h-[calc(100vh-200px)] overflow-y-auto">
                          <ResumePreview data={resumeData} template={selectedTemplate} />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          Updates in real-time as you edit
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-5">
          {/* Profile Summary Card */}
          <Card className="p-5 sticky top-6">
            <h3 className="font-semibold mb-4 text-lg">Your Profile</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10">
                <div className="p-2 rounded-lg bg-primary/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-semibold">{studentData.name || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm truncate">{studentData.email || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-muted">
                  <Code className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Skills</p>
                  <p className="font-medium text-sm">{studentData.skills.length} skills in profile</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-muted">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Projects</p>
                  <p className="font-medium text-sm">{studentData.projects.length} projects</p>
                </div>
              </div>
            </div>
          </Card>

          {/* ATS Tips Card */}
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">ATS Optimization Tips</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Use keywords from the job description</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Keep resume to 1-2 pages maximum</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Start bullet points with strong action verbs</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Quantify achievements with numbers</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-800">Use standard section headings</span>
              </div>
            </div>
          </Card>

          {/* Incomplete Profile Warning */}
          {(!studentData.name || studentData.skills.length === 0) && (
            <Card className="p-5 border-amber-500/50 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-amber-900">Complete Your Profile</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Add your name, skills, and projects to generate a better, more personalized resume
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
