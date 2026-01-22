import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole } from '../../common/types/enums';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            where: { role: 'STUDENT' as any },
            include: {
                profile: true,
                _count: {
                    select: { enrollments: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const student = await this.prisma.user.findFirst({
            where: { id, role: 'STUDENT' as any },
            include: {
                profile: true,
                enrollments: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        if (!student) throw new NotFoundException('Student not found');
        return student;
    }

    async getStudentProgress(studentId: string) {
        const progress = await this.prisma.lessonProgress.findMany({
            where: { userId: studentId },
            include: {
                lesson: {
                    include: { module: { include: { course: true } } },
                },
            },
        });

        // Group by course
        const courseProgress: Record<string, any> = {};
        progress.forEach((p) => {
            const course = p.lesson.module.course;
            if (!courseProgress[course.id]) {
                courseProgress[course.id] = {
                    courseTitle: course.title,
                    completedLessons: 0,
                };
            }
            if (p.completed) courseProgress[course.id].completedLessons++;
        });

        return courseProgress;
    }
}
