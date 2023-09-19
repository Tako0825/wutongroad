import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { NoticeModule } from 'src/notice/notice.module';
import { NoticeService } from 'src/notice/notice.service';

@Module({
  imports: [NoticeModule],
  providers: [SocketGateway, NoticeService]
})
export class SocketModule {}
