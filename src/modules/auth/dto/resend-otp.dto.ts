import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}