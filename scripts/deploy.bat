@echo off
REM ExcelMind CRM Deployment Script for Windows
REM This script deploys the application using Docker Compose

echo 🚀 Starting ExcelMind CRM Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    copy env.example .env
    echo 📝 Please edit .env file with your production values before running again.
    pause
    exit /b 1
)

echo 📦 Building Docker images...
docker-compose build --no-cache

echo 🗄️  Starting database...
docker-compose up -d postgres

echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo 🔄 Running database migrations...
docker-compose exec backend npm run prisma:deploy

echo 🌱 Seeding database...
docker-compose exec backend npm run seed

echo 🚀 Starting all services...
docker-compose up -d

echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo 🏥 Checking service health...
curl -f http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is healthy
) else (
    echo ❌ Backend health check failed
    docker-compose logs backend
    pause
    exit /b 1
)

curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is healthy
) else (
    echo ❌ Frontend health check failed
    docker-compose logs frontend
    pause
    exit /b 1
)

echo 🎉 Deployment completed successfully!
echo.
echo 📋 Service URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    API Documentation: http://localhost:3001/api/docs
echo    Database: localhost:5432
echo.
echo 🔐 Sample Credentials:
echo    Admin: admin@excelmind.edu / password123
echo    Lecturer: lecturer@excelmind.edu / password123
echo    Student: student@excelmind.edu / password123
echo.
echo 📊 Useful Commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo    Update services: docker-compose pull ^&^& docker-compose up -d

pause
