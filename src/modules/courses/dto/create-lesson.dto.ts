import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { LessonType } from '../../../common/types/enums';

export class CreateLessonDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    content?: string;

    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
    videoUrl?: string;

    @ApiProperty({ enum: LessonType })
    @IsEnum(LessonType)
    type!: LessonType;

    @ApiProperty()
    @IsNumber()
    duration!: number;
}
