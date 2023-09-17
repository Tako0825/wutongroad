import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {

    constructor(
        private commentService:CommentService
    ) {}

    // 接口 - 获取所有评论
    @Get()
    findAll() {
        return this.commentService.findAll()
    }

}
