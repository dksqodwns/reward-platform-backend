import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGatewayService } from './auth.gateway.service';
import { AuthLoginBodies, AuthRegisterBodies } from '@payload/auth';
import { Request, Response } from 'Express';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly authGatewayService: AuthGatewayService) {}

  @Post('register')
  async userRegister(@Body() body: AuthRegisterBodies) {
    return await this.authGatewayService.userRegister(body);
  }

  @Post('login')
  async userLogin(
    @Body() body: AuthLoginBodies,
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

  // TODO: 로그아웃 만들까?
  /**
   * 유저 본인의 프로필 조회하는 함수
   * TODO: 유저 개개인을 조회하는 함수이지만, :id 같이 파라미터를 통해서 유저를 조회 할 수있는 API가 따로 필요할 것 같음
   */
  @Get('profile')
  async userProfile(@Req() req: Request) {
    return;
  }

  /**
   * 유저 리스트를 조회하는 함수
   * TODO: 기본적인 쿼리 스트링에 대한 처리가 필요할 것
   * @param req
   */
  @Get('users')
  async getUsers(@Req() req: Request) {
    return;
  }

  @Get('users/:id')
  async getUserByUserId(@Req() req: Request, @Param('id') id: string) {
    const user = await this.authGatewayService.getUserByUserId(id);
    
    return {
      success: true,
      data: user,
    };
  }

  /**
   * 유저의 ROLE을 업데이트 하는 함수
   * TODO: ADMIN 유저만 접근 가능하도록 ROLE 가드가 있어야 함
   * @param req
   * @param id
   */
  @Patch('users/:id/role')
  async userRoleUpdate(@Req() req: Request, @Param('id') id: string) {
    return;
  }
}
