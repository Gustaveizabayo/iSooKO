// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient({
//     datasourceUrl: process.env.DATABASE_URL,

// });

// async function testConnection() {
//     try {
//         await prisma.$connect();
//         console.log(' Database connected successfully');

//         const users = await prisma.user.findMany();
//         console.log( ` Total users: ${users.length}`);

//         await prisma.$disconnect();


//     } catch (error) {
//         console.error('Database connection failed:', error);
//         process.getMaxListeners(1);
//     }
  
// }

// testConnection();