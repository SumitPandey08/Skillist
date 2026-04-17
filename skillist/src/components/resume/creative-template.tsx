import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    borderBottom: '4px dashed #ec4899',
    paddingBottom: 20,
    backgroundColor: '#fdf2f8',
    padding: 20,
    marginLeft: -40,
    marginRight: -40,
    marginTop: -40,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#be185d',
  },
  tagline: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  contact: {
    fontSize: 9,
    color: '#6b7280',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  accentBar: {
    height: 6,
    backgroundColor: '#ec4899',
    marginVertical: 15,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#be185d',
    marginTop: 15,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    marginBottom: 12,
    paddingLeft: 15,
    borderLeft: '2px solid #fbcfe8',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  itemCompany: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  itemDate: {
    fontSize: 9,
    color: '#9ca3af',
  },
  description: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  skillBadge: {
    backgroundColor: '#fce7f3',
    color: '#9d174d',
    padding: '3 10',
    borderRadius: 20,
    fontSize: 8,
    fontWeight: 'medium',
    marginRight: 6,
    marginBottom: 6,
  },
  projectCard: {
    backgroundColor: '#fdf2f8',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderLeft: '3px solid #ec4899',
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#be185d',
    marginBottom: 4,
  },
  projectTech: {
    fontSize: 8,
    color: '#9d174d',
    marginTop: 4,
  },
});

export const CreativeTemplate = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View>
            <Text style={styles.name}>{data.personalInfo?.name || data.name}</Text>
            <Text style={styles.tagline}>Creative Professional</Text>
          </View>
        </View>
        <View style={styles.contact}>
          {data.personalInfo?.email && <Text>✉️ {data.personalInfo.email}</Text>}
          {data.personalInfo?.phone && <Text>📞 {data.personalInfo.phone}</Text>}
          {data.personalInfo?.location && <Text>🗺️ {data.personalInfo.location}</Text>}
          {data.personalInfo?.portfolio && <Text>🌍 {data.personalInfo.portfolio}</Text>}
        </View>
      </View>

      <View style={styles.accentBar} />

      {/* Professional Summary */}
      {data.professionalSummary && (
        <View>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.description}>{data.professionalSummary}</Text>
        </View>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>My Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data.skills.map((skill: any, idx: number) => (
              <Text key={idx} style={styles.skillBadge}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Journey</Text>
          {data.experience.map((exp: any, idx: number) => (
            <View key={idx} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.title}</Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} — {exp.isCurrentRole ? 'Now' : exp.endDate}
                </Text>
              </View>
              <Text style={styles.itemCompany}>{exp.company}</Text>
              <Text style={styles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Featured Work</Text>
          {data.projects.map((proj: any, idx: number) => (
            <View key={idx} style={styles.projectCard}>
              <Text style={styles.projectTitle}>{proj.title}</Text>
              <Text style={styles.description}>{proj.description}</Text>
              {proj.technologies?.length > 0 && (
                <View style={styles.projectTech}>
                  <Text>🔥 {proj.technologies.join(' • ')}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu: any, idx: number) => (
            <View key={idx} style={[styles.item, { borderLeft: 'none', paddingLeft: 0 }]}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{edu.school}</Text>
                  <Text style={styles.itemCompany}>
                    {edu.degree} {edu.field ? `in ${edu.field}` : ''}
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
