import {  Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger('User service');

  async findAll() {
    this.logger.log('getAllUsers');
      const users = await this.prisma.user.findMany();
      console.log("🚀 ~ UserRepo ~ findAll ~ users:", users)
      return  users;
  }
}