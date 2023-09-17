import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTopicDto } from 'src/topic/dto/update-topic.dto';
import { Topic } from 'src/topic/entities/topic.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entities';

@Injectable()
export class CommonService {
    constructor(private prisma:PrismaService) {}

    // 尝试查询话题
    async tryToFindTopic(uuid: string) {
        const entity = await this.prisma.topic.findUnique({
            where: {
            uuid
            }
        })
        if(!entity) {
            throw new HttpException({
            tip: `请提供有效的 uuid 以查询话题`,
            meta: {
                uuid
            }
            }, HttpStatus.NOT_FOUND)
        }
        return entity
    }   

    // 尝试查询用户
    async tryToFindUser(uuid: string) {
        const entity = await this.prisma.user.findUnique({
            where: {
            uuid
            }
        })
        if(!entity) {
            throw new HttpException({
            tip: `请提供有效的 uuid 以查询用户`,
            meta: {
                uuid
            }
            }, HttpStatus.NOT_FOUND)
        }
        return entity
    }

    // 尝试查询话题分类
    async tryToFindCategory(uuid: string) {
        const entity = await this.prisma.category.findUnique({
            where: {
            uuid
            }
        })
        if(!entity) {
            throw new HttpException({
            tip: `请提供有效的 uuid 以查询话题分类`,
            meta: {
                uuid
            }
            }, HttpStatus.NOT_FOUND)
        }
        return entity
    }

    // 尝试修改用户信息
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

    // 尝试修改话题分类信息
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

    // 尝试修改话题信息
    async tryToUpdateTopic(uuid: string, data:UpdateTopicDto) {
        const oldValue = await this.tryToFindTopic(uuid)
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
