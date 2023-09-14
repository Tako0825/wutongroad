import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class WechatApiService {

    // GET
    public async get(url:string, params: Record<string, any>, headers?: Record<string, any>) {
        // params => query 转化
        const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
        
        const response = await fetch(`${url}?${queryString}`,{
            method: "GET",
            headers
        })
        return await response.json()
    }

    // POST
    public async post(url:string, body: Record<string, any>) {
        const response = await fetch(url, body)
        return await response.json()
    }
}
