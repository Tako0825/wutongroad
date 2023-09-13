import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokenService {
    public access_token:string
    private expires_in:number
    
    constructor() {
        this.init()
    }

    private async init() {
        // access_token - 获取到的凭证
        // expires_in - 凭证有效时间，单位：秒。目前是7200秒之内的值。
        const { access_token, expires_in } = await this.getAccessToken()
        this.access_token = access_token
        this.expires_in = expires_in * 1000
        
        // 每隔 2 小时刷新 access_token
        // setInterval(() => {
        //     this.updateAcessToken()
        // }, this.expires_in)
    }

    // 获取 access_token
    private async getAccessToken() {
        const url = "https://api.weixin.qq.com/cgi-bin/stable_token"
        const body = {
            grant_type: "client_credential",
            appid: process.env.APP_ID,
            secret: process.env.APP_SECRET,
        }
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        return await response.json()
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
