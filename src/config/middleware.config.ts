import rateLimit from 'express-rate-limit';
import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as statusMonitor from 'express-status-monitor';
import { AppModule } from '../app/app.module';
import Monitor from './monitor.config';

export async function setupMiddleware(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const monitorMiddleware = statusMonitor(Monitor);

  app.use(`api${Monitor.path}`, monitorMiddleware); // 确保路径与全局前缀结合

  // 限制访问频率
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 500, // 限制15分钟内最多只能访问500次
  });

  app.use(limiter);

  // 配置 cookie-parser

  app.use(cookieParser());

  // 配置 CORS

  app.use(
    cors({
      origin: ['*'], // 替换为你的前端域名
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, // 允许发送 cookies 和其他凭证
      allowedHeaders: ['Content-Type', 'XSRF-TOKEN', 'Authorization'], // 允许的自定义头
    }),
  );

  // 设置安全头信息

  app.use(helmet());
}
