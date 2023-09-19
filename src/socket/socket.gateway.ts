import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { NoticeService } from 'src/notice/notice.service';

@WebSocketGateway()
export class SocketGateway {
  constructor(
    private noticeService:NoticeService
  ) {}

  // 获取所有通知 - 启动小程序时执行 socket.emit("notice", data)
  @SubscribeMessage('notice')
  async handleMessage(@MessageBody() data: any) {
    const noticeList = await this.noticeService.findUserAll(data.uuid)
    return {
      event: "notice",
      data: noticeList
    };
  }
}
