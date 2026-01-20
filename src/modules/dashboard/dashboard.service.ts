import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole, CourseStatus } from '../../common/types/enums';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  async getAdminDashboard() {
    // User statistics
    const userStats = await this.prisma.user.groupBy({
      by: ['role', 'status'],
      _count: true,
    });

    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({
      where: { status: 'ACTIVE' },
    });

    // Course statistics
    const courseStats = await this.prisma.course.groupBy({
      by: ['category', 'status'],
      _count: true,
    });

    const totalCourses = await this.prisma.course.count();
    const publishedCourses = await this.prisma.course.count({
      where: { status: CourseStatus.PUBLISHED },
    });

    // Enrollment statistics
    const enrollmentStats = await this.prisma.enrollment.groupBy({
      by: ['status'],
      _count: true,
    });

    const totalEnrollments = await this.prisma.enrollment.count();
    const activeEnrollments = await this.prisma.enrollment.count({
      where: { status: 'ACTIVE' },
    });

    // Revenue statistics
    const revenueStats = await this.prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
      _count: true,
    });

    // Recent activities
    const recentActivities = await this.prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Top courses by enrollment
    const topCourses = await this.prisma.course.findMany({
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return {
      overview: {
        totalUsers,
        activeUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        activeEnrollments,
        totalRevenue: revenueStats._sum.amount || 0,
        totalTransactions: revenueStats._count || 0,
      },
      userStats,
      courseStats,
      enrollmentStats,
      recentActivities,
      topCourses,
    };
  }

  async getInstructorDashboard(instructorId: string) {
    const instructor = await this.prisma.user.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    if (instructor.role !== UserRole.INSTRUCTOR && instructor.role !== UserRole.ADMIN) {
      throw new ForbiddenException('User is not an instructor');
    }

    // Course statistics
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.status === CourseStatus.PUBLISHED).length;

    // Enrollment statistics
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        course: {
          instructorId,
        },
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
      orderBy: { enrolledAt: 'desc' },
      take: 20,
    });

    const totalEnrollments = await this.prisma.enrollment.count({
      where: {
        course: {
          instructorId,
        },
      },
    });

    // Revenue statistics
    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        enrollment: {
          course: {
            instructorId,
          },
        },
      },
      include: {
        enrollment: {
          include: {
            course: true,
          },
        },
      },
    });

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Course ratings
    const courseRatings = courses.map((course) => {
      const ratings = course.reviews.map((review) => review.rating);
      const averageRating =
        ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

      return {
        courseId: course.id,
        courseTitle: course.title,
        totalReviews: course.reviews.length,
        averageRating,
        totalEnrollments: course._count.enrollments,
      };
    });

    // Recent reviews
    const recentReviews = await this.prisma.review.findMany({
      where: {
        course: {
          instructorId,
        },
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
      },
      overview: {
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalRevenue,
        averageRating:
          courseRatings.length > 0
            ? courseRatings.reduce((sum, cr) => sum + cr.averageRating, 0) /
            courseRatings.length
            : 0,
      },
      courses: courseRatings,
      recentEnrollments: enrollments,
      recentReviews,
      payments: payments.slice(0, 10),
    };
  }

  async getInstructorAnalytics(instructorId: string, startDate?: string, endDate?: string) {
    const instructor = await this.prisma.user.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    // Revenue growth over time (Instructor specific)
    const revenueGrowth = await this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE_TRUNC('day', p."paidAt") as date,
        COUNT(*) as transaction_count,
        SUM(p.amount) as daily_revenue
      FROM payments p
      JOIN enrollments e ON p."enrollmentId" = e.id
      JOIN courses c ON e."courseId" = c.id
      WHERE c."instructorId" = '${instructorId}' 
        AND p.status = 'COMPLETED' 
        AND p."paidAt" IS NOT NULL
      ${startDate ? `AND p."paidAt" >= '${new Date(startDate).toISOString()}'` : ''}
      ${endDate ? `AND p."paidAt" <= '${new Date(endDate).toISOString()}'` : ''}
      GROUP BY DATE_TRUNC('day', p."paidAt")
      ORDER BY date
    `);

    // Enrollment growth over time (Instructor specific)
    const enrollmentGrowth = await this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE_TRUNC('day', e."enrolledAt") as date,
        COUNT(*) as count
      FROM enrollments e
      JOIN courses c ON e."courseId" = c.id
      WHERE c."instructorId" = '${instructorId}'
      ${startDate ? `AND e."enrolledAt" >= '${new Date(startDate).toISOString()}'` : ''}
      ${endDate ? `AND e."enrolledAt" <= '${new Date(endDate).toISOString()}'` : ''}
      GROUP BY DATE_TRUNC('day', e."enrolledAt")
      ORDER BY date
    `);

    // Top Performing Courses (Instructor specific)
    const topCourses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const formattedTopCourses = topCourses.map((course) => {
      const ratings = course.reviews.map(r => r.rating);
      const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        title: course.title,
        enrollments: course._count.enrollments,
        rating: avgRating,
        revenue: course.price * course._count.enrollments
      };
    });

    return {
      revenueGrowth,
      enrollmentGrowth,
      topCourses: formattedTopCourses
    };
  }

  async getStudentDashboard(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Enrollment statistics
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: studentId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
            modules: {
              include: {
                lessons: {
                  include: {
                    progress: {
                      where: { userId: studentId },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter((e) => e.status === 'ACTIVE').length;
    const completedEnrollments = enrollments.filter((e) => e.status === 'COMPLETED').length;

    // Progress statistics
    let totalLessons = 0;
    let completedLessons = 0;

    enrollments.forEach((enrollment) => {
      enrollment.course.modules.forEach((module) => {
        totalLessons += module.lessons.length;
        completedLessons += module.lessons.filter(
          (lesson) => lesson.progress.length > 0 && lesson.progress[0].completed,
        ).length;
      });
    });

    const overallProgress =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Recent activity
    const recentActivity = await this.prisma.activityLog.findMany({
      where: { userId: studentId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Upcoming lessons (from active enrollments)
    const upcomingLessons = [];
    for (const enrollment of enrollments.filter((e) => e.status === 'ACTIVE')) {
      for (const module of enrollment.course.modules) {
        for (const lesson of module.lessons) {
          const isCompleted = lesson.progress.length > 0 && lesson.progress[0].completed;
          if (!isCompleted) {
            upcomingLessons.push({
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              courseId: enrollment.course.id,
              courseTitle: enrollment.course.title,
              moduleTitle: module.title,
              type: lesson.type,
              duration: lesson.duration,
            });
            if (upcomingLessons.length >= 10) break;
          }
        }
        if (upcomingLessons.length >= 10) break;
      }
      if (upcomingLessons.length >= 10) break;
    }

    // Recommended courses (based on categories of enrolled courses)
    const enrolledCategories = Array.from(
      new Set(enrollments.map((e) => e.course.category)),
    );

    const recommendedCourses = await this.prisma.course.findMany({
      where: {
        status: CourseStatus.PUBLISHED,
        category: {
          in: enrolledCategories,
        },
        enrollments: {
          none: {
            userId: studentId,
          },
        },
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 5,
    });

    return {
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
      overview: {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalLessons,
        completedLessons,
        overallProgress,
      },
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment.id,
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        progress: this.calculateCourseProgress(enrollment.course.modules),
      })),
      recentActivity,
      upcomingLessons,
      recommendedCourses,
    };
  }

  async getAnalytics(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // User growth over time
    const userGrowth = await this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COUNT(*) as count,
        SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('day', "createdAt")) as cumulative
      FROM users
      ${startDate || endDate ? 'WHERE ' + [
        startDate ? `"createdAt" >= '${new Date(startDate).toISOString()}'` : '',
        endDate ? `"createdAt" <= '${new Date(endDate).toISOString()}'` : ''
      ].filter(Boolean).join(' AND ') : ''}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date
    `);

    // Enrollment growth over time
    const enrollmentGrowth = await this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE_TRUNC('day', "enrolledAt") as date,
        COUNT(*) as count,
        SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('day', "enrolledAt")) as cumulative
      FROM enrollments
      ${startDate || endDate ? 'WHERE ' + [
        startDate ? `"enrolledAt" >= '${new Date(startDate).toISOString()}'` : '',
        endDate ? `"enrolledAt" <= '${new Date(endDate).toISOString()}'` : ''
      ].filter(Boolean).join(' AND ') : ''}
      GROUP BY DATE_TRUNC('day', "enrolledAt")
      ORDER BY date
    `);

    // Revenue growth over time
    const revenueGrowth = await this.prisma.$queryRawUnsafe(`
      SELECT 
        DATE_TRUNC('day', "paidAt") as date,
        COUNT(*) as transaction_count,
        SUM(amount) as daily_revenue,
        SUM(SUM(amount)) OVER (ORDER BY DATE_TRUNC('day', "paidAt")) as cumulative_revenue
      FROM payments
      WHERE status = 'COMPLETED' AND "paidAt" IS NOT NULL
      ${startDate || endDate ? 'AND ' + [
        startDate ? `"paidAt" >= '${new Date(startDate).toISOString()}'` : '',
        endDate ? `"paidAt" <= '${new Date(endDate).toISOString()}'` : ''
      ].filter(Boolean).join(' AND ') : ''}
      GROUP BY DATE_TRUNC('day', "paidAt")
      ORDER BY date
    `);

    // Course performance
    const coursePerformance = await this.prisma.course.findMany({
      include: {
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      take: 20,
    });

    const coursePerformanceData = coursePerformance.map((course) => {
      const ratings = course.reviews.map((review) => review.rating);
      const averageRating =
        ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

      return {
        courseId: course.id,
        courseTitle: course.title,
        category: course.category,
        instructorName: course.instructor.name,
        totalEnrollments: course._count.enrollments,
        totalReviews: course._count.reviews,
        averageRating,
        revenue: course.price * course._count.enrollments,
      };
    });

    return {
      userGrowth,
      enrollmentGrowth,
      revenueGrowth,
      coursePerformance: coursePerformanceData,
    };
  }

  async getRecentActivity() {
    return this.prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  private calculateCourseProgress(modules: any[]) {
    let totalLessons = 0;
    let completedLessons = 0;

    modules.forEach((module) => {
      totalLessons += module.lessons.length;
      completedLessons += module.lessons.filter(
        (lesson: any) => lesson.progress.length > 0 && lesson.progress[0].completed,
      ).length;
    });

    return totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  }
}