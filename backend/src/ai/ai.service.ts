import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CourseRecommendationDto } from './dto/course-recommendation.dto';
import { SyllabusGenerationDto } from './dto/syllabus-generation.dto';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: openaiApiKey,
      });
    }
  }

  async recommendCourses(recommendationDto: CourseRecommendationDto) {
    const { interests, currentCourses, academicLevel, careerGoals } = recommendationDto;
    const mockAi = this.configService.get<string>('MOCK_AI') === 'true';

    if (mockAi || !this.openai) {
      return this.getMockCourseRecommendations(interests, currentCourses, academicLevel, careerGoals);
    }

    try {
      const prompt = `You are an AI academic advisor. Based on the following information, recommend 3-5 relevant courses:

Student Profile:
- Academic Level: ${academicLevel}
- Current Courses: ${currentCourses.join(', ')}
- Interests: ${interests.join(', ')}
- Career Goals: ${careerGoals.join(', ')}

Please provide course recommendations in the following JSON format:
{
  "recommendations": [
    {
      "title": "Course Title",
      "code": "COURSE_CODE",
      "description": "Brief description",
      "credits": 3,
      "difficulty": "Beginner/Intermediate/Advanced",
      "relevanceScore": 85,
      "prerequisites": ["PREREQ1", "PREREQ2"],
      "reason": "Why this course is recommended"
    }
  ],
  "analysis": {
    "interests": ["interest1", "interest2"],
    "currentCourses": ["course1", "course2"],
    "academicLevel": "level",
    "careerGoals": ["goal1", "goal2"],
    "totalRecommendations": 5
  }
}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert academic advisor specializing in course recommendations. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        return JSON.parse(response);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    // Fallback to mock data if OpenAI fails
    return this.getMockCourseRecommendations(interests, currentCourses, academicLevel, careerGoals);
  }

  async generateSyllabus(syllabusDto: SyllabusGenerationDto) {
    const { topic, level, duration, learningObjectives } = syllabusDto;
    const mockAi = this.configService.get<string>('MOCK_AI') === 'true';

    if (mockAi || !this.openai) {
      return this.getMockSyllabus(topic, level, duration, learningObjectives);
    }

    try {
      const weeksNum = typeof duration === 'number' ? duration : parseInt(String(duration || '16'));
      const weeks = Number.isFinite(weeksNum) && weeksNum > 0 ? weeksNum : 16;

      const prompt = `You are an AI course designer. Create a comprehensive syllabus for the following course:

Course Details:
- Topic: ${topic}
- Level: ${level}
- Duration: ${weeks} weeks
- Learning Objectives: ${learningObjectives.join(', ')}

Please provide a detailed syllabus in the following JSON format:
{
  "course": {
    "title": "Course Title",
    "code": "COURSE_CODE",
    "credits": 3,
    "duration": "${weeks} weeks",
    "level": "${level}"
  },
  "learningObjectives": ["objective1", "objective2", "objective3"],
  "weeklySchedule": [
    {
      "week": 1,
      "topic": "Topic for this week",
      "activities": ["Activity 1", "Activity 2"],
      "readings": ["Reading 1", "Reading 2"],
      "deliverables": ["Deliverable 1"]
    }
  ],
  "assessments": [
    {
      "type": "Assignment",
      "weight": 30,
      "description": "Description of assessment",
      "dueDate": "Week X"
    }
  ],
  "resources": [
    {
      "type": "Textbook",
      "title": "Book Title",
      "author": "Author Name",
      "required": true
    }
  ],
  "policies": {
    "attendance": "Attendance policy",
    "lateSubmission": "Late submission policy",
    "academicIntegrity": "Academic integrity policy",
    "grading": "Grading policy"
  }
}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert course designer and academic administrator. Create comprehensive, well-structured syllabi. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        return JSON.parse(response);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    // Fallback to mock data if OpenAI fails
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

  private getMockSyllabus(topic: string, level: string, duration: number | string | undefined, learningObjectives: string[] = []) {
    const weeksNum = typeof duration === 'number' ? duration : parseInt(String(duration || '16'));
    const weeks = Number.isFinite(weeksNum) && weeksNum > 0 ? weeksNum : 16;
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

  async chatWithAI(message: string) {
    const mockAi = this.configService.get<string>('MOCK_AI') === 'true';

    if (mockAi || !this.openai) {
      return this.getMockAIResponse(message);
    }

    try {
      const prompt = `You are an AI academic assistant for a university CRM system. You help students, lecturers, and administrators with academic matters including:

- Course recommendations and academic planning
- Study strategies and time management
- Syllabus creation and course design
- Academic guidance and support
- Assignment and project assistance

User message: "${message}"

Please provide a helpful, professional response. If the user is asking about specific features, mention that they can:
- Get personalized course recommendations
- Generate comprehensive syllabi
- Plan their studies effectively
- Get academic guidance

Respond in a conversational, helpful tone. Keep responses concise but informative.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI academic assistant. Provide clear, actionable advice for academic matters. Be encouraging and professional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        return {
          response: response,
          suggestions: [
            "Get course recommendations",
            "Generate a syllabus",
            "Plan your studies",
            "Ask about assignments"
          ]
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    // Fallback to mock response if OpenAI fails
    return this.getMockAIResponse(message);
  }

  private getMockAIResponse(message: string) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('course') && lowerMessage.includes('recommend')) {
      return {
        response: "Based on your academic profile and interests, I'd recommend exploring courses in Data Science, Machine Learning, or Advanced Statistics. These align well with current industry trends and your mathematical background. Would you like me to provide more specific recommendations based on your current courses?",
        suggestions: [
          "Get personalized course recommendations",
          "View available courses",
          "Check prerequisites"
        ]
      };
    }

    if (lowerMessage.includes('syllabus') || lowerMessage.includes('curriculum')) {
      return {
        response: "I can help you create a comprehensive syllabus! For effective syllabus design, consider including: learning objectives, weekly topics, assessment methods, required readings, and grading criteria. What subject area are you looking to create a syllabus for?",
        suggestions: [
          "Generate a new syllabus",
          "View syllabus templates",
          "Get syllabus best practices"
        ]
      };
    }

    if (lowerMessage.includes('study') && lowerMessage.includes('plan')) {
      return {
        response: "Here's a personalized study plan strategy: 1) Review your current course load and deadlines, 2) Allocate 2-3 hours per credit hour weekly, 3) Use active recall and spaced repetition, 4) Schedule regular review sessions. Would you like me to create a specific study schedule based on your current courses?",
        suggestions: [
          "Create a study schedule",
          "Set study reminders",
          "Track academic progress"
        ]
      };
    }

    if (lowerMessage.includes('grade') || lowerMessage.includes('improve')) {
      return {
        response: "To improve your academic performance, focus on: consistent attendance, active participation, regular study sessions, seeking help during office hours, and forming study groups. Based on your current grades, I notice you're doing well in mathematics - consider leveraging those strengths in related subjects.",
        suggestions: [
          "View grade analytics",
          "Get improvement tips",
          "Schedule tutoring"
        ]
      };
    }

    return {
      response: "I understand you're asking about academic matters. I can help with course recommendations, study planning, syllabus creation, and academic guidance. Could you be more specific about what you'd like assistance with? For example, you could ask about course selection, study strategies, or academic planning.",
      suggestions: [
        "Course recommendations",
        "Study planning",
        "Syllabus creation",
        "Academic guidance"
      ]
    };
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
