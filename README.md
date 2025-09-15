# ExcelMind CRM - University Academic Management Platform

A comprehensive fullstack web application for managing university academic workflows, supporting students, lecturers, and administrators with role-based dashboards, course & assignment management, AI-powered features, and real-time notifications.

## 🚀 Features

### Core Features
- **Multi-Role Authentication** - Students, Lecturers, Administrators
- **Course Management** - Create, browse, and manage courses
- **Assignment System** - Submit, grade, and track assignments
- **Enrollment Workflow** - Request and approve course enrollments
- **AI Assistant** - Course recommendations and syllabus generation
- **GPA Calculation** - Automatic grade point average calculation

### Bonus Features
- **Transcript PDF Generator** - Generate and download student transcripts
- **Real-time Notifications** - WebSocket-based live updates

## 🛠️ Tech Stack

### Backend
- **NestJS v10** - Node.js framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **PDFKit/Puppeteer** - PDF generation

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Zustand** - State management

### Testing
- **Jest + Supertest** - Backend testing
- **Playwright + RTL** - Frontend testing

### Deployment
- **Docker + Docker Compose** - Containerization

## 📁 Project Structure

```
excel-mind-crm/
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore rules
├── docker-compose.yml        # Docker orchestration
├── README.md                 # This file
├── SYSTEM_DESIGN.md          # Architecture documentation
│
├── /backend                  # NestJS + Prisma backend
│   ├── Dockerfile
│   └── package.json
│
├── /frontend                 # Next.js frontend
│   ├── Dockerfile
│   └── package.json
│
├── /scripts                  # Utility scripts
│   ├── seed.ts               # Database seeding
│   └── cleanup.ts            # Cleanup utilities
│
└── /tests                    # Test suites
    ├── backend-e2e/          # Backend integration tests
    └── frontend-e2e/         # Frontend E2E tests
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd excel-mind-crm
cp env.example .env
# Edit .env with your configuration
```

### 2. Production Deployment (Optional helpers included)
```bash
# Linux/Mac
./scripts/deploy.sh   # Optional convenience script

# Windows
scripts\deploy.bat    # Optional convenience script
```

### 3. Development Setup
```bash
# Install all dependencies
npm run install:all

# Setup database
npm run db:generate
npm run db:migrate
npm run seed

# Start development servers
npm run dev
```

### 4. Manual Docker Deployment
```bash
# Start all services
docker-compose up -d

# Seed the database
docker-compose exec backend npm run seed

# View logs
docker-compose logs -f
```

## 🔐 Sample Credentials

### Admin
- **Email**: admin@excelmind.edu
- **Password**: admin123
- **Role**: Administrator

### Lecturer
- **Email**: lecturer@excelmind.edu
- **Password**: lecturer123
- **Role**: Lecturer

### Student
- **Email**: student@excelmind.edu
- **Password**: student123
- **Role**: Student

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/me` - Get current user profile

### Courses
- `GET /courses` - List all courses
- `POST /courses` - Create course (Lecturer/Admin)
- `GET /courses/:id` - Get course details
- `POST /courses/:id/enroll` - Request enrollment

### Assignments
- `GET /assignments` - List assignments
- `POST /assignments` - Create assignment (Lecturer)
- `POST /assignments/:id/submit` - Submit assignment (Student)
- `POST /assignments/:id/grade` - Grade assignment (Lecturer)

### AI Features
- `POST /ai/recommend` - Get course recommendations
- `POST /ai/syllabus` - Generate syllabus

### Transcript
- `GET /transcript/:studentId/pdf` - Download transcript PDF

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:e2e
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Remove volumes (clean database)
docker-compose down -v
```

## 🔧 Environment Variables

See `.env.example` for all required environment variables.

## 📖 Documentation

- [System Design](./SYSTEM_DESIGN.md) - Architecture and design decisions
- [API Documentation](./backend/docs/) - Detailed API documentation
- [Frontend Components](./frontend/docs/) - Component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
