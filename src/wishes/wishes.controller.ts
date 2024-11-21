import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser, AuthUserId } from '../shared';
import { JwtGuard } from '../auth/passport-strategies/jwt/jwt-guard';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto, @AuthUserId() userId: string) {
    return this.wishesService.create(createWishDto, userId);
  }

  @Get('last')
  getLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  getTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  getWish(@Param('id') id: string) {
    return this.wishesService.findOne({
      relations: {
        owner: true,
        offers: true,
      },
      where: { id },
    });
  }

  @Patch(':id')
  patchWish(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne(id, updateWishDto);
  }

  @Delete(':id')
  deleteWish(@Param('id') id: string) {
    return this.wishesService.removeOne(id);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.copyOne(id, user);
  }
}
