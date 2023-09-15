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
    return {
      tip: "话题分类新建成功",
      category
    };
  }

  // 服务 - 获取所有话题分类
  async findAll() {
    const categorytList = await this.prisma.category.findMany()
    return {
      tip: "成功获取所有的话题分类",
      categorytList
    };
  }

  // 服务 - 获取指定话题分类
  async findOne(uuid: string) {
    const category = await this.tryToFindCategory(uuid)
    return {
      tip: "成功获取指定的话题分类",
      category
    }
  }

  // 服务 - 修改话题分类描述
  async updateDescription(uuid: string, updateDescriptionDto: UpdateDescriptionDto) {
    const oldValue = await this.tryToFindCategory(uuid)
    if(oldValue.description === updateDescriptionDto.description) {
      return {
        meta: {
          message: "话题描述不变, 无需作出修改"
        }
      }
    }
    const newValue = await this.prisma.category.update({
      where: {
        uuid
      },
      data: {
        description: updateDescriptionDto.description
      }
    })
    return {
      tip: "成功修改话题分类",
      newValue,
      oldValue
    }
  }

  // 服务 - 删除指定话题分类
  async remove(uuid: string) {
    await this.tryToFindCategory(uuid)
    const category = await this.prisma.category.delete({
      where: {
        uuid
      }
    })
    return {
      tip: "成功删除指定话题分类",
      category
    }
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
        meta: {
          uuid
        }
      }, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    return category
  }
}
