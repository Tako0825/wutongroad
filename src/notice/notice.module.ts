import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { NoticeGateway } from './notice.gateway';

@Module({
  controllers: [NoticeController],
  providers: [NoticeService, NoticeGateway],
  exports: [NoticeService]
})
export class NoticeModule {}
