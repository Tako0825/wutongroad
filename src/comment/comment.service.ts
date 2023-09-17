import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {

    // 服务 - 获取所有评论
    findAll() {
        return new HttpException({
            tip: "成功获取所有评论"
        }, HttpStatus.OK)
    }
}
