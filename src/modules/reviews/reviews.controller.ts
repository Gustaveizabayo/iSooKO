import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Reviews & Likes')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Rate and review a course' })
    @ApiResponse({ status: 201, description: 'Review created successfully' })
    @ApiResponse({ status: 403, description: 'Must be enrolled to review' })
    async createReview(@Req() req: any, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.createReview(req.user.userId, createReviewDto);
    }

    @Get('course/:courseId')
    @ApiOperation({ summary: 'Get all reviews for a course' })
    @ApiResponse({ status: 200, description: 'List of course reviews' })
    async getCourseReviews(@Param('courseId') courseId: string) {
        return this.reviewsService.getCourseReviews(courseId);
    }

    @Post('like/:courseId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toggle like status for a course' })
    @ApiResponse({ status: 200, description: 'Like toggled' })
    async toggleLike(@Req() req: any, @Param('courseId') courseId: string) {
        return this.reviewsService.toggleLike(req.user.userId, courseId);
    }

    @Get('stats/:courseId')
    @ApiOperation({ summary: 'Get average rating and likes count for a course' })
    @ApiResponse({ status: 200, description: 'Course statistics' })
    async getCourseStats(@Param('courseId') courseId: string) {
        return this.reviewsService.getCourseStats(courseId);
    }
}
