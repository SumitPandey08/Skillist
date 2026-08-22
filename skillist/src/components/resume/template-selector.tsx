"use client"

import React from 'react'
import { ResumeData } from '@/lib/resume-generator'
import { ATSTemplate } from './ats-template'
import { ModernTemplate } from './modern-template'
import { ExecutiveTemplate } from './executive-template'
import { CreativeTemplate } from './creative-template'
import { cn } from '@/lib/utils'
import { Check, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

export type TemplateType = 'ats-optimized' | 'modern-tech' | 'executive' | 'creative'

interface TemplateSelectorProps {
  data: ResumeData
  selectedTemplate: TemplateType
  onTemplateChange: (template: TemplateType) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const templates = [
    { 
      id: 'ats-optimized' as const, 
      name: 'ATS Optimized', 
      description: 'Clean, standard format designed to pass automated screening systems.', 
      icon: '📊',
      previewColor: 'bg-slate-100',
      accentColor: 'border-slate-400'
    },
    { 
      id: 'modern-tech' as const, 
      name: 'Modern Tech', 
      description: 'Vibrant design with indigo accents, perfect for tech and startup roles.', 
      icon: '💻',
      previewColor: 'bg-indigo-50',
      accentColor: 'border-indigo-500'
    },
    { 
      id: 'executive' as const, 
      name: 'Executive', 
      description: 'Professional traditional layout with amber accents for leadership positions.', 
      icon: '👔',
      previewColor: 'bg-amber-50',
      accentColor: 'border-amber-600'
    },
    { 
      id: 'creative' as const, 
      name: 'Creative', 
      description: 'Bold pink-themed design with unique layouts to showcase your personality.', 
      icon: '🎨',
      previewColor: 'bg-pink-50',
      accentColor: 'border-pink-500'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateChange(template.id)}
          className={cn(
            "relative flex flex-col p-0 rounded-2xl border-2 transition-all text-left overflow-hidden group hover:shadow-xl",
            selectedTemplate === template.id
              ? "border-primary ring-4 ring-primary/10 shadow-lg"
              : "border-border hover:border-primary/40 bg-card"
          )}
        >
          <div className={cn("h-24 w-full p-3 flex flex-col gap-2 opacity-80 group-hover:opacity-100 transition-opacity", template.previewColor)}>
            <div className={cn("h-2 w-1/2 rounded-full", template.id === 'ats-optimized' ? 'bg-slate-300' : template.id === 'modern-tech' ? 'bg-indigo-300' : template.id === 'executive' ? 'bg-amber-300' : 'bg-pink-300')} />
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/80 shadow-sm flex items-center justify-center text-xl">
                {template.icon}
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-1.5 w-full bg-white/60 rounded-full" />
                <div className="h-1.5 w-3/4 bg-white/60 rounded-full" />
              </div>
            </div>
            <div className={cn("mt-auto h-1 w-full rounded-full border-t-2 border-dashed", template.accentColor)} />
          </div>

          <div className="p-4 bg-card flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold text-base">{template.name}</p>
              {selectedTemplate === template.id && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {template.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

// Low-level renderer components
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false }
)

function ResumePreviewInternal({ 
  data, 
  template 
}: { 
  data: ResumeData
  template: TemplateType 
}) {
  // Sanitize data for react-pdf
  const sanitizedData = React.useMemo(() => {
    if (!data) return null;
    
    try {
      const clone: any = {
        personalInfo: {
          name: String(data.personalInfo?.name || ''),
          email: String(data.personalInfo?.email || ''),
          phone: String(data.personalInfo?.phone || ''),
          location: String(data.personalInfo?.location || ''),
          linkedIn: String(data.personalInfo?.linkedIn || ''),
          github: String(data.personalInfo?.github || ''),
          portfolio: String(data.personalInfo?.portfolio || ''),
        },
        professionalSummary: String(data.professionalSummary || ''),
        skills: Array.isArray(data.skills) ? data.skills.map((s: any) => ({
          name: String(s.name || ''),
          proficiency: String(s.proficiency || ''),
          category: String(s.category || 'General')
        })) : [],
        experience: Array.isArray(data.experience) ? data.experience.map((exp: any) => ({
          title: String(exp.title || ''),
          company: String(exp.company || ''),
          description: String(exp.description || ''),
          startDate: String(exp.startDate || ''),
          endDate: String(exp.endDate || ''),
          isCurrentRole: !!exp.isCurrentRole,
          achievements: Array.isArray(exp.achievements) ? exp.achievements.map(String) : []
        })) : [],
        projects: Array.isArray(data.projects) ? data.projects.map((p: any) => ({
          title: String(p.title || ''),
          description: String(p.description || ''),
          technologies: Array.isArray(p.technologies) ? p.technologies.map(String) : [],
          url: String(p.url || '')
        })) : [],
        education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
          school: String(edu.school || ''),
          degree: String(edu.degree || ''),
          field: String(edu.field || ''),
          graduationDate: String(edu.graduationDate || '')
        })) : [],
        targetRole: String((data as any).targetRole || 'Professional')
      };

      return clone;
    } catch (e) {
      console.error("Sanitization error:", e);
      return null;
    }
  }, [data]);

  const TemplateMap: Record<string, any> = {
    'ats-optimized': ATSTemplate,
    'modern-tech': ModernTemplate,
    'executive': ExecutiveTemplate,
    'creative': CreativeTemplate,
  }

  const TemplateComponent = TemplateMap[template]

  // Safety check for data and template
  if (!sanitizedData || !sanitizedData.personalInfo || !TemplateComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 min-h-[600px] p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Preparing your live preview...</p>
      </div>
    )
  }

  return (
    <div className="bg-muted p-2 sm:p-4 flex flex-col justify-center min-h-[600px] h-full overflow-hidden">
      <div className="w-full h-full bg-white shadow-2xl rounded-sm overflow-hidden relative border-none">
        <PDFViewer width="100%" height="800px" style={{ border: 'none' }} showToolbar={false}>
          <TemplateComponent data={sanitizedData} />
        </PDFViewer>
      </div>
    </div>
  )
}

// Export the preview component wrapped in dynamic with no SSR
export const ResumePreview = dynamic(
  () => Promise.resolve(ResumePreviewInternal),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-slate-50 min-h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
)
