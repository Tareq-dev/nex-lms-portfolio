import { prisma } from "../lib/prisma.js";

const testDatabaseConnection = async (): Promise<void> => {
  const usersCount = await prisma.user.count();

  const connectionInfo = await prisma.$queryRaw<
    Array<{
      database_name: string;
      database_user: string;
    }>
  >`
    SELECT
      current_database() AS database_name,
      current_user AS database_user
  `;

  console.log("Database connection successful.");
  console.table(connectionInfo);
  console.log(`Total users: ${usersCount}`);
};

testDatabaseConnection()
  .catch((error: unknown) => {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });