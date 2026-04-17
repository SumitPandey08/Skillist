import { ResumeData } from '@/lib/resume-generator'
import { ATSTemplate } from './ats-template'
import { ModernTemplate } from './modern-template'
import { ExecutiveTemplate } from './executive-template'
import { CreativeTemplate } from './creative-template'

export type TemplateType = 'ats-optimized' | 'modern-tech' | 'executive' | 'creative'

interface TemplateSelectorProps {
  data: ResumeData
  selectedTemplate: TemplateType
  onTemplateChange: (template: TemplateType) => void
}

export function TemplateSelector({ data, selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const templates = [
    { id: 'ats-optimized' as const, name: 'ATS Optimized', description: 'Best for ATS systems', icon: '📊' },
    { id: 'modern-tech' as const, name: 'Modern Tech', description: 'Clean & contemporary', icon: '💻' },
    { id: 'executive' as const, name: 'Executive', description: 'Professional & traditional', icon: '👔' },
    { id: 'creative' as const, name: 'Creative', description: 'Standout design', icon: '🎨' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateChange(template.id)}
          className={`
            p-4 rounded-xl border-2 transition-all text-left group
            ${selectedTemplate === template.id
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/50 bg-card'
            }
          `}
        >
          <div className="text-3xl mb-2">{template.icon}</div>
          <p className="font-semibold text-sm">{template.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
          {selectedTemplate === template.id && (
            <div className="mt-2 flex items-center gap-1 text-xs text-primary">
              <span>Selected</span>
            </div>
          )}
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
    <div className="border rounded-xl overflow-hidden bg-white shadow-lg">
      <TemplateComponent data={data} />
    </div>
  )
}
