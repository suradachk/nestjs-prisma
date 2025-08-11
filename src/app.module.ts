import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { jwtConfig } from './auth/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expires },
    }),
    UserModule,
  ],
  controllers: [UserController, AuthController],
  providers: [PrismaService],
})
export class AppModule {}
