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
        const data = await this.getAccessToken()
        console.log("access_token 接口已不受限制, 得到: ", data);
        
        const { access_token, expires_in } = data
        this.access_token = access_token
        this.expires_in = expires_in * 1000
        
        // 每隔 2 小时刷新 access_token
        setInterval(() => {
            this.updateAcessToken()
        }, this.expires_in)
    }

    // 获取 access_token
    private async getAccessToken() {
        const url = "https://api.weixin.qq.com/cgi-bin/token"
        const params = {
            grant_type: "client_credential",
            appid: process.env.APP_ID,
            secret: process.env.APP_SECRET
        }
        const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
        try {
            const response = await fetch(`${url}?${queryString}`)
            const data = await response.json()
            return data
        } catch(error) {
            throw new HttpException({
                code: 422,
                tip: error.message
            }, HttpStatus.UNPROCESSABLE_ENTITY)
        }
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
