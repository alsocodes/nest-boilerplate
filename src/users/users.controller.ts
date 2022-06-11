import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DefaultResponse } from 'src/default-response.interface';
import { JwtGuard } from 'src/guard/jwt.guard';
import { UUIDValidationPipe } from 'src/pipes/uuid-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserStatusDto } from './dto/patch-user-status.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@ApiSecurity('bearer')
@Controller('user')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUser(@Query() query: QueryUserDto): Promise<DefaultResponse> {
    const users = await this.usersService.findAllUser(query);
    return {
      statusCode: 200,
      success: true,
      message: 'Get all user success',
      data: users,
    } as DefaultResponse;
  }

  @Get(':id')
  async findOneUser(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<DefaultResponse> {
    const user = await this.usersService.findUserById(id);
    return {
      statusCode: 200,
      success: true,
      message: 'Get one user success',
      data: user,
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

  @Put(':id')
  async updateUser(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<DefaultResponse> {
    await this.usersService.updateUser(id, payload);
    return {
      statusCode: 200,
      success: true,
      message: 'Update user success',
    } as DefaultResponse;
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<DefaultResponse> {
    await this.usersService.deleteUser(id);
    return {
      statusCode: 200,
      success: true,
      message: 'Delete user success',
    } as DefaultResponse;
  }

  @Patch(':id/restore')
  async restoreUser(
    @Param('id', UUIDValidationPipe) id: string,
  ): Promise<DefaultResponse> {
    await this.usersService.restoreUser(id);
    return {
      statusCode: 200,
      success: true,
      message: 'Restore user success',
    } as DefaultResponse;
  }

  @Patch(':id/status')
  async patchUserStatus(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: PatchUserStatusDto,
  ): Promise<DefaultResponse> {
    await this.usersService.patchUserStatus(id, payload);
    return {
      statusCode: 200,
      success: true,
      message: 'Patch user status success',
    } as DefaultResponse;
  }
}
