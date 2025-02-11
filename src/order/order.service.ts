import { Injectable } from '@nestjs/common';
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
  async createOrder(createOrderDto: CreateOrderDto) {
    // const { bookId, customerId, quentity, totalPrice } = createOrderDto;
    // const order = createOrderDto.id
    //   ? await this.repository.create({
    //       id: createOrderDto.id,
    //       bookId,
    //       customerId,
    //       quentity,
    //       totalPrice,
    //     })
    //   : await this.repository.create({
    //       bookId,
    //       customerId,
    //       quentity,
    //       totalPrice,
    //     });
    //
    // await this.repository.save(order);
    //
    // return order;
  }
}
