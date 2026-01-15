import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateModuleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title!: string;
}
