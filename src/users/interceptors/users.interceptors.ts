import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
export class RemoveUserPasswordInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Omit<User, 'password' | 'email'>> {
    return next.handle().pipe(
      map((userData) => {
        if (userData && 'password' in userData) {
          const { password, ...user } = userData;
          return user;
        }
        return userData;
      }),
    );
  }
}
