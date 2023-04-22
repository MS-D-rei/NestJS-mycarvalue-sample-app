import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { SignupDto } from '@/auth/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login() {
    return 'login';
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    console.log(signupDto);
    return this.authService.signup(
      signupDto.username,
      signupDto.email,
      signupDto.password,
    );
  }
}
