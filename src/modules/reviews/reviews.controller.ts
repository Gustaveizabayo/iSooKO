import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Reviews & Likes')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Rate and review a course' })
    async createReview(@Req() req: any, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.createReview(req.user.userId, createReviewDto);
    }

    @Get('course/:courseId')
    @ApiOperation({ summary: 'Get all reviews for a course' })
    async getCourseReviews(@Param('courseId') courseId: string) {
        return this.reviewsService.getCourseReviews(courseId);
    }

    @Post('like/:courseId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Toggle like status for a course' })
    async toggleLike(@Req() req: any, @Param('courseId') courseId: string) {
        return this.reviewsService.toggleLike(req.user.userId, courseId);
    }

    @Get('stats/:courseId')
    @ApiOperation({ summary: 'Get average rating and likes count for a course' })
    async getCourseStats(@Param('courseId') courseId: string) {
        return this.reviewsService.getCourseStats(courseId);
    }
}
