import { Body, Controller, Post, Req, Res } from '@nestjs/common';
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
}
