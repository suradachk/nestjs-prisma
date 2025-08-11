import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger('user service');

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findFirst(query: Prisma.UserFindFirstArgs) {
    return await this.prisma.user.findFirst(query);
  }

  async findMany(query: Prisma.UserFindManyArgs) {
    return await this.prisma.user.findMany(query);
  }

  async count() {
    return await this.prisma.user.count();
  }

  async update(data: Prisma.UserUpdateArgs) {
    return await this.prisma.user.update(data);
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data });
  }

  async delete(data: Prisma.UserDeleteArgs) {
    return await this.prisma.user.delete(data);
  }
}
