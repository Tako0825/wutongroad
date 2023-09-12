import { PassportStrategy } from "@nestjs/passport"
import { PrismaService } from "src/prisma/prisma.service"
import { Strategy, ExtractJwt } from "passport-jwt"

export class JwtStrategy extends PassportStrategy(Strategy,"jwt") {
    constructor(
        private prisma = new PrismaService()
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_OR_KEY
        })
    }

    async validate(payload: any) {
        const { openid } = payload.params;

        // 根据openid从数据库或其他数据源中获取用户信息
        const user = await this.prisma.user.findUnique({
            where: {
                openid: openid
            }
        });
    
        // 返回验证后的用户信息
        return user;
    }
}