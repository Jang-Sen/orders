import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsString()
  id: string;

  @IsString()
  @ApiProperty({
    example: '',
    description: '책 ID',
  })
  bookId: string;

  @IsString()
  @ApiProperty({
    example: '',
    description: '고객 ID',
  })
  customerId: string;

  @IsNumber()
  @ApiProperty({
    example: 2,
    description: '주문 수량',
  })
  quantity: number;

  @IsNumber()
  @ApiProperty({
    example: 40000,
    description: '주문 총 가격',
  })
  totalPrice: number;
}
