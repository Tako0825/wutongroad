import { PassportStrategy } from "@nestjs/passport"
import { PrismaService } from "src/prisma/prisma.service"
import { Strategy, ExtractJwt } from "passport-jwt"

export class JwtStrategy extends PassportStrategy(Strategy,"jwt") {
    constructor(
        private prisma = new PrismaService()
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "wutongroad"
        })
    }

    async validate({ sub: id}) {
        return this.prisma.user.findUnique({
            where: { id }
        })
    }
}