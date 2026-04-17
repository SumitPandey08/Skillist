import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '3px solid #d97706',
    paddingBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  titleLine: {
    fontSize: 11,
    color: '#d97706',
    fontWeight: 'medium',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  contact: {
    fontSize: 9,
    color: '#6b7280',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d97706',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 10,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5,
  },
  item: {
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#4b5563',
  },
  itemDate: {
    fontSize: 9,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  skillChip: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '3 8',
    borderRadius: 3,
    fontSize: 8,
    marginRight: 6,
    marginBottom: 6,
    fontWeight: 'medium',
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  projectTech: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

export const ExecutiveTemplate = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{data.personalInfo?.name || data.name}</Text>
        </View>
        <Text style={styles.titleLine}>Executive Profile</Text>
        <View style={styles.contact}>
          {data.personalInfo?.email && <Text>📧 {data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text>📱 {data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text>📍 {data.personalInfo.location}</Text>}
          {data.personalInfo?.linkedIn && <Text>💼 LinkedIn</Text>}
        </View>
      </View>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <View>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.description}>{data.professionalSummary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp: any, idx: number) => (
            <View key={idx} style={styles.item}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
                </View>
                <Text style={styles.itemDate}>
                  {exp.startDate} — {exp.isCurrentRole ? 'Present' : exp.endDate}
                </Text>
              </View>
              <Text style={styles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Key Projects & Initiatives</Text>
          {data.projects.map((proj: any, idx: number) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.projectTitle}>{proj.title}</Text>
              <Text style={styles.description}>{proj.description}</Text>
              {proj.technologies?.length > 0 && (
                <Text style={styles.projectTech}>
                  Technologies: {proj.technologies.join(', ')}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Core Competencies</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data.skills.map((skill: any, idx: number) => (
              <Text key={idx} style={styles.skillChip}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu: any, idx: number) => (
            <View key={idx} style={styles.item}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{edu.school}</Text>
                  <Text style={styles.itemSubtitle}>
                    {edu.degree} {edu.field ? `— ${edu.field}` : ''}
                  </Text>
                </View>
                {edu.graduationDate && <Text style={styles.itemDate}>{edu.graduationDate}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
)
