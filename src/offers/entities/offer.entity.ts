import { BaseEntityWithIdAndDates, DECIMAL_TYPE_PARAMS } from '../../shared';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, IsOptional, Min } from 'class-validator';

@Entity()
export class Offer extends BaseEntityWithIdAndDates {
  @ManyToOne(() => User, (user) => user.wishes)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, {
    onDelete: 'CASCADE',
  })
  item: Wish;

  @Min(0.01)
  @Column('decimal', DECIMAL_TYPE_PARAMS)
  amount: number;

  @IsOptional()
  @IsBoolean()
  @Column({ default: false })
  hidden: boolean;
}
