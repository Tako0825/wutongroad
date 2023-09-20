import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class WsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(({ event, data }) => {
      console.log(event);
      console.log(data);
      
      return {
        event,
        data: {
          type: "success",
          data
        }
      }
    }));
  }
}
