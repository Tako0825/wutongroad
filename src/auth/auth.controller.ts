import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Validation } from 'src/common/validation';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 接口 - 登录
  @Post("login")
  @UsePipes(Validation)
  login(@Body() body:LoginDto) {
    return this.authService.login(body)
  }

  // 接口 - token自动登录
  @Get("verify")
  @UsePipes(Validation)
  @UseGuards(AuthGuard("jwt"))
  verify(@Req() req:any) {
    // 根据 token 获取的当前用户 req.user
    const user:User = req.user
    return this.authService.verify(user)
  }
}