import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthGatewayService } from './auth.gateway.service';
import {
  AuthDefaultQueries,
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthUpdateUserRoleBodies,
  Permission,
} from '@payload/auth';
import { Request, Response } from 'Express';
import { Permissions, Public } from '@common/decorators';
import { RpcExceptionFilter } from '../../filter/rpc-exception.filter';

@UseFilters(RpcExceptionFilter)
@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly authGatewayService: AuthGatewayService) {}

  @Post('register')
  @Public()
  async userRegister(@Body() body: AuthRegisterPayload) {
    return await this.authGatewayService.userRegister(body);
  }

  @Post('login')
  @Public()
  async userLogin(
    @Body() body: AuthLoginPayload,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authGatewayService.userLogin(body);
    /**
     * accessToken은 클라이언트에서 메모리에 저장
     * refreshToken은 DB에 저장
     */
    const { accessToken, refreshToken } = result.data;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      ok: true,
      accessToken,
    };
  }

  @Post('refresh')
  async userRefreshAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const oldToken: string | undefined = req.cookies['refreshToken'];
    const result = await this.authGatewayService.userRefreshAccessToken(
      oldToken
    );
    const { accessToken, refreshToken } = result.data;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return { accessToken };
  }

  /**
   * 유저 본인의 프로필 조회하는 함수
   * TODO: 유저 개개인을 조회하는 함수이지만, :id 같이 파라미터를 통해서 유저를 조회 할 수있는 API가 따로 필요할 것 같음
   */
  @Get('profile')
  async userProfile(@Req() req: Request) {
    const user = req.user;
    return {
      success: true,
      data: user,
    };
  }

  @Get('users')
  async getUserListHandler(@Query() query: AuthDefaultQueries) {
    return await this.authGatewayService.getUserList(query);
  }

  @Get('users/:id')
  async getUserByUserId(@Param('id') id: string) {
    const user = await this.authGatewayService.getUserByUserId(id);
    // TODO: 유저가 없을 경우 서비스에서 404 에러 내줘야 함
    return {
      success: true,
      data: user,
    };
  }

  @Patch('users/:id/role')
  @Permissions(Permission.USER_UPDATE)
  async userRoleUpdate(
    @Param('id') userId: string,
    @Body() body: AuthUpdateUserRoleBodies
  ) {
    return this.authGatewayService.userRoleUpdate(userId, body.roles);
  }
}
