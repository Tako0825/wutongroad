import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { PrismaModel } from 'src/common/enum/PrismaModel';
import { NoticeGateway } from './notice.gateway';
import { $Enums, Broadcast, User } from '@prisma/client';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NoticeService {
  constructor(
    private prisma:PrismaService,
    private commonService:CommonService,
    private userService:UserService,
    private noticeGateway:NoticeGateway
  ) {}
  
  // 服务 - 新建通知
  async createNotice(createNoticeDto:CreateNoticeDto) {
    const { type, content, sender_id, recipient_id } = createNoticeDto
    await this.commonService.getEntityByUuid(PrismaModel.user, recipient_id)
    const sender: User =  await this.commonService.getEntityByUuid(PrismaModel.user, sender_id)
    if(type === $Enums.NoticeType.admin && sender.role !== $Enums.NoticeType.admin) {
      throw new HttpException({
        tip: "权限不足, 仅管理员可通过调用接口的方式来新建通知"
      }, HttpStatus.UNAUTHORIZED)
    }
    if(sender_id !== recipient_id) {
      const notice = await this.prisma.notice.create({
        data: {
          type,
          content,
          sender_id,
          recipient_id
        }
      })
      return {
        tip: "成功新建消息通知",
        notice
      }
    }
    return {
      tip: "收件人和寄件人是同一用户, 不另外新建通知"
    }
  }

  // 服务 - 新建广播
  async createBroadcast(createBroadcastDto: CreateBroadcastDto) {
    const { content, sender_id } = createBroadcastDto
    const { role }: User = await this.commonService.getEntityByUuid(PrismaModel.user, sender_id)
    if(role !== $Enums.RoleType.admin) {
      throw new HttpException({
        tip: "权限不足, 仅管理员可通过调用接口的方式来新建广播"
      }, HttpStatus.UNAUTHORIZED)
    }
    const broadcast = await this.prisma.broadcast.create({
      data: {
        content,
        sender_id
      }
    })
    const { userList }  = await this.userService.findAll()
    // 1.为所有用户新建广播状态, 以记录用户各自的已读状态
    userList.forEach(async user => {
      await this.createBroadcastStatus(broadcast, user)
    })
    // 2.将广播实时播报给当前在线用户
    await this.noticeGateway.sendBroadcast(broadcast)
    return {
      tip: "成功新建广播",
      broadcast
    }
  }

  // 新建广播状态
  private async createBroadcastStatus(broadcast: Broadcast, user:User) {
    await this.prisma.broadcastStatus.create({
      data: {
        notice_id: broadcast.uuid,
        recipient_id: user.uuid
      }
    })
  }

  // 服务 - 获取指定用户未读通知数量
  async getUserUnreadCount(user_id: string) {

  }

  // 服务 - 获取指定用户所有通知
  async findUserAll(user_id: string) {

  }

  // 服务 - 清空指定用户所有通知
  async clearUserAll(user_id: string) {

  }
}
