import { Global, Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { NoticeModule } from 'src/notice/notice.module';
import { NoticeService } from 'src/notice/notice.service';

@Global()
@Module({
  imports: [NoticeModule],
  providers: [EventsGateway, NoticeService]
})
export class EventsModule {}
