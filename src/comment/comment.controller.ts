import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Validation } from 'src/common/validation';
import { PageDto } from 'src/topic/dto/page.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 接口 - 新建评论
  @Post()
  @UsePipes(Validation)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  // 接口 - 获取评论总数
  @Get("/total")
  getTotal() {
    return this.commentService.getTotal()
  }

  // 接口 - 获取指定页所有评论 - 已审核
  @Get("/approved/page")
  @UsePipes(Validation)
  findPage(@Query() pageDto:PageDto) {
    // 默认每页 10 条话题, 从第 1 页开始查询
    const { pageSize = 10, currentPage = 1 } = pageDto
    return this.commentService.findPage(+pageSize, +currentPage)
  }

  // 接口 - 获取指定页所有评论 - 未审核
  @Get("/pending-approval/page")
  @UsePipes(Validation)
  findPendingApproval(@Query() pageDto:PageDto) {
    // 默认每页 10 条话题, 从第 1 页开始查询
    const { pageSize = 10, currentPage = 1 } = pageDto
    return this.commentService.findPage(+pageSize, +currentPage)
  }

  // 接口 - 获取指定评论
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.commentService.findOne(uuid);
  }

  // 接口 - 获取指定用户下所有评论
  @Get("/user/:uuid")
  findUserComment(@Param('uuid') uuid: string) {
    return this.commentService.findUserComment(uuid)
  }

  // 接口 - 获取指定话题下所有评论
  @Get("/topic/:uuid")
  findTopicComment(@Param('uuid') uuid: string) {
    return this.commentService.findTopicComment(uuid)
  }

  // 接口 - 获取指定话题下所有评论的总数
  @Get("/topic/:uuid/total")
  getTopicCommentTotal(@Param('uuid') uuid: string) {
    return this.commentService.getTopicCommentTotal(uuid)
  }

  // 接口 - 获取指定评论下所有回复
  @Get("/:uuid/replies")
  findReplies(@Param('uuid') uuid: string) {
    return this.commentService.findReplies(uuid)
  }

  // 接口 - 删除评论
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.commentService.remove(uuid);
  }
}
