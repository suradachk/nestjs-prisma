import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { jwtConfig } from './auth/config';
import { PrismaModule } from './prisma/prisma.module';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
      validationSchema: Joi.object({
        PORT: Joi.number().default(4000),
        BACKEND_URL: Joi.string().required(),
        UPLOAD_DIR: Joi.string().default('./uploads'),
        UPLOAD_BILL_DIR: Joi.string().default('./uploads/bill'),
        JWT_SECRET: Joi.string().required(),
        AUTH_EXPIRES: Joi.string().default('1d'),
        AUTH_REFRESH_EXPIRES: Joi.string().default('5min'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expires },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
  controllers: [UserController, AuthController],
  providers: [],
})
export class AppModule {}
