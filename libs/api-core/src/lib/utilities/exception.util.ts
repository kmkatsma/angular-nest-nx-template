import { InternalServerErrorException, HttpException } from '@nestjs/common';

export class ExceptionUtil {
  static handleException(err: HttpException | Error, message: string) {
    // test if this is already an HttpException (has response), and if so forward along
    throw err;
    /*if (err['response']) {
      throw err;
    } else {
      throw err;
      throw new InternalServerErrorException(err, message);
    }*/
  }
}
