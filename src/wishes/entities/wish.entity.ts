import {
  ALLOWED_URL_PROTOCOLS,
  BaseEntityWithIdAndDates,
  DECIMAL_TYPE_PARAMETRES,
  MIN_LENGTH_ONE_SYMBOL,
} from '../../shared';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
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

  @Column('decimal', DECIMAL_TYPE_PARAMETRES)
  price: number;

  @Column('decimal', DECIMAL_TYPE_PARAMETRES)
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

  @Column('int', { default: 0 })
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  lists: Wishlist[];
}
