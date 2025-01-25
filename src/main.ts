// src/main.ts
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter'; // 自定义异常过滤器
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { knife4jSetup } from 'nest-knife4j';
import { createSwaggerDocument } from './config/swagger.config';
import { setupMiddleware } from './config/middleware.config';
import * as dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;
const PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局前缀
  app.setGlobalPrefix(PREFIX);

  // 启用全局管道和过滤器
  app.useGlobalPipes(new CustomValidationPipe()); // 使用自定义验证管道
  app.useGlobalFilters(new AllExceptionsFilter());

  // 配置中间件
  await setupMiddleware();

  // 配置 Swagger
  const options = createSwaggerDocument();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document, {
    customSiteTitle: 'API 文档',
    swaggerOptions: {
      filter: true, // 启用过滤功能
    },
  });
  knife4jSetup(app, [
    {
      name: 'nest-templates',
      url: `/api/swagger-json`,
      swaggerVersion: '1.0.0',
      location: `/api/swagger-json`,
    },
  ]);

  await app.listen(PORT, () => {
    Logger.log(
      `已启动，接口： http://localhost:${PORT}/${PREFIX} ， API文档：http://localhost:${PORT}/doc.html | http://localhost:${PORT}/api/swagger`,
    );
  });
}

bootstrap().catch((err) => Logger.error('启动错误：', err));
