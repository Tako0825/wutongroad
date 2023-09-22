import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { WechatApiService } from 'src/common/wechat-api/wechat-api.service';
import { WechatApiUrl } from 'src/common/enum/WechatApiUrl';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
 
@Injectable()
export class AuthService {
    constructor(
        private jwt:JwtService,
        private prisma:PrismaService,
        private wechatApi:WechatApiService,
        private userService:UserService
    ) {}

    // 服务 - 自动登录
    public async verify(user:User) {
        // 选择有需要的用户信息返回给前端
        const { uuid, nickname, role } = user
        return {
            tip: "自动登录成功",
            userInfo: {
                uuid,
                role,
                nickname
            }
        }
    }

    // 服务 - 登录
    public async login(body:LoginDto) {
        const { js_code } = body
        // 调用微信开放接口 - 小程序登录
        const data = await this.WechatLogin(js_code) as any
        const user:User = data.user
        const token:string = data.token
        // 选择有需要的用户信息返回给前端
        const { uuid, nickname, role } = user
        return {
            tip: "登录成功",
            userInfo: {
                uuid,
                nickname,
                role
            },
            token
        }
    }

    // 登录(1) - 调用微信开放接口 - 小程序登录
    private async WechatLogin(js_code: string) {
        const url = WechatApiUrl.code2Session
        const params = {
            appid: process.env.APP_ID,
            secret: process.env.APP_SECRET,
            js_code,
            grant_type: "authorization_code"
        }
        // 调用微信开放接口 - 小程序登录返回 openid & session_key
        const data = await this.wechatApi.get(url, params)

        // 根据 openid 获取用户信息
        const user = await this.getUserInfo(data)
        
        return {
            user,
            // 手动登录返回新的 token
            token: await this.jwt.signAsync({
                params: {
                    session_key: (data as any).session_key,
                    openid: (data as any).openid
                },
                sign: process.env.SECRET_OR_KEY
            })
        }
    }

    // 登录(1.1) - 获取用户信息(可能存在, 也可能不存在)
    private async getUserInfo(data: any) {
        const { openid, session_key } = data
        // 判断用户是否存在
        const user = await this.prisma.user.findFirst({
            where: {
                openid
            }
        })
        // 若用户不存在 - 新建用户
        if(!user) {
            return await this.userService.create({
                openid,
                session_key
            })
        }  
        // 若用户存在 - 更新用户的 session_key
        else if(user.session_key !== session_key) {
            return await this.prisma.user.update({
                where: {
                    openid
                },
                data: {
                    session_key
                }
            })
        }
        else return user
    }
}