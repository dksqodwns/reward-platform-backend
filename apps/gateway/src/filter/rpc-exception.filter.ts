import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@common/error-code.enum';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errorObj = exception.getError() as {
      code?: string;
      message?: string;
    };
    console.log('필터 걸림: ', errorObj);
    const code = errorObj.code as ErrorCode;

    const status =
      {
        [ErrorCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
        [ErrorCode.CONFLICT]: HttpStatus.CONFLICT,
        [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
        [ErrorCode.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
      }[code] || HttpStatus.INTERNAL_SERVER_ERROR;

    console.log('필터 code: ', code);
    console.log('필터 status: ', status);

    response.status(status).json({
      statusCode: status,
      code,
      message: errorObj.message,
    });
  }
}
