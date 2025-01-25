import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 获取 CSRF 令牌，并明确类型
    const csrfTokenFromCookie = req.cookies?.['XSRF-TOKEN'] as
      | string
      | undefined;
    const csrfTokenFromHeader = req.headers['xsrf-token'];

    // 检查 CSRF 令牌是否匹配
    if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
      throw new HttpException('Invalid CSRF token', HttpStatus.FORBIDDEN);
    }

    next();
  }
}
