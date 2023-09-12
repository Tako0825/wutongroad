import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Validation } from 'src/common/validation';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UsePipes(Validation)
  login(@Body() body:LoginDTO) {
    return this.authService.login(body)
  }

  @Get("verify")
  @UseGuards(AuthGuard("jwt"))
  test() {
    return {
      message: "令牌验证成功"
    }
  }
}
