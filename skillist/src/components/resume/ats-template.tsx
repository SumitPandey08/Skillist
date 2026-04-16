import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Standard fonts for ATS compatibility
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#000',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: '#444',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    textTransform: 'uppercase',
    color: '#000',
    borderBottom: 0.5,
    paddingBottom: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  description: {
    marginBottom: 5,
    textAlign: 'justify',
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    padding: '2 5',
    borderRadius: 3,
  }
})

interface ResumeData {
  name: string
  email: string
  bio?: string | null
  skills: { name: string; proficiency: string }[]
  experience: any[]
  education: any[]
  projects: any[]
}

export const ATSTemplate = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.contact}>{data.email} | ECHFLUX Portfolio Profile</Text>
      </View>

      {/* Summary */}
      {data.bio && (
        <View>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.description}>{data.bio}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((exp, idx) => (
            <View key={idx} style={{ marginBottom: 10 }}>
              <View style={styles.itemHeader}>
                <Text style={styles.bold}>{exp.title}</Text>
                <Text>{new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}</Text>
              </View>
              <Text style={styles.italic}>{exp.company}</Text>
              <Text style={styles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Key Projects</Text>
          {data.projects.map((proj, idx) => (
            <View key={idx} style={{ marginBottom: 8 }}>
              <View style={styles.itemHeader}>
                <Text style={styles.bold}>{proj.title}</Text>
                {proj.startDate && <Text>{new Date(proj.startDate).toLocaleDateString()}</Text>}
              </View>
              <Text style={styles.description}>{proj.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      <View>
        <Text style={styles.sectionTitle}>Skills & Expertise</Text>
        <View style={styles.skills}>
          {data.skills.map((skill, idx) => (
            <Text key={idx} style={styles.skillTag}>
              {skill.name} ({skill.proficiency})
            </Text>
          ))}
        </View>
      </View>

      {/* Education */}
      {data.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={{ marginBottom: 5 }}>
              <View style={styles.itemHeader}>
                <Text style={styles.bold}>{edu.school}</Text>
                {edu.graduationDate && <Text>{new Date(edu.graduationDate).getFullYear()}</Text>}
              </View>
              <Text>{edu.degree} in {edu.field}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
)
