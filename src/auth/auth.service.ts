import { Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private jwt:JwtService,
        private prisma:PrismaService
    ) {}

    // 服务 - 登录
    async login(body:LoginDTO) {
        return this.WechatHttpApi(body)
    }

    // 微信接口服务
    private async WechatHttpApi(body:LoginDTO) {
        const url = "https://api.weixin.qq.com/sns/jscode2session"
        const params = {
          appid: process.env.APP_ID,
          secret: process.env.APP_SECRET,
          js_code: body.js_code,
          grant_type: "authorization_code"
        }
        const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

        try {
            const response = await fetch(`${url}?${queryString}`)
            const data = await response.json()
            await this.register(data)
            return {
                message: "登录成功",
                token: await this.jwt.signAsync({
                    params: {
                        session_key: (data as any).session_key,
                        openid: (data as any).openid
                    },
                    sign: process.env.SECRET_OR_KEY
                })
            }
        } catch(error) {
            throw new Error("登录失败")
        }
    }

    // 首次登录 - 自动进行注册
    private async register(data: any) {
        let user = await this.prisma.user.findFirst({
            where: {
                openid: data.openid
            }
        })
        if(!user) {
            user = await this.prisma.user.create({
                data: {
                    openid: data.openid,
                    session_key: data.session_key
                }
            })
        }
        return user
    } 
}