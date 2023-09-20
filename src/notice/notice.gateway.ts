import { UseFilters, UseInterceptors } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CommonService } from 'src/common/common.service';
import { PrismaModel } from 'src/common/enum/PrismaModel';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { WsFilter } from 'src/common/ws.filter';
import { WsInterceptor } from 'src/common/ws.interceptor';

@UseInterceptors(new WsInterceptor())
@UseFilters(new WsFilter())
@WebSocketGateway(3001, {
  namespace: "notice",
  cors: {
    origin: "*"
  }
})
export class NoticeGateway {
  constructor(
    private prisma:PrismaService,
    private commonService:CommonService
  ) {}
  
  @SubscribeMessage('getAll')
  async handleMessage(@MessageBody() data:any, socket: Socket) {
    const { recipient_id } = data
    try {
      await this.commonService.getEntityByUuid(PrismaModel.user, recipient_id)
    } catch(error) {
      throw new WsException(error)
    }
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
