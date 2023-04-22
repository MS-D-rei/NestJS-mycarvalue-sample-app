import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { SerializeInterceptor } from '@/interceptor/serialize.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @UseInterceptors(SerializeInterceptor)
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: string) {
    console.log('handler is running');
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(parseInt(id), updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(parseInt(id));
  }
}
