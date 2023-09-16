import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from './entities/category.entity';

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
  async updateDescription(uuid: string, updateDescriptionDto: UpdateCategoryDto) {
    const { newValue, oldValue } = await this.tryToUpdateCategory(uuid, updateDescriptionDto)
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
        tip: "请提供有效的 uuid 以查询话题分类",
        meta: {
          uuid
        }
      }, HttpStatus.NOT_FOUND)
    }
    return category
  }

  // 尝试对提交数据和数据库进行比对, 判断是否需要作出修改
  async tryToUpdateCategory(uuid: string, data:UpdateCategoryDto) {
    const oldValue = await this.tryToFindCategory(uuid)
    for(let key in data) {
      if(data[key] !== oldValue[key]){
        const newValue:Category = await this.prisma.category.update({
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
