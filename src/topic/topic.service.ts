import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Topic } from './entities/topic.entity';

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
  async findPage(pageSize: number, currentPage: number) {
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

  // 服务 - 获取指定用户下所有话题
  async findUserTopic(user_id: string) {
    const user = await this.tryToFindUser(user_id)
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
    const category = await this.tryToFindCategory(category_id)
    const topicList = await this.prisma.topic.findMany({
      where: {
        category_id
      }
    })
    const count = topicList.length
    return new HttpException({
      tip: `查询成功, ${category.title}-该分类共有${count}条话题`,
      count,
      topicList
    }, HttpStatus.OK)
  }

  // 服务 - 修改话题
  async update(uuid: string, updateTopicDto: UpdateTopicDto) {
    const { newValue, oldValue } = await this.tryToUpdateUser(uuid, updateTopicDto)
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

  // 尝试根据 uuid 查询相应话题
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

  // 尝试根据 uuid 查询相应用户
  async tryToFindUser(uuid: string) {
    const entity = await this.prisma.user.findUnique({
      where: {
        uuid
      }
    })
    if(!entity) {
      throw new HttpException({
        tip: `请提供有效的 uuid 以查询用户`,
        meta: {
          uuid
        }
      }, HttpStatus.NOT_FOUND)
    }
    return entity
  }

  // 尝试根据 uuid 查询相应话题分类
  async tryToFindCategory(uuid: string) {
    const entity = await this.prisma.category.findUnique({
      where: {
        uuid
      }
    })
    if(!entity) {
      throw new HttpException({
        tip: `请提供有效的 uuid 以查询话题分类`,
        meta: {
          uuid
        }
      }, HttpStatus.NOT_FOUND)
    }
    return entity
  }

  // 尝试对提交数据和数据库进行比对, 判断是否需要作出修改
  async tryToUpdateUser(uuid: string, data:UpdateTopicDto) {
    const oldValue = await this.tryToFindTopic(uuid)
    for(let key in data) {
      if(data[key] !== oldValue[key]){
        const newValue:Topic = await this.prisma.topic.update({
          where: {
            uuid
          },
          data
        })
        return {
          oldValue,
          newValue
        }
      }
    }
    throw new HttpException({
      tip: "数据经过比对, 无需作出修改"
    }, HttpStatus.BAD_REQUEST)
  }
}
