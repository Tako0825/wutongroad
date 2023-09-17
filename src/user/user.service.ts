import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class UserService {
  constructor(
    private commonService:CommonService
  ) {}

  // 服务 - 查找指定用户
  async findOne(uuid: string) {
    const user = await this.commonService.tryToFindUser(uuid)
    const { nickname, role, gender, avatar, create_time } = user
    return new HttpException({
      tip: "成功找到指定用户",
      userInfo: {
        nickname,
        role,
        gender,
        avatar,
        create_time
      }
    },HttpStatus.OK)
  }

  // 服务 - 修改用户信息
  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const { oldValue, newValue } = await this.commonService.tryToUpdateUser(uuid, updateUserDto)
    // 选择有需要的信息返回给前端, 注意不要泄露隐私信息
    return new HttpException({
      tip: "成功修改用户信息",
      newValue: {
        uuid: newValue.uuid,
        nickname: newValue.nickname,
        avatar: newValue.avatar,
        gender: newValue.gender,
        create_time: newValue.create_time,
        role: newValue.role
      },
      oldValue: {
        uuid: oldValue.uuid,
        nickname: oldValue.nickname,
        avatar: oldValue.avatar,
        gender: oldValue.gender,
        create_time: oldValue.create_time,
        role: oldValue.role
      }
    }, HttpStatus.OK)
  }
}
