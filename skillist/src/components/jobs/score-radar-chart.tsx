'use client'

import * as React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface ScoreRadarChartProps {
  data: {
    skills: number
    experience: number
    projects: number
    potential: number
  }
}

export function ScoreRadarChart({ data }: ScoreRadarChartProps) {
  const chartData = [
    { subject: 'Skills', A: data.skills, fullMark: 100 },
    { subject: 'Experience', A: data.experience, fullMark: 100 },
    { subject: 'Projects', A: data.projects, fullMark: 100 },
    { subject: 'Potential', A: data.potential, fullMark: 100 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Match Score"
            dataKey="A"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
