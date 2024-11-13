import {
  BaseEntityWithIdAndDates,
  DECIMAL_TYPE_PARAMETRES,
} from '../../shared';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends BaseEntityWithIdAndDates {
  @ManyToOne(() => User, (user) => user.wishes)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, {
    onDelete: 'CASCADE',
  })
  item: Wish;

  @Column('decimal', DECIMAL_TYPE_PARAMETRES)
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
