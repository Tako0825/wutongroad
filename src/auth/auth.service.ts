import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModel } from './model/user.model';
import { AccessTokenService } from 'src/auth/access-token/access-token.service';
import { VerifyDTO } from './dto/verify.dto';
import { WechatApiService } from 'src/wechat-api/wechat-api.service';
import { WechatApiUrl } from 'src/enum/WechatApiUrl';
import { createHash } from "crypto"

@Injectable()
export class AuthService {
    constructor(
        private jwt:JwtService,
        private prisma:PrismaService,
        private accessToken:AccessTokenService,
        private wechatApi:WechatApiService
    ) {}

    // 服务 - 自动登录
    public async verify(user:UserModel, body:VerifyDTO) {
        // ...有待补充: 这里验证 session_key是否有效
        const { openid, session_key } = user
        const { rawData } = body
        const sha1Hash = createHash('sha1');
        sha1Hash.update(rawData + session_key, "utf-8");
        // ...需要修改: 这里 signature 无效
        const signature = sha1Hash.digest('base64');

        const data = await this.WechatCheckSessionKey(openid, signature)
        console.log(data);
    }

    // 自动登录(1) - 校验登录态
    private async WechatCheckSessionKey(openid: string, signature: string) {
        const url = WechatApiUrl.checkSessionKey
        const params = {
            access_token : `${this.accessToken.access_token}`,
            openid,
            signature,
            sig_method: "hmac_sha256"
        }
        
        const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
        const response = await fetch(`${url}?${queryString}`,{
            method: "GET",
            headers: {
            'Content-Type': 'application/json',
            }
        })
        return await response.json()
        // 调用微信开放接口 - 小程序登录
    }

    // 服务 - 登录
    public async login(body:LoginDTO) {
        const { js_code } = body
        return this.WechatLogin(js_code)
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
        // 调用微信开放接口 - 小程序登录
        const data = await this.wechatApi.get(url, params)
        // 若是首次登录 - 自动注册
        this.register(data)
        
        return {
            tip: "登录成功",
            token: await this.jwt.signAsync({
                params: {
                    session_key: (data as any).session_key,
                    openid: (data as any).openid
                },
                sign: process.env.SECRET_OR_KEY
            })
        }
    }

    // 登录(2) - 自动注册
    private async register(data: any) {
        // 判断用户是否存在
        const user = await this.prisma.user.findFirst({
            where: {
                openid: data.openid
            }
        })
        // 若用户不存在则需要自动注册 - 将 openid 和 session_id 等用户信息存入数据库
        if(!user) {
            await this.prisma.user.create({
                data: {
                    openid: data.openid,
                    session_key: data.session_key,
                    role: "user",
                    nickname: "uu"
                }
            })
        } 
        // 若用户存在则更新 session_id
        else {
            await this.prisma.user.update({
                where: {
                    openid: data.openid
                },
                data: {
                    session_key: data.session_key
                }
            })
        }
    } 
}