import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SystemNoticeDto } from './dto/system-notice.dto';
import { NoticeType } from '@prisma/client';
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
    return new HttpException({
      tip: "成功新建消息通知",
      notice
    },HttpStatus.OK)
  }

  // 服务 - 新建系统通知
  async createSystemNotice(systemNoticeDto:SystemNoticeDto) {
    const { recipient_id, content } = systemNoticeDto
    await this.commonService.getEntityByUuid(PrismaModel.user, recipient_id)
    const notice = await this.prisma.notice.create({
      data: {
        type: NoticeType.system,
        content,
        recipient_id
      }
    })
    return new HttpException({
      tip: "成功新建系统通知",
      notice
    },HttpStatus.OK)
  }

  // 服务 - 获取指定通知
  async findOne(uuid: string) {
    const notice =  await this.commonService.getEntityByUuid(PrismaModel.notice, uuid)
    return new HttpException({
      tip: "成功获取指定通知",
      notice
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定用户所有通知
  async findUserAll(user_id: string) {
    await this.commonService.getEntityByUuid(PrismaModel.user, user_id)
    const noticeList = await this.prisma.notice.findMany({
      where: {
        recipient_id: user_id
      }
    })
    return noticeList
  }

  // 服务 - 删除通知
  async delete(uuid: string) {
    
  }
}
