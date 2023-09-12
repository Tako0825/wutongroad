import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from "argon2"
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma:PrismaService
    ) {}

    // 服务 - 注册
    async register(body:RegisterDTO) {
        const user = await this.prisma.user.create({
            data: {
                name: body.name,
                password: await hash(body.password),
                role: "user"
            }
        })
        return {
            message: "注册成功",
            meta: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        }
    }

    // 服务 - 登录
    async login(body:LoginDTO) {
        const user = await this.prisma.user.findFirst({
            where: {
                name: body.name
            }
        })
        return {
            message: "登录成功",
            meta: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        }
    }

}