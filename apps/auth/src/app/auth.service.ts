import { Injectable } from '@nestjs/common';
import {
  AuthLoginPayload,
  AuthRefreshTokenPayload,
  AuthRegisterPayload,
  AuthUpdateUserRolePayload,
  AuthUserResponsePayload,
  UserListQueryPayload,
} from '@payload/auth';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { PasswordEncoder, TokenService } from '../utils';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@common/error-code.enum';
import { User, UserDocument } from '@schema/user.schema';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '@schema/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly tokenService: TokenService
  ) {}

  async getUserByUserId(
    userId: string
  ): Promise<AuthUserResponsePayload | null> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) return null;

    return {
      userId: user._id.toString(),
      email: user.email,
      userName: user.userName,
      roles: user.roles,
      consecutiveLoginDays: user.consecutiveLoginDays,
      invitesSent: user.invitesSent,
    };
  }

  async userRegister(body: AuthRegisterPayload) {
    const isExistUser = await this.userModel.exists({ email: body.email });
    if (isExistUser) {
      throw new RpcException({
        code: ErrorCode.CONFLICT,
        message: '이미 가입 된 이메일 입니다.',
      });
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

  async userLogin(body: AuthLoginPayload) {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user) {
      throw new RpcException({
        code: ErrorCode.BAD_REQUEST,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }
    const correctPassword = await this.passwordEncoder.compare(
      body.password,
      user.password
    );
    if (!correctPassword) {
      throw new RpcException({
        code: ErrorCode.BAD_REQUEST,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const accessTokenData = await this.tokenService.createAccessToken(user);
    const refreshTokenData = await this.tokenService.createRefreshToken(user);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLoginAt = user.lastLoginAt;
    if (lastLoginAt) {
      const yesterday = new Date(today);
      yesterday.setDate(lastLoginAt.getDate() - 1);

      if (lastLoginAt.getTime() === yesterday.getTime()) {
        user.consecutiveLoginDays++;
      } else if (lastLoginAt.getTime() < yesterday.getTime()) {
        user.consecutiveLoginDays = 1;
      }
    } else {
      user.consecutiveLoginDays = 1;
    }

    user.lastLoginAt = today;
    await this.userModel.updateOne(
      { _id: user._id },
      {
        lastLoginAt: user.lastLoginAt,
        consecutiveLoginDays: user.consecutiveLoginDays,
      }
    );

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
      throw new RpcException({
        code: ErrorCode.UNAUTHORIZED,
        message: '인증 정보가 올바르지 않습니다.',
      });
    }
    let payload: AuthRefreshTokenPayload;
    try {
      payload = await this.tokenService.verifyRefreshToken(oldToken);
    } catch (e) {
      throw new RpcException({
        code: ErrorCode.UNAUTHORIZED,
        message: `유효하지 않은 리프레시 토큰 입니다. error=${e}`,
      });
    }

    const record = await this.refreshTokenModel.findOne({
      refreshToken: oldToken,
    });
    if (!record || record.expiresAt < new Date()) {
      throw new RpcException({
        code: ErrorCode.UNAUTHORIZED,
        message: `유효하지 않은 리프레시 토큰 입니다.`,
      });
    }

    const user = await this.userModel.findOne({ userId: payload.userId });
    if (!user) {
      throw new RpcException({
        code: ErrorCode.NOT_FOUND,
        message: `존재하지 않는 사용자 입니다.`,
      });
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

  async getUserList(query: UserListQueryPayload) {
    const { sort, filter, omit, page, limit } = query;
    const conditions = {};

    if (filter) conditions[filter.key] = filter.value;
    if (omit) conditions[omit.key] = omit.value;

    const sortOption = {};
    if (sort) {
      sortOption[sort.key] = sort.order === 'asc' ? 1 : -1;
    }
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      this.userModel.countDocuments(conditions),
      this.userModel
        .find(conditions)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select('-password -__v')
        .lean(),
    ]);

    return {
      success: true,
      data,
      metadata: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
    };
  }

  async updateUserRole(payload: AuthUpdateUserRolePayload) {
    const { userId, roles } = payload;
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new RpcException({
        code: ErrorCode.NOT_FOUND,
        message: `존재하지 않는 사용자 입니다. userId=${userId}`,
      });
    }

    user.roles = roles;
    await user.save();

    return {
      success: true,
      data: {
        userId: user._id,
        roles: user.roles,
      },
    };
  }
}
