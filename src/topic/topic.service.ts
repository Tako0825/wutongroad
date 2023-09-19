import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';
import { PrismaModel } from 'src/common/enum/PrismaModel';

@Injectable()
export class TopicService {
  constructor(
    private prisma:PrismaService,
    private commonService:CommonService
  ) {}

  // 服务 - 新建话题
  async create(createTopicDto: CreateTopicDto) {
    const { title, content, category_id, user_id } = createTopicDto
    await this.commonService.getEntityByUuid(PrismaModel.user, user_id)
    await this.commonService.getEntityByUuid(PrismaModel.category, category_id)
    const topic = await this.prisma.topic.create({
      data: {
        title,
        content,
        category_id,
        user_id
      }
    })
    return new HttpException({
      tip: "成功新建话题",
      topic
    }, HttpStatus.OK)
  }

  // 服务 - 获取话题总数
  async getTotal() {
    return new HttpException({
      tip: "成功获取话题总数",
      total: await this.prisma.topic.count()
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定页所有话题 - 已审核
  async findPage(pageSize: number, currentPage: number) {
    const topicList = await this.prisma.topic.findMany({
      where: {
        is_approved: true
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    })
    const count = topicList.length
    return new HttpException({
      tip: `成功获取第${currentPage}页, 共${count}条话题`,
      currentPage,
      count,
      topicList
    },HttpStatus.OK)
  }

  // 服务 - 获取指定页所有话题 - 待审核
  async findPendingApproval(pageSize: number, currentPage: number) {
    const topicList = await this.prisma.topic.findMany({
      where: {
        is_approved: false
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    })
    const count = topicList.length
    return new HttpException({
      tip: `成功获取第${currentPage}页, 共${count}条话题`,
      currentPage,
      count,
      topicList
    },HttpStatus.OK)
  }

  // 服务 - 获取指定话题
  async findOne(uuid: string) {
    const topic = await this.commonService.getEntityByUuid(PrismaModel.topic, uuid)
    return new HttpException({
      tip: "成功获取指定话题",
      topic
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定用户下所有话题
  async findUserTopic(user_id: string) {
    const user = await this.commonService.getEntityByUuid(PrismaModel.user, user_id)
    const topicList = await this.prisma.topic.findMany({
      where: {
        user_id
      }
    })
    const count = topicList.length
    return new HttpException({
      tip: `查询成功, ${user.nickname}-该用户共发表了${count}条话题`,
      count,
      topicList
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定分类下所有话题
  async findCategoryTopic(category_id: string) {
    const category = await this.commonService.getEntityByUuid(PrismaModel.category,category_id)
    const topicList = await this.prisma.topic.findMany({
      where: {
        category_id
      }
    })
    const count = topicList.length
    return new HttpException({
      tip: `查询成功, ${category.title}-该分类下共有${count}条话题`,
      count,
      topicList
    }, HttpStatus.OK)
  }

  // 服务 - 修改话题
  async update(uuid: string, updateTopicDto: UpdateTopicDto) {
    const { newValue, oldValue } = await this.commonService.updateRowByUuid(PrismaModel.topic, uuid, updateTopicDto)
    return new HttpException({
      tip: "成功修改话题标题",
      newValue,
      oldValue
    }, HttpStatus.OK)
  }

  // 服务 - 删除话题
  async remove(uuid: string) {
    await this.commonService.getEntityByUuid( PrismaModel.topic,uuid)
    await this.prisma.topic.delete({
      where: {
        uuid
      }
    })
    return new HttpException({
      tip: "成功删除话题"
    }, HttpStatus.OK)
  }
}
