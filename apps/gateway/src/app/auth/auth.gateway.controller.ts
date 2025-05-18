import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthGatewayService } from './auth.gateway.service';
import { AuthLoginBodies, AuthRegisterBodies } from '@payload/auth';
import { Response } from 'Express';

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
}
