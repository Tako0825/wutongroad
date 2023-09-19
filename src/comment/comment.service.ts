import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class CommentService {
  constructor(
    private prisma:PrismaService,
    private commonService:CommonService
  ) {}

  // 服务 - 新建评论
  async create(createCommentDto: CreateCommentDto) {
    const { user_id, topic_id, content, parent_id } = createCommentDto
    await this.commonService.tryToFindUser(user_id),
    await this.commonService.tryToFindTopic(topic_id)
    const comment = await this.prisma.comment.create({
      data: {
        content,
        user_id,
        topic_id,
        parent_id
      }
    })
    return new HttpException({
      tip: "成功新建评论",
      comment
    }, HttpStatus.OK)
  }

  // 服务 - 获取评论总数
  async getTotal() {
    return new HttpException({
      tip: "成功获取评论总数",
      total: await this.prisma.comment.count()
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定页所有评论 - 已审核
  async findPage(pageSize: number, currentPage: number) {
    const commentList = await this.prisma.comment.findMany({
      where: {
        is_approved: true
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    })
    const count = commentList.length
    return new HttpException({
      tip: `成功获取第${currentPage}页, 共${count}条评论`,
      currentPage,
      count,
      commentList
    },HttpStatus.OK)
  }

  // 服务 - 获取指定页所有评论 - 未审核
  async findPendingApproval(pageSize: number, currentPage: number) {
    const commentList = await this.prisma.comment.findMany({
      where: {
        is_approved: false
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    })
    const count = commentList.length
    return new HttpException({
      tip: `成功获取第${currentPage}页, 共${count}条评论`,
      currentPage,
      count,
      commentList
    },HttpStatus.OK)
  }

  // 服务 - 获取指定评论
  async findOne(uuid: string) {
    const topic = await this.commonService.tryToFindComment(uuid)
    return new HttpException({
      tip: "成功获取指定评论",
      topic
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定用户下所有评论
  async findUserComment(user_id: string) {
    const user = await this.commonService.tryToFindUser(user_id)
    const commentList = await this.prisma.comment.findMany({
      where: {
        user_id
      }
    })
    const count = commentList.length
    return new HttpException({
      tip: `查询成功, ${user.nickname}-该用户共发表了${count}条评论`,
      count,
      commentList
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定话题下所有评论
  async findTopicComment(topic_id: string) {
    const topic = await this.commonService.tryToFindTopic(topic_id)
    const commentList = await this.prisma.comment.findMany({
      where: {
        topic_id
      }
    })
    const count = commentList.length
    return new HttpException({
      tip: `查询成功, ${topic.title}-这条话题收到共${count}条评论`,
      count,
      commentList
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定话题下所有评论的总数
  async getTopicCommentTotal(topic_id:string) {
    await this.commonService.tryToFindTopic(topic_id)
    const total = await this.prisma.comment.count({
      where: {
        topic_id
      }
    })
    return new HttpException({
      tip: `成功获取该话题下所有评论, 共${total}条`,
      total
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定评论下所有回复
  async findReplies(uuid: string) {
    const replies = await this.prisma.comment.findMany({
      where: {
        parent_id: uuid
      }
    })
    return new HttpException({
      tip: `成功获取该评论所收到的共${replies.length}条回复`,
      replies
    }, HttpStatus.OK)
  }

  // 服务 - 删除指定评论
  async remove(uuid: string) {
    await this.commonService.tryToFindComment(uuid)
    await this.prisma.comment.delete({
      where: {
        uuid
      }
    })
    return new HttpException({
      tip: "成功删除评论"
    }, HttpStatus.OK)
  }
}