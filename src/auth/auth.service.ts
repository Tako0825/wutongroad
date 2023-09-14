import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModel } from './model/user.model';
import { WechatApiService } from 'src/wechat-api/wechat-api.service';
import { WechatApiUrl } from 'src/enum/WechatApiUrl';

@Injectable()
export class AuthService {
    constructor(
        private jwt:JwtService,
        private prisma:PrismaService,
        private wechatApi:WechatApiService
    ) {}

    // 服务 - 自动登录
    public async verify(user:UserModel) {
        const { openid, session_key, role, nickname } = user
        // 选择有需要的用户信息返回给前端
        const data = {
            tip: "自动登录成功",
            userInfo: {
                openid,
                session_key,
                role,
                nickname
            }
        }
        // 服务器日志 - 用户自动登录
        console.log(`${nickname}(${openid})-自动登录成功`);
        return data
    }

    // 服务 - 登录
    public async login(body:LoginDTO) {
        const { js_code } = body
        const data = await this.WechatLogin(js_code) as any
        const nickname = (data.userInfo as Partial<UserModel>).nickname
        const openid = (data.userInfo as Partial<UserModel>).openid
        // 服务器日志 - 用户登录
        console.log(`${nickname}(${openid})-登录成功`);
        return data
    }

    // 登录(1) - 小程序登录
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
        
        // 选择有需要的用户信息返回给前端
        const { openid, session_key, role, nickname } = user
        return {
            tip: "登录成功",
            userInfo: {
                openid,
                session_key,
                role,
                nickname
            },
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

    // 登录(1.1) - 获取用户信息
    private async getUserInfo(data: any) {
        // 判断用户是否存在
        let user = await this.prisma.user.findFirst({
            where: {
                openid: data.openid
            }
        })
        // 若用户不存在 - 在数据库创建用户信息
        if(!user) {
            return await this.prisma.user.create({
                data: {
                    openid: data.openid,
                    session_key: data.session_key,
                    role: "user",
                    nickname: "uu"
                }
            })
        }  
        // 若用户存在 - 判断是否需要在数据库中更新用户的 session_key
        else {
            try {
                const user = await this.prisma.user.update({
                    where: {
                        openid: data.openid
                    },
                    data: {
                        session_key: data.session_key
                    }
                })
                return user
            }catch (error) {
                throw new HttpException({
                    
                },HttpStatus.BAD_REQUEST)
            }
        }
    }
}