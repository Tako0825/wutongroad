import { Injectable } from '@nestjs/common';
import { WechatApiUrl } from 'src/enum/WechatApiUrl';
import { WechatApiService } from 'src/wechat-api/wechat-api.service';

@Injectable()
export class AccessTokenService {
    public access_token:string
    private expires_in:number
    
    constructor(
        private wechatApi:WechatApiService
    ) {
        this.init()
    }

    private async init() {
        // access_token - 获取到的凭证
        // expires_in - 凭证有效时间，单位：秒。目前是7200秒之内的值。
        const data = await this.getAccessToken()
        const { access_token, expires_in } = data
        this.access_token = access_token
        this.expires_in = expires_in * 1000
        console.log(data);
        // 每隔 2 小时更新一次 access_token
        // setInterval(() => {
        //     this.updateAcessToken()
        // }, this.expires_in)
    }

    // 获取 access_token
    private async getAccessToken() {
        const url = WechatApiUrl.getAccessToken
        const body = {
            grant_type: "client_credential",
            appid: process.env.APP_ID,
            secret: process.env.APP_SECRET,
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return await this.wechatApi.post(url, body, headers)
    }

    // 每隔 2 小时更新 access_token
    private updateAcessToken() {
        setTimeout(async () => {
            const { access_token, expires_in } = await this.getAccessToken()
            this.access_token = access_token
            this.expires_in = expires_in * 1000
        }, this.expires_in)
    }
}
