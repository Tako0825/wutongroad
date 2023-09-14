import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from './common/jwt.strategy';
import { WechatApiModule } from './wechat-api/wechat-api.module';
import { QiniuModule } from './qiniu/qiniu.module';

@Module({
  imports: [
    // 异步注册 - JWT
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        return {
          secret: process.env.SECRET_OR_KEY,
          signOptions: { expiresIn:'300d' },
        }
      }
    }),
    AuthModule,
    PrismaModule,
    WechatApiModule,
    QiniuModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
