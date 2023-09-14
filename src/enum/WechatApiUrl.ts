export enum WechatApiUrl {
    // 小程序登录
    code2Session = "https://api.weixin.qq.com/sns/jscode2session",
    // 检验登录态
    checkSessionKey = "https://api.weixin.qq.com/wxa/checksession",
    // 获取稳定版接口调用凭据
    getAccessToken ="https://api.weixin.qq.com/cgi-bin/stable_token"
}