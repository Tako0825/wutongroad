import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaModel } from './enum/PrismaModel';

@Injectable()
export class CommonService {
    constructor(private prisma:PrismaService) {}

    /**
     * 尝试根据 uuid 获取数据模型的实体 entity
     * @param { PrismaModel } model - 具体的数据模型
     * @param { string } uuid - 当前数据实体对应的uuid
     * @return - entity | HttpException(异常)
    */
    async getEntityByUuid(model: PrismaModel, uuid: string) {
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

    /**
     * 尝试根据 uuid 修改数据实体在数据库中对应的值
     * @param { PrismaModel } model - 具体的数据模型
     * @param { string } uuid - 当前数据实体对应的uuid
     * @return - entity | HttpException(异常)
    */
    async updateRowByUuid(model: PrismaModel, uuid: string, data: Record<string, any>) {
        const oldValue = await this.getEntityByUuid(model, uuid)
        for(let key in data) {
            if(data[key] !== oldValue[key]) {
                const newValue = await (this.prisma[model] as any).update({
                    where: {
                        uuid
                    },
                    data
                })
                return {
                    newValue,
                    oldValue
                }
            }
        }
        throw new HttpException({
            tip: "数据经过比对, 无需作出修改"
        }, HttpStatus.BAD_REQUEST)
    }
}
