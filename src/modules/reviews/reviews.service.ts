import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async createReview(userId: string, createReviewDto: CreateReviewDto) {
        const { courseId, rating, comment } = createReviewDto;

        // Check if course exists
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) throw new NotFoundException('Course not found');

        // Check if user is enrolled
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { courseId_userId: { courseId, userId } },
        });
        if (!enrollment) throw new ForbiddenException('You must be enrolled to leave a review');

        // Check if already reviewed (Prisma schema @@unique handles this but we can check early)
        const existingReview = await this.prisma.review.findUnique({
            where: { courseId_userId: { courseId, userId } },
        });
        if (existingReview) throw new ConflictException('You have already reviewed this course');

        return this.prisma.review.create({
            data: {
                courseId,
                userId,
                rating,
                comment,
            },
        });
    }

    async getCourseReviews(courseId: string) {
        return this.prisma.review.findMany({
            where: { courseId, reviewStatus: 'APPROVED' }, // Filter by approved if moderation is needed
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async toggleLike(userId: string, courseId: string) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) throw new NotFoundException('Course not found');

        const existingLike = await this.prisma.like.findUnique({
            where: { courseId_userId: { courseId, userId } },
        });

        if (existingLike) {
            await this.prisma.like.delete({
                where: { id: existingLike.id },
            });
            return { liked: false };
        } else {
            await this.prisma.like.create({
                data: { courseId, userId },
            });
            return { liked: true };
        }
    }

    async getCourseStats(courseId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { courseId },
            select: { rating: true },
        });

        const likesCount = await this.prisma.like.count({
            where: { courseId },
        });

        const averageRating = reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;

        return {
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalReviews: reviews.length,
            totalLikes: likesCount,
        };
    }
}
