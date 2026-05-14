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
    borderBottomWidth: 3,
    borderBottomColor: '#d97706',
    borderBottomStyle: 'solid',
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
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  contact: {
    fontSize: 9,
    color: '#6b7280',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    marginRight: 8,
    marginBottom: 4,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d97706',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
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
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    marginRight: 6,
    marginBottom: 6,
    fontWeight: 'bold',
    borderRadius: 3,
    fontSize: 8,
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

export const ExecutiveTemplate = ({ data }: { data: any }) => {
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
          <View style={styles.nameRow}>
            <Text style={styles.name}>{data.personalInfo.name || 'Professional Resume'}</Text>
          </View>
          <Text style={styles.titleLine}>Executive Profile</Text>
          <View style={styles.contact}>
            {data.personalInfo.email ? <View style={styles.contactItem}><Text>📧 {data.personalInfo.email}</Text></View> : null}
            {data.personalInfo.phone ? <View style={styles.contactItem}><Text>📱 {data.personalInfo.phone}</Text></View> : null}
            {data.personalInfo.location ? <View style={styles.contactItem}><Text>📍 {data.personalInfo.location}</Text></View> : null}
            {data.personalInfo.linkedIn ? <View style={styles.contactItem}><Text>💼 LinkedIn</Text></View> : null}
          </View>
        </View>

        {/* Professional Summary */}
        {data.professionalSummary ? (
          <View>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={styles.description}>{data.professionalSummary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {data.experience && data.experience.length > 0 ? (
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
        ) : null}

        {/* Projects */}
        {data.projects && data.projects.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Key Projects & Initiatives</Text>
            {data.projects.map((proj: any, idx: number) => (
              <View key={idx} style={styles.item}>
                <Text style={styles.projectTitle}>{proj.title}</Text>
                <Text style={styles.description}>{proj.description}</Text>
                {proj.technologies && proj.technologies.length > 0 ? (
                  <Text style={styles.projectTech}>
                    Technologies: {proj.technologies.join(', ')}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {data.skills && data.skills.length > 0 ? (
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
        ) : null}

        {/* Education */}
        {data.education && data.education.length > 0 ? (
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
                  {edu.graduationDate ? <Text style={styles.itemDate}>{edu.graduationDate}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
