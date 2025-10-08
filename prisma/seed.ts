import { PrismaClient } from '../lib/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@systemfifty.com' },
    update: {},
    create: {
      email: 'admin@systemfifty.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });

  console.log('Seeded admin user:', admin.email);
  console.log('Password: admin123');
  console.log('\nIMPORTANT: Change this password after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
