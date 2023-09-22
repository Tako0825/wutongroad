import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Validation } from 'src/common/validation';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateAdminNoticeDto } from './dto/create-admin-notice.dto';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 接口 - 新建通知
  @Post()
  @UsePipes(Validation)
  create(@Body() createNoticeDto:CreateNoticeDto) {
    return this.noticeService.create(createNoticeDto)
  }

  // 接口 - 新建管理员通知 (仅限管理员使用)
  @Post("admin")
  @UsePipes(Validation)
  createAdminNotice(@Body() createAdminNoticeDto: CreateAdminNoticeDto) {
    return this.noticeService.createAdminNotice(createAdminNoticeDto)
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
