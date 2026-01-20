import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export enum AdminAction {
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
    SUSPEND = 'SUSPEND',
}

export class AdminActionDto {
    @ApiProperty({ enum: AdminAction })
    @IsEnum(AdminAction)
    action!: AdminAction;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    reason?: string;
}
