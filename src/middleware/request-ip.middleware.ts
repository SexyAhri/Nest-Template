import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as requestIp from 'request-ip';

@Injectable()
export class RequestIpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = requestIp.getClientIp(req);
    req['clientIp'] = clientIp ?? undefined; // 使用空值合并运算符处理 null 情况
    next();
  }
}
