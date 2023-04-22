import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/users.entity';

@Injectable()
export class UsersService {
  constructor(
    // this is the same as @Repository(User) private usersRepository: Repository<User>
    // but it's shorter and more concise
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(username: string, email: string, password: string) {
    const user = this.usersRepository.create({ username, email, password });
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, data: Partial<User>) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

  async removeUser(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.remove(user);
  }
}
