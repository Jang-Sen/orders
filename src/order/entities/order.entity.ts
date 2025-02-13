import { Column, Entity } from 'typeorm';
import { Base } from '../../common/entities/base.entity';

@Entity()
export class Order extends Base {
  @Column()
  public bookId: string;

  @Column()
  public customerId: string;

  @Column()
  public quantity: number;

  @Column()
  public totalPrice: number;
}
