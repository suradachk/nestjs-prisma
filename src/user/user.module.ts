import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UserController, UserService, UserRepo, PrismaService],
  exports: [UserService],
})
export class UserModule {}
