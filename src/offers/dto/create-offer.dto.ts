import { PickType } from '@nestjs/mapped-types';
import { Offer } from '../entities/offer.entity';
import { IsString, Min } from 'class-validator';

export class CreateOfferDto extends PickType(Offer, [
  'amount',
  'hidden',
] as const) {
  @IsString()
  @Min(0)
  itemId: string;
}
