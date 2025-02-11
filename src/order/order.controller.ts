import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';

const GET_CUSTOMER = 'get_customer';
const GET_BOOK = 'get_book';
const IS_BOOK_IN_STOCK = 'is_book_in_stock';
const DECREASE_STOCK = 'decrease_stock';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('BOOK_SERVICE')
    private readonly bookClient: ClientProxy,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
  ) {}

  // 등록
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const { bookId, customerId, quantity } = createOrderDto;
    let customer, book;
    try {
      customer = await this.customerClient
        .send(GET_CUSTOMER, {
          customerId,
        })
        .toPromise();

      book = await this.bookClient
        .send(GET_BOOK, {
          bookId,
        })
        .toPromise();
    } catch (err) {
      throw new ServiceUnavailableException(
        'service Unavailable, please try again later',
      );
    }

    if (!customer) {
      throw new NotFoundException('customer not found');
    }

    if (!book) {
      throw new NotFoundException('book not found');
    }

    const isBookInStock = await this.bookClient
      .send('IS_BOOK_IN_STOCK', {
        bookId,
        quantity,
      })
      .toPromise();

    if (!isBookInStock) {
      throw new BadRequestException('not enough books in stock');
    }

    // const order = await this.orderService;
  }
}
