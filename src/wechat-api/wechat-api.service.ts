import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class WechatApiService {

    // GET
    public async get(url:string, params: any, body?:any, headers?: any) {
        // params => query 转化
        const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
        console.log(`${url}?${queryString}`);
        
        const response = await fetch(`${url}?${queryString}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body
        })
        return await response.json()
    }

    // POST
    public async post(url:string, body: Record<string, any>) {
        const response = await fetch(url, body)
        return await response.json()
    }
}
