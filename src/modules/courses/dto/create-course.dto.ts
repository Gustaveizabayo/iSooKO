import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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
}
