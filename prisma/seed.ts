import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@kanban.com',
      password: 'admin123', // You should hash this in production
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@kanban.com',
      password: 'user123', // You should hash this in production
      role: Role.USER,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Welcome to Kanban',
      description: 'This is a sample task',
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdBy: admin.id,
      assigneeId: user.id,
    },
  });
}

main()
  .then(() => console.log('🌱 Seeded successfully'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
