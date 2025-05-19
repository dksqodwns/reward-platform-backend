import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { ErrorCode } from '@common/error-code.enum';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { HttpException } from '@nestjs/common';

export abstract class BaseGatewayService {
  constructor(protected readonly client: ClientProxy) {}

  protected sendMessage(command: string, payload: any) {
    return lastValueFrom(
      this.client.send({ cmd: command }, payload).pipe(
        catchError((error) => {
          const { code, message } = error as {
            code: ErrorCode;
            message: string;
          };
          const status =
            code === ErrorCode.NOT_FOUND
              ? HttpStatus.NOT_FOUND
              : code === ErrorCode.CONFLICT
              ? HttpStatus.CONFLICT
              : code === ErrorCode.UNAUTHORIZED
              ? HttpStatus.UNAUTHORIZED
              : code === ErrorCode.BAD_REQUEST
              ? HttpStatus.BAD_REQUEST
              : HttpStatus.INTERNAL_SERVER_ERROR;

          return throwError(() => new HttpException(message, status));
        })
      )
    );
  }
}
