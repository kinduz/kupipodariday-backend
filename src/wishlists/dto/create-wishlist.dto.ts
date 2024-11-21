import { PickType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';
import { ArrayMaxSize, IsArray } from 'class-validator';

export class CreateWishlistDto extends PickType(Wishlist, [
  'name',
  'image',
] as const) {
  @IsArray()
  @ArrayMaxSize(10)
  itemsId: string[];
}
