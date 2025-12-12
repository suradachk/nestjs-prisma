import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/profile')
  async getProfile(@CurrentUser() user: User) {
    return await this.authService.getProfile(user.userId);
  }

  @Post('/login')
  async logIn(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logOut(@CurrentUser() user: User) {
    return await this.authService.logout(user);
  }

  @UseGuards(AuthGuard)
  @Post('/chanage-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @CurrentUser() user: User,
  ) {
    const { password, newPassword } = body;
    return await this.authService.changePassword(user, password, newPassword);
  }

  @UseGuards(AuthGuard)
  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { username, password } = body;
    return await this.authService.resetPassword(username, password);
  }

  @Post('/refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException('refreshToken invalid');
    }
    return await this.authService.refreshToken(refreshToken);
  }
}
