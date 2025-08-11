import { UserService } from '../user/user.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { comparePassoword, hashPassword } from '../utils/auth-helper';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { jwtConfig } from 'src/auth/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@Req() req) {
    const { user } = req;
    const getUser = await this.userService.findByUserId(user.userId);
    if (!getUser) {
      return getUser;
    }
    return getUser;
    // return getUserProfile(getUser);
  }

  @Post('/login')
  async logIn(@Body() body) {
    const { username, password } = body;

    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('not found user');
    }
    const comparePassowrd = await comparePassoword(password, user.password);

    if (!comparePassowrd) {
      throw new UnauthorizedException('password is incorrect');
    }
    const { userId, firstName, lastName, email } = user;

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
    await this.userService.update(user.userId, {
      refreshToken,
    });
    return { ...payload, accessToken, refreshToken };
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logOut(@Req() req) {
    const { user } = req;
    await this.userService.update(user.userId, {
      refreshToken: null,
    });
    return { message: 'Logged Out' };
  }

  @UseGuards(AuthGuard)
  @Post('/chanage-password')
  async changePassword(@Body() body, @Req() req) {
    const { user } = req;
    const { password, newPassword } = body;
    const findUser = await this.userService.findByUsername(user.username);
    if (!findUser) {
      throw new NotFoundException('not found user');
    }
    const comparePassowrd = await comparePassoword(password, findUser.password);
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

  @UseGuards(AuthGuard)
  @Post('/reset-password')
  async resetPassword(@Body() body, @Req() req) {
    // const { user } = req;
    const { username, password } = body;
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

  @Post('/refresh')
  async refresh(@Body() body) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException('refreshToken invalid');
    }

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
      await this.userService.update(user.userId, {
        refreshToken: refreshTokenNew,
      });
      return { ...newPayload, accessToken, refreshToken: refreshTokenNew };
    } catch {
      throw new UnauthorizedException('refreshToken invalid!');
    }
  }
}
