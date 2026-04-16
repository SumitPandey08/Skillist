import { createWorker } from '../../core/queues';
import { prisma } from '../../lib/prisma';
import logger from '../../core/logger';
import { extractTextFromPdf } from '../../lib/ai/pdf';
import { extractResumeData } from '../../lib/ai/parser';
import axios from 'axios';
import { nanoid } from 'nanoid';

export const resumeWorker = createWorker('resume-parsing', async (job) => {
  const { resumeId, userId, fileUrl } = job.data;
  
  logger.info(`Starting parsing for resume ${resumeId}`);
  
  try {
    await prisma.resume.update({
      where: { id: resumeId },
      data: { status: 'processing' }
    });

    // 1. Download the PDF
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // 2. Extract Text
    const text = await extractTextFromPdf(buffer);

    // 3. Parse with AI
    const extractedData = await extractResumeData(text);

    // 4. Update Resume Status
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        status: 'completed',
        parsedData: JSON.stringify(extractedData)
      }
    });

    // 5. Sync to Student Profile (Atomic Transaction)
    await prisma.$transaction(async (tx) => {
      // Update student resume URL
      await tx.student.update({
        where: { id: userId },
        data: { resumeUrl: fileUrl }
      });

      // Sync Skills
      for (const skill of extractedData.skills) {
        const matchedSkill = await tx.skill.upsert({
          where: { name: skill.name },
          update: {},
          create: { id: nanoid(), name: skill.name }
        });

        await tx.studentSkill.upsert({
          where: {
            studentId_skillId: {
              studentId: userId,
              skillId: matchedSkill.id
            }
          },
          update: { proficiency: skill.proficiency },
          create: {
            studentId: userId,
            skillId: matchedSkill.id,
            proficiency: skill.proficiency
          }
        });
      }

      // Sync Experience
      await tx.experience.deleteMany({ where: { studentId: userId } });
      for (const exp of extractedData.experience) {
        await tx.experience.create({
          data: {
            id: nanoid(),
            studentId: userId,
            title: exp.title,
            company: exp.company,
            location: exp.location || null,
            description: exp.description,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate && exp.endDate !== 'Present' ? new Date(exp.endDate) : null,
          }
        });
      }

      // Sync Education
      await tx.education.deleteMany({ where: { studentId: userId } });
      for (const edu of extractedData.education) {
        await tx.education.create({
          data: {
            id: nanoid(),
            studentId: userId,
            school: edu.school,
            degree: edu.degree || null,
            field: edu.field || null,
            graduationDate: edu.graduationDate ? new Date(edu.graduationDate) : null,
          }
        });
      }
    });

    logger.info(`Completed parsing for resume ${resumeId} and synced with user ${userId}`);
  } catch (error: any) {
    logger.error(`Error parsing resume ${resumeId}: ${error.message}`);
    await prisma.resume.update({
      where: { id: resumeId },
      data: { status: 'failed', error: error.message }
    });
  }
});
