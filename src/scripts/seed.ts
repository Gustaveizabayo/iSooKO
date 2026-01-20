
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    const password = await bcrypt.hash('password123', 10);

    // 1. Create Admin
    const adminEmail = 'admin@example.com';
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Super Admin',
            password,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            profile: {
                create: {
                    bio: 'System Administrator',
                    status: 'ACTIVE',
                }
            }
        },
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // 2. Create Instructor
    const instructorEmail = 'instructor@example.com';
    const instructor = await prisma.user.upsert({
        where: { email: instructorEmail },
        update: {},
        create: {
            email: instructorEmail,
            name: 'John Instructor',
            password,
            role: UserRole.INSTRUCTOR,
            status: UserStatus.ACTIVE,
            profile: {
                create: {
                    bio: 'Expert Instructor',
                    experience: '10 years of coding',
                    status: 'ACTIVE',
                }
            }
        },
    });
    console.log(`✅ Instructor created: ${instructor.email}`);

    // 3. Create Student
    const studentEmail = 'student@example.com';
    const student = await prisma.user.upsert({
        where: { email: studentEmail },
        update: {},
        create: {
            email: studentEmail,
            name: 'Jane Student',
            password,
            role: UserRole.STUDENT,
            status: UserStatus.ACTIVE,
            profile: {
                create: {
                    bio: 'Eager Learner',
                    status: 'ACTIVE',
                }
            }
        },
    });
    console.log(`✅ Student created: ${student.email}`);

    // 4. Create a Course
    const course = await prisma.course.upsert({
        where: { id: 'seed-course-1' }, 
        update: {},
        create: {
            title: 'NestJS Masterclass',
            description: 'Learn NestJS from scratch to advanced.',
            price: 49.99,
            duration: 120, // minutes
            category: 'Development',
            instructorId: instructor.id,
            isPublished: true,
            modules: {
                create: [
                    {
                        title: 'Introduction',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Welcome',
                                    type: 'VIDEO',
                                    videoUrl: 'https://example.com/video.mp4',
                                    order: 1,
                                    duration: 5,
                                }
                            ]
                        }
                    }
                ]
            }
        }
    } as any); 

    // Better way for Course:
    const existingCourse = await prisma.course.findFirst({ where: { title: 'NestJS Masterclass' } });
    if (!existingCourse) {
        await prisma.course.create({
            data: {
                title: 'NestJS Masterclass',
                description: 'Learn NestJS from scratch to advanced.',
                price: 49.99,
                duration: 120,
                category: 'Development',
                instructorId: instructor.id,
                isPublished: true,
                modules: {
                    create: [
                        {
                            title: 'Introduction',
                            order: 1,
                            lessons: {
                                create: [
                                    {
                                        title: 'Welcome',
                                        type: 'VIDEO',
                                        content: 'Welcome to the course!',
                                        order: 1,
                                        duration: 5
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        });
        console.log(` Course created: NestJS Masterclass`);
    } else {
        console.log(` Course already exists: NestJS Masterclass`);
    }

    console.log('Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
