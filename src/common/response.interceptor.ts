import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { HttpStatusCode } from 'src/enum/HttpStatusCode';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(response => {
      // 响应拦截器
      return {
        code: response.status,
        message: HttpStatusCode[response.status],
        data: response.response
      }
    }))
  }
}
