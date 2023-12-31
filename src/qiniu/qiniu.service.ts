import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { auth, conf, rs, zone } from 'qiniu';

@Injectable()
export class QiniuService {
    // 七牛云 - ACCESS_KEY
    private access_key:string = process.env.QINIU_ACCESS_KEY
    // 七牛云 - SECRET_KEY
    private secret_key:string = process.env.QINIU_SECRET_KEY
    // 鉴权对象
    private mac = new auth.digest.Mac(this.access_key, this.secret_key)
    // 加速域名
    private url:string = "s0ynhi7q8.hn-bkt.clouddn.com"
    // 其他选项
    private options:Record<string, any> = {
        // 1.存储空间名
        bucket: "wutongroad"
    }
    // 配置
    private config = new conf.Config({
        zone: zone.Zone_z2
    })

    // 服务 - 获取七牛云上传 token
    getUploadToken() {
        const putPolicy = new rs.PutPolicy(this.options)
        return {
            tip: "成功获取七牛云上传凭据",
            uploadToken: putPolicy.uploadToken(this.mac)
        }
    }
}
