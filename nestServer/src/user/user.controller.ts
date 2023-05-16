import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(@Body() data: UserDto) {
    return this.userService.addUser(data);
  }

  @Post('login')
  login(@Body() data: UserDto) {
    return this.userService.enterUser(data.email, data.password);
  }

  @Get('data/:id')
  getData(@Param('id') id: number) {
    return this.userService.getUserData(id);
  }
}
