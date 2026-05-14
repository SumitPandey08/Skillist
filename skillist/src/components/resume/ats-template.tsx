import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

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
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
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
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
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
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 3,
  }
})

export const ATSTemplate = ({ data }: { data: any }) => {
  if (!data || !data.personalInfo) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Loading resume data...</Text>
        </Page>
      </Document>
    );
  }
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.name || 'Professional Resume'}</Text>
          <Text style={styles.contact}>{data.personalInfo.email} | Portfolio Profile</Text>
        </View>

        {/* Summary */}
        {data.professionalSummary ? (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.description}>{data.professionalSummary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {data.experience && data.experience.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 10 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.bold}>{exp.title}</Text>
                  <Text>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                </View>
                <Text style={styles.italic}>{exp.company}</Text>
                <Text style={styles.description}>{exp.description}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Projects */}
        {data.projects && data.projects.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {data.projects.map((proj: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.bold}>{proj.title}</Text>
                  {proj.startDate ? <Text>{proj.startDate}</Text> : null}
                </View>
                <Text style={styles.description}>{proj.description}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {data.skills && data.skills.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <View style={styles.skills}>
              {data.skills.map((skill: any, idx: number) => (
                <Text key={idx} style={styles.skillTag}>
                  {skill.name} {skill.proficiency ? `(${skill.proficiency})` : ''}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* Education */}
        {data.education && data.education.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 5 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.bold}>{edu.school}</Text>
                  {edu.graduationDate ? <Text>{edu.graduationDate}</Text> : null}
                </View>
                <Text>{edu.degree} in {edu.field}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
