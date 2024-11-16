import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signin')
  async signIn(@Body() user: SignInDto) {
    return this.authService.auth(user as User);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: SignUpDto) {
    const user = await this.userService.create(createUserDto);
    return this.authService.auth(user);
  }
}
