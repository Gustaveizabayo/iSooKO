import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { CourseStatus } from '../../../common/types/enums';

export class CreateCourseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description!: string;

    @ApiProperty()
    @IsNumber()
    price!: number;

    @ApiProperty()
    @IsNumber()
    duration!: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    instructorId!: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    thumbnailUrl?: string;

    @ApiProperty({ enum: CourseStatus, required: false })
    @IsEnum(CourseStatus)
    @IsOptional()
    status?: CourseStatus;
}
