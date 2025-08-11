import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private logger = new Logger('User Controller');

  @Get('')
  async findAll() {
    this.logger.debug('findAll');
    return await this.userService.findAll();
  }

  @Post('')
  async create(@Body() body: any) {
    return await this.userService.create(body);
  }
}
