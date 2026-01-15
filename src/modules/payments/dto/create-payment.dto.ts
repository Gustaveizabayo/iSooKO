import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Enrollment ID' })
  @IsString()
  @IsNotEmpty()
  enrollmentId!: string;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ description: 'Payment method (e.g., credit_card, paypal)' })
  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;
}