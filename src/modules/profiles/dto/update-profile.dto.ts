import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class UpdateProfileDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    bio?: string;

    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
    profileImageUrl?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    language?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    experience?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    qualifications?: string;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}
