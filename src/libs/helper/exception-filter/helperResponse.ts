import { HttpStatus } from '@nestjs/common';
import { ResponseData } from 'src/libs/utils/enum';

export function HandleResponse(
  statusCode: number,
  status: string,
  message?: unknown,
  data?: unknown,
  error?: unknown,
) {
  if (status === ResponseData.SUCCESS) {
    return {
      statusCode: statusCode || HttpStatus.OK,
      status,
      message,
      data,
      error,
    };
  }

  throw {
    statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    status,
    message,
    data,
    error,
  };

}
