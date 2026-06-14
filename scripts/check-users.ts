import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
  const users = await prisma.user.findMany();
  console.log('Seeded Users in Database:');
  users.forEach(u => {
    console.log(`- Email: ${u.email}, Role: ${u.role}, Name: ${u.firstName} ${u.lastName}`);
  });
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
