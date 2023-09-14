import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModel } from './model/user.model';
import { WechatApiService } from 'src/wechat-api/wechat-api.service';
import { WechatApiUrl } from 'src/enum/WechatApiUrl';
import { v4 } from "uuid"
 
@Injectable()
export class AuthService {
    constructor(
        private jwt:JwtService,
        private prisma:PrismaService,
        private wechatApi:WechatApiService
    ) {}

    // 服务 - 自动登录
    public async verify(user:UserModel) {
        // 选择有需要的用户信息返回给前端
        const { uuid, nickname, role } = user
        // 服务器日志 - 用户自动登录
        console.log(`${nickname}(${uuid})-自动登录成功`);
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
    public async login(body:LoginDTO) {
        const { js_code } = body
        // 调用微信开放接口 - 小程序登录
        const data = await this.WechatLogin(js_code) as any
        const user:UserModel = data.user
        const token:string = data.token
        // 选择有需要的用户信息返回给前端
        const { uuid, nickname, role } = user
        // 服务器日志 - 用户登录
        console.log(`${nickname}(${uuid})-登录成功`);
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
        // 判断用户是否存在
        const user = await this.prisma.user.findFirst({
            where: {
                openid: data.openid
            }
        })
        // 若用户不存在 - 新建用户
        if(!user) {
            return await this.prisma.user.create({
                data: {
                    uuid: v4(),
                    nickname: "uu",
                    role: "user",
                    openid: data.openid,
                    session_key: data.session_key
                }
            })
        }  
        // 若用户存在 - 更新用户的 session_key
        else if(user.session_key !== data.session_key) {
            return await this.prisma.user.update({
                where: {
                    openid: data.openid
                },
                data: {
                    session_key: data.session_key
                }
            })
        }
        else return user
    }
}