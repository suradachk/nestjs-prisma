import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { getUserProfile } from 'src/utils/map-model/user-model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private logger = new Logger('User Controller');

  @Get('')
  async findAll() {
    this.logger.debug('findAll');
    const res = await this.userService.findAll();
    return res.map((u) => getUserProfile(u));
    // return await this.userService.findAll();
  }

  @Post('')
  async create(@Body() body: any) {
    return await this.userService.create(body);
  }
}
