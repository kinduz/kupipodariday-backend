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

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Patch(':id')
  patchWish(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne(id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWish(@Param('id') id: string) {
    return this.wishesService.removeOne(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.copyOne(id, user);
  }
}
