import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  // Fetch all users with their related foray and trading activities
  const users = await prisma.user.findMany({
    include: {
      forayDef: true,
      forayAtk: true,
      trader: true,
    },
  });

  // Serialize the data to JSON format
  const jsonData = JSON.stringify(users, null, 2);

  // Write the JSON data to a file named 'data-dump.json'
  fs.writeFileSync('data-dump.json', jsonData);

  console.log('Data export completed successfully.');
}

exportData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
