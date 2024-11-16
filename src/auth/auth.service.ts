import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { isValidHash } from '../shared';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LocalGuard } from './passport-strategies/local/local-guard';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(LocalGuard)
  auth(user: User) {
    const payload = { id: user.id, username: user.username };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userService.findOne({
      select: { id: true, password: true },
      where: { username },
    });
    const isPasswordMatchesHash = await isValidHash(password, user.password);

    if (!user || isPasswordMatchesHash) {
      throw new UnauthorizedException();
    }

    const { password: userPassword, ...result } = user;
    return result;
  }
}
