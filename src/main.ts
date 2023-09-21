import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpFilter } from './common/http.filter';
import { WsAdapter } from "@nestjs/platform-ws"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 跨域 - CORS
  app.enableCors({
    origin: "*"
  })

  // 适配器 - ws库
  app.useWebSocketAdapter(new WsAdapter(app));

  // 请求前缀 - api
  app.setGlobalPrefix("api")

  // 响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor())

  // 异常过滤器
  app.useGlobalFilters(new HttpFilter())

  // 监听端口 - 3000
  await app.listen(3000);
}
bootstrap();
