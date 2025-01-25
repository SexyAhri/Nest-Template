import {
  ValidationPipe,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // 只允许在 DTO 中定义的属性
      forbidNonWhitelisted: true, // 禁止未在 DTO 中定义的属性
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式转换
      },
      exceptionFactory: (errors) => {
        const messages = errors
          .map((error) => {
            if (error.constraints) {
              return Object.values(error.constraints);
            }
            return ['未知的验证错误'];
          })
          .flat();
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: messages,
        });
      },
    });
  }
}
