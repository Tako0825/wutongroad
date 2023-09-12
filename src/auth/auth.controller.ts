import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { Validation } from 'src/common/validation';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @UsePipes(Validation)
  register(@Body() body:RegisterDTO) {
    return this.authService.register(body)
  }

  @Post("login")
  @UsePipes(Validation)
  login(@Body() body:LoginDTO) {
    return this.authService.login(body)
  }

  // 该接口用于测试令牌是否有效
  @Get("test")
  @UseGuards(AuthGuard("jwt"))
  test() {
    return "令牌有效"
  }
}
