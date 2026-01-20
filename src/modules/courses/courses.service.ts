import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCourseDto, UpdateCourseDto, CreateModuleDto, CreateLessonDto } from './dto';
import { CourseStatus } from '../../common/types/enums';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(createCourseDto: CreateCourseDto) {
        const { instructorId, ...courseData } = createCourseDto;
        return this.prisma.course.create({
            data: {
                ...courseData,
                status: CourseStatus.DRAFT,
                instructor: { connect: { id: instructorId } },
            },
        });
    }

    async findAll(filters?: { category?: string; level?: string; instructorId?: string }) {
        const where: any = {};

        if (filters?.category) {
            where.category = filters.category;
        }

        if (filters?.level) {
            where.level = filters.level;
        }

        if (filters?.instructorId) {
            where.instructorId = filters.instructorId;
        }

        return this.prisma.course.findMany({
            where,
            include: {
                instructor: {
                    select: { id: true, name: true, email: true },
                },
                modules: {
                    include: {
                        lessons: true,
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                instructor: {
                    select: { id: true, name: true, email: true },
                },
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        return course;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        const course = await this.prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        return this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
        });
    }

    async remove(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Check if course has enrollments
        const enrollments = await this.prisma.enrollment.count({
            where: { courseId: id },
        });

        if (enrollments > 0) {
            throw new ForbiddenException('Cannot delete course with existing enrollments');
        }

        return this.prisma.course.delete({
            where: { id },
        });
    }

    async addModule(courseId: string, createModuleDto: CreateModuleDto) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Get the max order for modules in this course
        const maxOrder = await this.prisma.module.aggregate({
            where: { courseId },
            _max: { order: true },
        });

        return this.prisma.module.create({
            data: {
                ...createModuleDto,
                courseId,
                order: (maxOrder._max.order || 0) + 1,
            },
        });
    }

    async addLesson(courseId: string, moduleId: string, createLessonDto: CreateLessonDto) {
        // Verify course and module exist and are related
        const module = await this.prisma.module.findFirst({
            where: {
                id: moduleId,
                courseId,
            },
        });

        if (!module) {
            throw new NotFoundException('Module not found in this course');
        }

        // Get the max order for lessons in this module
        const maxOrder = await this.prisma.lesson.aggregate({
            where: { moduleId },
            _max: { order: true },
        });

        return this.prisma.lesson.create({
            data: {
                ...createLessonDto,
                moduleId,
                order: (maxOrder._max.order || 0) + 1,
            } as any,
        });
    }
}
