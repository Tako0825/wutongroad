import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class WechatApiService {

    public async get(url:string, params: Record<string, any>) {
        // params => query 转化
        const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
        
        try {
            const response = await fetch(`${url}?${queryString}`)
            const data = await response.json()
            return data
        } catch(error) {
            throw new HttpException({
                code: 404,
                message: "调用失败 - 微信开放接口 (请检查请求参数)",
            }, HttpStatus.NOT_FOUND)
        }
    }
}
