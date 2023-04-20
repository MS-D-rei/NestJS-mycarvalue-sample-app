import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: string, email: string, password: string) {
    const user = this.usersRepository.create({ username, email, password });
    return this.usersRepository.save(user);
  }

  async findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
}
