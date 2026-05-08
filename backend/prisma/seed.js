const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'Data Engineering', color: '#3b82f6', icon: '🗄️' },
  { name: 'AI/ML Projects', color: '#8b5cf6', icon: '🤖' },
  { name: 'Learning & Training', color: '#10b981', icon: '📚' },
  { name: 'Meetings', color: '#f59e0b', icon: '📅' },
  { name: 'Documentation', color: '#6366f1', icon: '📝' },
  { name: 'Code Review', color: '#ec4899', icon: '🔍' },
  { name: 'Debugging', color: '#ef4444', icon: '🐛' },
  { name: 'Administration', color: '#64748b', icon: '⚙️' },
];

async function main() {
  console.log('Seeding database...');

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const allCats = await prisma.category.findMany();
  const catMap = Object.fromEntries(allCats.map(c => [c.name, c.id]));

  const now = new Date();
  const sampleLogs = [
    {
      taskName: 'Set up ETL pipeline for sales data',
      description: 'Configured Apache Spark pipeline to process daily sales data from S3',
      project: 'Sales Analytics',
      startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      durationMinutes: 120,
      tags: ['spark', 'etl', 's3'],
      status: 'completed',
      priority: 'high',
      categoryId: catMap['Data Engineering'],
    },
    {
      taskName: 'Fine-tune sentiment analysis model',
      description: 'Working on improving accuracy of the customer feedback classifier',
      project: 'Customer Intelligence',
      startTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      durationMinutes: 120,
      tags: ['nlp', 'pytorch', 'huggingface'],
      status: 'in_progress',
      priority: 'high',
      categoryId: catMap['AI/ML Projects'],
    },
    {
      taskName: 'Review dbt model documentation',
      description: 'Reviewed and updated data model documentation in Confluence',
      project: 'Data Platform',
      startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 23 * 60 * 60 * 1000),
      durationMinutes: 60,
      tags: ['dbt', 'documentation'],
      status: 'completed',
      priority: 'medium',
      categoryId: catMap['Documentation'],
    },
    {
      taskName: 'Sprint planning meeting',
      description: 'Q1 sprint planning with the data platform team',
      project: 'Team Operations',
      startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      durationMinutes: 90,
      tags: ['planning', 'agile'],
      status: 'completed',
      priority: 'medium',
      categoryId: catMap['Meetings'],
    },
    {
      taskName: 'Debug Airflow DAG failure',
      description: 'Investigated and fixed task dependency issue in the daily_reports DAG',
      project: 'Data Platform',
      startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 180 * 60 * 1000),
      durationMinutes: 180,
      tags: ['airflow', 'debugging'],
      status: 'completed',
      priority: 'high',
      categoryId: catMap['Debugging'],
    },
  ];

  for (const log of sampleLogs) {
    await prisma.workLog.create({ data: log });
  }

  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
