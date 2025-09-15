import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CourseRecommendationDto } from './dto/course-recommendation.dto';
import { SyllabusGenerationDto } from './dto/syllabus-generation.dto';

@Injectable()
export class AiService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async recommendCourses(recommendationDto: CourseRecommendationDto) {
    const { interests, currentCourses, academicLevel, careerGoals } = recommendationDto;
    const mockAi = this.configService.get<string>('MOCK_AI') === 'true';
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (mockAi || !openaiApiKey) {
      return this.getMockCourseRecommendations(interests, currentCourses, academicLevel, careerGoals);
    }

    // TODO: Implement OpenAI integration
    return this.getMockCourseRecommendations(interests, currentCourses, academicLevel, careerGoals);
  }

  async generateSyllabus(syllabusDto: SyllabusGenerationDto) {
    const { topic, level, duration, learningObjectives } = syllabusDto;
    const mockAi = this.configService.get<string>('MOCK_AI') === 'true';
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (mockAi || !openaiApiKey) {
      return this.getMockSyllabus(topic, level, duration, learningObjectives);
    }

    // TODO: Implement OpenAI integration
    return this.getMockSyllabus(topic, level, duration, learningObjectives);
  }

  private getMockCourseRecommendations(interests: string[], currentCourses: string[], academicLevel: string, careerGoals: string[]) {
    const recommendations = [
      {
        id: 'rec1',
        title: 'Advanced Machine Learning',
        code: 'CS501',
        description: 'Deep dive into machine learning algorithms and neural networks',
        credits: 3,
        difficulty: 'Advanced',
        relevanceScore: 0.95,
        prerequisites: ['CS101', 'MATH301'],
        reason: 'Based on your interest in AI and data science, this course will advance your machine learning skills',
      },
      {
        id: 'rec2',
        title: 'Software Engineering Principles',
        code: 'CS401',
        description: 'Best practices in software development and project management',
        credits: 3,
        difficulty: 'Intermediate',
        relevanceScore: 0.88,
        prerequisites: ['CS101'],
        reason: 'Essential for your software development career goals',
      },
      {
        id: 'rec3',
        title: 'Database Systems',
        code: 'CS301',
        description: 'Design and implementation of database systems',
        credits: 3,
        difficulty: 'Intermediate',
        relevanceScore: 0.82,
        prerequisites: ['CS101'],
        reason: 'Complements your current programming courses and is crucial for full-stack development',
      },
      {
        id: 'rec4',
        title: 'Statistics for Data Science',
        code: 'STAT401',
        description: 'Statistical methods and analysis for data science applications',
        credits: 3,
        difficulty: 'Intermediate',
        relevanceScore: 0.79,
        prerequisites: ['MATH201'],
        reason: 'Strong foundation for your data science interests and career goals',
      },
    ];

    return {
      recommendations: recommendations.slice(0, 3), // Return top 3
      analysis: {
        interests: interests,
        currentCourses: currentCourses,
        academicLevel: academicLevel,
        careerGoals: careerGoals,
        totalRecommendations: recommendations.length,
      },
    };
  }

  private getMockSyllabus(topic: string, level: string, duration: string, learningObjectives: string[]) {
    const weeks = parseInt(duration) || 16;
    const syllabus = {
      course: {
        title: `${topic} - ${level} Level`,
        code: this.generateCourseCode(topic),
        credits: 3,
        duration: `${weeks} weeks`,
        level: level,
      },
      learningObjectives: learningObjectives.length > 0 ? learningObjectives : [
        `Understand fundamental concepts of ${topic}`,
        `Apply ${topic} principles to real-world problems`,
        `Develop practical skills in ${topic}`,
        `Analyze and evaluate ${topic} solutions`,
      ],
      weeklySchedule: this.generateWeeklySchedule(topic, level, weeks),
      assessments: [
        {
          type: 'Assignment',
          weight: 30,
          description: 'Weekly practical assignments',
          dueDate: 'Ongoing',
        },
        {
          type: 'Midterm Exam',
          weight: 25,
          description: 'Mid-term examination covering weeks 1-8',
          dueDate: 'Week 8',
        },
        {
          type: 'Final Project',
          weight: 35,
          description: 'Comprehensive project applying course concepts',
          dueDate: 'Week 16',
        },
        {
          type: 'Participation',
          weight: 10,
          description: 'Class participation and discussions',
          dueDate: 'Ongoing',
        },
      ],
      resources: [
        {
          type: 'Textbook',
          title: `${topic}: A Comprehensive Guide`,
          author: 'Dr. Academic Expert',
          required: true,
        },
        {
          type: 'Online Resources',
          title: 'Course Website',
          url: 'https://course.example.com',
          required: true,
        },
        {
          type: 'Software',
          title: 'Development Environment',
          description: 'Required software and tools',
          required: true,
        },
      ],
      policies: {
        attendance: 'Regular attendance is expected and will be recorded',
        lateSubmission: 'Late submissions will be penalized by 10% per day',
        academicIntegrity: 'All work must be original and properly cited',
        grading: 'Grades will be posted within one week of submission',
      },
    };

    return syllabus;
  }

  private generateCourseCode(topic: string): string {
    const prefix = topic.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    const number = Math.floor(Math.random() * 400) + 100;
    return `${prefix}${number}`;
  }

  private generateWeeklySchedule(topic: string, level: string, weeks: number) {
    const schedule = [];
    const topics = [
      'Introduction and Overview',
      'Fundamental Concepts',
      'Core Principles',
      'Advanced Techniques',
      'Practical Applications',
      'Case Studies',
      'Project Work',
      'Review and Assessment',
    ];

    for (let week = 1; week <= weeks; week++) {
      const topicIndex = Math.min(Math.floor((week - 1) / 2), topics.length - 1);
      schedule.push({
        week: week,
        topic: `${topics[topicIndex]} - ${topic}`,
        activities: [
          'Lecture: Theory and concepts',
          'Lab: Hands-on practice',
          'Assignment: Practical exercise',
          'Discussion: Q&A and review',
        ],
        readings: [
          `Chapter ${week} from course textbook`,
          'Additional online resources',
        ],
        deliverables: week % 4 === 0 ? ['Assignment due'] : [],
      });
    }

    return schedule;
  }
}
