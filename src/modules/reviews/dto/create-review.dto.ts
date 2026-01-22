import { IsString, IsInt, Min, Max, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({ example: 'clv123...', description: 'ID of the course' })
    @IsString()
    @IsNotEmpty()
    courseId!: string;

    @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
    @IsInt()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    rating!: number;

    @ApiProperty({ example: 'Great course!', description: 'Comment (optional)' })
    @IsString()
    @IsOptional()
    comment?: string;
}
