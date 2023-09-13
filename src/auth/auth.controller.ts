import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Validation } from 'src/common/validation';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserModel } from './model/user.model';
import { VerifyDTO } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // API - 登录
  @Post("login")
  @UsePipes(Validation)
  login(@Body() body:LoginDTO) {
    return this.authService.login(body)
  }

  // API - token自动登录
  @Post("verify")
  @UsePipes(Validation)
  @UseGuards(AuthGuard("jwt"))
  verify(@Req() req:any, @Body() body:VerifyDTO) {
    // 根据 token 获取的当前用户 req.user
    const user:UserModel = req.user
    return this.authService.verify(user, body)
  }
}
