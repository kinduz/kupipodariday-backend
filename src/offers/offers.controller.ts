import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUserId } from '../shared';
import { User } from '../users/entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @AuthUserId() userId: User) {
    return this.offersService.create(createOfferDto, userId);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUserId() userId: string) {
    return this.offersService.findOne(id, userId);
  }
}
