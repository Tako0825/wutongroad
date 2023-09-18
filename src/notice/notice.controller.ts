import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Validation } from 'src/common/validation';
import { SystemNoticeDto } from './dto/system-notice.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 接口 - 新建消息通知
  @Post()
  @UsePipes(Validation)
  create(@Body() createNoticeDto:CreateNoticeDto) {
    return this.noticeService.create(createNoticeDto)
  }

  // 接口 - 新建系统通知
  @Post("system")
  @UsePipes(Validation)
  createSystemNotice(@Body() systemNoticeDto: SystemNoticeDto) {
    return this.noticeService.createSystemNotice(systemNoticeDto);
  }
}
