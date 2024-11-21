import { Column, Entity, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ALLOWED_URL_PROTOCOLS, BaseEntityWithIdAndDates } from '../../shared';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import {
  MAX_USER_ABOUT_LENGTH,
  MAX_USER_USERNAME_LENGTH,
  MIN_USER_ABOUT_LENGTH,
  MIN_USER_USERNAME_LENGTH,
  USER_ABOUT_DEFAULT,
  USER_AVATAR_DEFAULT,
} from './constants/user-entity.constants';

@Entity()
export class User extends BaseEntityWithIdAndDates {
  @Length(MIN_USER_USERNAME_LENGTH, MAX_USER_USERNAME_LENGTH)
  @Column({ length: MAX_USER_USERNAME_LENGTH, unique: true })
  username: string;

  @IsOptional()
  @Length(MIN_USER_ABOUT_LENGTH, MAX_USER_ABOUT_LENGTH)
  @Column({
    default: USER_ABOUT_DEFAULT,
    length: MAX_USER_ABOUT_LENGTH,
  })
  about: string;

  @IsOptional()
  @IsUrl({ protocols: ALLOWED_URL_PROTOCOLS })
  @Column({
    default: USER_AVATAR_DEFAULT,
  })
  avatar: string;

  @Column({
    unique: true,
    select: false,
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Column({ select: false })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
