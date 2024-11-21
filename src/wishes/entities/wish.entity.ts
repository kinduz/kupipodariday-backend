import {
  ALLOWED_URL_PROTOCOLS,
  BaseEntityWithIdAndDates,
  DECIMAL_TYPE_PARAMS,
  MIN_LENGTH_ONE_SYMBOL,
} from '../../shared';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length, Min } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import {
  MAX_WISH_DESCRIPTION_LENGTH,
  MAX_WISH_NAME_LENGTH,
} from './constants/wish-entity.constants';

@Entity()
export class Wish extends BaseEntityWithIdAndDates {
  @Length(MIN_LENGTH_ONE_SYMBOL, MAX_WISH_NAME_LENGTH)
  @Column({ length: MAX_WISH_NAME_LENGTH })
  name: string;

  @Column()
  @IsUrl({ protocols: ALLOWED_URL_PROTOCOLS })
  link: string;

  @Column()
  @IsUrl({ protocols: ALLOWED_URL_PROTOCOLS })
  image: string;

  @Min(0)
  @Column('decimal', DECIMAL_TYPE_PARAMS)
  price: number;

  @Min(0)
  @Column('decimal', {
    default: 0,
    precision: DECIMAL_TYPE_PARAMS['precision'],
    scale: DECIMAL_TYPE_PARAMS['scale'],
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @Length(MIN_LENGTH_ONE_SYMBOL, MAX_WISH_DESCRIPTION_LENGTH)
  @Column({ length: MAX_WISH_DESCRIPTION_LENGTH })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Min(0)
  @Column('int', { default: 0 })
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
