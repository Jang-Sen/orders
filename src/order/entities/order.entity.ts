import { Column, Entity } from 'typeorm';
import { Base } from '../../common/entities/base.entity';

@Entity()
export class Order extends Base {
  @Column()
  bookId: string;

  @Column()
  customerId: string;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;
}
