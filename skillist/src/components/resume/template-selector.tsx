import { ResumeData } from '@/lib/resume-generator'
import { ATSTemplate } from './ats-template'
import { ModernTemplate } from './modern-template'
import { ExecutiveTemplate } from './executive-template'
import { CreativeTemplate } from './creative-template'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

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
          {/* Visual Preview Representation */}
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

export function ResumePreview({ 
  data, 
  template 
}: { 
  data: ResumeData
  template: TemplateType 
}) {
  const TemplateComponent = {
    'ats-optimized': ATSTemplate,
    'modern-tech': ModernTemplate,
    'executive': ExecutiveTemplate,
    'creative': CreativeTemplate,
  }[template]

  return (
    <div className="bg-muted p-4 sm:p-8 flex justify-center min-h-[600px] overflow-auto">
      <div className="w-full max-w-[800px] bg-white shadow-2xl rounded-sm origin-top transition-transform">
        <TemplateComponent data={data} />
      </div>
    </div>
  )
}
