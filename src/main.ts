import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 请求前缀 - api
  app.setGlobalPrefix("api")

  // 响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor())

  // 监听端口 - 3000
  await app.listen(3000);
}
bootstrap();
