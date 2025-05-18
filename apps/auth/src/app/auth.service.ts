import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginBodies, AuthRegisterBodies } from '@payload/auth';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
  User,
  UserDocument,
} from '../schemas';
import { Model } from 'mongoose';
import { PasswordEncoder } from '../utils';
import { TokenService } from '../utils/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly tokenService: TokenService
  ) {}

  async userRegister(body: AuthRegisterBodies) {
    const isExistUser = await this.userModel.exists({ email: body.email });
    if (isExistUser) {
      // TODO: Custom Exception을 생성해서 주는게 낫지 않을까? 하는 의문이 든다.
      throw new ConflictException('이미 가입 된 이메일 입니다.');
    }
    const hashedPassword = await this.passwordEncoder.encode(body.password);
    const user = await this.userModel.create({
      email: body.email,
      password: hashedPassword,
      userName: body.userName,
      roles: ['USER'],
    });

    return {
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        userName: user.userName,
        role: user.roles,
      },
    };
  }

  async userLogin(body: AuthLoginBodies) {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.'
      );
    }
    const correctPassword = await this.passwordEncoder.compare(
      body.password,
      user.password
    );
    if (!correctPassword) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.'
      );
    }
    const accessTokenData = await this.tokenService.createAccessToken(user);
    const refreshTokenData = await this.tokenService.createRefreshToken(user);

    await this.refreshTokenModel.create({
      userId: user._id.toString(),
      refreshToken: refreshTokenData.refreshToken,
      expiresAt: refreshTokenData.expiresAt,
    });

    return {
      success: true,
      data: {
        accessToken: accessTokenData.accessToken,
        refreshToken: refreshTokenData.refreshToken,
      },
    };
  }

  async userRefreshAccessToken(oldToken: string | undefined) {
    if (!oldToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }
    let payload: { userId: string };
    try {
      payload = await this.tokenService.verifyRefreshToken(oldToken);
    } catch (e) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰 입니다.');
    }

    const record = await this.refreshTokenModel.findOne({
      refreshToken: oldToken,
    });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException(
        '리프레시 토큰이 만료되었거나, 존재하지 않습니다.'
      );
    }

    const user = await this.userModel.findOne({ userId: payload.userId });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자 입니다.');
    }

    const { accessToken, ...data } = await this.tokenService.createAccessToken(
      user
    );
    const { refreshToken, expiresAt } =
      await this.tokenService.createRefreshToken(user);
    await this.refreshTokenModel.deleteOne({ _id: record._id });
    await this.refreshTokenModel.create({
      userId: user._id.toString(),
      refreshToken,
      expiresAt,
    });

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
