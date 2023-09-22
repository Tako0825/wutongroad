import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { PrismaModel } from 'src/common/enum/PrismaModel';

@Injectable()
export class NoticeService {
  constructor(
    private prisma:PrismaService,
    private commonService:CommonService
  ) {}
  
  // 服务 - 新建消息通知
  async create(createNoticeDto:CreateNoticeDto) {
    const { recipient_id, sender_id, content, type } = createNoticeDto
    const recipient = await this.commonService.getEntityByUuid(PrismaModel.user, recipient_id)
    const sender = await this.commonService.getEntityByUuid(PrismaModel.user, sender_id)
    if(recipient.uuid === sender.uuid) {
      throw new HttpException({
        tip: "寄件人和收件人不允许是同一用户"
      }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const notice = await this.prisma.notice.create({
      data: {
        type,
        content,
        recipient_id,
        sender_id
      }
    })
    return {
      tip: "成功新建消息通知",
      notice
    }
  }

  // 接口 - 获取指定用户未读通知数量
  async getUserUnreadCount(user_id: string) {
    await this.commonService.getEntityByUuid(PrismaModel.user, user_id)
    const count = await this.prisma.notice.count({
      where: {
        recipient_id: user_id,
        is_read: false
      }
    })
    return {
      tip: "成功获取未读通知数量",
      count
    }
  }

  // 服务 - 获取指定用户所有通知
  async findUserAll(user_id: string) {
    await this.commonService.getEntityByUuid(PrismaModel.user, user_id)
    const noticeList = await this.prisma.notice.findMany({
      where: {
        recipient_id: user_id
      }
    })
    return {
      tip: "成功获取所有通知",
      noticeList
    }
  }

  // 服务 - 清空指定用户所有通知
  async clearUserAll(user_id: string) {
    await this.commonService.getEntityByUuid(PrismaModel.user, user_id)
    await this.prisma.notice.deleteMany({
      where: {
        recipient_id: user_id
      }
    })
    return {
      tip: "成功删除所有通知"
    }
  }
}
