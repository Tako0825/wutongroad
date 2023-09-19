import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { WechatApiModule } from './wechat-api/wechat-api.module';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [WechatApiModule, PrismaModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
