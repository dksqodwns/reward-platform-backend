import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordEncoder {
  async encode(password: string): Promise<string> {
    return argon.hash(password);
  }

  async compare(
    rawPassword: string,
    encodedPassword: string
  ): Promise<boolean> {
    return await argon.verify(encodedPassword, rawPassword);
  }
}
