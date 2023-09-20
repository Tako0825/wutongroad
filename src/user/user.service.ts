import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommonService } from 'src/common/common.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaModel } from 'src/common/enum/PrismaModel';

@Injectable()
export class UserService {
  constructor(
    private prisma:PrismaService,
    private commonService:CommonService
  ) {}

  // 服务 - 创建用户
  async create(createUserDto:CreateUserDto) {
    const { openid, session_key } = createUserDto
    const user = await this.prisma.user.create({
      data: {
        openid,
        session_key,
      }
    })
    const { nickname, gender, role, create_time, avatar, uuid } = user
    return {
      tip: "成功创建新用户",
      userInfo: {
        nickname,
        gender,
        role,
        create_time,
        avatar,
        uuid
      }
    }
  }

  // 服务 - 查找指定用户
  async findOne(uuid: string) {
    const user = await this.commonService.getEntityByUuid(PrismaModel.user, uuid)
    const { nickname, role, gender, avatar, create_time } = user
    return {
      tip: "成功找到指定用户",
      userInfo: {
        nickname,
        role,
        gender,
        avatar,
        create_time
      }
    }
  }

  // 服务 - 修改用户信息
  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const { oldValue, newValue } = await this.commonService.updateRowByUuid(PrismaModel.user, uuid, updateUserDto)
    // 选择有需要的信息返回给前端, 注意不要泄露隐私信息
    return {
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
    }
  }
}
