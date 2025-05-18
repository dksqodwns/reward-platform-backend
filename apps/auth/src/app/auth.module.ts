import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema, User, UserSchema } from '../schemas';
import { PasswordEncoder } from '../utils';
import { TokenService } from '../utils/token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:skfk4fkd@localhost:27017/reward_auth?authSource=admin',
      {
        // TODO: DB 주소 env
        autoCreate: true,
        autoIndex: true,
      }
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.register({
      // TODO: ConfigModule 작성하면 registerAsync로 바꿔야 함
      /*
       *
       * JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          secret: config.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
        }),
      });
       * */
      secret: 'JWT_ACCESS_SECRET',
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordEncoder, TokenService],
})
export class AuthModule {}
