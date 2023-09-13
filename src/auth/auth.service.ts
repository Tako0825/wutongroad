import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModel } from './model/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwt:JwtService,
        private prisma:PrismaService
    ) {}

    // 服务 - 进入小程序验证token（自动登录）
    async verify(user:UserModel) {
        // ...这里验证 session_key是否有效
        return "令牌验证成功"
    }

    // 服务 - 登录
    async login(body:LoginDTO) {
        return this.WechatHttpApi(body)
    }

    // 微信接口服务
    private async WechatHttpApi(body:LoginDTO) {
        console.log("获取到js_code: ", body.js_code);
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
            throw new HttpException({
                code: 422,
                tip: "请提供有效的的js_code"
            }, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }

    // 判断用户是否存在
    private async isUserExisted(data:any) {
        const user = await this.prisma.user.findFirst({
            where: {
                openid: data.openid
            }
        })
        return user?true:false
    }

    // 若用户不存在 - 将 openid 和 session_id 等用户信息存入数据库 
    private async register(data: any) {
        const existed = await this.isUserExisted(data)
        if(!existed) {
            await this.prisma.user.create({
                data: {
                    openid: data.openid,
                    session_key: data.session_key,
                    role: "user",
                    nickname: "uu"
                }
            })
        }
    } 
}