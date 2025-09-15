import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...');

  try {
    // Delete all records in reverse dependency order
    await prisma.notification.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    throw error;
  }
}

async function cleanupFiles() {
  console.log('🧹 Starting file cleanup...');

  const uploadDirs = [
    './uploads',
    './uploads/syllabi',
    './uploads/submissions',
    './uploads/transcripts',
  ];

  for (const dir of uploadDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            console.log(`🗑️  Deleted file: ${filePath}`);
          }
        }
        console.log(`✅ Cleaned directory: ${dir}`);
      } catch (error) {
        console.error(`❌ Error cleaning directory ${dir}:`, error);
      }
    }
  }
}

async function cleanupLogs() {
  console.log('🧹 Starting log cleanup...');

  const logDirs = ['./logs', './backend/logs', './frontend/logs'];
  const logFiles = ['*.log', '*.log.*'];

  for (const dir of logDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith('.log') || file.includes('.log.')) {
            const filePath = path.join(dir, file);
            fs.unlinkSync(filePath);
            console.log(`🗑️  Deleted log file: ${filePath}`);
          }
        }
        console.log(`✅ Cleaned logs in: ${dir}`);
      } catch (error) {
        console.error(`❌ Error cleaning logs in ${dir}:`, error);
      }
    }
  }
}

async function cleanupBuilds() {
  console.log('🧹 Starting build cleanup...');

  const buildDirs = [
    './backend/dist',
    './backend/node_modules',
    './frontend/.next',
    './frontend/out',
    './frontend/node_modules',
    './node_modules',
  ];

  for (const dir of buildDirs) {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`🗑️  Deleted build directory: ${dir}`);
      } catch (error) {
        console.error(`❌ Error cleaning build directory ${dir}:`, error);
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting comprehensive cleanup...\n');

  try {
    await cleanupDatabase();
    await cleanupFiles();
    await cleanupLogs();
    await cleanupBuilds();

    console.log('\n✅ All cleanup operations completed successfully!');
    console.log('\n📋 Cleaned:');
    console.log('- Database records');
    console.log('- Upload files');
    console.log('- Log files');
    console.log('- Build artifacts');
    console.log('- Node modules');
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🧹 ExcelMind CRM Cleanup Script

Usage: npm run cleanup [options]

Options:
  --database, -d    Clean database only
  --files, -f       Clean files only
  --logs, -l        Clean logs only
  --builds, -b      Clean builds only
  --help, -h        Show this help message

Examples:
  npm run cleanup                    # Clean everything
  npm run cleanup --database         # Clean database only
  npm run cleanup --files --logs     # Clean files and logs only
`);
  process.exit(0);
}

if (args.includes('--database') || args.includes('-d')) {
  cleanupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (args.includes('--files') || args.includes('-f')) {
  cleanupFiles()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (args.includes('--logs') || args.includes('-l')) {
  cleanupLogs()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (args.includes('--builds') || args.includes('-b')) {
  cleanupBuilds()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  main()
    .catch(() => process.exit(1))
    .finally(async () => {
      await prisma.$disconnect();
    });
}
