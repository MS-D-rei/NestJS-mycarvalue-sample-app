import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { Serialize } from '@/interceptor/serialize.interceptor';
import { UserDto } from '@/users/dto/user.dto';
import { currentUser } from '@/users/decorator/current-user.decorator';
import { User } from '@/entities';
import { CurrentUserInterceptor } from '@/users/interceptor/current-user.interceptor';
import { AuthGuard } from '@/auth/guard/auth.guard';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('currentUser')
  // currentUser(@Session() session: any) {
  //   console.log(session);
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('currentUser')
  @UseGuards(AuthGuard)
  @UseInterceptors(CurrentUserInterceptor)
  currentUser(@currentUser() user: User) {
    console.log(user);
    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(parseInt(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
