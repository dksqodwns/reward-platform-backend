import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthLoginBodies, AuthRegisterBodies } from '@payload/auth';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  userRegister(@Payload() body: AuthRegisterBodies) {
    return this.authService.userRegister(body);
  }

  @MessagePattern({ cmd: 'login' })
  userLogin(@Payload() body: AuthLoginBodies) {
    return this.authService.userLogin(body);
  }
}
