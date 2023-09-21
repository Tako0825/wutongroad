import { HttpException, HttpStatus, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CommonService } from 'src/common/common.service';
import { PrismaModel } from 'src/common/enum/PrismaModel';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { WsFilter } from 'src/common/ws.filter';
import { WsInterceptor } from 'src/common/ws.interceptor';
import { GetAllDto } from './dto/get-all.dto';
import { SetReadDto } from './dto/set-read.dto';
import { WsValidation } from 'src/common/ws.validation';
import { Notice } from '@prisma/client';

@UseInterceptors(new WsInterceptor())
@UsePipes(WsValidation)
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
  
  // 订阅 - 当前用户所有通知
  @SubscribeMessage('get-all-notice')
  async getAllNotice(@MessageBody() { recipient_id }:GetAllDto, socket: Socket) {
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
      event: "get-all-notice",
      data: {
        noticeList,
        tip: "当前用户所有通知"
      }
    }
  }

  // 订阅 - 当前用户未读通知的数量
  @SubscribeMessage('get-unread-count')
  async getUnreadCount(socket: Socket) {
    const count = await this.prisma.notice.count({
      where: {
        is_read: false
      } 
    })
    return {
      event: "get-unread-count",
      data: {
        count,
        tip: "当前未读通知的数量"
      }
    }
  }

  // 订阅 - 将当前通知标记为已读
  @SubscribeMessage("set-read")
  async setRead(@MessageBody() { uuid }: SetReadDto) {
    try {
      await this.commonService.updateRowByUuid(PrismaModel.notice, uuid, {
        is_read: true
      })
    } catch(error) {
      throw new WsException(error)
    }
    return {
      event: "set-read",
      data: {
        tip: "将当前通知标记为已读"
      }
    }
  }

  // 订阅- 将所有通知标记为已读
  @SubscribeMessage("set-all-read")
  async setAllRead(@MessageBody() { recipient_id }:GetAllDto) {
    try {
      await this.commonService.getEntityByUuid(PrismaModel.user, recipient_id)
      await this.prisma.notice.updateMany({
        where: {
          recipient_id
        },
        data: {
          is_read: true
        }
      })
    } catch(error) {
      throw new WsException(error)
    } 
    return {
      event: "set-all-read",
      data: {
        tip: "将所有通知标记为已读"
      }
    }
  }

}
