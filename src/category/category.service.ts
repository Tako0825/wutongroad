import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma:PrismaService
  ) {}

  // 服务 - 新建话题分类
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        title: createCategoryDto.title,
        description: createCategoryDto.description
      }
    })
    return new HttpException({
      tip: "话题分类新建成功",
      category
    }, HttpStatus.OK)
  }

  // 服务 - 获取所有话题分类
  async findAll() {
    const categorytList = await this.prisma.category.findMany()
    return new HttpException({
      tip: "成功获取所有的话题分类",
      categorytList
    }, HttpStatus.OK)
  }

  // 服务 - 获取指定话题分类
  async findOne(uuid: string) {
    const category = await this.tryToFindCategory(uuid)
    return new HttpException({
      tip: "成功获取指定的话题分类",
      category
    }, HttpStatus.OK)
  }

  // 服务 - 修改话题分类描述
  async updateDescription(uuid: string, updateDescriptionDto: UpdateDescriptionDto) {
    const oldValue = await this.tryToFindCategory(uuid)
    if(oldValue.description === updateDescriptionDto.description) {
      return new HttpException({
          tip: "话题描述不变, 无需作出修改"
      }, HttpStatus.NOT_MODIFIED)
    }
    const newValue = await this.prisma.category.update({
      where: {
        uuid
      },
      data: {
        description: updateDescriptionDto.description
      }
    })
    return new HttpException({
      tip: "成功修改话题分类",
      newValue,
      oldValue
    }, HttpStatus.OK)
  }

  // 服务 - 删除指定话题分类
  async remove(uuid: string) {
    await this.tryToFindCategory(uuid)
    const category = await this.prisma.category.delete({
      where: {
        uuid
      }
    })
    return new HttpException({
      tip: "成功删除指定话题分类",
      category
    }, HttpStatus.OK)
  }

  // 尝试根据 uuid 查询话题分类
  async tryToFindCategory(uuid: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        uuid
      }
    })
    if(!category) {
      throw new HttpException({
        tip: "请提供有效的 uuid",
        meta: {
          uuid
        }
      }, HttpStatus.NOT_FOUND)
    }
    return category
  }
}
