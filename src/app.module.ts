import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from './common/jwt.strategy';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    // 异步注册 - JWT
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        return {
          secret: "wutongroad",
          signOptions: { expiresIn:'300d' },
        }
      }
    }),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
