import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Validation } from 'src/common/validation';
import { PageDto } from './dto/page.dto';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  // 接口 - 新建话题
  @Post()
  @UsePipes(Validation)
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicService.create(createTopicDto);
  }

  // 接口 - 获取话题总数
  @Get("/total")
  getTotal() {
    return this.topicService.getTotal()
  }

  // 接口 - 获取指定页所有话题 - 已审核
  @Get("/approved/page")
  @UsePipes(Validation)
  findPage(@Query() pageDto:PageDto) {
    // 默认每页 10 条话题, 从第 1 页开始查询
    const { pageSize = 10, currentPage = 1 } = pageDto
    return this.topicService.findPage(+pageSize, +currentPage)
  }

  // 接口 - 获取指定页所有话题 - 待审核
  @Get("/pending-approval/page")
  @UsePipes(Validation)
  findPendingApproval(@Query() pageDto:PageDto) {
    console.log(":2313221");
    // 默认每页 10 条话题, 从第 1 页开始查询
    const { pageSize = 10, currentPage = 1 } = pageDto
    return this.topicService.findPendingApproval(+pageSize, +currentPage)
  }

  // 接口 - 获取指定话题
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
  return this.topicService.findOne(uuid);
  }

  // 接口 - 获取指定用户话题 
  @Get("/user/:uuid")
  findUserTopic(@Param('uuid') uuid: string) {
    return this.topicService.findUserTopic(uuid)
  }

  // 接口 - 获取指定分类话题
  @Get("/category/:uuid")
  findCategoryTopic(@Param('uuid') uuid: string) {
    return this.topicService.findCategoryTopic(uuid)
  }

  // 接口 - 修改话题
  @Patch(':uuid')
  @UsePipes(Validation)
  updateTitle(@Param('uuid') uuid: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicService.update(uuid, updateTopicDto);
  }

  // 接口 - 删除话题
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.topicService.remove(uuid);
  }
}
