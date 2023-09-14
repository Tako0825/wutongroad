import { Controller, Get } from '@nestjs/common';
import { QiniuService } from './qiniu.service';

@Controller('qiniu')
export class QiniuController {
    constructor(private readonly qiniuService:QiniuService) {}

    @Get("upload-token")
    getUploadToken() {
      return this.qiniuService.getUploadToken()
    }
}
