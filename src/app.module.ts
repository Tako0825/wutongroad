import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from './common/jwt.strategy';
import { WechatApiModule } from './wechat-api/wechat-api.module';
import { QiniuModule } from './qiniu/qiniu.module';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

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
    CategoryModule,
    TopicModule,
    UserModule,
    CommonModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
