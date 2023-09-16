import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicService {
  constructor(private prisma:PrismaService) {}

  // 服务 - 新建话题
  async create(createTopicDto: CreateTopicDto) {
    const topic = await this.prisma.topic.create({
      data: {
        title: createTopicDto.title,
        content: createTopicDto.content,
        category_id: createTopicDto.category_id,
        user_id: createTopicDto.user_id
      }
    })
    return new HttpException({
      tip: "成功新建话题",
      topic
    },HttpStatus.OK)
  }

  // 服务 - 获取话题总数
  async getTotal() {
    return new HttpException({
      tip: "成功获取话题总数",
      total: await this.prisma.topic.count()
    }, HttpStatus.OK)
  }

  // 服务 - 获取所有话题
  async findAll() {
    const topicList = await this.prisma.topic.findMany()
    return new HttpException({
      tip: "成功获取所有话题",
      topicList
    },HttpStatus.OK)
  }

  // 服务 - 获取指定页所有话题
  async findPage(currentPage: number, pageSize: number) {
    const topicList = await this.prisma.topic.findMany({
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
    const topic = await this.tryToFindTopic(uuid)
    return new HttpException({
      tip: "成功获取指定话题",
      topic
    }, HttpStatus.OK)
  }

  // 服务 - 修改话题
  async update(uuid: string, updateTopicDto: UpdateTopicDto) {
    const oldValue = await this.tryToFindTopic(uuid)
    const newValue = await this.prisma.topic.update({
      where: {
        uuid
      },
      data: {
        title: updateTopicDto.title,
        content: updateTopicDto.content,
        category_id: updateTopicDto.category_id
      }
    })
    return new HttpException({
      tip: "成功修改话题标题",
      newValue,
      oldValue
    }, HttpStatus.OK)
  }

  // 服务 - 删除话题
  async remove(uuid: string) {
    await this.tryToFindTopic(uuid)
    await this.prisma.topic.delete({
      where: {
        uuid
      }
    })
    return new HttpException({
      tip: "成功删除话题"
    }, HttpStatus.OK)
  }

  // 尝试根据 uuid 查询 1.用户、2.话题分类、3.话题
  async tryToFindTopic(uuid: string) {
      const entity = await this.prisma.topic.findUnique({
        where: {
          uuid
        }
      })
      if(!entity) {
        throw new HttpException({
          tip: `请提供有效的 uuid 以查询话题`,
          meta: {
            uuid
          }
        }, HttpStatus.NOT_FOUND)
      }
      return entity
  }
}
