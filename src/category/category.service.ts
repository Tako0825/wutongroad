import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';
import { PrismaModel } from 'src/common/enum/PrismaModel';

@Injectable()
export class CategoryService {
  constructor(
    private prisma:PrismaService,
    private commonService:CommonService
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
    const category = await this.commonService.getEntityByUuid(PrismaModel.category, uuid)
    return new HttpException({
      tip: "成功获取指定的话题分类",
      category
    }, HttpStatus.OK)
  }

  // 服务 - 修改话题分类描述
  async updateCategory(uuid: string, updateCategoryDto: UpdateCategoryDto) {
    const { newValue, oldValue } = await this.commonService.tryToUpdateCategory(uuid, updateCategoryDto)
    return new HttpException({
      tip: "成功修改话题分类",
      newValue,
      oldValue
    }, HttpStatus.OK)
  }

  // 服务 - 删除指定话题分类
  async remove(uuid: string) {
    await this.commonService.getEntityByUuid(PrismaModel.category, uuid)
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
}
