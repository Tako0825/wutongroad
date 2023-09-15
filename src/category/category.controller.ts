import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { Validation } from 'src/common/validation';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 接口 - 新建话题分类
  @Post()
  @UsePipes(Validation)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  // 接口 - 获取所有话题分类
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  // 接口 - 获取指定话题分类
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.categoryService.findOne(uuid);
  }

  // 接口 - 修改话题分类描述
  @Patch(':uuid')
  @UsePipes(Validation)
  updateDescription(@Param('uuid') uuid: string, @Body() updateDescriptionDto: UpdateDescriptionDto) {
    return this.categoryService.updateDescription(uuid, updateDescriptionDto);
  }

  // 接口 - 删除指定话题分类
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.categoryService.remove(uuid);
  }
}
