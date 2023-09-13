import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenModule } from 'src/auth/access-token/access-token.module';

@Module({
  imports: [AccessTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
