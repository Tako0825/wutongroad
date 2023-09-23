import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Validation } from 'src/common/validation';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 接口 - 新建通知 (仅在管理员发送私人通知时作为接口调用, 通常在服务器内部使用)
  @Post()
  @UsePipes(Validation)
  createNotice(@Body() createNoticeDto:CreateNoticeDto) {
    return this.noticeService.createNotice(createNoticeDto)
  }

  // 接口 - 新建广播
  @Post("broadcast")
  @UsePipes(Validation)
  createBroadcast(@Body() createBroadcastDto:CreateBroadcastDto) {
    return this.noticeService.createBroadcast(createBroadcastDto)
  }

  // 接口 - 获取指定用户未读通知数量
  @Get("/user/:uuid/unread/count")
  getUserUnreadCount(@Param("uuid") user_id:string) {
    return this.noticeService.getUserUnreadCount(user_id)
  }

  // 接口 - 获取指定用户所有通知
  @Get("/user/:uuid")
  findUserNotice(@Param("uuid") user_id:string) {
    return this.noticeService.findUserAll(user_id)
  }

  // 接口 - 清空指定用户所有通知
  @Delete("/user/:uuid")
  clearUserAll(@Param("uuid") user_id:string) {
    return this.noticeService.clearUserAll(user_id)
  }
}
