import {  Injectable, Logger } from '@nestjs/common';
import { UserRepo} from "./user.repo"

@Injectable()
export class UserService {
  constructor(private  userRepo: UserRepo) {}

  private logger = new Logger('User service');

  async findAll() {
    return await this.userRepo.findAll()
  }
}