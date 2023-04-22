import { UserDto } from '@/users/dto/user.dto';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // run something before a request is handled by the request handler
    return next.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        return plainToInstance(UserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
