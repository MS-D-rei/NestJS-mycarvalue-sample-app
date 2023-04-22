import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(username: string, email: string, password: string) {
    const newUser = await this.usersService.create(username, email, password);
    delete newUser.password;
    return newUser;
    // access token process
  }
}
