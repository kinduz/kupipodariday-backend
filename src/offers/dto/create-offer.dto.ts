import { PickType } from '@nestjs/mapped-types';
import { Offer } from '../entities/offer.entity';
import { IsString } from 'class-validator';

export class CreateOfferDto extends PickType(Offer, [
  'amount',
  'hidden',
] as const) {
  @IsString()
  itemId: string;
}
