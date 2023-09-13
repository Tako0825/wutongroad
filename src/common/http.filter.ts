import { ArgumentsHost, Catch, ExceptionFilter,HttpException } from '@nestjs/common';
import { Request, Response } from 'express'
import { HttpStatusCode } from 'src/enum/HttpStatusCode';

@Catch()
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = exception.getStatus?exception.getStatus():500

    // 1.根据状态码 status 从枚举类型 HttpStatusCode 中获取对应的提示信息 tip
    // 2.如果异常抛出时需要返回数据，请使用 meta 属性来表示数据信息
    response.status(status).json({
      code: status,
      message: exception.message,
      data: {
        tip: HttpStatusCode[status],
        meta: (exception.getResponse() as any).meta
      }
    })
  }
}
