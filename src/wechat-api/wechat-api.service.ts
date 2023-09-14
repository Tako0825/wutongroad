import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class WechatApiService {

    // GET
    public async get(url:string, params: Record<string, any>, headers?: Record<string, any>) {
        // params => query 转化
        const queryString = new URLSearchParams()
        Object.keys(params).forEach(key => {
            queryString.append(key, params[key])
        })
        const response:Record<string, any> = await fetch(`${url}?${queryString}`,{
            method: "GET",
            headers
        })
        const data = await response.json()
        if(data.errcode) {
            throw new HttpException({
                meta: {
                    error: data.errmsg
                }
            },HttpStatus.BAD_REQUEST)
        }
        return data
    }

    // POST
    public async post(url:string, body: Record<string, any>, headers?: Record<string, any>) {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
        const data = await response.json()
        if(data.errcode) {
            throw new HttpException({
                meta: {
                    error: data.errmsg
                }
            },HttpStatus.BAD_REQUEST)
        }
        return data
    }
}
