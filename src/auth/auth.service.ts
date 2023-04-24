import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '@/users/users.service';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(username: string, email: string, password: string) {
    // check if user exists
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('Email in use');
    }
    // if not, hash their password
    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password together
    const hash = (await scryptAsync(password, salt, 32)) as Buffer;
    // join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // create a user in the db
    const newUser = await this.usersService.create(username, email, result);

    return newUser;
  }

  async login(email: string, password: string) {
    // find user in db
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // hash the provided password
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scryptAsync(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('password is not valid');
    }
    return user;
  }
}
