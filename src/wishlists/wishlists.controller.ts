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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthUser, AuthUserId } from '../shared';
import { JwtGuard } from '../auth/passport-strategies/jwt/jwt-guard';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@AuthUser() user: User, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(user, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  update(
    @AuthUserId() userId: string,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOne(userId, id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUserId() userId: string) {
    return this.wishlistsService.removeOne(id, userId);
  }
}
