'use client'

import * as React from 'react'
import { ResumeData } from './resume-generator'
import { ATSTemplate } from '@/components/resume/ats-template'
import { ModernTemplate } from '@/components/resume/modern-template'
import { ExecutiveTemplate } from '@/components/resume/executive-template'
import { CreativeTemplate } from '@/components/resume/creative-template'
import { TemplateType } from '@/components/resume/template-selector'

export function useResumeExport() {
  const downloadPDF = React.useCallback(async (
    data: ResumeData, 
    template: TemplateType, 
    filename: string
  ) => {
    const { PDFDownloadLink, BlobProvider } = await import('@react-pdf/renderer')
    
    const TemplateComponent = {
      'ats-optimized': ATSTemplate,
      'modern-tech': ModernTemplate,
      'executive': ExecutiveTemplate,
      'creative': CreativeTemplate,
    }[template]

    // For client-side PDF generation
    const element = document.createElement('div')
    element.style.display = 'none'
    document.body.appendChild(element)

    // We'll use a simple approach - just trigger download via link
    // In production, you'd want server-side PDF generation for better reliability
    const blob = await new Promise<Blob>((resolve) => {
      // Approximate PDF generation - in real app use server-side
      const pdfContent = generateSimplePDF(data, template)
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      resolve(blob)
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const downloadTXT = React.useCallback((data: ResumeData, filename: string) => {
    const text = generateTextResume(data)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const downloadDOCX = React.useCallback(async (data: ResumeData, filename: string) => {
    // Basic HTML-based DOCX generation (Word can open HTML files)
    const html = generateHTMLResume(data)
    const blob = new Blob([html], { 
      type: 'application/msword' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  return {
    downloadPDF,
    downloadTXT,
    downloadDOCX,
  }
}

function generateSimplePDF(data: ResumeData, template: TemplateType): string {
  // This is a simplified placeholder. In production, use server-side PDF generation
  // or a proper client-side PDF library like @react-pdf/renderer
  // For now, we'll return an empty blob and rely on other methods
  return ''
}

function generateTextResume(data: ResumeData): string {
  let text = `${data.personalInfo.name.toUpperCase()}\n`
  text += `${data.personalInfo.email} ${data.personalInfo.phone || ''} ${data.personalInfo.location || ''}\n\n`
  
  if (data.professionalSummary) {
    text += `PROFESSIONAL SUMMARY\n${'='.repeat(40)}\n${data.professionalSummary}\n\n`
  }
  
  if (data.experience.length > 0) {
    text += `EXPERIENCE\n${'='.repeat(40)}\n`
    data.experience.forEach(exp => {
      text += `${exp.title} at ${exp.company}\n`
      text += `${exp.startDate} - ${exp.isCurrentRole ? 'Present' : exp.endDate}\n`
      text += `${exp.description}\n\n`
    })
  }
  
  if (data.projects.length > 0) {
    text += `PROJECTS\n${'='.repeat(40)}\n`
    data.projects.forEach(proj => {
      text += `${proj.title}\n`
      text += `${proj.description}\n`
      text += `Tech: ${proj.technologies.join(', ')}\n\n`
    })
  }
  
  if (data.skills.length > 0) {
    text += `SKILLS\n${'='.repeat(40)}\n`
    text += data.skills.map(s => `${s.name} (${s.proficiency})`).join(', ')
    text += '\n\n'
  }
  
  if (data.education.length > 0) {
    text += `EDUCATION\n${'='.repeat(40)}\n`
    data.education.forEach(edu => {
      text += `${edu.degree} in ${edu.field || 'N/A'} - ${edu.school}\n`
    })
  }
  
  return text
}

function generateHTMLResume(data: ResumeData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.personalInfo.name} - Resume</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    h2 { color: #2980b9; margin-top: 20px; }
    .contact { color: #7f8c8d; margin-bottom: 20px; }
    .section { margin-bottom: 25px; }
    .item { margin-bottom: 15px; }
    .item-title { font-weight: bold; }
    .item-subtitle { color: #7f8c8d; font-style: italic; }
    .skill { display: inline-block; background: #ecf0f1; padding: 4px 10px; margin: 2px; border-radius: 3px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${data.personalInfo.name}</h1>
  <div class="contact">
    ${data.personalInfo.email} | ${data.personalInfo.phone || ''} | ${data.personalInfo.location || ''}
    ${data.personalInfo.linkedIn ? ' | ' + data.personalInfo.linkedIn : ''}
  </div>
  
  ${data.professionalSummary ? `<div class="section"><h2>Professional Summary</h2><p>${data.professionalSummary}</p></div>` : ''}
  
  ${data.experience.length > 0 ? `<div class="section"><h2>Experience</h2>` + 
    data.experience.map(exp => `
    <div class="item">
      <div class="item-title">${exp.title}</div>
      <div class="item-subtitle">${exp.company} | ${exp.startDate} - ${exp.isCurrentRole ? 'Present' : exp.endDate}</div>
      <div>${exp.description}</div>
    </div>
  `).join('') + '</div>' : ''}
  
  ${data.projects.length > 0 ? `<div class="section"><h2>Projects</h2>` +
    data.projects.map(proj => `
    <div class="item">
      <div class="item-title">${proj.title}</div>
      <div>${proj.description}</div>
      <div>Technologies: ${proj.technologies.join(', ')}</div>
    </div>
  `).join('') + '</div>' : ''}
  
  ${data.skills.length > 0 ? `<div class="section"><h2>Skills</h2>` +
    `<div>${data.skills.map(s => `<span class="skill">${s.name}</span>`).join('')}</div>` : ''}
  
  ${data.education.length > 0 ? `<div class="section"><h2>Education</h2>` +
    data.education.map(edu => `
    <div class="item">
      <div class="item-title">${edu.school}</div>
      <div class="item-subtitle">${edu.degree} ${edu.field ? 'in ' + edu.field : ''}</div>
    </div>
  `).join('') + '</div>' : ''}
</body>
</html>`
}
