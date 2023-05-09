import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { SignupDto } from '@/auth/dto/signup.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { Serialize } from '@/interceptor/serialize.interceptor';
import { UserDto } from '@/users/dto/user.dto';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Session() session: any) {
    // console.log(signupDto);
    const user = await this.authService.signup(
      signupDto.username,
      signupDto.email,
      signupDto.password,
    );
    session.userId = user.id;
    // console.log(user);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: any) {
    // console.log(loginDto);
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    session.userId = user.id;
    // console.log(user);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Session() session: any) {
    session.userId = null;
  }
}
