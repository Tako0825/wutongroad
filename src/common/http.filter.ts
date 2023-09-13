import { ArgumentsHost, Catch, ExceptionFilter,HttpException } from '@nestjs/common';
import { Request, Response } from 'express'

@Catch()
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = exception.getStatus()

    // 401 - token
    if(status == 401){
      response.status(status).json({
        code: status,
        message: exception.message,
        data: {
          tip: "无效的身份验证令牌"
        }
     })
    } 

    // 422 - Http Exception
    else if(status == 422) {
      response.status(status).json({
        code: status,
        message: exception.message,
        data: {
          tip: "数据验证失败",
          ...exception.getResponse() as object
        }
      })
    }

    // 出口
    else {
      response.status(404).json({
        code: 404,
        message: exception?.message,
        data: {
          tip: "发现异常"
        }
      })
    }
  }
}
