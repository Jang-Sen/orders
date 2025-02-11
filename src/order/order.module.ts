import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: 'BOOK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://yytralag:zE6Ujbm5XE2yTjui7OjqXOiCJ0pP_r_i@fuji.lmq.cloudamqp.com/yytralag',
          ],
          queue: 'book_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'CUSTOMER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://yytralag:zE6Ujbm5XE2yTjui7OjqXOiCJ0pP_r_i@fuji.lmq.cloudamqp.com/yytralag',
          ],
          queue: 'customer_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://yytralag:zE6Ujbm5XE2yTjui7OjqXOiCJ0pP_r_i@fuji.lmq.cloudamqp.com/yytralag',
          ],
          queue: 'order_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [ClientsModule],
})
export class OrderModule {}
