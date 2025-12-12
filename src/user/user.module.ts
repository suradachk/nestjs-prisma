import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';

@Module({
  providers: [UserController, UserService, UserRepo],
  exports: [UserService],
})
export class UserModule {}
