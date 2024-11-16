import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class PatchUserDto extends PartialType(
  PickType(User, ['username', 'about', 'avatar', 'email', 'password'] as const),
) {}
