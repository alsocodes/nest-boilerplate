import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserStatusDto } from './dto/patch-user-status.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UserResultOneInterface } from './interface/user-result-one.interface';
import { UserResultsCountInterface } from './interface/user-results-count.interface';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findUserById(id: string): Promise<UserResultOneInterface> {
    return await this.userRepository.findOneUser(id);
  }

  async findAllUser(query: QueryUserDto): Promise<UserResultsCountInterface> {
    return this.userRepository.findAllUser(query);
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    return await this.userRepository.createUser(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    return await this.userRepository.updateUser(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<void> {
    return await this.userRepository.deleteUser(id);
  }

  async patchUserStatus(
    id: string,
    patchUserStatusDto: PatchUserStatusDto,
  ): Promise<void> {
    return await this.userRepository.patchUserStatus(id, patchUserStatusDto);
  }

  async restoreUser(id: string): Promise<void> {
    return await this.userRepository.restoreUser(id);
  }

  async validateUser(email: string, password: string): Promise<User> {
    return await this.userRepository.validateUser(email, password);
  }
}
