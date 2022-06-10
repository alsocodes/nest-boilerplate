import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserResultCount } from '../interface/user-result-count.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findAllUser(): Promise<UserResultCount> {
    const query = await this.createQueryBuilder('user').getManyAndCount();
    return {
      page: 1,
      perPage: 20,
      countAll: query[1],
      rows: query[0],
    } as UserResultCount;
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
        throw new ConflictException(`Email ${email} already used`);
      } else {
        throw new InternalServerErrorException(e);
      }
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
