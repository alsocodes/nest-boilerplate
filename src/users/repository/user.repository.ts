import { Brackets, EntityRepository, ILike, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserResultsCountInterface } from '../interface/user-results-count.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PatchUserStatusDto } from '../dto/patch-user-status.dto';
import { UserResultOneInterface } from '../interface/user-result-one.interface';
import { QueryUserDto } from '../dto/query-user.dto';
import { IsEmail, IsOptional } from 'class-validator';

class FilterQuery {
  @IsOptional()
  @IsEmail()
  email: string;
}
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findOneUser(id: string): Promise<UserResultOneInterface> {
    const user2 = await this.findOne({
      select: ['id', 'name', 'email', 'isActive', 'createdAt', 'updatedAt'],
      where: { id: id },
    });

    return user2;
  }

  async findAllUser(query: QueryUserDto): Promise<UserResultsCountInterface> {
    const { page, perPage, search, email, name, isActive } = query;

    const queryBuilder = this.createQueryBuilder('users')
      .select([
        'users.id',
        'users.name',
        'users.email',
        'users.isActive',
        'users.createdAt',
        'users.updatedAt',
      ])
      .skip(page - 1)
      .take(perPage);

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('users.name LIKE :search', {
            search: `%${search}%`,
          }).orWhere('users.email LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (name) queryBuilder.andWhere('users.name = :name', { name: name });
    if (email) queryBuilder.andWhere('users.email = :email', { email: email });
    if (isActive)
      queryBuilder.andWhere('users.isActive = :isActive', {
        isActive: isActive,
      });

    const count = await queryBuilder.getCount();
    const users = await queryBuilder.getMany();
    return {
      page: page,
      perPage: perPage,
      totalPage: Math.ceil(count / perPage),
      countAll: count,
      rows: users,
    } as UserResultsCountInterface;
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { name, email, password } = createUserDto;

    const user = this.create();
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);

    try {
      await user.save();
    } catch (e) {
      if (e.code == '23505') {
        throw new ConflictException(`Email ${email} already in used`);
      } else {
        throw new InternalServerErrorException(e);
      }
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { name, email } = updateUserDto;
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException(`Id ${id} not found`);
    }

    try {
      user.name = name;
      user.email = email;
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(`Email ${email} already in used`);
      } else {
        throw new InternalServerErrorException(e);
      }
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException(`Id ${id} not found`);
    }

    try {
      await user.softRemove();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async patchUserStatus(
    id: string,
    patchUserStatus: PatchUserStatusDto,
  ): Promise<void> {
    const { isActive } = patchUserStatus;
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException(`Id ${id} not found`);
    }

    try {
      user.isActive = isActive;
      await user.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async restoreUser(id: string): Promise<void> {
    try {
      await this.createQueryBuilder()
        .where(`id = :id`, { id })
        .restore()
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }
}
