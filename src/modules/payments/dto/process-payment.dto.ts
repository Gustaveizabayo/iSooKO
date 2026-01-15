import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Payment ID' })
  @IsString()
  @IsNotEmpty()
  paymentId!: string;

  @ApiProperty({ description: 'Transaction ID from payment gateway' })
  @IsString()
  @IsNotEmpty()
  transactionId!: string;
}