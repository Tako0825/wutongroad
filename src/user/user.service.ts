import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entities';

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService) {}

  // 服务 - 查找指定用户
  async findOne(uuid: string) {
    const user = await this.tryToFindUser(uuid)
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
    const { oldValue, newValue } = await this.tryToUpdateUser(uuid, updateUserDto)
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

  // 尝试根据 uuid 查询对应用户是否存在
  async tryToFindUser(uuid: string) {
      const user:User = await this.prisma.user.findUnique({
        where: {
          uuid
        }
      })
      if(!user) {
        throw new HttpException({
          tip: "请提供有效的 uuid 以查找用户"
        }, HttpStatus.NOT_FOUND)
      } else return user
  }

  // 尝试对提交数据和数据库进行比对, 判断是否需要作出修改
  async tryToUpdateUser(uuid: string, data:UpdateUserDto) {
    const oldValue = await this.tryToFindUser(uuid)
    for(let key in data) {
      if(data[key] !== oldValue[key]){
        const newValue:User = await this.prisma.user.update({
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
