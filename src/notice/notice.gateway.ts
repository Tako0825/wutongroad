import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/common/prisma/prisma.service';

@WebSocketGateway(3001, {
  namespace: "notice",
  cors: {
    origin: "*"
  }
})
export class NoticeGateway {
  constructor(
    private prisma:PrismaService,
  ) {}
  
  @SubscribeMessage('getAll')
  async handleMessage(@MessageBody() data:any, socket: Socket) {
    const { recipient_id } = data
    const noticeList = await this.prisma.notice.findMany({
      where: {
        recipient_id
      }
    })
    return {
      event: "getAll",
      data: noticeList
    }
  }
}
