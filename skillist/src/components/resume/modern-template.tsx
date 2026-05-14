import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    color: '#000',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
    borderBottomStyle: 'solid',
    paddingBottom: 15,
    backgroundColor: '#f8fafc',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: -40,
    marginRight: -40,
    marginTop: -40,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
   title: {
     fontSize: 12,
     color: '#6366f1',
     fontWeight: 'bold',
     marginBottom: 8,
     textTransform: 'uppercase',
     letterSpacing: 1,
   },
   nameRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 8,
   },
  contact: {
    fontSize: 9,
    color: '#64748b',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    flexDirection: 'row',
    marginRight: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#6366f1',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
  },
  itemDate: {
    fontSize: 9,
    color: '#94a3b8',
  },
  description: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
  },
   projectTech: {
     backgroundColor: '#f1f5f9',
     paddingTop: 2,
     paddingBottom: 2,
     paddingLeft: 6,
     paddingRight: 6,
     borderRadius: 3,
     fontSize: 7,
     color: '#64748b',
     marginRight: 4,
     marginTop: 4,
   },
   projectTitle: {
     fontSize: 11,
     fontWeight: 'bold',
     color: '#1e293b',
     marginBottom: 4,
   },
 })

export const ModernTemplate = ({ data }: { data: any }) => {
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
        {/* Header with background */}
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{data.personalInfo.name || 'Professional Resume'}</Text>
          </View>
          <Text style={styles.title}>{data.targetRole || 'Professional'}</Text>
          <View style={styles.contact}>
            {data.personalInfo.email ? <View style={styles.contactItem}><Text>📧 {data.personalInfo.email}</Text></View> : null}
            {data.personalInfo.phone ? <View style={styles.contactItem}><Text>📱 {data.personalInfo.phone}</Text></View> : null}
            {data.personalInfo.location ? <View style={styles.contactItem}><Text>📍 {data.personalInfo.location}</Text></View> : null}
            {data.personalInfo.linkedIn ? <View style={styles.contactItem}><Text>💼 LinkedIn</Text></View> : null}
            {data.personalInfo.github ? <View style={styles.contactItem}><Text>🐙 GitHub</Text></View> : null}
            {data.personalInfo.portfolio ? <View style={styles.contactItem}><Text>🌐 Portfolio</Text></View> : null}
          </View>
        </View>

        {/* Professional Summary */}
        {data.professionalSummary ? (
          <View>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.description}>{data.professionalSummary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {data.experience && data.experience.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
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
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {data.projects.map((proj: any, idx: number) => (
              <View key={idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.projectTitle}>{proj.title}</Text>
                  {proj.url ? <Text style={{ fontSize: 8, color: '#6366f1' }}>🔗 {proj.url}</Text> : null}
                </View>
                <Text style={styles.description}>{proj.description}</Text>
                <View style={styles.skillsContainer}>
                  {proj.technologies && proj.technologies.length > 0 ? proj.technologies.map((tech: string, i: number) => (
                    <Text key={i} style={styles.projectTech}>{tech}</Text>
                  )) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {data.skills && data.skills.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsContainer}>
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
            <Text style={styles.sectionTitle}>EDUCATION</Text>
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
