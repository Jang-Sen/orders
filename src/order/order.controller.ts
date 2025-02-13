import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Inject,
  NotFoundException,
  Param,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import axios from 'axios';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

const GET_CUSTOMER = 'get_customer';
const GET_BOOK = 'get_book';
const IS_BOOK_IN_STOCK = 'is_book_in_stock';
const DECREASE_STOCK = 'decrease_stock';

@ApiTags('Order')
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
  @ApiOperation({ summary: '주문 받기' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const { bookId, customerId, quantity } = createOrderDto;
    let customer, book;
    try {
      // 고객의 정보를 받음
      customer = await this.customerClient
        .send(GET_CUSTOMER, {
          customerId,
        })
        .toPromise();

      // console.log('customer +++++++++++++++ ' + JSON.stringify(customer));

      // 책의 정보를 받음
      book = await this.bookClient
        .send(GET_BOOK, {
          bookId,
        })
        .toPromise();
      // console.log('book +++++++++++++++++++++++' + JSON.stringify(book));
    } catch (err) {
      console.log(err);
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

    // 주문을 받았을 경우, 책의 수량 감소
    const isBookInStock = await this.bookClient
      .send(IS_BOOK_IN_STOCK, {
        bookId,
        quantity,
      })
      .toPromise();

    if (!isBookInStock) {
      throw new BadRequestException('not enough books in stock');
    }
    const order = await this.orderService.createOrder(createOrderDto);

    return order;
  }

  @Delete('/:id')
  @ApiOperation({ summary: '주문 취소' })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    const order = await this.orderService.getOrderById(id);

    const { bookId, quantity } = order;

    console.log(order);

    // 삭제
    await this.orderService.deleteOrder(order.id);

    try {
      const { data, status } = await axios.patch(
        `http://localhost:3002/${bookId}`,
        { quantity },
      );

      console.log(data);

      console.log(status);
    } catch (err) {
      console.log(err.message);
    }
    // const { bookId, customerId, quantity } = dto;
    // let book, customer;
    //
    // try {
    //   // 주문 취소 할 고객의 정보를 받아옴.
    //   customer = await this.customerClient
    //     .send(GET_CUSTOMER, {
    //       customerId,
    //     })
    //     .toPromise();
    //
    //   // 주문 취소 할 책의 정보를 받아옴.
    //   book = await this.bookClient
    //     .send(GET_BOOK, {
    //       bookId,
    //     })
    //     .toPromise();
    // } catch (err) {
    //   console.log(err);
    //
    //   throw new ServiceUnavailableException(
    //     'service Unavailable, please try again later',
    //   );
    // }
    //
    // if (!customer) {
    //   throw new NotFoundException('customer not found');
    // }
    //
    // if (!book) {
    //   throw new NotFoundException('book not found');
    // }
    //
    // // 1. 주문 취소 들어감
    // const decreaseStock = await this.bookClient
    //   .send(DECREASE_STOCK, {
    //     bookId,
    //     quantity,
    //   })
    //   .toPromise();
    // 2. 원래 갯수와 quantity가 +가 되야함.
  }
}
