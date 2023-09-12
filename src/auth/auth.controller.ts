import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { Validation } from 'src/common/validation';
import { LoginDTO } from './dto/login.dto';

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

}
