import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentStatus, CourseStatus } from '../../common/types/enums';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) { }

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const { courseId, userId } = createEnrollmentDto;

    // Check if course exists and is published
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new ForbiddenException('Course is not published');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('User account is not active');
    }

    // Check for existing enrollment
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId,
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'CANCELLED') {
        // Reactivate cancelled enrollment
        return this.prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { status: 'ACTIVE' },
          include: {
            course: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      }
      throw new ConflictException('Already enrolled in this course');
    }

    // Check if user is the instructor
    if (course.instructorId === userId) {
      throw new ForbiddenException('Instructor cannot enroll in their own course');
    }

    // Create enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        courseId,
        userId,
        status: 'ACTIVE',
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'ENROLL',
        resource: 'COURSE',
        details: {
          courseId,
          courseTitle: course.title,
          enrollmentId: enrollment.id,
        },
      },
    });

    return enrollment;
  }

  async findAll(filters?: { courseId?: string; userId?: string; status?: string }) {
    const where: any = {};

    if (filters?.courseId) {
      where.courseId = filters.courseId;
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.status) {
      where.status = filters.status as EnrollmentStatus;
    }

    return this.prisma.enrollment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const enrollmentHead = await this.prisma.enrollment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!enrollmentHead) {
      throw new NotFoundException('Enrollment not found');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            modules: {
              include: {
                lessons: {
                  include: {
                    progress: {
                      where: {
                        userId: enrollmentHead.userId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
    });

    return enrollment;
  }

  async complete(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Check if all lessons are completed
    const totalLessons = enrollment.course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0,
    );

    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        userId: enrollment.userId,
        completed: true,
        lesson: {
          module: {
            courseId: enrollment.courseId,
          },
        },
      },
    });

    if (completedLessons < totalLessons) {
      throw new BadRequestException('Not all lessons are completed');
    }

    return this.prisma.enrollment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async cancel(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status === 'CANCELLED') {
      throw new BadRequestException('Enrollment already cancelled');
    }

    return this.prisma.enrollment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getCourseStats(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const enrollments = await this.prisma.enrollment.groupBy({
      by: ['status'],
      where: { courseId },
      _count: true,
    });

    const totalEnrollments = enrollments.reduce((sum, e) => sum + e._count, 0);

    const ratings = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { courseId },
      _count: true,
    });

    const totalRatings = ratings.reduce((sum, r) => sum + r._count, 0);
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.rating * r._count, 0) / totalRatings
        : 0;

    const recentEnrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
      orderBy: { enrolledAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      courseId,
      courseTitle: course.title,
      totalEnrollments,
      enrollmentStats: enrollments,
      ratingStats: ratings,
      averageRating,
      recentEnrollments,
    };
  }

  async getUserProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId,
        },
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    progress: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const totalLessons = enrollment.course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0,
    );

    const completedLessons = enrollment.course.modules.reduce(
      (sum, module) =>
        sum + module.lessons.filter((lesson) => lesson.progress.length > 0 && lesson.progress[0].completed).length,
      0,
    );

    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const modulesWithProgress = enrollment.course.modules.map((module) => ({
      ...module,
      totalLessons: module.lessons.length,
      completedLessons: module.lessons.filter(
        (lesson) => lesson.progress.length > 0 && lesson.progress[0].completed,
      ).length,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        progress: lesson.progress[0] || null,
      })),
    }));

    return {
      enrollmentId: enrollment.id,
      courseId,
      userId,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      totalLessons,
      completedLessons,
      progressPercentage,
      modules: modulesWithProgress,
    };
  }

  async updateLessonProgress(enrollmentId: string, lessonId: string, completed: boolean) {
    // Verify enrollment exists
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  where: { id: lessonId },
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Verify lesson exists in course
    const lessonExists = enrollment.course.modules.some((module) =>
      module.lessons.some((lesson) => lesson.id === lessonId),
    );

    if (!lessonExists) {
      throw new NotFoundException('Lesson not found in this course');
    }

    // Update or create progress record
    const progress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: enrollment.userId,
          lessonId,
        },
      },
      update: {
        completed,
        updatedAt: new Date(),
      },
      create: {
        userId: enrollment.userId,
        lessonId,
        completed,
      },
    });

    return progress;
  }
}