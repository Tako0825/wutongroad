import { Body, Controller, Patch, UsePipes } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { ApproveTopicDto } from './dto/approve-topic.dto';
import { Validation } from 'src/common/validation';

@Controller('approval')
export class ApprovalController {
    constructor(
        private approvalService:ApprovalService
    ) {}

    // 接口 - 指定文章通过审核
    @Patch("topic/:uuid")
    @UsePipes(Validation)
    approveTopic(@Body() approveTopicDto:ApproveTopicDto) {
        return this.approvalService.approveTopic(approveTopicDto)
    }
}
