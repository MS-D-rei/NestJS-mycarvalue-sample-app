import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UpdateUserDto } from '@/users/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
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
