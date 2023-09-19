import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category, Topic, User } from '@prisma/client';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateTopicDto } from 'src/topic/dto/update-topic.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { PrismaModel } from './enum/PrismaModel';

@Injectable()
export class CommonService {
    constructor(private prisma:PrismaService) {}

    /**
     * 尝试根据 uuid 获取数据模型的实体 entity
     * @param { PrismaModel } model - 具体的数据模型
     * @param { string } uuid - 当前数据模型相应uuid
     * @return - entity | HttpException(异常)
    */
    async getEntityByUuid(model: PrismaModel, uuid:string) {
        const entity = await (this.prisma[model] as any).findFirst({
            where: {
                uuid
            }
        })
        if(!entity) {
            throw new HttpException({
                tip: `请提供有效的 uuid`,
                meta: {
                    uuid
                }
            }, HttpStatus.UNPROCESSABLE_ENTITY)
        } else return entity
    }

    // 尝试修改用户信息
    async tryToUpdateUser(uuid: string, data:UpdateUserDto) {
        const oldValue = await this.getEntityByUuid(PrismaModel.user, uuid)
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

    // 尝试修改话题分类信息
    async tryToUpdateCategory(uuid: string, data:UpdateCategoryDto) {
        const oldValue = await this.getEntityByUuid(PrismaModel.category, uuid)
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

    // 尝试修改话题信息
    async tryToUpdateTopic(uuid: string, data:UpdateTopicDto) {
        const oldValue = await this.getEntityByUuid(PrismaModel.topic, uuid)
        for(let key in data) {
            if(data[key] !== oldValue[key]){
            const newValue:Topic = await this.prisma.topic.update({
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
