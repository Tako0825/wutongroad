import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ApproveTopicDto } from './dto/approve-topic.dto';
import { PrismaModel } from 'src/common/enum/PrismaModel';
import { Topic, User } from '@prisma/client';

@Injectable()
export class ApprovalService {
    constructor(
        private prisma:PrismaService,
        private commonService:CommonService
    ) {}

    // 服务 - 指定文章通过审核
    async approveTopic(approveTopicDto: ApproveTopicDto) {
        const { admin_id, topic_id } = approveTopicDto
        const user: User = await this.commonService.getEntityByUuid(PrismaModel.user, admin_id)
        if(user.role !== "admin") {
            throw new HttpException({
                tip: "权限不足, 仅管理员能够审核话题"
            }, HttpStatus.UNAUTHORIZED)
        }
        const topic: Topic = await this.commonService.getEntityByUuid(PrismaModel.topic, topic_id)
        if(topic.is_approved === true) {
            throw new HttpException({
                tip: "这篇话题已通过审核, 请勿重复操作"
            }, HttpStatus.BAD_REQUEST)
        }
        await this.prisma.topic.update({
            where: {
                uuid: topic_id
            },
            data: {
                is_approved: true
            }
        })
        return {
            tip: "审核成功",
            topic
        }
    }
}
