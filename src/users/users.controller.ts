import { Body, Controller, Get, Post } from '@nestjs/common';
import { DefaultResponse } from 'src/default-response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUser(): Promise<DefaultResponse> {
    const users = await this.usersService.findAllUser();
    return {
      statusCode: 200,
      success: true,
      message: 'Sukses',
      data: users,
    } as DefaultResponse;
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<DefaultResponse> {
    await this.usersService.createUser(payload);
    return {
      statusCode: 201,
      success: true,
      message: 'Create user success',
    } as DefaultResponse;
  }
}
