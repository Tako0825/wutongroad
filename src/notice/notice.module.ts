import { Global, Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { NoticeGateway } from './notice.gateway';

@Global()
@Module({
  controllers: [NoticeController],
  providers: [NoticeService, NoticeGateway],
  exports: [NoticeService, NoticeGateway]
})
export class NoticeModule {}
