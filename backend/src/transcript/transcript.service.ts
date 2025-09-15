import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TranscriptService {
  constructor(private prisma: PrismaService) {}

  async generateTranscript(studentId: string, requesterId: string, requesterRole: string) {
    // Check if requester is authorized (student themselves, admin, or lecturer of their courses)
    if (requesterRole !== 'admin' && requesterId !== studentId) {
      // Check if requester is a lecturer of any of the student's courses
      const studentEnrollments = await this.prisma.enrollment.findMany({
        where: { studentId, status: 'approved' },
        include: { course: true },
      });

      const isLecturerOfStudentCourses = studentEnrollments.some(
        enrollment => enrollment.course.lecturerId === requesterId
      );

      if (!isLecturerOfStudentCourses) {
        throw new ForbiddenException('You are not authorized to view this transcript');
      }
    }

    // Get student information
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get student's enrolled courses with grades
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId,
        status: 'approved',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            credits: true,
          },
        },
      },
    });

    // Get all assignments and submissions for GPA calculation
    const courseIds = enrollments.map(e => e.course.id);
    const assignments = await this.prisma.assignment.findMany({
      where: {
        courseId: { in: courseIds },
      },
      include: {
        submissions: {
          where: { studentId },
        },
        course: {
          select: {
            id: true,
            code: true,
            credits: true,
          },
        },
      },
    });

    // Calculate GPA
    const gpa = this.calculateGPA(assignments);

    // Generate PDF
    const pdfBuffer = await this.generatePDF(student, enrollments, assignments, gpa);

    return {
      buffer: pdfBuffer,
      filename: `transcript_${student.name.replace(/\s+/g, '_')}_${studentId}.pdf`,
    };
  }

  private calculateGPA(assignments: any[]): number {
    const courseGrades = new Map();

    assignments.forEach(assignment => {
      const courseId = assignment.course.id;
      const courseCredits = assignment.course.credits;
      
      if (!courseGrades.has(courseId)) {
        courseGrades.set(courseId, {
          credits: courseCredits,
          totalPoints: 0,
          maxPoints: 0,
        });
      }

      const courseGrade = courseGrades.get(courseId);
      
      assignment.submissions.forEach(submission => {
        if (submission.grade !== null) {
          courseGrade.totalPoints += submission.grade;
          courseGrade.maxPoints += assignment.maxPoints;
        }
      });
    });

    let totalWeightedPoints = 0;
    let totalCredits = 0;

    courseGrades.forEach((grade, courseId) => {
      if (grade.maxPoints > 0) {
        const percentage = (grade.totalPoints / grade.maxPoints) * 100;
        const letterGrade = this.percentageToLetterGrade(percentage);
        const gradePoints = this.letterGradeToPoints(letterGrade);
        
        totalWeightedPoints += gradePoints * grade.credits;
        totalCredits += grade.credits;
      }
    });

    return totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  }

  private percentageToLetterGrade(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  private letterGradeToPoints(letterGrade: string): number {
    const gradePoints = {
      'A': 4.0,
      'B': 3.0,
      'C': 2.0,
      'D': 1.0,
      'F': 0.0,
    };
    return gradePoints[letterGrade] || 0.0;
  }

  private async generatePDF(student: any, enrollments: any[], assignments: any[], gpa: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text('EXCELMIND UNIVERSITY', { align: 'center' });
      doc.fontSize(16).text('OFFICIAL TRANSCRIPT', { align: 'center' });
      doc.moveDown(2);

      // Student Information
      doc.fontSize(14).text('STUDENT INFORMATION', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Name: ${student.name}`);
      doc.text(`Student ID: ${student.id}`);
      doc.text(`Email: ${student.email}`);
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`);
      doc.moveDown(2);

      // Academic Summary
      doc.fontSize(14).text('ACADEMIC SUMMARY', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Total Credits: ${enrollments.reduce((sum, e) => sum + e.course.credits, 0)}`);
      doc.text(`GPA: ${gpa.toFixed(2)}`);
      doc.moveDown(2);

      // Course Details
      doc.fontSize(14).text('COURSE DETAILS', { underline: true });
      doc.moveDown(0.5);

      const courseGrades = new Map();
      assignments.forEach(assignment => {
        const courseId = assignment.course.id;
        if (!courseGrades.has(courseId)) {
          courseGrades.set(courseId, {
            course: assignment.course,
            assignments: [],
          });
        }
        courseGrades.get(courseId).assignments.push(assignment);
      });

      courseGrades.forEach((courseData, courseId) => {
        const course = courseData.course;
        const courseAssignments = courseData.assignments;
        
        // Calculate course grade
        let totalPoints = 0;
        let maxPoints = 0;
        courseAssignments.forEach(assignment => {
          assignment.submissions.forEach(submission => {
            if (submission.grade !== null) {
              totalPoints += submission.grade;
              maxPoints += assignment.maxPoints;
            }
          });
        });

        const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
        const letterGrade = this.percentageToLetterGrade(percentage);

        doc.fontSize(12).text(`${course.code} - ${course.title}`, { continued: true });
        doc.text(` (${course.credits} credits)`, { align: 'right' });
        doc.text(`Grade: ${letterGrade} (${percentage.toFixed(1)}%)`);
        doc.moveDown(0.5);
      });

      doc.moveDown(2);

      // Footer
      doc.fontSize(10).text('This is an official transcript generated by ExcelMind University', { align: 'center' });
      doc.text('For verification, contact: registrar@excelmind.edu', { align: 'center' });

      doc.end();
    });
  }
}
