import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  Patch,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthUserId } from '../shared';
import { FindUsersDto } from './dto/find-users.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { JwtGuard } from '../auth/passport-strategies/jwt/jwt-guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findMe(@AuthUserId() id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  patchMe(@AuthUserId() id: string, @Body() patchUserDto: PatchUserDto) {
    return this.usersService.updateOne(id, patchUserDto);
  }

  @Get('me/wishes')
  getMyWishes(@AuthUserId() userId: string) {
    return this.usersService.getWishes('user.id = :userId', { userId });
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.getWishes('user.username = :username', {
      username,
    });
  }

  @Post('find')
  findMany(@Body() { query }: FindUsersDto) {
    return this.usersService.findMany(query);
  }
}
