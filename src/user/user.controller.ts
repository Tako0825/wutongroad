import { Controller, Get, Body, Patch, Param, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Validation } from 'src/common/validation';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 接口 - 获取指定用户
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.userService.findOne(uuid);
  }

  // 接口 - 修改用户信息
  @Patch(':uuid')
  @UsePipes(Validation)
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uuid, updateUserDto);
  }
}
