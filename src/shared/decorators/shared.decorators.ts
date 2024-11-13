import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const AuthUserId = createParamDecorator(
  (decoratorParam: never, ctx: ExecutionContext): User =>
    ctx.switchToHttp().getRequest().user.id,
);
