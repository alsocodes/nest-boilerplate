import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LoginResponse } from './interface/login-response.interface';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken } as LoginResponse;
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshAccessTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;
    const payload = await this.decodeToken(refreshToken);
    const refreshTokenFind = await this.refreshTokenRepository.findOne(
      payload.jid,
      { relations: ['user'] },
    );

    if (!refreshTokenFind) {
      throw new UnauthorizedException('Refresh token is not found');
    }

    if (refreshTokenFind.isRevoked) {
      throw new UnauthorizedException('Refresh token has beed revoked');
    }

    const accessToken = await this.createAccessToken(refreshTokenFind.user);

    return { accessToken };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is expired');
      } else {
        throw new InternalServerErrorException('Failed to decode token');
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async createRefreshToken(user: User): Promise<string> {
    const refreshTokenCreate =
      await this.refreshTokenRepository.createRefreshToken(
        user,
        +refreshTokenConfig.expiresIn,
      );
    const payload = {
      jid: refreshTokenCreate.id,
    };
    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshTokenConfig,
    );
    return refreshToken;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOne(id);
    if (!refreshToken) {
      throw new NotFoundException('Refresh token is not found');
    }
    refreshToken.isRevoked = true;
    await refreshToken.save();
  }
}
