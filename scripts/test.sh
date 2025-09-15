#!/bin/bash

# ExcelMind CRM Testing Script
# This script runs all tests for the application

set -e

echo "🧪 Starting ExcelMind CRM Test Suite..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm run install:all

echo "🔧 Setting up test environment..."
# Copy test environment file
cp env.example .env.test

echo "🗄️  Starting test database..."
docker-compose -f docker-compose.test.yml up -d postgres

echo "⏳ Waiting for test database to be ready..."
sleep 10

echo "🔄 Running database migrations..."
cd backend
npm run prisma:deploy
cd ..

echo "🌱 Seeding test database..."
cd backend
npm run seed
cd ..

echo "🧪 Running Backend Tests..."
cd backend
npm run test
npm run test:e2e
cd ..

echo "🧪 Running Frontend Tests..."
cd frontend
npm run test
npm run test:e2e
cd ..

echo "🧹 Cleaning up test environment..."
docker-compose -f docker-compose.test.yml down -v

echo "✅ All tests completed successfully!"
echo ""
echo "📊 Test Results:"
echo "   Backend Unit Tests: ✅"
echo "   Backend E2E Tests: ✅"
echo "   Frontend Unit Tests: ✅"
echo "   Frontend E2E Tests: ✅"
