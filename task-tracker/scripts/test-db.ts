import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

config({ path: '.env', quiet: true });
config({ path: '.env.local', override: true, quiet: true });

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

async function main() {
  console.log('🔌 Testing database connection...\n');

  // 1. Test basic connection
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }

  // 2. Test profiles table (User model in schema)
  try {
    const profileCount = await prisma.user.count();
    console.log(`✅ profiles table exists — ${profileCount} rows`);
  } catch (error) {
    console.error('❌ profiles table missing or broken:', error);
  }

  // 3. Test tasks table
  try {
    const taskCount = await prisma.task.count();
    console.log(`✅ tasks table exists — ${taskCount} rows`);
  } catch (error) {
    console.error('❌ tasks table missing or broken:', error);
  }

  // 4. Test create a dummy task (then immediately delete it)
  try {
    const dummyProfile = await prisma.user.upsert({
      where: { id: 'test-user-id' },
      update: {},
      create: {
        id: 'test-user-id',
        email: 'test@test.com',
        name: 'Test User',
      },
    });
    console.log(`✅ profile create/upsert works — id: ${dummyProfile.id}`);

    const dummyTask = await prisma.task.create({
      data: {
        title: 'Test Task',
        priority: 'HIGH',
        status: 'TODO',
        userId: dummyProfile.id,
      },
    });
    console.log(`✅ task create works — id: ${dummyTask.id}`);

    await prisma.task.delete({ where: { id: dummyTask.id } });
    await prisma.user.delete({ where: { id: dummyProfile.id } });
    console.log('✅ cleanup successful — test rows deleted\n');
  } catch (error) {
    console.error('❌ write/delete test failed:', error);
  }

  console.log('🎉 All database checks complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
