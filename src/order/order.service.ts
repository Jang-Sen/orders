import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  // 등록
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { bookId, customerId, quantity, totalPrice } = createOrderDto;
    const order = createOrderDto.id
      ? this.repository.create({
          id: createOrderDto.id,
          bookId,
          customerId,
          quantity,
          totalPrice,
        })
      : this.repository.create({
          bookId,
          customerId,
          quantity,
          totalPrice,
        });

    await this.repository.save(order);

    return order;
  }

  // 조회
  async getOrderById(id: string): Promise<Order> {
    const order = await this.repository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException('Not Found Order');
    }

    return order;
  }

  // 삭제
  async deleteOrder(id: string): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException('Not Found Order');
    }

    return true;
  }
}
