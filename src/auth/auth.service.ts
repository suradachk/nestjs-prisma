import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { comparePassword, hashPassword } from '../utils/auth-helper';
import { jwtConfig } from './config';
import { getUserProfile } from 'src/utils/map-model/user-model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async generateTokens(user: User) {
    const payload = { userId: user.userId, username: user.username };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.userService.update(userId, {
      refreshToken: refreshToken,
    });
  }

  async getProfile(userId: string) {
    const user = await this.userService.findByUserId(userId);
    if (!user) throw new NotFoundException('User not found');
    return getUserProfile(user);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user);

    const updateRefreshToken = await this.updateRefreshToken(
      user.userId,
      tokens.refreshToken,
    );
    if (!updateRefreshToken!) {
      throw new UnauthorizedException("User can't update refresh token");
    }
    return {
      user: { id: user.userId, username: user.username },
      ...tokens,
    };
  }

  async logout(user: User) {
    const updateUser = await this.userService.update(user.userId, {
      refreshToken: null,
    });
    return { ...updateUser, message: 'Logged Out' };
  }

  async changePassword(user: User, password: string, newPassword: string) {
    const findUser = await this.userService.findByUsername(user.username);
    if (!findUser) {
      throw new NotFoundException('not found user');
    }
    const comparePassowrd = await comparePassword(password, findUser.password);
    if (!comparePassowrd) {
      throw new UnauthorizedException('password is incorrect');
    }

    const { userId, username, firstName, lastName, email } = findUser;

    const payload = {
      userId,
      username,
      fullName: `${firstName} ${lastName}`,
      email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.expires,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.refreshExpires,
    });

    const hashNewPassword = await hashPassword(newPassword);
    await this.userService.update(user.userId, {
      refreshToken,
      password: hashNewPassword,
    });
    return { ...payload, accessToken, refreshToken };
  }

  async resetPassword(username: string, password: string) {
    const findUser = await this.userService.findByUsername(username);
    if (!findUser) {
      throw new NotFoundException('not found user');
    }
    const { userId, firstName, lastName, email } = findUser;

    const payload = {
      userId,
      username,
      fullName: `${firstName} ${lastName}`,
      email,
    };
    const passwordHash = await hashPassword(password);
    await this.userService.update(findUser.userId, {
      password: passwordHash,
    });
    return { ...payload };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConfig.secret,
      });
      const user = await this.userService.findByUserId(payload.userId);
      if (!user) {
        throw new UnauthorizedException('refreshToken invalid!');
      }
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('user refreshToken invalid!');
      }
      const { userId, username, fullName, email, levelId } = payload;
      const newPayload = {
        userId,
        username,
        fullName,
        email,
        levelId,
      };
      const accessToken = this.jwtService.sign(newPayload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.expires,
      });
      const refreshTokenNew = this.jwtService.sign(newPayload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.refreshExpires,
      });
      const updateRefreshToken = await this.updateRefreshToken(
        user.userId,
        refreshTokenNew,
      );
      if (!updateRefreshToken!) {
        throw new UnauthorizedException("User can't update refresh token");
      }
      return { ...newPayload, accessToken, refreshToken: refreshTokenNew };
    } catch {
      throw new UnauthorizedException('refreshToken invalid!');
    }
  }
}
