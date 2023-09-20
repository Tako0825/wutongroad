import { UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CommonService } from 'src/common/common.service';
import { PrismaModel } from 'src/common/enum/PrismaModel';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { WsFilter } from 'src/common/ws.filter';

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
  
  @UseFilters(new WsFilter())
  // @UseGuards(AuthGuard("jwt"))
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
