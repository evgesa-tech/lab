
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  for (const name of ['user', 'administrator']) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      roles: { connect: [{ name: 'administrator' }, { name: 'user' }] },
    },
  });
  console.log('Seed: роли user/administrator, пользователь admin / admin123');
}

main().finally(() => prisma.$disconnect());
